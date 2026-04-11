// ==================== Core Types ====================

export type MemberStatus = 'active' | 'inactive' | 'suspended' | 'alumni' | 'pending'
export type Gender = 'male' | 'female'
export type PaymentMethod = 'paystack' | 'bank_transfer' | 'cash' | 'manual'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'reversed'
export type ElectionStatus = 'draft' | 'upcoming' | 'active' | 'closed' | 'results_declared'
export type LeadershipGroup = 'board_of_trustees' | 'national_executives' | 'state_executives' | 'directorate'
export type IDCardType = 'online' | 'physical'
export type IDCardPaymentStatus = 'pending' | 'paid' | 'failed'
export type IDCardAdminStatus = 'pending' | 'approved' | 'rejected'
export type IDCardDeliveryStatus = 'processing' | 'shipped' | 'delivered'
export type EventType = 'news' | 'event' | 'announcement'
export type EventStatus = 'draft' | 'published' | 'archived'
export type CommunicationType = 'email' | 'sms' | 'both'
export type DonationMode = 'physical' | 'monetary' | 'both'
export type DonationStatus = 'pending' | 'acknowledged' | 'verified'
export type UserRole = 'admin' | 'executive' | 'super_admin'

// ==================== Member ====================

export interface Member {
  id: string
  memberNumber: string
  memberCode: string
  firstName: string
  lastName: string
  middleName?: string
  gender: Gender
  dateOfBirth: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  stateOfOrigin: string
  lga: string
  sport: string
  profilePicture?: string
  status: MemberStatus
  passwordHash?: string
  isAlumni: boolean
  createdAt: string
  updatedAt: string
}

// ==================== Admin User ====================

