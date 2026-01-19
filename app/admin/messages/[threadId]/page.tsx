"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import ThreadView from "@/components/messaging/ThreadView";

export default function AdminMessageThreadPage({ params }: { params: { threadId: string } }) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <Link
          href="/admin/messages"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Back to Messages
        </Link>
      </div>

      <div className="flex-1 flex flex-col">
        <ThreadView threadId={params.threadId} isReadOnly={true} />
      </div>
    </div>
  );
}
