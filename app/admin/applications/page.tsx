"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ApplicationsList from "@/components/admin/ApplicationsList";

export default function AdminApplicationsPage() {
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Application Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Review and manage enrollment applications
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <ApplicationsList />
          </div>
        </div>
      </div>
    </div>
  );
}
