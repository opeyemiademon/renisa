'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UserPlus, Download, FileText, Search, RotateCcw, ChevronDown, ChevronUp,
  MoreVertical, Eye, Edit2, Trash2, LogIn, ShieldCheck, FileDown, X,
} from 'lucide-react'
import {
  getAllMembers, updateMemberStatus, markMemberAsAlumni,
  deleteMember, loginAsMember,
} from '@/lib/api_services/memberApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { buildImageUrl, formatDate, downloadCSV } from '@/lib/utils'
import { NIGERIAN_STATES } from '@/lib/nigerianStates'
import { useAppDispatch } from '@/hooks/redux'
import { setCredentials } from '@/lib/store/authSlice'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

async function loadImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function imageFormat(dataUrl: string): string {
  return dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
}

interface FilterState {
  name: string
  memberNumber: string
  memberCode: string
  email: string
  gender: string
  state: string
  status: string
  dateFrom: string
  dateTo: string
}

const emptyFilter: FilterState = {
  name: '', memberNumber: '', memberCode: '', email: '',
  gender: '', state: '', status: '', dateFrom: '', dateTo: '',
}

const stateOptions = [
  { value: '', label: 'All States' },
  ...NIGERIAN_STATES.map((s) => ({ value: s, label: s })),
]

