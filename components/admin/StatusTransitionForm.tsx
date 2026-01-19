"use client";

import { useState } from "react";

interface StatusTransitionFormProps {
  applicationId: string;
  currentStatus: string;
  onSuccess: () => void;
}

const statusOptions = [
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "WAITLISTED", label: "Waitlisted" },
  { value: "REJECTED", label: "Rejected" },
];

export default function StatusTransitionForm({
  applicationId,
  currentStatus,
  onSuccess,
}: StatusTransitionFormProps) {
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/v1/admin/applications/${applicationId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          New Status *
        </label>
        <select
          id="status"
          required
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select status --</option>
          {statusOptions
            .filter((option) => option.value !== currentStatus)
            .map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700">
          Admin Notes
        </label>
        <textarea
          id="adminNotes"
          rows={4}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add any notes about this status change..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || !status}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </div>
    </form>
  );
}
