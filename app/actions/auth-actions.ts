"use server"

import { cookies } from "next/headers"
import { authenticateUser, createSession, createUser } from "@/lib/mongodb"
import { z } from "zod"

// Signup validation schema
const SignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Login validation schema
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Signup action
export async function signupAction(formData: FormData) {
  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const contactNumber = formData.get("contactNumber") as string
  const password = formData.get("password") as string

  // Validate form data
  const result = SignupSchema.safeParse({ fullName, email, contactNumber, password })

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, errors }
  }

  // Create user
  const createUserResult = await createUser({
    fullName,
    email,
    password,
    contactNumber,
  })

  if (!createUserResult.success) {
    return { success: false, message: createUserResult.message }
  }

  // Create session
  const sessionId = await createSession(createUserResult.userId!)

  // Set session cookie
  cookies().set({
    name: "sessionId",
    value: sessionId,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, message: "Signup successful" }
}

// Login action
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate form data
  const result = LoginSchema.safeParse({ email, password })

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, errors }
  }

  // Authenticate user
  const authResult = await authenticateUser(email, password)

  if (!authResult.success) {
    return { success: false, message: authResult.message }
  }

  // Create session
  const sessionId = await createSession(authResult.userId!)

  // Set session cookie
  cookies().set({
    name: "sessionId",
    value: sessionId,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, message: "Login successful" }
}

// Logout action
export async function logoutAction() {
  // Clear the session cookie
  cookies().delete("sessionId")

  // No need to redirect here, we'll handle that on the client
  return { success: true }
}
