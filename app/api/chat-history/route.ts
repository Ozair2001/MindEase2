import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChatHistory from "@/models/userChat";

// POST = save new chat
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { userId, messages } = await req.json();

  try {
    const newChat = await ChatHistory.create({ userId, messages });
    return NextResponse.json(newChat, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save chat" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const chats = await ChatHistory.find({ userId }).sort({ updatedAt: -1 });
  return NextResponse.json(chats);
}