export interface AdminUser {
  id: string
  username: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

// ==================== Member Code ====================

export interface MemberCode {
  id: string
  code: string
  batchName: string
  isUsed: boolean
  usedBy?: string | Pick<Member, 'id' | 'firstName' | 'lastName' | 'memberNumber'>
  usedByMember?: Pick<Member, 'id' | 'firstName' | 'lastName' | 'memberNumber'>
  expiresAt?: string
  expiryDate?: string
  createdAt: string
  updatedAt: string
}

// ==================== Payment Types ====================

export interface PaymentType {
  id: string
  name: string
  description: string
  amount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ==================== Payment ====================

export interface Payment {
  id: string
  memberId: string
  member?: Pick<Member, 'id' | 'firstName' | 'lastName' | 'memberNumber'>
  paymentTypeId: string
  paymentType?: PaymentType
  amount: number
  year: number
  method: PaymentMethod
  status: PaymentStatus
  reference: string
  paystackReference?: string
  note?: string
  recordedBy?: string
  createdAt: string
  updatedAt: string
}

// ==================== Election ====================

export interface ElectoralPosition {
  id: string
  electionId: string
  title: string
  description?: string
  formFee: number
  maxCandidates?: number
  createdAt: string
  updatedAt: string
}

export interface Election {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  candidacyDeadline: string
  status: ElectionStatus
  eligibilityCriteria: {
    minYearsAsMember?: number
    mustBeActive?: boolean
    mustHavePaidDues?: boolean
  }
  positions: ElectoralPosition[]
  year?: number
  votingStartDate?: string
  votingEndDate?: string
  eligibilityMinYears?: number
  requiresDuesPayment?: boolean
  createdAt: string
  updatedAt: string
}

// ==================== Candidate ====================

export interface Candidate {
  id: string
  memberId: string
  member?: Pick<Member, 'id' | 'firstName' | 'lastName' | 'memberNumber' | 'profilePicture'>
  electionId: string
  positionId: string
  position?: ElectoralPosition
  manifesto: string
  profilePicture?: string
  isApproved: boolean
  formPaymentStatus: string
  formPaymentRef?: string
  status?: string
  createdAt: string
  updatedAt: string
}

// ==================== Vote ====================

export interface Vote {
  id: string
  memberId: string
  electionId: string
  positionId: string
  candidateId: string
  createdAt: string
}

export interface VoteResult {
  positionId: string
  positionTitle: string
  candidates: Array<{
    candidateId: string
    candidateName: string
    voteCount: number
    percentage: number
  }>
  totalVotes: number
}

// ==================== Leadership ====================

export interface LeadershipGroupInfo {
  id: string
  name: string
  slug: string
  description: string
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface LeadershipMember {
  id: string
  groupId: string
  group?: LeadershipGroupInfo
  memberId?: { id?: string; firstName?: string; lastName?: string; profilePicture?: string; bio?: string; sport?: string; state?: string; memberNumber?: string }
  name: string
  slug?: string | null
  position: string
  bio?: string
  profilePicture?: string
  /** Leadership-specific image; GraphQL also exposes as photo */
  photo?: string
  coverPhoto?: string
  galleryImages?: string[]
  state?: string
  tenure?: string
  tenureStart?: string
  tenureEnd?: string
  isCurrent: boolean
  socialLinks?: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
  }
  createdAt: string
  updatedAt: string
}

// ==================== Hero Slide ====================

export interface HeroSlide {
  id: string
  title: string
  subtitle?: string
  caption?: string
  imageUrl: string
  tag?: string
  ctaText?: string
  ctaLink?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ==================== Executive ====================

export interface Executive {
  id: string
  name: string
  position: string
  photo?: string
  profilePicture?: string
  tenure?: string
  sport?: string
  bio?: string
  socialLinks?: { platform: string; url: string }[]
  member?: { sport?: string; firstName?: string; lastName?: string; profilePicture?: string; memberNumber?: string }
  /** Populated member from API, or ID string when creating/updating */
  memberId?: string | { id?: string; sport?: string; firstName?: string; lastName?: string; profilePicture?: string; memberNumber?: string }
  displayOrder: number
  order?: number
  createdAt: string
  updatedAt: string
}

// ==================== Award ====================

export interface AwardCategory {
  id: string
  name: string
  description?: string
  icon?: string
  isActive?: boolean
  pollActive?: boolean
  isPubliclyVisible?: boolean
  votingStartDate?: string
  votingEndDate?: string
  createdAt: string
  updatedAt: string
}

export interface Award {
  id: string
  title: string
  recipientName: string
  recipientPhoto?: string
  categoryId: string | AwardCategory
  category?: AwardCategory
  status?: string
  year: number
  description?: string
  votingEnabled: boolean
  votingEndDate?: string
  totalVotes?: number
  createdAt: string
  updatedAt: string
}

export interface AwardVote {
  id: string
  memberId: string
  awardId: string
  createdAt: string
}

/** Matches admin Award Winners report / getAwardWinnersReport */
export interface AwardWinnerInfo {
  awardId: string
  recipientName: string
  recipientPhoto?: string | null
  memberNumber?: string | null
  voteCount: number
}

export interface CategoryWinner {
  categoryId: string
  categoryName: string
  winner: AwardWinnerInfo | null
  nominees: AwardWinnerInfo[]
  pollActive: boolean
  isPubliclyVisible: boolean
  votingStartDate?: string | null
  votingEndDate?: string | null
}

// ==================== ID Card ====================

export interface IDCardSettings {
  id: string
  onlineFee: number
  physicalFee: number
  requiresApproval: boolean
  isEnabled: boolean
  validityYears: number
  headerText?: string
  footerText?: string
  updatedAt: string
}

/** Populated `memberId` when ID card queries include member subfields */
export interface IDCardRequestMemberRef {
  id: string
  firstName: string
  lastName: string
  middleName?: string
  memberNumber?: string
  sport?: string
  state?: string
  status?: string
  profilePicture?: string
  createdAt?: string
}

export interface IDCardRequest {
  id: string
  memberId: string | IDCardRequestMemberRef
  member?: Pick<Member, 'id' | 'firstName' | 'lastName' | 'memberNumber' | 'sport' | 'state'>
  requestType: IDCardType
  photo: string
  paymentStatus: IDCardPaymentStatus
  paymentReference?: string
  adminStatus: IDCardAdminStatus
  rejectionReason?: string
  deliveryStatus?: IDCardDeliveryStatus
  cardUrl?: string
  generatedCardFront?: string
  generatedCardBack?: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

// ==================== Event ====================

export interface Event {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  eventDate?: string
  venue?: string
  eventType: EventType
  views?: number
  publishedAt?: string
  type?: string
  status: EventStatus
  isFeatured: boolean
  createdBy?: string
  description?: string
  startDate?: string
  endDate?: string
  location?: string
  address?: string
  registrationLink?: string
  createdAt: string
  updatedAt: string
}

// ==================== Gallery ====================

export interface GalleryItem {
  id: string
  title: string
  description?: string
  caption?: string
  imageUrl: string
  albumName: string
  eventDate?: string
  year: number
  uploadedBy?: string
  createdAt: string
  updatedAt: string
}

// ==================== Communication ====================

export interface Communication {
  id: string
  type: CommunicationType
  subject?: string
  message: string
  recipients: 'all' | 'active' | string[]
  sentBy: string
  sentCount: number
  createdAt: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
  updatedAt: string
}

// ==================== Donation ====================

export interface DonationType {
  id: string
  name: string
  description: string
  donationMode: DonationMode
  icon?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DonationInvoice {
  id: string
  donationId: string
  invoiceNumber: string
  amount: number
  currency?: string
  pdfUrl?: string
  paystackReference?: string
  paymentUrl?: string
  status: PaymentStatus
  createdAt: string
}

export interface Donation {
  id: string
  donationTypeId: string
  donationType?: DonationType
  donorName: string
  donorEmail?: string
  donorPhone?: string
  description?: string
  notes?: string
  adminNotes?: string
  amount?: number
  currency?: string
  items?: string
  physicalItems?: string
  quantity?: number
  estimatedValue?: number
  preferredDropoffDate?: string
  paymentMethod?: string
  paymentStatus?: string
  paystackRef?: string
  manualTransferReference?: string
  isMonetary: boolean
  status: DonationStatus
  acknowledgedBy?: string
  acknowledgedAt?: string
  invoice?: DonationInvoice
  createdAt: string
  updatedAt: string
}

// ==================== Site Content ====================

export interface SiteContent {
  id: string
  section: string
  title?: string
  content: string
  metadata?: Record<string, string>
  updatedBy?: string
  updatedAt: string
}

// ==================== Dashboard ====================

export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  newMembersThisMonth: number
  totalPaymentsThisYear: number
  activeElections: number
  upcomingEvents: number
  totalDonations: number
  pendingIDCards: number
  memberGrowth: Array<{ month: string; count: number }>
  paymentTypeDistribution: Array<{ name: string; total: number }>
  recentMembers: Member[]
  recentPayments: Payment[]
}

// ==================== Auth ====================

export interface AuthPayload {
  token: string
  member?: Member
  adminUser?: AdminUser
  portal: 'member' | 'admin'
}

// ==================== Paginated Result ====================

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ==================== API Response ====================

export interface MutationResponse {
  success: boolean
  message: string
}

// ==================== Form Types ====================

export interface LoginForm {
  email: string
  password: string
}

export interface MemberRegistrationForm {
  memberCode: string
  firstName: string
  lastName: string
  middleName?: string
  gender: Gender
  dateOfBirth: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  stateOfOrigin: string
  lga: string
  sport: string
  profilePicture?: string
  password: string
  confirmPassword: string
}
