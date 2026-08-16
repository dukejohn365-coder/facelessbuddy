import { LandingNav } from "@/components/landing/landing-nav"
import { Hero } from "@/components/landing/hero"
import { Problem } from "@/components/landing/problem"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { SocialProof } from "@/components/landing/social-proof"
import { Pricing } from "@/components/landing/pricing"
import { Faq } from "@/components/landing/faq"
import { FinalCta } from "@/components/landing/final-cta"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function LandingPage() {
  return (
    <div className="bg-background">
      <LandingNav />
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <SocialProof />
      <Pricing />
      <Faq />
      <FinalCta />
      <LandingFooter />
    </div>
  )
}