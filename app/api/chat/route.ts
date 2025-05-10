import { NextResponse } from "next/server";

// URL of your local model server
const MODEL_SERVER_URL = process.env.MODEL_SERVER_URL || "https://grand-morally-hound.ngrok-free.app";//add ngrok link

export async function POST(req: Request) {
  try {
    const { messages, userLocation } = await req.json();

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();

    if (!lastUserMessage) {
      return NextResponse.json({
        response: "I'm sorry, I couldn't understand your message. Could you please try again?",
      });
    }

    // Create a context-aware prompt
    const contextPrefix =
      userLocation === "pakistan"
        ? "As a mental health assistant for Pakistani users, "
        : "As a mental health assistant, ";

    // Get the last few messages for context (up to 3)
    const recentMessages = messages.slice(-3);
    const conversationHistory = recentMessages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    // Create the final prompt
    const prompt = `${contextPrefix}please provide a helpful response to this conversation:\n\n${conversationHistory}\n\nUser: ${lastUserMessage.content}\nAssistant:`;

    console.log("Connecting to model server at:", MODEL_SERVER_URL);
    console.log("Sending prompt:", prompt);

    // Call the local model server
    const modelResponse = await fetch(`${MODEL_SERVER_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        max_length: 300,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(120000), // 15 seconds timeout
    });

    if (!modelResponse.ok) {
      const errorText = await modelResponse.text();
      console.error("Model server error:", modelResponse.status, errorText);
      return NextResponse.json(
        {
          response:
            "I'm having trouble connecting to my knowledge base. Please check if the model server is running correctly.",
          error: `Model server error: ${modelResponse.status} - ${errorText}`,
        },
        { status: 502 }
      );
    }

    const result = await modelResponse.json();
    console.log("Model response:", result);

    // Return only the model's response
    return NextResponse.json({ response: result.generated_text });
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      {
        response:
          "I'm unable to generate a response right now. Please make sure the model server is running at " +
          MODEL_SERVER_URL,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
