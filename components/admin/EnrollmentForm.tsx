"use client";

import { useState, useEffect } from "react";

interface EnrollmentFormProps {
  applicationId: string;
  childId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Class {
  id: string;
  name: string;
  capacity: number;
  program: {
    name: string;
  };
  _count: {
    enrollments: number;
  };
}

export default function EnrollmentForm({
  applicationId,
  childId,
  onSuccess,
  onCancel,
}: EnrollmentFormProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [formData, setFormData] = useState({
    classId: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/v1/admin/classes");
      const data = await response.json();

      if (response.ok) {
        setClasses(data.classes);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/v1/admin/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          classId: formData.classId,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create enrollment");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return <div className="text-gray-600">Loading classes...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
          Select Class *
        </label>
        <select
          id="classId"
          required
          value={formData.classId}
          onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select a class --</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name} ({cls.program.name}) - {cls._count.enrollments}/{cls.capacity} enrolled
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Start Date *
        </label>
        <input
          type="date"
          id="startDate"
          required
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date (Optional)
        </label>
        <input
          type="date"
          id="endDate"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Enrollment"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
