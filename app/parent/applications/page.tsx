"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ApplicationStatus from "@/components/parent/ApplicationStatus";
import { ApplicationStatus as AppStatus } from "@/generated/prisma";

interface Application {
  id: string;
  status: AppStatus;
  child: {
    name: string;
  };
  program: {
    name: string;
  };
  submittedAt?: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/v1/parent/applications");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch applications");
      }

      setApplications(data.applications);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (applicationId: string) => {
    if (!confirm("Are you sure you want to submit this application?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/v1/parent/applications/${applicationId}/submit`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      // Refresh applications
      fetchApplications();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="mt-1 text-sm text-gray-600">
                Track your enrollment applications
              </p>
            </div>
            <Link
              href="/parent/applications/new"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              New Application
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {applications.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                You haven't created any applications yet.
              </p>
              <Link
                href="/parent/applications/new"
                className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Create Your First Application
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Child
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {app.child.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {app.program.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ApplicationStatus status={app.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {app.submittedAt
                          ? new Date(app.submittedAt).toLocaleDateString()
                          : "Not submitted"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {app.status === "DRAFT" && (
                          <button
                            onClick={() => handleSubmit(app.id)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6">
            <Link
              href="/parent"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
