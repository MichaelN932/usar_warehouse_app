import { RequestStatus, POStatus } from '../../types';

type Status = RequestStatus | POStatus;

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

const statusStyles: Record<Status, string> = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Approved: 'bg-blue-100 text-blue-700 border-blue-200',
  Backordered: 'bg-orange-100 text-orange-700 border-orange-200',
  ReadyForPickup: 'bg-green-100 text-green-700 border-green-200',
  Fulfilled: 'bg-slate-100 text-slate-600 border-slate-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
  Draft: 'bg-slate-100 text-slate-600 border-slate-200',
  Submitted: 'bg-blue-100 text-blue-700 border-blue-200',
  PartialReceived: 'bg-amber-100 text-amber-700 border-amber-200',
  Received: 'bg-green-100 text-green-700 border-green-200',
};

const statusLabels: Record<Status, string> = {
  Pending: 'Pending',
  Approved: 'Approved',
  Backordered: 'Backordered',
  ReadyForPickup: 'Ready for Pickup',
  Fulfilled: 'Fulfilled',
  Cancelled: 'Cancelled',
  Draft: 'Draft',
  Submitted: 'Submitted',
  PartialReceived: 'Partial',
  Received: 'Received',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'px-1.5 py-0.5 text-[10px]'
    : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-bold border ${sizeClasses} ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
