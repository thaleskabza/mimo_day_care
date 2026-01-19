"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Child {
  id: string;
  name: string;
  enrollments: Array<{
    id: string;
    class: {
      id: string;
      name: string;
      program: {
        name: string;
      };
      teacher: {
        user: {
          name: string;
        };
      };
    };
  }>;
}

interface MessageComposeProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MessageCompose({ onSuccess, onCancel }: MessageComposeProps) {
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await fetch("/api/v1/parent/children");
      const data = await response.json();

      if (response.ok) {
        // Filter children with active enrollments
        const childrenWithEnrollments = data.children.filter(
          (child: Child) => child.enrollments && child.enrollments.length > 0
        );
        setChildren(childrenWithEnrollments);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!selectedChild || !selectedClass) return;

    setError("");
    setCreating(true);

    try {
      const response = await fetch("/api/v1/messages/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId: selectedChild,
          classId: selectedClass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create conversation");
      }

      // Redirect to the new thread
      router.push(`/parent/messages/${data.thread.id}`);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading...</div>;
  }

  if (children.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
        <p className="font-medium">No enrolled children</p>
        <p className="text-sm mt-1">
          You need to have a child with an active enrollment to start messaging.
        </p>
      </div>
    );
  }

  const selectedChildData = children.find((c) => c.id === selectedChild);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="child" className="block text-sm font-medium text-gray-700">
          Select Child *
        </label>
        <select
          id="child"
          value={selectedChild}
          onChange={(e) => {
            setSelectedChild(e.target.value);
            setSelectedClass(""); // Reset class selection
          }}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">-- Select a child --</option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
      </div>

      {selectedChildData && (
        <div>
          <label htmlFor="class" className="block text-sm font-medium text-gray-700">
            Select Class *
          </label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select a class --</option>
            {selectedChildData.enrollments.map((enrollment) => (
              <option key={enrollment.class.id} value={enrollment.class.id}>
                {enrollment.class.name} ({enrollment.class.program.name}) - Teacher:{" "}
                {enrollment.class.teacher.user.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleCreateThread}
          disabled={creating || !selectedChild || !selectedClass}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {creating ? "Creating..." : "Start Conversation"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
