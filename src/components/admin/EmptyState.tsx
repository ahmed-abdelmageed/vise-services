
import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  isLoading?: boolean;
}

export const EmptyState = ({ 
  title = "No data available", 
  description = "There are no items to display at this time.", 
  action,
  isLoading 
}: EmptyStateProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
};
