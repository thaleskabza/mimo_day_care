"use client";

import { ApplicationStatus as Status } from "@/generated/prisma";

interface ApplicationStatusProps {
  status: Status;
}

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  WAITLISTED: "bg-orange-100 text-orange-800",
  REJECTED: "bg-red-100 text-red-800",
};

const statusLabels = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  WAITLISTED: "Waitlisted",
  REJECTED: "Rejected",
};

export default function ApplicationStatus({ status }: ApplicationStatusProps) {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
  const label = statusLabels[status] || status;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}
