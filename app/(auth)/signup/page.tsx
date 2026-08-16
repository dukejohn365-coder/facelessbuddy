import type { Metadata } from "next"

import { SignupForm } from "@/components/signup-form"

export const metadata: Metadata = {
  title: "Create Your Account",
  description:
    "Start free and see 3 hand-vetted faceless YouTube channels now. No credit card required.",
  robots: { index: false, follow: false },
}

export default function SignupPage() {
  return <SignupForm />
}
