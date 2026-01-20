"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Child {
  id: string;
  name: string;
  dob: string;
  allergies?: string;
  medicalNotes?: string;
  createdAt: string;
}

export default function ChildrenPage() {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await fetch("/api/v1/parent/children");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch children");
      }

      setChildren(data.children);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
              <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your children's profiles
              </p>
            </div>
            <Link
              href="/parent/children/new"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Add Child
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {children.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                You haven't added any children yet.
              </p>
              <Link
                href="/parent/children/new"
                className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Add Your First Child
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={`/parent/children/${child.id}`}
                  className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {child.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Date of Birth:</span>{" "}
                    {new Date(child.dob).toLocaleDateString()}
                  </p>
                  {child.allergies && (
                    <p className="text-sm text-red-600 mb-1">
                      <span className="font-medium">Allergies:</span> {child.allergies}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-4">
                    Added {new Date(child.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
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
