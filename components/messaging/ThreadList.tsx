"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Thread {
  id: string;
  child: {
    name: string;
  };
  class: {
    name: string;
    program: {
      name: string;
    };
    teacher?: {
      user: {
        name: string;
      };
    };
  };
  messages: Array<{
    content: string;
    createdAt: string;
  }>;
  _count: {
    messages: number;
  };
  updatedAt: string;
}

interface ThreadListProps {
  basePath: string; // "/parent/messages" or "/teacher/messages"
}

export default function ThreadList({ basePath }: ThreadListProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await fetch("/api/v1/messages/threads");
      const data = await response.json();

      if (response.ok) {
        setThreads(data.threads);
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading conversations...</div>;
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {threads.map((thread) => {
        const lastMessage = thread.messages[0];
        const preview = lastMessage
          ? lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? "..." : "")
          : "No messages yet";

        return (
          <Link
            key={thread.id}
            href={`${basePath}/${thread.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {thread.child.name} - {thread.class.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {thread.class.program.name}
                  {thread.class.teacher && ` • Teacher: ${thread.class.teacher.user.name}`}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">{preview}</p>
              </div>
              <div className="ml-4 text-right">
                <span className="text-xs text-gray-500">
                  {new Date(thread.updatedAt).toLocaleDateString()}
                </span>
                {thread._count.messages > 0 && (
                  <div className="mt-1 text-xs text-blue-600 font-medium">
                    {thread._count.messages} message{thread._count.messages !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
