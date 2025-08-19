
import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
      case 'approved':
        return "bg-green-100 text-green-800";
      case 'unpaid':
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'in progress':
      case 'document review':
        return "bg-blue-100 text-blue-800";
      case 'interview scheduled':
        return "bg-purple-100 text-purple-800";
      case 'rejected':
      case 'cancelled':
      case 'overdue':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </span>
  );
};
