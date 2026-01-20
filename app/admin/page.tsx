"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPortal() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{session?.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Your Admin Dashboard
            </h2>
            <p className="text-gray-600">
              This is your admin portal where you can manage applications, enrollments, staff,
              and view audit logs.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900">Applications</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Review and manage enrollment applications
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900">Enrollments</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage active enrollments
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900">Staff Management</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage teachers and staff
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900">Classes</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage classes and programs
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900">Audit Logs</h3>
                <p className="mt-2 text-sm text-gray-500">
                  View system audit trail
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900">Messages</h3>
                <p className="mt-2 text-sm text-gray-500">
                  View all messages for moderation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
