"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Class {
  id: string;
  name: string;
  capacity: number;
  schedule: string | null;
  ageRange: string | null;
  program: {
    name: string;
  };
  _count: {
    enrollments: number;
  };
}

export default function ClassesList() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/v1/teacher/classes");
      const data = await response.json();

      if (response.ok) {
        setClasses(data.classes);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading classes...</div>;
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No classes assigned yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((classItem) => (
        <Link
          key={classItem.id}
          href={`/teacher/classes/${classItem.id}`}
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {classItem.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{classItem.program.name}</p>

            <div className="space-y-2 text-sm text-gray-500">
              {classItem.ageRange && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Age Range:</span>
                  {classItem.ageRange}
                </div>
              )}

              <div className="flex items-center">
                <span className="font-medium mr-2">Enrolled:</span>
                {classItem._count.enrollments} / {classItem.capacity}
              </div>

              {classItem.schedule && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Schedule:</span>
                  {classItem.schedule}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-blue-600 font-medium">
                View Roster →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
