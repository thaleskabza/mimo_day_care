"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Child {
  id: string;
  name: string;
  dob: string;
  allergies: string | null;
  medicalNotes: string | null;
  parent: {
    user: {
      name: string;
      email: string;
      phone: string | null;
    };
  };
  enrollments: Array<{
    id: string;
    status: string;
    startDate: string;
    class: {
      name: string;
      program: {
        name: string;
      };
    };
  }>;
}

export default function TeacherChildDetailPage({ params }: { params: { childId: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchChild();
    }
  }, [status, params.childId]);

  const fetchChild = async () => {
    try {
      const response = await fetch(`/api/v1/teacher/children/${params.childId}`);
      const data = await response.json();

      if (response.ok) {
        setChild(data.child);
      } else {
        router.push("/teacher/classes");
      }
    } catch (error) {
      console.error("Error fetching child:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!child) {
    return null;
  }

  const age = Math.floor(
    (new Date().getTime() - new Date(child.dob).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Child Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Child Information</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{child.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Age</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {age} years ({new Date(child.dob).toLocaleDateString()})
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                    <dd className="mt-1 text-sm">
                      {child.allergies ? (
                        <span className="text-red-600 font-medium">{child.allergies}</span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </dd>
                  </div>
                  {child.medicalNotes && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Medical Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900 bg-yellow-50 p-3 rounded">
                        {child.medicalNotes}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Parent Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{child.parent.user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a
                        href={`mailto:${child.parent.user.email}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {child.parent.user.email}
                      </a>
                    </dd>
                  </div>
                  {child.parent.user.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <a
                          href={`tel:${child.parent.user.phone}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {child.parent.user.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Enrollments */}
              {child.enrollments.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrollments</h2>
                  <div className="space-y-3">
                    {child.enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {enrollment.class.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {enrollment.class.program.name}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              enrollment.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {enrollment.status}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Started: {new Date(enrollment.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