// ─── Row Action Menu ──────────────────────────────────────────────────────────
function RowMenu({
  row, index, onView, onEdit, onDownloadProfile, onDelete, onLoginAs, onChangeStatus,
}: {
  row: any
  index: number
  onView: () => void
  onEdit: () => void
  onDownloadProfile: () => void
  onDelete: () => void
  onLoginAs: () => void
  onChangeStatus: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const status = row.status || row.membershipStatus
  const isActive = status === 'active'

  const items = [
    { icon: Eye, label: 'View Member', action: onView, color: 'text-gray-700' },
    { icon: Edit2, label: 'Edit Member', action: onEdit, color: 'text-gray-700' },
    { icon: FileDown, label: 'Download Profile', action: onDownloadProfile, color: 'text-gray-700' },
    null, // divider
    { icon: LogIn, label: 'Login as Member', action: onLoginAs, color: 'text-blue-600' },
    {
      icon: ShieldCheck,
      label: isActive ? 'Suspend Member' : status === 'suspended' ? 'Activate Member' : 'Change Status',
      action: onChangeStatus,
      color: isActive ? 'text-amber-600' : 'text-green-600',
    },
    null, // divider
    { icon: Trash2, label: 'Delete Member', action: onDelete, color: 'text-red-500' },
  ]

  // Determine if menu should open upward (last few rows)
  const openUp = index >= 15

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
        title="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 w-52 bg-white rounded-xl border border-gray-200 shadow-xl py-1 ${
            openUp ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {items.map((item, i) => {
            if (item === null) return <div key={i} className="my-1 border-t border-gray-100" />
            const Icon = item.icon
            return (
              <button
                key={item.label}
                onClick={() => { setOpen(false); item.action() }}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${item.color}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Change Status Modal ──────────────────────────────────────────────────────
function ChangeStatusModal({
  member, isOpen, onClose, onConfirm, loading,
}: {
  member: any
  isOpen: boolean
  onClose: () => void
  onConfirm: (status: string) => void
  loading: boolean
}) {
  const [selected, setSelected] = useState('')
  const current = member?.status || member?.membershipStatus || ''

  const options = ['active', 'inactive', 'suspended', 'pending'].filter((s) => s !== current)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Member Status" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Current status: <span className="font-semibold capitalize text-gray-800">{current}</span>
        </p>
        <Select
          label="New Status"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          placeholder="Select new status..."
          options={options.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
        />
        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            onClick={() => selected && onConfirm(selected)}
            loading={loading}
            disabled={!selected}
            className="flex-1"
          >
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminMembersPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [filter, setFilter] = useState<FilterState>(emptyFilter)
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(emptyFilter)
  const [liveSearch, setLiveSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [filtersOpen, setFiltersOpen] = useState(true)

  // Modal state
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [statusTarget, setStatusTarget] = useState<any>(null)
  const [loginAsTarget, setLoginAsTarget] = useState<any>(null)

  const setField = (f: keyof FilterState, v: string) => setFilter((p) => ({ ...p, [f]: v }))
  const hasActiveFilters = Object.values(appliedFilter).some((v) => v !== '')

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['admin-members', appliedFilter],
    queryFn: () => {
      const params: Record<string, string> = {}
      Object.entries(appliedFilter).forEach(([k, v]) => { if (v) params[k] = v })
      return getAllMembers(Object.keys(params).length ? params : undefined)
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: string }) => updateMemberStatus(id, newStatus),
    onSuccess: () => {
      toast.success('Member status updated')
      queryClient.invalidateQueries({ queryKey: ['admin-members'] })
      setStatusTarget(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMember(id),
    onSuccess: () => {
      toast.success('Member deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-members'] })
      setDeleteTarget(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const loginAsMutation = useMutation({
    mutationFn: (id: string) => loginAsMember(id),
    onSuccess: (data, id) => {
      dispatch(setCredentials({ token: data.token, member: data.member as any, portal: 'member' }))
      toast.success(`Logged in as ${data.member.firstName} ${data.member.lastName}`)
      router.push('/member/dashboard')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const allMembers = (data || []) as any[]

  const liveFiltered = liveSearch.trim()
    ? allMembers.filter((m: any) => {
        const q = liveSearch.toLowerCase()
        return (
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.memberNumber?.toLowerCase().includes(q) ||
          m.phone?.includes(q)
        )
      })
    : allMembers

  const visibleRows = liveFiltered.slice(0, visibleCount)

  const handleSearch = () => { setAppliedFilter({ ...filter }); setVisibleCount(20) }
  const handleReset = () => { setFilter(emptyFilter); setAppliedFilter(emptyFilter); setVisibleCount(20) }

  const handleExportCSV = () => {
    if (!allMembers.length) return toast.error('No data to export')
    const rows = [
      ['SN', 'Member Number', 'Member Code', 'First Name', 'Last Name', 'Gender', 'Email', 'Phone', 'Sport', 'State', 'Status', 'Registered'],
      ...allMembers.map((m: any, i: number) => [
        i + 1, m.memberNumber, m.memberCode, m.firstName, m.lastName, m.gender || '',
        m.email, m.phone || '', m.sport || '', m.state || '',
        m.status || m.membershipStatus, formatDate(m.createdAt),
      ]),
    ]
    downloadCSV(rows, 'renisa-members.csv')
  }

  const handleExportPDF = async () => {
    if (!allMembers.length) return toast.error('No data to export')
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 12
    const colWidths = [8, 32, 38, 16, 50, 24, 22, 22, 18, 24]
    const rowHeight = 7
    const headerH = 8

    let logoBase64: string | null = null
    try { logoBase64 = await loadImageAsBase64('/logo.png') } catch {}

    doc.setFillColor(26, 107, 58)
    doc.rect(0, 0, pageW, 22, 'F')
    if (logoBase64) {
      doc.addImage(logoBase64, imageFormat(logoBase64), margin, 3, 16, 16)
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      doc.text('RENISA — Members Report', margin + 19, 10)
      doc.setFontSize(8)
      doc.text(`Generated: ${new Date().toLocaleString()}   ·   Total: ${allMembers.length} member(s)`, margin + 19, 17)
    } else {
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      doc.text('RENISA — Members Report', margin, 10)
      doc.setFontSize(8)
      doc.text(`Generated: ${new Date().toLocaleString()}   ·   Total: ${allMembers.length} member(s)`, margin, 17)
    }

    let y = 28

    if (hasActiveFilters) {
      const activeDesc = Object.entries(appliedFilter)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').trim()}: ${v}`)
        .join('   |   ')
      doc.setFontSize(7.5)
      doc.setTextColor(80)
      doc.text(`Active filters: ${activeDesc}`, margin, y)
      y += 6
    }

    const cols = ['#', 'Member No.', 'Full Name', 'Gender', 'Email', 'Phone', 'Sport', 'State', 'Status', 'Registered']
    doc.setFillColor(26, 107, 58)
    doc.rect(margin, y, pageW - margin * 2, headerH, 'F')
    doc.setFontSize(7.5)
    doc.setTextColor(255)
    let x = margin
    cols.forEach((col, i) => { doc.text(col, x + 1.5, y + 5.5); x += colWidths[i] })
    y += headerH

    allMembers.forEach((m: any, idx: number) => {
      if (y + rowHeight > doc.internal.pageSize.getHeight() - 10) {
        doc.addPage(); y = 14
        doc.setFillColor(26, 107, 58)
        doc.rect(margin, y, pageW - margin * 2, headerH, 'F')
        doc.setTextColor(255)
        let hx = margin
        cols.forEach((col, i) => { doc.text(col, hx + 1.5, y + 5.5); hx += colWidths[i] })
        y += headerH
      }
      const isEven = idx % 2 === 0
      doc.setFillColor(isEven ? 245 : 255, isEven ? 250 : 255, isEven ? 247 : 255)
      doc.rect(margin, y, pageW - margin * 2, rowHeight, 'F')
      doc.setTextColor(50); doc.setFontSize(7)
      const cells = [
        String(idx + 1), m.memberNumber || '', `${m.firstName} ${m.lastName}`,
        m.gender ? m.gender[0].toUpperCase() + m.gender.slice(1) : '',
        m.email || '', m.phone || '', m.sport || '', m.state || '',
        m.status || m.membershipStatus || '', formatDate(m.createdAt),
      ]
      let cx = margin
      cells.forEach((cell, i) => {
        const text = doc.splitTextToSize(String(cell), colWidths[i] - 3)[0] || ''
        doc.text(text, cx + 1.5, y + 5); cx += colWidths[i]
      })
      doc.setDrawColor(220)
      doc.rect(margin, y, pageW - margin * 2, rowHeight, 'S')
      y += rowHeight
    })

    doc.setFontSize(7); doc.setTextColor(160)
    doc.text(`RENISA Members Report — ${new Date().toLocaleDateString()}`, margin, doc.internal.pageSize.getHeight() - 6)
    doc.save('renisa-members.pdf')
  }

  const handleDownloadProfile = async (m: any) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 20

    let logoBase64: string | null = null
    try { logoBase64 = await loadImageAsBase64('/logo.png') } catch {}

    let profileBase64: string | null = null
    if (m.profilePicture) {
      try { profileBase64 = await loadImageAsBase64(buildImageUrl(m.profilePicture)) } catch {}
    }

    // Header bar
    doc.setFillColor(26, 107, 58)
    doc.rect(0, 0, pageW, 38, 'F')
    if (logoBase64) {
      doc.addImage(logoBase64, imageFormat(logoBase64), margin, 4, 28, 28)
      doc.setFontSize(16)
      doc.setTextColor(255)
      doc.text('RENISA', margin + 32, 15)
      doc.setFontSize(9)
      doc.setTextColor(200, 230, 210)
      doc.text('Retired Nigerian Women & Men Sports Association', margin + 32, 22)
      doc.setFontSize(11)
      doc.setTextColor(255)
      doc.text('Member Profile', margin + 32, 31)
    } else {
      doc.setFontSize(16)
      doc.setTextColor(255)
      doc.text('RENISA', margin, 15)
      doc.setFontSize(9)
      doc.setTextColor(200, 230, 210)
      doc.text('Retired Nigerian Women & Men Sports Association', margin, 22)
      doc.setFontSize(11)
      doc.setTextColor(255)
      doc.text('Member Profile', margin, 31)
    }

    // Member number badge
    doc.setFontSize(9)
    doc.setTextColor(212, 160, 23)
    doc.text(m.memberNumber || '', pageW - margin, 15, { align: 'right' })

    let y = 52

    // Profile photo or initials circle
    if (profileBase64) {
      doc.addImage(profileBase64, imageFormat(profileBase64), margin, y - 15, 30, 30)
      doc.setDrawColor(200)
      doc.setLineWidth(0.3)
      doc.rect(margin, y - 15, 30, 30, 'S')
    } else {
      doc.setFillColor(230, 245, 235)
      doc.circle(margin + 15, y, 15, 'F')
      doc.setFontSize(16)
      doc.setTextColor(26, 107, 58)
      doc.text((m.firstName?.[0] || '') + (m.lastName?.[0] || ''), margin + 15, y + 5, { align: 'center' })
    }

    // Name & status
    const nameX = margin + 35
    doc.setFontSize(14)
    doc.setTextColor(30)
    doc.text(`${m.firstName} ${m.middleName ? m.middleName + ' ' : ''}${m.lastName}`, nameX, y - 3)
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(m.email || '', nameX, y + 4)
    doc.setFontSize(8)
    const status = m.status || m.membershipStatus || ''
    doc.setTextColor(status === 'active' ? 26 : 180, status === 'active' ? 107 : 50, status === 'active' ? 58 : 50)
    doc.text(`Status: ${status.toUpperCase()}`, nameX, y + 11)

    y += 32

    // Section divider
    doc.setDrawColor(200)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageW - margin, y)
    y += 8

    // Fields
    const fields: [string, string][] = [
      ['Member Number', m.memberNumber || '—'],
      ['Member Code', m.memberCode || '—'],
      ['Gender', m.gender ? m.gender.charAt(0).toUpperCase() + m.gender.slice(1) : '—'],
      ['Date of Birth', m.dateOfBirth ? formatDate(m.dateOfBirth) : '—'],
      ['Phone', m.phone || '—'],
      ['Alternate Phone', m.alternatePhone || '—'],
      ['Sport', m.sport || '—'],
      ['State of Residence', m.state || '—'],
      ['State of Origin', m.stateOfOrigin || '—'],
      ['LGA', m.lga || '—'],
      ['City', m.city || '—'],
      ['Address', m.address || '—'],
      ['Membership Year', m.membershipYear ? String(m.membershipYear) : '—'],
      ['Registered', formatDate(m.createdAt)],
    ]

    const col1X = margin
    const col2X = pageW / 2 + 5
    let col1Y = y
    let col2Y = y

    fields.forEach((([label, value], i) => {
      const isLeft = i % 2 === 0
      const curX = isLeft ? col1X : col2X
      const curY = isLeft ? col1Y : col2Y

      doc.setFontSize(7.5)
      doc.setTextColor(130)
      doc.text(label, curX, curY)
      doc.setFontSize(9)
      doc.setTextColor(40)
      const lines = doc.splitTextToSize(value, (pageW / 2) - margin - 5)
      doc.text(lines[0], curX, curY + 5.5)

      if (isLeft) col1Y += 14
      else col2Y += 14
    }))

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 14
    doc.setFillColor(26, 107, 58)
    doc.rect(0, footerY, pageW, 14, 'F')
    doc.setFontSize(7.5)
    doc.setTextColor(200, 230, 210)
    doc.text('This is an official RENISA member profile document.', margin, footerY + 6)
    doc.text(`Printed: ${new Date().toLocaleString()}`, pageW - margin, footerY + 6, { align: 'right' })

    doc.save(`${m.firstName}-${m.lastName}-profile.pdf`)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Members</h2>
          {hasActiveFilters && (
            <p className="text-xs text-[#1a6b3a] mt-0.5">{allMembers.length} result(s) matching filters</p>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#1a6b3a]" />
            <span>Search & Filter</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-[#1a6b3a] text-white text-xs">
                {Object.values(appliedFilter).filter(Boolean).length} active
              </span>
            )}
          </div>
          {filtersOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {filtersOpen && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Name" placeholder="First or last name..." value={filter.name} onChange={(e) => setField('name', e.target.value)} />
              <Input label="Member Number" placeholder="e.g. RENISA-2024-0001" value={filter.memberNumber} onChange={(e) => setField('memberNumber', e.target.value)} />
              <Input label="Member Code" placeholder="Registration code..." value={filter.memberCode} onChange={(e) => setField('memberCode', e.target.value)} />
              <Input label="Email" placeholder="member@email.com" type="email" value={filter.email} onChange={(e) => setField('email', e.target.value)} />
              <Select label="Gender" value={filter.gender} onChange={(e) => setField('gender', e.target.value)} placeholder="All Genders"
                options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
              <Select label="State" value={filter.state} onChange={(e) => setField('state', e.target.value)} options={stateOptions} />
              <Select label="Status" value={filter.status} onChange={(e) => setField('status', e.target.value)} placeholder="All Statuses"
                options={[
                  { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' }, { value: 'alumni', label: 'Alumni' }, { value: 'pending', label: 'Pending' },
                ]} />
              <Input label="Registered From" type="date" value={filter.dateFrom} onChange={(e) => setField('dateFrom', e.target.value)} />
              <Input label="Registered To" type="date" value={filter.dateTo} onChange={(e) => setField('dateTo', e.target.value)} />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button onClick={handleSearch} loading={isFetching} iconLeft={<Search className="w-4 h-4" />}>Search</Button>
              <Button variant="outline" onClick={handleReset} iconLeft={<RotateCcw className="w-4 h-4" />}>Reset</Button>
              {hasActiveFilters && <span className="text-sm text-gray-500 ml-1">{allMembers.length} member(s) found</span>}
            </div>
          </div>
        )}
      </div>

      {/* Table toolbar: live search left, actions right */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search name, email, member no..."
            value={liveSearch}
            onChange={(e) => { setLiveSearch(e.target.value); setVisibleCount(20) }}
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30 bg-white"
          />
          {liveSearch && (
            <button onClick={() => setLiveSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {liveSearch && (
            <span className="text-xs text-gray-500">{liveFiltered.length} result(s)</span>
          )}
          <Button variant="outline" size="sm" iconLeft={<FileText className="w-4 h-4" />} onClick={handleExportPDF}>PDF</Button>
          <Button variant="outline" size="sm" iconLeft={<Download className="w-4 h-4" />} onClick={handleExportCSV}>CSV</Button>
          <Link href="/admin/members/add">
            <Button iconLeft={<UserPlus className="w-4 h-4" />} size="sm">Add Member</Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-3 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-10">SN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Member</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Member No.</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Gender</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Sport</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">State</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Registered</th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#1a6b3a] border-t-transparent animate-spin" />
                      Searching...
                    </div>
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    {liveSearch ? `No results for "${liveSearch}".` : hasActiveFilters ? 'No members match your filters.' : 'No members found.'}
                  </td>
                </tr>
              ) : (
                visibleRows.map((row: any, idx: number) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3">
                      <span className="text-xs text-gray-400 font-mono">{idx + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1a6b3a] flex-shrink-0">
                          {row.profilePicture ? (
                            <img src={buildImageUrl(row.profilePicture)} alt={row.firstName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{row.firstName?.[0]}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{row.firstName} {row.lastName}</p>
                          <p className="text-xs text-gray-400">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="font-mono text-xs">{row.memberNumber}</span></td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{row.gender || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{row.sport || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{row.state || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={row.status || row.membershipStatus}>
                        {row.status || row.membershipStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-500 text-xs">{formatDate(row.createdAt)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <RowMenu
                        row={row}
                        index={idx}
                        onView={() => router.push(`/admin/members/${row.id}`)}
                        onEdit={() => router.push(`/admin/members/${row.id}?edit=1`)}
                        onDownloadProfile={() => handleDownloadProfile(row)}
                        onDelete={() => setDeleteTarget(row)}
                        onLoginAs={() => setLoginAsTarget(row)}
                        onChangeStatus={() => setStatusTarget(row)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {visibleCount < liveFiltered.length && (
          <div className="px-4 py-4 border-t border-gray-100 text-center">
            <button
              onClick={() => setVisibleCount((v) => v + 20)}
              className="text-sm text-[#1a6b3a] hover:underline font-medium"
            >
              Load More ({liveFiltered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete Member"
        message={`Are you sure you want to permanently delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This action cannot be undone.`}
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />

      {/* Login as member confirm */}
      <ConfirmModal
        isOpen={!!loginAsTarget}
        onClose={() => setLoginAsTarget(null)}
        onConfirm={() => loginAsTarget && loginAsMutation.mutate(loginAsTarget.id)}
        title="Login as Member"
        message={`You are about to log in as ${loginAsTarget?.firstName} ${loginAsTarget?.lastName}. Your current admin session will be replaced. Continue?`}
        confirmVariant="primary"
        loading={loginAsMutation.isPending}
      />

      {/* Change status */}
      <ChangeStatusModal
        member={statusTarget}
        isOpen={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={(newStatus) => statusTarget && statusMutation.mutate({ id: statusTarget.id, newStatus })}
        loading={statusMutation.isPending}
      />
    </div>
  )
}
