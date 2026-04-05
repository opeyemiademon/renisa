import axios from 'axios';
import path from 'path';
import IDCardRequest from './idCardRequest.model.js';
import IDCardSettings from '../idCardSettings/idCardSettings.model.js';
import Member from '../member/member.model.js';
import { requireMemberAuth, requireAdminAuth } from '../../middleware/auth.js';
import { generateIDCard } from '../../utils/idCardGenerator.js';
import { sendEmail, idCardStatusTemplate } from '../../utils/emailService.js';
import { UPLOAD_FOLDERS } from '../../utils/constants.js';
import { createNotification } from '../../utils/createNotification.js';
import { createMemberNotification } from '../../utils/createMemberNotification.js';
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/payment/callback';
const idCardRequestResolvers = {
    IDCardRequest: {
        member: (parent) => parent.memberId,
        photo: (parent) => parent.uploadedPhoto,
        cardUrl: (parent) => parent.generatedCardFront,
    },
    Query: {
        getMyIDCardRequests: async (_, __, context) => {
            requireMemberAuth(context);
            return await IDCardRequest.find({ memberId: context.member.id })
                .populate('memberId', 'firstName lastName memberNumber profilePicture sport state')
                .populate('reviewedBy', 'name email')
                .sort({ createdAt: -1 });
        },
        getAllIDCardRequests: async (_, { adminStatus, paymentStatus }, context) => {
            requireAdminAuth(context);
            const filter = {};
            if (adminStatus)
                filter.adminStatus = adminStatus;
            if (paymentStatus)
                filter.paymentStatus = paymentStatus;
            return await IDCardRequest.find(filter)
                .populate('memberId', 'firstName lastName memberNumber email profilePicture sport state')
                .populate('reviewedBy', 'name email')
                .sort({ createdAt: -1 });
        },
        getIDCardRequest: async (_, { id }, context) => {
            if (!context.isAuthenticated)
                throw new Error('Authentication required');
            return await IDCardRequest.findById(id)
                .populate('memberId', 'firstName lastName memberNumber profilePicture')
                .populate('reviewedBy', 'name email');
        },
    },
    Mutation: {
        requestIDCard: async (_, { data }, context) => {
            requireMemberAuth(context);
            const settings = await IDCardSettings.findOne();
            if (!settings || !settings.isEnabled)
                throw new Error('ID card requests are currently disabled');
            const amount = data.requestType === 'online' ? settings.onlineFee : settings.physicalFee;
            const request = await IDCardRequest.create({
                memberId: context.member.id,
                requestType: data.requestType,
                uploadedPhoto: data.uploadedPhoto || data.photo,
                deliveryAddress: data.deliveryAddress,
                amount,
                paymentStatus: 'pending',
                adminStatus: 'pending',
                ...(data.generatedCardFront && { generatedCardFront: data.generatedCardFront }),
                ...(data.generatedCardBack && { generatedCardBack: data.generatedCardBack }),
            });
            const memberDoc = await Member.findById(context.member.id).select('firstName lastName').lean();
            const name = memberDoc ? `${memberDoc.firstName} ${memberDoc.lastName}` : 'A member';
            createNotification('id_card_request', 'New ID Card Request', `${name} has submitted a new ${data.requestType} ID card request.`, request._id.toString(), 'IDCardRequest');
            return { success: true, message: 'ID card request submitted', data: request };
        },
        verifyIDCardPayment: async (_, { reference }, context) => {
            requireMemberAuth(context);
            const paystackRef = reference;
            const request = await IDCardRequest.findOne({ paymentRef: paystackRef });
            if (!request)
                throw new Error('Request not found');
            try {
                const response = await axios.get(`https://api.paystack.co/transaction/verify/${paystackRef}`, { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } });
                const isSuccessful = response.data.data.status === 'success';
                const updated = await IDCardRequest.findByIdAndUpdate(request._id, { paymentStatus: isSuccessful ? 'paid' : 'failed', paidAt: isSuccessful ? new Date() : undefined }, { new: true });
                return { success: isSuccessful, message: isSuccessful ? 'Payment verified' : 'Payment failed', data: updated };
            }
            catch {
                throw new Error('Failed to verify payment');
            }
        },
        approveIDCardRequest: async (_, { id }, context) => {
            requireAdminAuth(context);
            const request = await IDCardRequest.findById(id).populate('memberId');
            if (!request)
                throw new Error('Request not found');
            const member = request.memberId;
            const settings = await IDCardSettings.findOne();
            const validityYears = settings?.validityYears || 1;
            const validUntil = String(new Date().getFullYear() + validityYears);
            // Use member-previewed card images if already generated during request submission
            let generatedCardFront = request.generatedCardFront || undefined;
            let generatedCardBack = request.generatedCardBack || undefined;
            // Fall back to server-side generation only if not already captured
            if (!generatedCardFront || !generatedCardBack) {
                const outputDir = path.join(process.cwd(), 'uploads', UPLOAD_FOLDERS.ID_CARDS);
                try {
                    const profilePicPath = member.profilePicture
                        ? path.join(process.cwd(), member.profilePicture.replace(/^\//, ''))
                        : undefined;
                    const result = await generateIDCard({
                        memberNumber: member.memberNumber,
                        firstName: member.firstName,
                        lastName: member.lastName,
                        middleName: member.middleName,
                        sport: member.sport,
                        state: member.state,
                        membershipYear: member.membershipYear,
                        profilePicture: profilePicPath,
                        validUntil,
                    }, outputDir);
                    generatedCardFront = `/uploads/${UPLOAD_FOLDERS.ID_CARDS}/${path.basename(result.frontPath)}`;
                    generatedCardBack = `/uploads/${UPLOAD_FOLDERS.ID_CARDS}/${path.basename(result.backPath)}`;
                }
                catch (err) {
                    console.error('ID card generation error:', err);
                }
            }
            const updated = await IDCardRequest.findByIdAndUpdate(id, {
                adminStatus: 'approved',
                reviewedBy: context.admin.id,
                reviewedAt: new Date(),
                generatedCardFront,
                generatedCardBack,
            }, { new: true });
            sendEmail(member.email, 'Your RENISA ID Card is Ready', idCardStatusTemplate(`${member.firstName} ${member.lastName}`, 'approved')).catch(console.error);
            createMemberNotification(String(request.memberId._id || request.memberId), 'id_card_approved', 'ID Card Approved', 'Your ID card request has been approved. You can now download your digital ID card.', '/member/id-card');
            return { success: true, message: 'ID card request approved and card generated', data: updated };
        },
        rejectIDCardRequest: async (_, { id, reason }, context) => {
            requireAdminAuth(context);
            const request = await IDCardRequest.findById(id).populate('memberId', 'firstName lastName email');
            if (!request)
                throw new Error('Request not found');
            const updated = await IDCardRequest.findByIdAndUpdate(id, { adminStatus: 'rejected', reviewedBy: context.admin.id, reviewedAt: new Date(), rejectionReason: reason }, { new: true });
            const member = request.memberId;
            sendEmail(member.email, 'RENISA ID Card Request Update', idCardStatusTemplate(`${member.firstName} ${member.lastName}`, 'rejected', reason)).catch(console.error);
            createMemberNotification(String(member._id || request.memberId._id), 'id_card_rejected', 'ID Card Request Rejected', reason ? `Your ID card request was rejected: ${reason}` : 'Your ID card request was rejected.', '/member/id-card');
            return { success: true, message: 'ID card request rejected', data: updated };
        },
        updateIDCardDeliveryStatus: async (_, { id, deliveryStatus, trackingInfo }, context) => {
            requireAdminAuth(context);
            const updated = await IDCardRequest.findByIdAndUpdate(id, { deliveryStatus, ...(trackingInfo && { trackingInfo }) }, { new: true });
            if (!updated)
                throw new Error('Request not found');
            return { success: true, message: 'Delivery status updated', data: updated };
        },
        confirmIDCardPaystackPayment: async (_, { requestId, reference, amount }, context) => {
            requireMemberAuth(context);
            const request = await IDCardRequest.findById(requestId);
            if (!request)
                throw new Error('ID card request not found');
            if (request.memberId.toString() !== context.member.id)
                throw new Error('Unauthorized');
            if (request.paymentStatus === 'paid')
                throw new Error('Payment already completed');
            try {
                const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } });
                const ps = response.data.data;
                if (ps.status !== 'success')
                    throw new Error('Payment was not successful');
                const updated = await IDCardRequest.findByIdAndUpdate(requestId, { paymentRef: reference, paymentStatus: 'paid', paidAt: new Date() }, { new: true });
                createMemberNotification(context.member.id, 'payment', 'ID Card Payment Confirmed', `Your ID card payment of ₦${amount.toLocaleString()} was successful. We will process your request shortly.`, '/member/id-card');
                return { success: true, message: 'Payment confirmed', data: updated };
            }
            catch (err) {
                throw new Error(err.message || 'Failed to verify payment');
            }
        },
        approveIDCardPayment: async (_, { id }, context) => {
            requireAdminAuth(context);
            const request = await IDCardRequest.findById(id).populate('memberId', 'firstName lastName email');
            if (!request)
                throw new Error('Request not found');
            if (request.paymentStatus === 'paid')
                throw new Error('Payment is already marked as paid');
            const updated = await IDCardRequest.findByIdAndUpdate(id, { paymentStatus: 'paid', paidAt: new Date() }, { new: true });
            const member = request.memberId;
            createMemberNotification(String(member._id || member), 'payment', 'ID Card Payment Approved', 'Your ID card payment has been approved by admin. Your request is now being processed.', '/member/id-card');
            return { success: true, message: 'Payment approved successfully', data: updated };
        },
        deleteIDCardRequest: async (_, { id }, context) => {
            requireAdminAuth(context);
            const request = await IDCardRequest.findById(id);
            if (!request)
                throw new Error('Request not found');
            await IDCardRequest.findByIdAndDelete(id);
            return { success: true, message: 'ID card request deleted', data: null };
        },
        manualIDCardPayment: async (_, { requestId, referenceNumber, notes }, context) => {
            requireMemberAuth(context);
            const request = await IDCardRequest.findById(requestId);
            if (!request)
                throw new Error('ID card request not found');
            if (request.memberId.toString() !== context.member.id)
                throw new Error('Unauthorized');
            if (request.paymentStatus === 'paid')
                throw new Error('Payment already completed');
            const paymentRef = `RENISA-ID-MANUAL-${referenceNumber.replace(/\s+/g, '-').toUpperCase()}`;
            await IDCardRequest.findByIdAndUpdate(requestId, {
                paymentRef,
                paymentStatus: 'pending',
                notes: notes || `Manual bank transfer reference: ${referenceNumber}`,
            });
            const updated = await IDCardRequest.findById(requestId);
            return { success: true, message: 'Manual payment submitted. Admin will verify and process your request.', data: updated };
        },
    },
};
export default idCardRequestResolvers;
//# sourceMappingURL=idCardRequest.resolvers.js.map