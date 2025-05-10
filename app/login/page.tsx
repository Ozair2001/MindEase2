"use client"

import type React from "react"

import { useState } from "react"
import Layout from "../components/layout"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically handle the login logic
    console.log("Login attempted with:", { email, password })
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] bg-gradient-to-b from-background to-accent">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl px-8 pt-6 pb-8 mb-4"
          >
            <h2 className="text-3xl font-bold mb-6 text-center gradient-text">Login</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-8 right-0 flex items-center px-3 h-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-gradient-to-r from-primary to-purple-900 hover:opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200"
                type="submit"
              >
                Sign In
              </button>
              <Link
                href="/signup"
                className="inline-block align-baseline font-bold text-sm gradient-text hover:opacity-80"
              >
                Don't have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
