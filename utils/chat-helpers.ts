/**
 * Formats the response from the LLM model
 * This can be expanded to handle specific formatting needs
 */
export function formatModelResponse(text: string): string {
  // Remove any leading/trailing whitespace
  let formatted = text.trim()

  // Handle any specific formatting needs for your model's responses
  // For example, if your model sometimes includes prefixes like "AI:" or similar
  formatted = formatted.replace(/^(AI:|Assistant:|Bot:)/i, "").trim()

  // If the response is empty, provide a fallback
  if (!formatted) {
    formatted = "I'm here to help. What would you like to talk about?"
  }

  return formatted
}

/**
 * Creates a context-aware prompt for the model based on conversation history
 */
export function createContextAwarePrompt(messages: any[], userLocation: string | null): string {
  // Get the last few messages for context (up to 5)
  const recentMessages = messages.slice(-5)

  // Create a system context based on user location
  const systemContext =
    userLocation === "pakistan"
      ? "You are a mental health assistant trained specifically for Pakistani users. Provide culturally sensitive responses that respect local values and customs. Your name is Mind Ease."
      : "You are a mental health assistant. Provide supportive and helpful responses. Your name is Mind Ease."

  // Build the conversation history
  let conversationHistory = ""

  recentMessages.forEach((msg) => {
    if (msg.role === "user") {
      conversationHistory += `User: ${msg.content}\n`
    } else {
      conversationHistory += `Assistant: ${msg.content}\n`
    }
  })

  // If there's no conversation yet, just use the system context
  if (!conversationHistory) {
    return `${systemContext}\n\nUser: Hello\nAssistant:`
  }

  // Make sure the prompt ends with "Assistant:" to prompt the model to continue
  if (!conversationHistory.endsWith("Assistant:")) {
    conversationHistory += "Assistant:"
  }

  return `${systemContext}\n\n${conversationHistory}`
}
