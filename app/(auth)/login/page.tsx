import type { Metadata } from "next"

import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your FacelessBuddy account to keep discovering profitable faceless YouTube channels.",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginForm />
}
