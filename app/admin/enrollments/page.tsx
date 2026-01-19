"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Enrollment {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  child: {
    name: string;
    parent: {
      user: {
        name: string;
        email: string;
      };
    };
  };
  class: {
    name: string;
    program: {
      name: string;
    };
    teacher: {
      user: {
        name: string;
      };
    };
  };
}

export default function AdminEnrollmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchEnrollments();
    }
  }, [status, statusFilter]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const url = statusFilter
        ? `/api/v1/admin/enrollments?status=${statusFilter}`
        : "/api/v1/admin/enrollments";

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setEnrollments(data.enrollments);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (enrollmentId: string) => {
    if (!confirm("Are you sure you want to activate this enrollment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/admin/enrollments/${enrollmentId}/activate`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Enrollment activated successfully!");
        fetchEnrollments();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to activate enrollment");
      }
    } catch (error) {
      console.error("Error activating enrollment:", error);
      alert("An error occurred");
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage student enrollments
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4 flex items-center gap-4">
              <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
                Filter by status:
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
                <option value="ENDED">Ended</option>
              </select>
            </div>

            {enrollments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No enrollments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Child
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {enrollment.child.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{enrollment.child.parent.user.name}</div>
                          <div className="text-xs text-gray-400">
                            {enrollment.child.parent.user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{enrollment.class.name}</div>
                          <div className="text-xs text-gray-400">
                            {enrollment.class.program.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {enrollment.class.teacher.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              enrollment.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : enrollment.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : enrollment.status === "PAUSED"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {enrollment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(enrollment.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {enrollment.status === "PENDING" && (
                            <button
                              onClick={() => handleActivate(enrollment.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
