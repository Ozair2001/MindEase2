"use client"

import { useState, useEffect } from "react"
import Layout from "./components/layout"
import Link from "next/link"
import { Heart, Sparkles, Zap } from "lucide-react"

export default function Home() {
  const [showLocationPrompt, setShowLocationPrompt] = useState(true)
  const [userLocation, setUserLocation] = useState<"pakistan" | "other" | null>(null)

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation")
    if (savedLocation) {
      setUserLocation(savedLocation as "pakistan" | "other")
      setShowLocationPrompt(false)
    }
  }, [])

  const handleLocationSelection = (location: "pakistan" | "other") => {
    setUserLocation(location)
    setShowLocationPrompt(false)
    localStorage.setItem("userLocation", location)
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gradient-to-b from-background to-accent">
        {showLocationPrompt ? (
          <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Mind Ease</h2>
            <p className="text-gray-600 mb-6 text-center">Please select your location:</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleLocationSelection("pakistan")}
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                Pakistan
              </button>
              <button
                onClick={() => handleLocationSelection("other")}
                className="px-6 py-2 bg-primary text-white rounded-full hover:bg-secondary/90 transition-colors"
              >
                Other
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 gradient-text animate-float">
              {userLocation === "pakistan" ? "Welcome to Mind Ease Pakistan" : "Welcome to Mind Ease"}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
              {userLocation === "pakistan"
                ? "Your AI companion for mental health support, tailored specifically for the Pakistani community. Get culturally sensitive help, find peace, and improve your well-being with our intelligent chatbot."
                : "Your AI companion for mental health support. Get personalized help, find peace, and improve your well-being with our intelligent chatbot."}
            </p>
            <div className="space-x-4 mb-12">
              <Link
                href="/chat"
                className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-900 text-white text-lg font-semibold hover:opacity-90 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-primary/25"
              >
                Start Chatting Now
              </Link>
              <Link
                href="/signup"
                className="inline-block px-8 py-4 rounded-xl bg-white text-primary border-2 border-primary text-lg font-semibold hover:bg-primary hover:text-white transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-primary/25"
              >
                Sign Up
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
              {[
                {
                  icon: Heart,
                  title: userLocation === "pakistan" ? "Culturally Sensitive Support" : "Personalized Support",
                  description:
                    userLocation === "pakistan"
                      ? "Receive compassionate and understanding responses tailored to Pakistani cultural context."
                      : "Receive compassionate and understanding responses tailored to your personal needs.",
                },
                {
                  icon: Sparkles,
                  title: "AI-Powered Insights",
                  description:
                    userLocation === "pakistan"
                      ? "Benefit from advanced AI technology trained on Pakistani mental health data."
                      : "Benefit from advanced AI technology trained on diverse mental health data.",
                },
                {
                  icon: Zap,
                  title: "24/7 Availability",
                  description:
                    userLocation === "pakistan"
                      ? "Access support anytime, aligned with Pakistani time zones and lifestyle."
                      : "Access support anytime, whenever you need it most.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-3 rounded-xl bg-primary/10 mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-3 gradient-text">{feature.title}</h2>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
