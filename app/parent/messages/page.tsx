"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThreadList from "@/components/messaging/ThreadList";
import MessageCompose from "@/components/messaging/MessageCompose";

export default function ParentMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCompose, setShowCompose] = useState(false);

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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="mt-2 text-sm text-gray-600">
                Communicate with your child's teachers
              </p>
            </div>
            <button
              onClick={() => setShowCompose(!showCompose)}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {showCompose ? "Cancel" : "New Conversation"}
            </button>
          </div>

          {showCompose ? (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Start New Conversation</h2>
              <MessageCompose
                onSuccess={() => setShowCompose(false)}
                onCancel={() => setShowCompose(false)}
              />
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <ThreadList basePath="/parent/messages" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
