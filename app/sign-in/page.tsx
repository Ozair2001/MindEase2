"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import Link from "next/link"
import { Brain } from "lucide-react"

//react icons
import { FaGithub } from "react-icons/fa"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TriangleAlert } from "lucide-react"

const SignIn = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [pending, setPending] = useState(false)
  const router = useRouter()
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })
    if (res?.ok) {
      router.push("/chat")
      toast.success("login successful")
    } else if (res?.status === 401) {
      setError("Invalid Credentials")
      setPending(false)
    } else {
      setError("Something went wrong")
    }
  }

  const handleProvider = (event: React.MouseEvent<HTMLButtonElement>, value: "github") => {
    event.preventDefault()
    signIn(value, { callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-accent p-4">
      <div className="mb-8 flex items-center space-x-2">
        <Brain className="h-10 w-10 text-primary" />
        <span className="text-3xl font-bold gradient-text">Mind Ease</span>
      </div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center gradient-text">Welcome Back</CardTitle>
          <CardDescription className="text-center text-gray-600">Sign in to your Mind Ease account</CardDescription>
        </CardHeader>

        {!!error && (
          <div className="mx-6 mb-4 bg-red-50 border border-red-200 p-3 rounded-lg flex items-center gap-x-2 text-sm text-red-700">
            <TriangleAlert className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                disabled={pending}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                disabled={pending}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <Button
              className="w-full bg-gradient-to-r from-primary to-purple-900 text-white hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-primary/25"
              size="lg"
              disabled={pending}
            >
              {pending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              disabled={pending}
              onClick={(e) => handleProvider(e, "github")}
              variant="outline"
              size="lg"
              className="bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <FaGithub className="h-5 w-5 mr-2" />
              GitHub
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link className="font-medium gradient-text hover:opacity-80 transition-colors" href="/sign-up">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn
