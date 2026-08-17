import type { Metadata } from "next"

import {
  LegalH2,
  LegalLayout,
  LegalLead,
  LegalLi,
  LegalP,
  LegalUl,
} from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How FacelessBuddy collects, uses, and protects your personal information — and the third parties involved in running the Service.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 16, 2026">
      <LegalLead>
        This Privacy Policy explains what FacelessBuddy (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects when you use our website
        and the dashboard behind the login, why we collect it, and how you can
        control it.
      </LegalLead>

      <LegalP>
        The short version: we collect the basics needed to run the Service —
        your name and email, the channels you save, and a little usage data. We
        don&apos;t sell your information, and we never see your card details
        when you pay.
      </LegalP>

      <LegalH2>What we collect</LegalH2>
      <LegalUl>
        <LegalLi>
          <span className="font-medium text-foreground">Account information.</span>{" "}
          When you sign up with an email and password, or sign in with Google,
          we get your name and email address. With Google sign-in, Google shares
          the name and email tied to your Google account.
        </LegalLi>
        <LegalLi>
          <span className="font-medium text-foreground">What you save.</span>{" "}
          The channels you save, the competitors you add, and your
          outlier-tracking preferences. This is the stuff you ask us to remember
          so it&apos;s there when you come back.
        </LegalLi>
        <LegalLi>
          <span className="font-medium text-foreground">Usage information.</span>{" "}
          Basic technical information about how the Service is used — the pages
          you visit, rough timing, and device or browser details — so we can
          keep things running and spot problems.
        </LegalLi>
      </LegalUl>

      <LegalH2>How we use it</LegalH2>
      <LegalP>We use what we collect to:</LegalP>
      <LegalUl>
        <LegalLi>
          create and manage your account and keep you logged in;
        </LegalLi>
        <LegalLi>
          show you the saved channels, competitors, and preferences you&apos;ve
          stored;
        </LegalLi>
        <LegalLi>
          send you service messages — like letting you know when something about
          your account or the Service changes;
        </LegalLi>
        <LegalLi>
          keep the Service secure and understand how it&apos;s used so we can
          improve it.
        </LegalLi>
      </LegalUl>
      <LegalP>
        We don&apos;t use your data for advertising, and we don&apos;t sell or
        rent it to anyone.
      </LegalP>

      <LegalH2>Local storage and cookies</LegalH2>
      <LegalP>
        We store a small preference — your light or dark theme choice — in your
        browser&apos;s local storage so the site looks right when you come back.
        We don&apos;t use third-party advertising or analytics cookies on our
        site.
      </LegalP>

      <LegalH2>What we share</LegalH2>
      <LegalP>
        We share data only with the companies that help us run the Service, and
        only as far as they need it:
      </LegalP>
      <LegalUl>
        <LegalLi>
          <span className="font-medium text-foreground">Convex</span> — hosts our
          database and backend, and stores the account and saved data above.
        </LegalLi>
        <LegalLi>
          <span className="font-medium text-foreground">Google</span> — if you
          sign in with Google, Google handles that sign-in. We also pull public
          channel and video data from the YouTube API to populate the database;
          that data is public anyway.
        </LegalLi>
        <LegalLi>
          <span className="font-medium text-foreground">Paddle</span> — when you
          pay for a plan, Paddle processes the payment as our merchant of
          record. Paddle collects and handles your payment and billing details,
          and we never receive or store your card number.
        </LegalLi>
      </LegalUl>

      <LegalH2>Payment details</LegalH2>
      <LegalP>
        When you buy a plan, you pay through Paddle. Card numbers and payment
        details go straight to Paddle — we don&apos;t collect, see, or store
        them. Paddle has its own privacy policy at paddle.com/privacy.
      </LegalP>

      <LegalH2>Retention and deletion</LegalH2>
      <LegalP>
        We keep your account data while your account is active. You can ask us
        to delete your account and data at any time, and we&apos;ll take care of
        it. Some data may need to be kept where the law requires it — for
        example, tax records for transactions.
      </LegalP>

      <LegalH2>Your rights</LegalH2>
      <LegalP>
        Depending on where you live, you may have rights to access, correct, or
        delete your personal data, and to ask us to stop processing it. In the
        EU and EEA this includes rights under the GDPR; in California, the CCPA
        gives you the right to know what we collect and to delete it. To
        exercise any of these, email us at{" "}
        <a
          href="mailto:support@facelessbuddy.app"
          className="font-medium text-foreground underline underline-offset-4"
        >
          support@facelessbuddy.app
        </a>{" "}
        and we&apos;ll respond within the timeframe the law allows.
      </LegalP>

      <LegalH2>Where your data is stored</LegalH2>
      <LegalP>
        Our database is hosted on Convex&apos;s cloud infrastructure, which may
        be outside the country you&apos;re in — including outside the EU and
        EEA. By using the Service you understand your data may be processed and
        stored in other countries. When we transfer data out of the EEA, we rely
        on appropriate safeguards.
      </LegalP>

      <LegalH2>Children</LegalH2>
      <LegalP>
        FacelessBuddy isn&apos;t for anyone under 18, and we don&apos;t
        knowingly collect data from children. If you think a child has given us
        data, email us and we&apos;ll delete it.
      </LegalP>

      <LegalH2>Security</LegalH2>
      <LegalP>
        We use HTTPS, keep access to your data limited to what&apos;s needed,
        and rely on Convex&apos;s security practices for our hosted database. No
        system is perfectly secure, but we take reasonable steps to protect what
        you&apos;ve shared with us.
      </LegalP>

      <LegalH2>Changes to this policy</LegalH2>
      <LegalP>
        If we change this policy, we&apos;ll update the date at the top and, for
        significant changes, let you know in the app or by email.
      </LegalP>

      <LegalH2>Contact</LegalH2>
      <LegalP>
        Questions about your data? Email us at{" "}
        <a
          href="mailto:support@facelessbuddy.app"
          className="font-medium text-foreground underline underline-offset-4"
        >
          support@facelessbuddy.app
        </a>
        .
      </LegalP>
    </LegalLayout>
  )
}