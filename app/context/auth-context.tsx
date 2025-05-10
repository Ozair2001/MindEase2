"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  fullName: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    async function loadUserFromSession() {
      try {
        console.log("Checking auth status...")
        const response = await fetch("/api/auth/me")

        if (response.ok) {
          const userData = await response.json()
          console.log("User data:", userData)
          if (userData.user) {
            setUser(userData.user)
          }
        } else {
          console.log("Not authenticated")
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserFromSession()
  }, [])

  const login = (userData: User) => {
    console.log("Login called with:", userData)
    setUser(userData)
  }

  const logout = () => {
    console.log("Logout called")
    setUser(null)
    // Call logout API
    fetch("/api/auth/logout", { method: "POST" }).catch(console.error)
  }

  // Add this for debugging
  useEffect(() => {
    console.log("Auth state changed:", { user, isLoading })
  }, [user, isLoading])

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
