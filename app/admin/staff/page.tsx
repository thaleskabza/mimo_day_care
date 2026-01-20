"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Teacher {
  id: string;
  name: string;
  email: string;
  _count?: {
    classes: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export default function AdminStaffPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [assigningRole, setAssigningRole] = useState(false);

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [roleAssignment, setRoleAssignment] = useState({
    userId: "",
    role: "TEACHER" as const,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const teachersRes = await fetch("/api/v1/admin/staff/teachers");
      const teachersData = await teachersRes.json();

      if (teachersRes.ok) {
        setTeachers(teachersData.teachers);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch("/api/v1/admin/staff/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacher),
      });

      if (response.ok) {
        setNewTeacher({ name: "", email: "", password: "" });
        fetchData();
        alert("Teacher created successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
      alert("Failed to create teacher");
    } finally {
      setCreating(false);
    }
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigningRole(true);

    try {
      const response = await fetch("/api/v1/admin/staff/assign-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roleAssignment),
      });

      if (response.ok) {
        setRoleAssignment({ userId: "", role: "TEACHER" });
        fetchData();
        alert("Role assigned successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("Failed to assign role");
    } finally {
      setAssigningRole(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Staff Management</h1>

      {/* Create Teacher Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
        <form onSubmit={handleCreateTeacher} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="teacher@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newTeacher.password}
                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Min 8 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Teacher Account"}
          </button>
        </form>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Teaching Staff ({teachers.length})</h2>
        </div>

        {teachers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No teachers found. Add your first teacher above.
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Assigned Classes</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {teachers.map((teacher) => {
                const classCount = teacher._count?.classes || 0;

                return (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 font-medium">{teacher.name}</td>
                    <td className="px-6 py-4 text-gray-600">{teacher.email}</td>
                    <td className="px-6 py-4">
                      {classCount > 0 ? `${classCount} class${classCount > 1 ? 'es' : ''}` : 'No classes assigned'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Staff Management Notes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• New teachers are automatically assigned the TEACHER role</li>
          <li>• Teachers can be assigned to classes from the Class Management page</li>
          <li>• Default password should be changed on first login (feature coming soon)</li>
          <li>• Staff can access the Teacher Portal at /teacher after login</li>
        </ul>
      </div>
    </div>
  );
}
