import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChatHistory from "@/models/userChat";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  try {
    const chat = await ChatHistory.findById(params.id);
    if (!chat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(chat);
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase()
  const { messages } = await req.json()
  try {
    const updated = await ChatHistory.findByIdAndUpdate(
      params.id,
      { messages },
      { new: true }
    )
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(updated, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }
}