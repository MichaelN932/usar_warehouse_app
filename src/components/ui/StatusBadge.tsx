import { RequestStatus, POStatus } from '../../types';

type Status = RequestStatus | POStatus;

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, string> = {
  Pending: 'badge-pending',
  Approved: 'badge-approved',
  Backordered: 'badge-backordered',
  ReadyForPickup: 'badge-ready',
  Fulfilled: 'badge-fulfilled',
  Cancelled: 'badge-cancelled',
  Draft: 'bg-gray-100 text-gray-800',
  Submitted: 'bg-blue-100 text-blue-800',
  PartialReceived: 'bg-yellow-100 text-yellow-800',
  Received: 'bg-green-100 text-green-800',
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

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
