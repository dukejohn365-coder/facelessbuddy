import type { Metadata } from "next"

import {
  LegalH2,
  LegalLayout,
  LegalLead,
  LegalLi,
  LegalOl,
  LegalP,
} from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "FacelessBuddy's 30-day money-back guarantee, how refunds work through Paddle, and how to cancel your subscription.",
  alternates: { canonical: "/refunds" },
}

export default function RefundsPage() {
  return (
    <LegalLayout title="Refund Policy" updated="August 16, 2026">
      <LegalLead>
        FacelessBuddy sells its plans through Paddle, our online reseller and
        merchant of record. That means Paddle handles the charges, receipts, and
        refunds on our behalf. This policy explains how refunds work for paid
        plans.
      </LegalLead>

      <LegalP>
        The short version: every paid plan starts with a 7-day free trial, and
        you can get a full refund within 30 days of purchase — no forms, no
        fuss. After that, you can still cancel at any time to stop future
        charges.
      </LegalP>

      <LegalH2>Free trial</LegalH2>
      <LegalP>
        Both paid plans — Starter at $14/month and Growth at $29/month — start
        with a 7-day free trial. You won&apos;t be charged until the trial ends,
        and if you cancel during the trial you&apos;ll never be charged.
      </LegalP>

      <LegalH2>30-day money-back guarantee</LegalH2>
      <LegalP>
        If you&apos;re not happy after paying, you can request a full refund
        within 30 days of your purchase. No questions asked. If your
        subscription has renewed, the 30 days run from that renewal date for
        that payment.
      </LegalP>

      <LegalH2>How to request a refund</LegalH2>
      <LegalP>
        Refunds are handled by Paddle, our merchant of record. The easiest ways
        to ask are:
      </LegalP>
      <LegalOl>
        <LegalLi>
          open the &ldquo;View receipt&rdquo; or &ldquo;Manage subscription&rdquo;
          link in the email Paddle sent you, or
        </LegalLi>
        <LegalLi>
          visit Paddle&apos;s buyer support at paddle.net and choose
          &ldquo;Request refund&rdquo;, or
        </LegalLi>
        <LegalLi>
          email us at{" "}
          <a
            href="mailto:support@facelessbuddy.app"
            className="font-medium text-foreground underline underline-offset-4"
          >
            support@facelessbuddy.app
          </a>{" "}
          and we&apos;ll point you the right way.
        </LegalLi>
      </LegalOl>
      <LegalP>
        If your refund is approved, Paddle processes it back to your original
        payment method within 14 days.
      </LegalP>

      <LegalH2>Cancelling instead</LegalH2>
      <LegalP>
        If you&apos;re outside the 30-day window, or you&apos;d rather not go
        through a refund, you can cancel your subscription at any time — one
        click, right in your account. Cancellation stops future charges, and you
        keep access until the end of the period you&apos;ve paid for.
      </LegalP>

      <LegalH2>When refunds don&apos;t apply</LegalH2>
      <LegalP>
        We reserve the right to decline a refund where there&apos;s clear
        evidence of fraud, refund abuse (like buying repeatedly just to refund),
        or a request that&apos;s outside the 30-day guarantee. Your statutory
        rights under local consumer law always come first, and nothing in this
        policy overrides them.
      </LegalP>

      <LegalH2>A note on digital products</LegalH2>
      <LegalP>
        FacelessBuddy is a digital service — you get instant access to the
        dashboard and the data inside it. Because it&apos;s digital, there&apos;s
        nothing to return or restock, which is why we rely on the 30-day
        guarantee above rather than physical-return rules.
      </LegalP>

      <LegalH2>Complaints</LegalH2>
      <LegalP>
        If something&apos;s gone wrong, tell us first. Email{" "}
        <a
          href="mailto:support@facelessbuddy.app"
          className="font-medium text-foreground underline underline-offset-4"
        >
          support@facelessbuddy.app
        </a>{" "}
        and we&apos;ll get back to you within 2 business days; we aim to resolve
        complaints within 10 business days. If we can&apos;t sort it out, Paddle
        handles the next step — you can reach Paddle&apos;s buyer support at
        paddle.net. As a consumer you may also have the right to take a
        complaint to a trade ombudsman service in your country.
      </LegalP>

      <LegalH2>Contact</LegalH2>
      <LegalP>
        Refund questions? Email us at{" "}
        <a
          href="mailto:support@facelessbuddy.app"
          className="font-medium text-foreground underline underline-offset-4"
        >
          support@facelessbuddy.app
        </a>
        , or go straight to Paddle&apos;s buyer support at paddle.net.
      </LegalP>
    </LegalLayout>
  )
}