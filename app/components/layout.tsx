"use client"

import Link from "next/link"
import { Brain, User, LogOut } from "lucide-react"
import type React from "react"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChatPage = pathname === "/chat"

  // This would be replaced with your actual auth logic
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ fullName: string } | null>(null)

  // Simulate checking auth status - replace with your actual auth check
  useEffect(() => {
    // For demo purposes - check if there's a stored session
    const hasSession = localStorage.getItem("sessionId")
    if (hasSession) {
      setIsLoggedIn(true)
      setUser({ fullName: "User" }) // Replace with actual user data
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto flex flex-wrap justify-between items-center py-4 px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Mind Ease</span>
          </Link>
          <nav className="flex flex-col items-end space-y-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-primary transition-colors">
                Chat
              </Link>

              {isLoggedIn ? (
                // Show user menu when logged in
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{user?.fullName.split(" ")[0]}</span>
                  </div>
                  <Link
                    href="/profile"
                    className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      // Handle logout
                      localStorage.removeItem("sessionId")
                      setIsLoggedIn(false)
                      setUser(null)
                    }}
                    className="flex items-center px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </div>
              ) : (
                // Show login/signup when not logged in and not on chat page
                !isChatPage && (
                  <>
                    <Link
                      href="/sign-in"
                      className="px-4 py-2 rounded-lg text-primary border border-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-purple-900 text-white hover:opacity-90 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/learn-more" className="text-gray-500 hover:text-primary transition-colors">
                Learn More
              </Link>
              <Link href="/faqs" className="text-gray-500 hover:text-primary transition-colors">
                FAQs
              </Link>
              <Link href="/about-us" className="text-gray-500 hover:text-primary transition-colors">
                About Us
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto py-6 px-6 text-center text-gray-600">
          © 2025 Mind Ease. All rights reserved.
        </div>
      </footer>
    </div>
  )
}