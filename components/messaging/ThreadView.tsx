"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    name: string;
    email: string;
  };
  senderId: string;
}

interface Thread {
  id: string;
  child: {
    name: string;
    parent: {
      user: {
        name: string;
        email: string;
      };
    };
  };
  class: {
    name: string;
    program: {
      name: string;
    };
    teacher: {
      user: {
        name: string;
        email: string;
      };
    };
  };
  messages: Message[];
}

interface ThreadViewProps {
  threadId: string;
  isReadOnly?: boolean;
}

export default function ThreadView({ threadId, isReadOnly = false }: ThreadViewProps) {
  const { data: session } = useSession();
  const [thread, setThread] = useState<Thread | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchThread();
  }, [threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [thread?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchThread = async () => {
    try {
      const response = await fetch(`/api/v1/messages/threads/${threadId}`);
      const data = await response.json();

      if (response.ok) {
        setThread(data.thread);
      } else {
        setError(data.error || "Failed to load conversation");
      }
    } catch (error) {
      console.error("Error fetching thread:", error);
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setError("");
    setSending(true);

    try {
      const response = await fetch(`/api/v1/messages/threads/${threadId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setNewMessage("");
      fetchThread(); // Refresh messages
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading conversation...</div>;
  }

  if (error && !thread) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!thread) {
    return <div className="text-gray-600">Conversation not found</div>;
  }

  const currentUserId = (session?.user as any)?.id;

  return (
    <div className="flex flex-col h-full">
      {/* Thread Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {thread.child.name} - {thread.class.name}
        </h2>
        <p className="text-sm text-gray-500">
          {thread.class.program.name} • Teacher: {thread.class.teacher.user.name}
        </p>
        <p className="text-sm text-gray-500">
          Parent: {thread.child.parent.user.name}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {thread.messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          thread.messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-lg rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isOwnMessage ? "text-blue-100" : "text-gray-700"}`}>
                      {isOwnMessage ? "You" : message.sender.name}
                    </span>
                    <span className={`text-xs ml-3 ${isOwnMessage ? "text-blue-200" : "text-gray-500"}`}>
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {!isReadOnly && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 self-end"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}

      {isReadOnly && (
        <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-3">
          <p className="text-sm text-yellow-800">
            Read-only access. You cannot send messages in this conversation.
          </p>
        </div>
      )}
    </div>
  );
}
