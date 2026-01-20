"use client";

import Link from "next/link";
import ApplicationForm from "@/components/parent/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/parent/applications"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Applications
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              New Application
            </h1>
            <p className="text-gray-600 mb-6">
              Create a new enrollment application for your child.
            </p>

            <ApplicationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
