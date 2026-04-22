import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-NG').format(amount);
}
export function formatDate(
  dateInput: string | number | Date,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  let parsedDate: Date;

  if (dateInput instanceof Date) {
    parsedDate = dateInput;
  } else if (typeof dateInput === 'number') {
    parsedDate = new Date(dateInput);
  } else {
    const trimmed = dateInput.trim();
    parsedDate = /^\d+$/.test(trimmed)
      ? new Date(Number(trimmed))
      : new Date(trimmed);
  }

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

 const { year = 'numeric', month = 'short', day = 'numeric' } = options;
  return parsedDate.toLocaleDateString(locale, { year, month, day, ...options });
}


export function formatDateOnly(
  dateInput: string | number | Date,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  let parsedDate: Date;

  if (dateInput instanceof Date) {
    parsedDate = dateInput;
  } else if (typeof dateInput === 'number') {
    parsedDate = new Date(dateInput);
  } else {
    const trimmed = dateInput.trim();
    parsedDate = /^\d+$/.test(trimmed)
      ? new Date(Number(trimmed))
      : new Date(trimmed);
  }

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

 const { year = 'numeric', month = 'short', day = 'numeric' } = options;
  return parsedDate.toLocaleDateString(locale, { year, month, day });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatMemberNumber(num: string): string {
  return num.startsWith('RNS') ? num : `RNS-${num}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() 
}

export function buildImageUrl(path?: string): string {
  if (!path) return ''
  if (path.startsWith('https')) return path
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function downloadCSV(data: string[][] | Record<string, unknown>[], filename: string): void {
  let rows: string[][]
  if (data.length > 0 && !Array.isArray(data[0])) {
    const headers = Object.keys(data[0] as Record<string, unknown>)
    rows = [
      headers,
      ...(data as Record<string, unknown>[]).map((row) => headers.map((h) => String(row[h] ?? ''))),
    ]
  } else {
    rows = data as string[][]
  }
  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
