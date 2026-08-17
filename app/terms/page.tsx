import type { Metadata } from "next"

import {
  LegalH2,
  LegalLayout,
  LegalLead,
  LegalLi,
  LegalNote,
  LegalP,
  LegalUl,
} from "@/components/legal/legal-layout"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The agreement between you and FacelessBuddy covering your use of the Service — plans, trials, refunds, and acceptable use.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="August 16, 2026">
      <LegalLead>
        These Terms of Service (&ldquo;Terms&rdquo;) are the agreement between
        you and FacelessBuddy (&ldquo;FacelessBuddy&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;, &ldquo;our&rdquo;) covering your use of the
        FacelessBuddy website, the sign-up form, and everything behind the
        login — the dashboard, the channel database, outlier tracking, and
        competitor analysis (together, the &ldquo;Service&rdquo;).
      </LegalLead>

      <LegalP>
        When you create an account or keep using the Service, you&apos;re
        telling us you&apos;ve read these Terms and agree to them. If you
        don&apos;t agree, please don&apos;t sign up.
      </LegalP>

      <LegalH2>Who can use FacelessBuddy</LegalH2>
      <LegalP>
        FacelessBuddy is for people who are 18 or older. By signing up, you
        confirm you&apos;re at least 18 and that the information you give us is
        accurate and yours to give.
      </LegalP>

      <LegalH2>Your account, your responsibility</LegalH2>
      <LegalP>
        Your account is yours to look after. Keep your password to yourself and
        tell us right away if you think someone else has gotten in. You&apos;re
        responsible for everything that happens under your account, so don&apos;t
        share your login with anyone. We may suspend or close accounts that get
        shared, sold, or used in a way that breaks these Terms.
      </LegalP>

      <LegalH2>What FacelessBuddy is</LegalH2>
      <LegalP>
        FacelessBuddy is a research tool for faceless YouTube creators. At the
        heart of the Service is a curated database of faceless YouTube channels.
        Every channel is reviewed by a person on our team before it&apos;s
        listed, using public YouTube data — subscriber counts, view numbers,
        upload history — so the numbers you see are real, not guessed. On top of
        the database you get outlier video tracking (videos that have performed
        well above a channel&apos;s average) and competitor analysis for channels
        you choose to study.
      </LegalP>
      <LegalP>
        It&apos;s a research tool. It doesn&apos;t run channels for you, and
        nothing in the Service promises you&apos;ll make money. The channels and
        numbers we show are there for research and inspiration, not as a
        guarantee of results.
      </LegalP>

      <LegalH2>Plans, trials, and payment</LegalH2>
      <LegalP>
        The Service has a free plan and two paid plans: Starter at $14/month and
        Growth at $29/month. Both paid plans start with a 7-day free trial, and
        you can cancel at any time. We may change prices, plans, or features in
        the future; if the price of a plan you&apos;re paying for changes,
        we&apos;ll give you reasonable notice before it applies to you.
      </LegalP>
      <LegalP>
        Purchases are processed by Paddle, our online reseller. Paddle is the
        Merchant of Record for all our orders — it handles payments, receipts,
        customer service inquiries, and returns. We never see or store your card
        number. All pricing is set by us; Paddle may add applicable taxes on top
        depending on where you are.
      </LegalP>
      <LegalNote>
        Our order process is conducted by our online reseller Paddle.com.
        Paddle.com is the Merchant of Record for all our orders. Paddle provides
        all customer service inquiries and handles returns.
      </LegalNote>

      <LegalH2>Cancellation and refunds</LegalH2>
      <LegalP>
        You can cancel your subscription at any time — there&apos;s a cancel
        option in your account, and it takes effect without you needing to
        contact anyone. You&apos;ll keep access until the end of the billing
        period you&apos;ve already paid for. Refunds are covered by our Refund
        Policy, which is part of these Terms. Paddle handles refunds on our
        behalf.
      </LegalP>

      <LegalH2>Acceptable use</LegalH2>
      <LegalP>Keep the Service useful for everyone. In particular, don&apos;t:</LegalP>
      <LegalUl>
        <LegalLi>
          scrape, crawl, or bulk-copy the channel database or any part of the
          Service;
        </LegalLi>
        <LegalLi>
          resell, redistribute, or republish the data we show;
        </LegalLi>
        <LegalLi>
          create multiple accounts to get around free limits or trial rules;
        </LegalLi>
        <LegalLi>
          use the Service for spam, scams, or anything illegal;
        </LegalLi>
        <LegalLi>
          interfere with the Service or try to access parts you&apos;re not
          authorized to use;
        </LegalLi>
        <LegalLi>present our data as your own.</LegalLi>
      </LegalUl>

      <LegalH2>Intellectual property</LegalH2>
      <LegalP>
        The Service, its design, and its content — other than public YouTube
        data and anything belonging to the channels shown — belong to
        FacelessBuddy. You get a personal, non-exclusive, non-transferable
        license to use the Service for your own research. Channel names, videos,
        and other data belong to their respective owners, and we don&apos;t
        claim them. YouTube is a trademark of Google LLC, and FacelessBuddy
        isn&apos;t affiliated with or endorsed by YouTube or Google.
      </LegalP>

      <LegalH2>The data we show</LegalH2>
      <LegalP>
        Channel data comes from public YouTube information and is reviewed by
        hand, but numbers change and mistakes happen. We do our best to keep
        things accurate, but we don&apos;t guarantee that any particular
        channel, view count, or video will always be current. Treat the Service
        as a starting point for your own research, not the final word.
      </LegalP>

      <LegalH2>Disclaimer of warranties</LegalH2>
      <LegalP>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo;. To the extent the law allows, we make no warranties
        that the Service will be uninterrupted or error-free, or that any
        channel in the database will perform a certain way. We&apos;re not
        giving financial, legal, or business advice, and results aren&apos;t
        guaranteed.
      </LegalP>

      <LegalH2>Limitation of liability</LegalH2>
      <LegalP>
        To the fullest extent permitted by law, FacelessBuddy isn&apos;t liable
        for indirect, incidental, or consequential damages — including lost
        profits or lost opportunities — that come from using, or not being able
        to use, the Service. Our total liability for any claim related to the
        Service is limited to the amount you&apos;ve paid us in the twelve
        months before the claim.
      </LegalP>

      <LegalH2>Changes to these Terms</LegalH2>
      <LegalP>
        We may update these Terms from time to time. When we do, we&apos;ll
        update the &ldquo;Last updated&rdquo; date at the top and, for
        significant changes, let you know in the app or by email. Continuing to
        use the Service after a change means you accept the new Terms.
      </LegalP>

      <LegalH2>Governing law</LegalH2>
      <LegalP>
        These Terms are governed by the laws of Uganda. If a dispute can&apos;t
        be resolved informally, it will be handled in the courts of Kampala,
        Uganda.
      </LegalP>

      <LegalH2>Contact</LegalH2>
      <LegalP>
        Questions about these Terms? Email us at{" "}
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