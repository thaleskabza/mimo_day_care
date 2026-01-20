"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Program {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
  capacity: number;
  program: Program;
  teacher: Teacher;
  _count: {
    enrollments: number;
  };
}

export default function AdminClassesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    programId: "",
    teacherId: "",
    capacity: 20,
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
      const [classesRes, programsRes, teachersRes] = await Promise.all([
        fetch("/api/v1/admin/classes"),
        fetch("/api/v1/admin/programs"),
        fetch("/api/v1/admin/staff/teachers"),
      ]);

      const classesData = await classesRes.json();
      const programsData = await programsRes.json();
      const teachersData = await teachersRes.json();

      if (classesRes.ok) setClasses(classesData.classes);
      if (programsRes.ok) setPrograms(programsData.programs);
      if (teachersRes.ok) setTeachers(teachersData.teachers);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch("/api/v1/admin/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", programId: "", teacherId: "", capacity: 20 });
        fetchData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Class Management</h1>

      {/* Create Class Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Class</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Class Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., Sunshine Room"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Program <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.programId}
                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Teacher <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="50"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Class"}
          </button>
        </form>
      </div>

      {/* Classes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Existing Classes ({classes.length})</h2>
        </div>

        {classes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No classes created yet. Create your first class above.
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Class Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Program</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Teacher</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Capacity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Enrolled</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {classes.map((cls) => {
                const enrolled = cls._count.enrollments;
                const available = cls.capacity - enrolled;
                const utilizationPercent = (enrolled / cls.capacity) * 100;

                return (
                  <tr key={cls.id}>
                    <td className="px-6 py-4 font-medium">{cls.name}</td>
                    <td className="px-6 py-4">{cls.program.name}</td>
                    <td className="px-6 py-4">{cls.teacher.name}</td>
                    <td className="px-6 py-4">{cls.capacity}</td>
                    <td className="px-6 py-4">{enrolled}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          available === 0
                            ? "bg-red-100 text-red-800"
                            : available <= 3
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {available} spots ({utilizationPercent.toFixed(0)}% full)
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
