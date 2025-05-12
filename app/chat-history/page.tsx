// app/chat-history/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Layout from "../components/layout";

interface Chat {
  _id: string;
  updatedAt: string;
}

export default function ChatHistoryPage() {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // once we have a user session, fetch their chats
  useEffect(() => {
    if (status !== "authenticated") return;
    const userId = session.user?.image; // ensure your session.user has an `id`
    fetch(`/api/chat-history?userId=${userId}`)
      .then((res) => res.json())
      .then((data: Chat[]) => setChats(data))
      .finally(() => setLoading(false));
  }, [session, status]);

  if (status === "loading") {
    return <p>Loading session…</p>;
  }
  if (status !== "authenticated") {
    return <p>Please sign in to see your chat history.</p>;
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-140px)] bg-gradient-to-b from-background to-accent">
        <div className="max-w-xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Your Chat History</h1>
          {loading ? (
            <p>Loading chats…</p>
          ) : chats.length === 0 ? (
            <p>
              No chats yet. Start a new conversation{" "}
              <Link href="/chat" className="text-blue-600">
                here
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-2">
              {chats.map((chat) => (
                <li key={chat._id}>
                  <Link
                    href={`/chat?chatId=${chat._id}`}
                    className="block p-3 border rounded hover:bg-gray-50"
                  >
                    {/* display timestamp or any summary */}
                    Chat from {new Date(chat.updatedAt).toLocaleString()}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
