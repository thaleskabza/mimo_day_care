"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ThreadList from "@/components/messaging/ThreadList";

export default function TeacherMessagesPage() {
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
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="mt-2 text-sm text-gray-600">
              Communicate with parents about their children
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <ThreadList basePath="/teacher/messages" />
          </div>
        </div>
      </div>
    </div>
  );
}
