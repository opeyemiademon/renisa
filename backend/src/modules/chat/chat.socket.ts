import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './chat.model.js';
import Member from '../member/member.model.js';
import { TOKEN_SECRET } from '../../utils/constants.js';

// memberId -> socketId
const onlineMembers = new Map<string, string>();

// memberId -> member info cache
const onlineMemberInfo = new Map<string, { id: string; firstName: string; lastName: string; profilePicture?: string }>();

function getMemberFromToken(token: string): { id: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET) as any;
    if (decoded.type === 'member') return { id: decoded.id, email: decoded.email };
    return null;
  } catch {
    return null;
  }
}

async function broadcastOnlineMembers(io: SocketServer) {
  const memberList = Array.from(onlineMemberInfo.values());
  io.emit('online_members', memberList);
}

export function initChatSocket(io: SocketServer) {
  io.on('connection', (socket: Socket) => {
    let memberId: string | null = null;

    // Authenticate
    socket.on('auth', async (token: string) => {
      const decoded = getMemberFromToken(token);
      if (!decoded) {
        socket.emit('auth_error', 'Invalid token');
        return;
      }
      memberId = decoded.id;
      onlineMembers.set(memberId, socket.id);
      socket.join(`user:${memberId}`);

      // Fetch and cache member info
      const memberDoc = await Member.findById(memberId).select('firstName lastName profilePicture').lean() as any;
      if (memberDoc) {
        onlineMemberInfo.set(memberId, {
          id: memberId,
          firstName: memberDoc.firstName,
          lastName: memberDoc.lastName,
          profilePicture: memberDoc.profilePicture,
        });
      }

      // Broadcast updated online list with member info
      await broadcastOnlineMembers(io);

      // Send recent conversation list to this member
      const conversations = await getConversationList(memberId);
      socket.emit('conversations', conversations);
    });

    // Get chat history with a specific member
    socket.on('get_history', async ({ withMemberId }: { withMemberId: string }) => {
      if (!memberId) return;
      const messages = await Message.find({
        $or: [
          { senderId: memberId, receiverId: withMemberId },
          { senderId: withMemberId, receiverId: memberId },
        ],
      })
        .sort({ createdAt: 1 })
        .limit(100)
        .lean();

      // Mark received messages as read
      await Message.updateMany(
        { senderId: withMemberId, receiverId: memberId, isRead: false },
        { isRead: true }
      );

      socket.emit('chat_history', { withMemberId, messages });

      // Notify sender their messages were read
      const senderSocketId = onlineMembers.get(withMemberId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('messages_read', { byMemberId: memberId });
      }
    });

    // Send message
    socket.on('send_message', async ({ receiverId, message }: { receiverId: string; message: string }) => {
      if (!memberId || !message?.trim()) return;

      const saved = await Message.create({
        senderId: memberId,
        receiverId,
        message: message.trim(),
      });

      const populated = await Message.findById(saved._id)
        .populate('senderId', 'firstName lastName profilePicture memberNumber')
        .populate('receiverId', 'firstName lastName profilePicture memberNumber')
        .lean();

      const payload = {
        id: (saved._id as any).toString(),
        senderId: memberId,
        receiverId,
        message: message.trim(),
        isRead: false,
        createdAt: saved.createdAt,
        sender: (populated as any)?.senderId,
      };

      // Send to receiver if online
      const receiverSocketId = onlineMembers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', payload);
      }

      // Echo back to sender
      socket.emit('message_sent', payload);

      // Update conversation lists for both
      const [senderConvos, receiverConvos] = await Promise.all([
        getConversationList(memberId),
        getConversationList(receiverId),
      ]);
      socket.emit('conversations', senderConvos);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('conversations', receiverConvos);
      }
    });

    // Typing indicator
    socket.on('typing', ({ receiverId, isTyping }: { receiverId: string; isTyping: boolean }) => {
      if (!memberId) return;
      const receiverSocketId = onlineMembers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', { senderId: memberId, isTyping });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      if (memberId) {
        onlineMembers.delete(memberId);
        onlineMemberInfo.delete(memberId);
        await broadcastOnlineMembers(io);
      }
    });
  });
}

async function getConversationList(memberId: string) {
  // Find all members this user has chatted with
  const sent = await Message.distinct('receiverId', { senderId: memberId });
  const received = await Message.distinct('senderId', { receiverId: memberId });

  const peerIds = [...new Set([...sent.map(String), ...received.map(String)])].filter(
    (id) => id !== memberId
  );

  const conversations = await Promise.all(
    peerIds.map(async (peerId) => {
      const peer = await Member.findById(peerId).select('firstName lastName profilePicture memberNumber').lean();
      if (!peer) return null;

      const lastMsg = await Message.findOne({
        $or: [
          { senderId: memberId, receiverId: peerId },
          { senderId: peerId, receiverId: memberId },
        ],
      })
        .sort({ createdAt: -1 })
        .lean();

      const unreadCount = await Message.countDocuments({
        senderId: peerId,
        receiverId: memberId,
        isRead: false,
      });

      return {
        memberId: peerId,
        member: peer,
        lastMessage: lastMsg?.message || '',
        lastMessageAt: lastMsg?.createdAt || null,
        unreadCount,
        isOnline: onlineMembers.has(peerId),
      };
    })
  );

  return conversations
    .filter(Boolean)
    .sort((a: any, b: any) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
    });
}

export { onlineMembers };
