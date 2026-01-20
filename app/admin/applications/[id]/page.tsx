"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ApplicationStatus from "@/components/parent/ApplicationStatus";
import StatusTransitionForm from "@/components/admin/StatusTransitionForm";
import EnrollmentForm from "@/components/admin/EnrollmentForm";

interface Application {
  id: string;
  status: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  adminNotes: string | null;
  child: {
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
  };
  program: {
    name: string;
    description: string | null;
    ageRange: string;
    tuitionFee: number;
  };
}

export default function AdminApplicationDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchApplication();
    }
  }, [status, params.id]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/v1/admin/applications/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setApplication(data.application);
      } else {
        router.push("/admin/applications");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!application) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/admin/applications"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Applications
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
                <ApplicationStatus status={application.status} />
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Child Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Child Information</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.child.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(application.child.dob).toLocaleDateString()}
                    </dd>
                  </div>
                  {application.child.allergies && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                      <dd className="mt-1 text-sm text-gray-900">{application.child.allergies}</dd>
                    </div>
                  )}
                  {application.child.medicalNotes && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Medical Notes</dt>
                      <dd className="mt-1 text-sm text-gray-900">{application.child.medicalNotes}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Parent Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Parent Information</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.child.parent.user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.child.parent.user.email}</dd>
                  </div>
                  {application.child.parent.user.phone && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{application.child.parent.user.phone}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Program Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Program Information</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Program</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.program.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Age Range</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.program.ageRange}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tuition Fee</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      ${application.program.tuitionFee.toFixed(2)}/month
                    </dd>
                  </div>
                  {application.program.description && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900">{application.program.description}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Application Timeline */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {application.submittedAt && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Submitted</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(application.submittedAt).toLocaleString()}
                      </dd>
                    </div>
                  )}
                  {application.reviewedAt && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Reviewed</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(application.reviewedAt).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Admin Notes */}
              {application.adminNotes && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h2>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded">
                    {application.adminNotes}
                  </p>
                </div>
              )}

              {/* Status Update Form */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Application Status</h2>
                <StatusTransitionForm
                  applicationId={application.id}
                  currentStatus={application.status}
                  onSuccess={fetchApplication}
                />
              </div>

              {/* Create Enrollment (only for APPROVED applications) */}
              {application.status === "APPROVED" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Enrollment</h2>
                  {showEnrollmentForm ? (
                    <EnrollmentForm
                      applicationId={application.id}
                      childId={application.child.id}
                      onSuccess={() => {
                        setShowEnrollmentForm(false);
                        alert("Enrollment created successfully!");
                      }}
                      onCancel={() => setShowEnrollmentForm(false)}
                    />
                  ) : (
                    <button
                      onClick={() => setShowEnrollmentForm(true)}
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Create Enrollment
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
