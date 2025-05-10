"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Layout from "../components/layout"
import { Brain, User, Send, Loader, AlertTriangle, X, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  role: "user" | "assistant" | "error"
  content: string
}

interface QuickReply {
  text: string
  action: () => void
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [userLocation, setUserLocation] = useState<"pakistan" | "other" | null>(null)
  const [modelServerStatus, setModelServerStatus] = useState<"connected" | "disconnected" | "unknown">("unknown")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [visibleExplanations, setVisibleExplanations] = useState<any>({})
  const [explanations, setExplanations] = useState<Record<number, any>>({})
  const [followUpSwitch, setFollowUpSwitch] = useState(false)

  // Remove these states as we don't need them anymore
  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  // const [anonymously, setAnonymously] = useState(false)

  const quickReplies: QuickReply[] = [
    { text: "I'm feeling anxious", action: () => handleQuickReply("I'm feeling anxious") },
    { text: "How to manage stress?", action: () => handleQuickReply("How to manage stress?") },
    { text: "Tell me about depression", action: () => handleQuickReply("Tell me about depression") },
    { text: "Help me sleep better", action: () => handleQuickReply("Help me sleep better") },
  ]

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      setUserLocation(savedLocation as "pakistan" | "other")
    }
  }, [])

  useEffect(() => {
    if (userLocation) {
      const greeting =
        userLocation === "pakistan"
          ? "Assalam-o-alaikum! How can I assist you today?"
          : "Hello! How can I assist you today?"
      setMessages([{ role: "assistant", content: greeting }])
    }
  }, [userLocation])

  function generateFollowUpQuestions(lastResponse: any) {
    // Convert the last response to lowercase
    const lastResponseLower = lastResponse.toLowerCase()
    let followUp: any = []

    // Expanded mental health keyword detection with more nuanced questions
    if (["stress", "stressed", "overwhelmed"].some((word) => lastResponseLower.includes(word))) {
      followUp = [
        "What is causing the most stress for you right now?",
        "How do you usually cope with stress?",
        "Have you been able to take breaks or relax recently?",
        "What would help reduce your stress levels?",
        "How is this stress affecting your daily life?",
      ]
    } else if (["lonely", "alone", "isolated", "no one"].some((word) => lastResponseLower.includes(word))) {
      followUp = [
        "What would help you feel less lonely?",
        "When was the last time you connected with someone?",
        "What activities do you enjoy that might make you feel more connected?",
        "Is there someone you feel comfortable reaching out to?",
        "What does meaningful connection look like for you?",
      ]
    } else if (["anxious", "anxiety", "nervous", "worried"].some((word) => lastResponseLower.includes(word))) {
      followUp = [
        "What triggers your anxiety the most?",
        "How do you usually cope with anxious feelings?",
        "Have you tried any relaxation techniques to help with anxiety?",
        "Where do you feel the anxiety in your body?",
        "What helps ground you when you're feeling anxious?",
      ]
    } else if (["depressed", "depression", "hopeless", "empty"].some((word) => lastResponseLower.includes(word))) {
      followUp = [
        "What activities or hobbies make you feel more energized?",
        "Have you been able to talk to someone about your feelings?",
        "What do you think would make you feel better right now?",
        "How is your sleep and appetite been lately?",
        "What small thing could you do today to care for yourself?",
      ]
    } else if (["panic", "panicking", "overwhelmed"].some((word) => lastResponseLower.includes(word))) {
      followUp = [
        "How do you manage panic when it happens?",
        "Do you have any calming techniques that work for you?",
        "What helps you when you're feeling overwhelmed?",
        "Can you describe what panic feels like for you?",
        "What's one thing that might help you feel safer right now?",
      ]
    } else if (["angry", "anger", "frustrated"].some((word) => lastResponseLower.includes(word))) {
      followUp = [
        "What triggered these feelings for you?",
        "How do you typically express anger in healthy ways?",
        "What do you need when you feel this way?",
        "Where do you feel the anger in your body?",
        "What would help you feel calmer right now?",
      ]
    } else if (["sleep", "tired", "insomnia"].some((word) => lastResponseLower.includes(word))) {
      followUp = [
        "How has your sleep been affecting your mood?",
        "What does your bedtime routine look like?",
        "Have you tried any relaxation techniques before bed?",
        "What thoughts keep you up at night?",
        "How rested do you feel when you wake up?",
      ]
    }

    // General follow-up questions if no specific keywords detected
    if (followUp.length === 0) {
      followUp = [
        "Would you like to tell me more about how you're feeling?",
        "What's been on your mind lately?",
        "How has this been affecting your daily life?",
        "What would be most helpful to discuss right now?",
        "Have you experienced this before?",
        "What do you think would help in this situation?",
      ]
    }

    // Return a random question from the follow-up list
    return followUp[Math.floor(Math.random() * followUp.length)]
  }

  // Check model server status on load
  useEffect(() => {
    const checkModelServer = async () => {
      try {
        const modelServerUrl = process.env.MODEL_SERVER_URL || "https://grand-morally-hound.ngrok-free.app" // ngrok link
        const response = await fetch(`${modelServerUrl}/health`, {
          signal: AbortSignal.timeout(5000), // 5 second timeout
        })

        if (response.ok) {
          setModelServerStatus("connected")
        } else {
          setModelServerStatus("disconnected")
        }
      } catch (error) {
        console.error("Error checking model server:", error)
        setModelServerStatus("disconnected")
      }
    }

    checkModelServer()
  }, [])

  const handleQuickReply = (text: string) => {
    setInput(text)
    handleSubmit(new Event("submit") as any)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Remove the authentication check - allow all users to chat without prompting
    // if ((!isLoggedIn && !showAuthPrompt && !anonymously)) {
    //   setShowAuthPrompt(true)
    //   return
    // }

    const userMessage = { role: "user" as const, content: input }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")
    setIsTyping(true)
    // setShowAuthPrompt(false) - No longer needed

    try {
      // Add a realistic typing delay based on message length
      const typingDelay = Math.min(1000 + input.length * 10, 3000)
      await new Promise((resolve) => setTimeout(resolve, typingDelay))

      if (followUpSwitch) {
        const followUpQuestion = generateFollowUpQuestions(messages[messages.length - 1].content)
        setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: followUpQuestion }])
        setFollowUpSwitch(false)
        return
      }

      // Call our API with all messages for context
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userLocation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle error response from our API
        setModelServerStatus("disconnected")
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "error",
            content:
              data.response ||
              "I'm having trouble connecting to my knowledge base. Please check if the model server is running.",
          },
        ])
      } else {
        // Handle successful response
        setFollowUpSwitch(true)
        setModelServerStatus("connected")
        setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: data.response }])
      }
    } catch (error) {
      console.error("Error fetching AI response:", error)
      setModelServerStatus("disconnected")
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "error",
          content: "I'm unable to generate a response right now. Please check if the model server is running.",
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  // Remove this function as it's no longer needed
  // const handleContinueAnonymously = () => {
  //   setShowAuthPrompt(false)
  //   handleSubmit(new Event("submit") as any)
  //   setAnonymously(true);
  // }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  if (!userLocation) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[calc(100vh-140px)] bg-gradient-to-b from-background to-accent">
          <p className="text-xl text-gray-600">Please select your location on the home page first.</p>
        </div>
      </Layout>
    )
  }

  const toggleExplanation = async (index: number) => {
    // Check if explanation is already available in state
    if (!explanations[index]) {
      // If not available, call the function to fetch the explanation
      getExplanation(index, messages[index - 1].content, messages[index].content)
    }

    // Toggle explanation visibility
    setVisibleExplanations((prev: any) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Function to get explanation for a message (in a real app, this might be an API call)
  const getExplanation = async (index: number, user_input: string, content: string) => {
    try {
      const response = await fetch("https://grand-morally-hound.ngrok-free.app/explain", {
        //ngrok link
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: user_input, content: content }),
        signal: AbortSignal.timeout(120000), // 15 seconds timeout
      })

      const data = await response.json()

      if (!response.ok) {
        return "I'm having trouble connecting to my knowledge base. Please check if the model server is running."
      } else {
        const explanation = data.generated_text
        // Store the explanation in state
        setExplanations((prev) => ({
          ...prev,
          [index]: explanation,
        }))
        return explanation
      }
    } catch (error) {
      console.error("Error fetching AI response:", error)
      return "I'm unable to generate a response right now. Please check if the model server is running."
    }
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-140px)] bg-gradient-to-b from-background to-accent">
        {modelServerStatus === "disconnected" && (
          <div className="bg-amber-50 border-amber-200 border p-2 text-amber-800 text-sm flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Model server appears to be disconnected. Responses may be unavailable.
          </div>
        )}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((m, index) => (
            <div key={index} className="space-y-2">
              <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-end space-x-2 ${m.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}
                >
                  <div
                    className={`rounded-full p-2 ${
                      m.role === "user"
                        ? "bg-primary text-white"
                        : m.role === "error"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-white text-primary border border-gray-200"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="h-6 w-6" />
                    ) : m.role === "error" ? (
                      <AlertTriangle className="h-6 w-6" />
                    ) : (
                      <Brain className="h-6 w-6" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 max-w-md relative group ${
                      m.role === "user"
                        ? "bg-primary text-white"
                        : m.role === "error"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {m.content}

                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute -right-10 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${
                        visibleExplanations[index] ? "opacity-100" : ""
                      }`}
                      onClick={() => toggleExplanation(index)}
                      aria-label={visibleExplanations[index] ? "Hide explanation" : "Show explanation"}
                    >
                      {visibleExplanations[index] ? <X className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Explanation section */}
              {visibleExplanations[index] && (
                <div className={`ml-12 mr-12 p-3 rounded-md bg-gray-50 border border-gray-200 text-sm text-gray-600`}>
                  <div className="flex items-center gap-2 mb-1">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">🧠 The words that helped me generate this answer are:</span>
                  </div>
                  <div className="space-y-1">
                    {explanations[index] && explanations[index].length > 0 ? (
                      explanations[index].map(([word, value]: any, idx: any) => (
                        <div key={idx} className="flex items-center">
                          <span className="font-medium text-gray-700">{word}</span>
                          <span className="ml-2 text-gray-500">({value.toFixed(2)})</span>
                        </div>
                      ))
                    ) : (
                      <p>Loading explanation...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="rounded-full p-2 bg-white text-primary">
                  <Loader className="h-6 w-6 animate-spin" />
                </div>
                <div className="rounded-lg p-3 bg-white text-gray-800">Mind Ease is typing...</div>
              </div>
            </div>
          )}

          {/* Remove the authentication prompt */}
          {/* {showAuthPrompt && !anonymously && (
            <div className="flex justify-center">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <p className="text-gray-800 mb-4">
                  Please log in or sign up to continue the conversation, or choose to continue anonymously.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    href="/sign-in"
                    className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Link>
                  <button
                    onClick={handleContinueAnonymously}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Continue Anonymously
                  </button>
                </div>
              </div>
            </div>
          )} */}

          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white/50 backdrop-blur-md border-t border-gray-200">
          <div className="flex flex-wrap justify-center mb-4 space-x-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={reply.action}
                className="bg-white text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors mb-2"
                disabled={modelServerStatus === "disconnected"}
              >
                {reply.text}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                modelServerStatus === "disconnected" ? "Model server disconnected..." : "Type your message here..."
              }
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isTyping || modelServerStatus === "disconnected"}
            />
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={isTyping || !input.trim() || modelServerStatus === "disconnected"}
            >
              <Send className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
