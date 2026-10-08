import { clsx, type ClassValue } from 'clsx'
import { format, parseISO } from 'date-fns'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names, resolving conflicting Tailwind utilities.
 * Used by every component in src/components/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NEUTRAL = 'bg-gray-100 text-gray-800 border-gray-200'

/** Badge classes for a workflow status (evidence, tasks, exports, ...). */
export function getStatusColor(status?: string | null): string {
  switch ((status ?? '').trim().toLowerCase()) {
    case 'ready':
    case 'completed':
    case 'complete':
    case 'accepted':
    case 'approved':
    case 'done':
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'pending':
    case 'draft':
    case 'in progress':
    case 'in_progress':
    case 'processing':
    case 'generating':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'failed':
    case 'rejected':
    case 'overdue':
    case 'error':
    case 'inactive':
    case 'expired':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return NEUTRAL
  }
}

/** Badge classes for a control severity. */
export function getSeverityColor(severity?: string | null): string {
  switch ((severity ?? '').trim().toLowerCase()) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return NEUTRAL
  }
}

/** Badge classes for a task priority. */
export function getPriorityColor(priority?: string | null): string {
  switch ((priority ?? '').trim().toLowerCase()) {
    case 'urgent':
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return NEUTRAL
  }
}

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null
  const date = typeof value === 'string' ? parseISO(value) : value
  return Number.isNaN(date.getTime()) ? null : date
}

const EMPTY = '—'

/** Format an ISO date string as e.g. "Jan 5, 2026". */
export function formatDate(value?: string | Date | null): string {
  const date = toDate(value)
  return date ? format(date, 'MMM d, yyyy') : EMPTY
}

/** Format an ISO date string as e.g. "Jan 5, 2026 14:30". */
export function formatDateTime(value?: string | Date | null): string {
  const date = toDate(value)
  return date ? format(date, 'MMM d, yyyy HH:mm') : EMPTY
}
