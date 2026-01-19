"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Child {
  id: string;
  name: string;
}

interface Program {
  id: string;
  name: string;
  description?: string;
  ageRange: string;
  tuitionFee: number;
  schedule?: string;
}

interface ApplicationFormProps {
  onSuccess?: () => void;
}

export default function ApplicationForm({ onSuccess }: ApplicationFormProps) {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [formData, setFormData] = useState({
    childId: "",
    programId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch children
      const childrenResponse = await fetch("/api/v1/parent/children");
      const childrenData = await childrenResponse.json();

      if (childrenResponse.ok) {
        setChildren(childrenData.children);
      }

      // Fetch programs
      const programsResponse = await fetch("/api/v1/programs");
      const programsData = await programsResponse.json();

      if (programsResponse.ok) {
        setPrograms(programsData.programs);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/v1/parent/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create application");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/parent/applications");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <div className="text-gray-600">Loading...</div>;
  }

  if (children.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
        <p className="font-medium">No children found</p>
        <p className="text-sm mt-1">
          You need to add a child profile before you can create an application.
        </p>
        <button
          onClick={() => router.push("/parent/children/new")}
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Add Child Now →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="childId" className="block text-sm font-medium text-gray-700">
          Select Child *
        </label>
        <select
          id="childId"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={formData.childId}
          onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
        >
          <option value="">-- Select a child --</option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="programId" className="block text-sm font-medium text-gray-700">
          Select Program *
        </label>
        {programs.length === 0 ? (
          <div className="mt-1 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            <p className="text-sm">
              No programs are currently available. Please contact the administrator.
            </p>
          </div>
        ) : (
          <select
            id="programId"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.programId}
            onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
          >
            <option value="">-- Select a program --</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || programs.length === 0}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Application"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
