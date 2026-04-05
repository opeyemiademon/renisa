import type { Member, MemberStatus, Gender } from '@/types'
import type { IDCardRequestMemberRef } from '@/types'

const MEMBER_STATUSES: MemberStatus[] = ['active', 'inactive', 'suspended', 'alumni', 'pending']

function normalizeStatus(s?: string | null): MemberStatus {
  if (s && MEMBER_STATUSES.includes(s as MemberStatus)) return s as MemberStatus
  return 'active'
}

/**
 * Builds a full `Member` for ID card previews/PDF when the API/Redux object is partial
 * (e.g. login payload omits `memberCode` / `updatedAt`).
 */
export function buildMemberForIdCardPreview(
  source: Partial<Member> | IDCardRequestMemberRef
): Member {
  const firstName = source.firstName?.trim() || 'Member'
  const lastName = source.lastName?.trim() || ''
  const memberNumber =
    ('memberNumber' in source && source.memberNumber?.trim()) || 'RENISA-PENDING'
  const id = ('id' in source && source.id) || ''

  return {
    id: String(id),
    memberNumber,
    memberCode: ('memberCode' in source && source.memberCode?.trim()) || memberNumber,
    firstName,
    lastName,
    middleName: 'middleName' in source ? source.middleName : undefined,
    gender: (('gender' in source && source.gender) || 'male') as Gender,
    dateOfBirth: ('dateOfBirth' in source && source.dateOfBirth) || '',
    phone: ('phone' in source && source.phone) || '',
    email: ('email' in source && source.email) || '',
    address: ('address' in source && source.address) || '',
    city: ('city' in source && source.city) || '',
    state: (source.state?.trim()) || '—',
    stateOfOrigin: ('stateOfOrigin' in source && source.stateOfOrigin) || source.state || '',
    lga: ('lga' in source && source.lga) || '',
    sport: (source.sport?.trim()) || '—',
    profilePicture: 'profilePicture' in source ? source.profilePicture : undefined,
    status: normalizeStatus('status' in source ? source.status : undefined),
    isAlumni: ('isAlumni' in source && source.isAlumni) ?? false,
    createdAt: ('createdAt' in source && source.createdAt) || '',
    updatedAt: ('updatedAt' in source && source.updatedAt) || ('createdAt' in source && source.createdAt) || '',
  }
}
