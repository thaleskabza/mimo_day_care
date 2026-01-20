"use client";

import Link from "next/link";
import ChildForm from "@/components/parent/ChildForm";

export default function NewChildPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/parent/children"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Children
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Add Child Profile
            </h1>
            <p className="text-gray-600 mb-6">
              Enter your child's information to create their profile.
            </p>

            <ChildForm />
          </div>
        </div>
      </div>
    </div>
  );
}
