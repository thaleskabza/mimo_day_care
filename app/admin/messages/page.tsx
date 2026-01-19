"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ThreadList from "@/components/messaging/ThreadList";

export default function AdminMessagesPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Messages Audit</h1>
            <p className="mt-2 text-sm text-gray-600">
              View all message conversations (read-only)
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
            <p className="text-sm font-medium">
              Admin/Principal Access: You can view conversations for audit purposes but cannot send messages.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <ThreadList basePath="/admin/messages" />
          </div>
        </div>
      </div>
    </div>
  );
}
