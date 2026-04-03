export default function TermsOfUsePage() {
  const lastUpdated = 'January 1, 2025'

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-white font-serif">Terms of Use</h1>
          <p className="text-white/70 mt-3 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">

            <div className="bg-[#1a6b3a]/5 border border-[#1a6b3a]/15 rounded-xl p-5 text-sm text-gray-600 leading-relaxed">
              These Terms of Use govern your access to and use of the RENISA website and member portal.
              By accessing or using our services, you agree to be bound by these terms. If you do not
              agree, please discontinue use of our website immediately.
            </div>

            <Section title="1. Acceptance of Terms">
              <p>
                By accessing <strong>www.renisa.org</strong> or any of its subpages, you confirm that
                you are at least 18 years of age, you have read and understood these Terms of Use, and
                you agree to be legally bound by them. These terms apply to all visitors, registered
                members, and administrators of the RENISA platform.
              </p>
            </Section>

            <Section title="2. Membership Eligibility">
              <p>Membership of RENISA is open to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Retired Nigerian athletes who represented Nigeria at national or international level.</li>
                <li>Retired sports administrators, coaches, and officials with verifiable service records.</li>
                <li>Honorary members approved by the RENISA Board of Trustees.</li>
              </ul>
              <p className="mt-3">
                RENISA reserves the right to verify membership eligibility and reject or revoke
                membership at its sole discretion. False declarations during registration may result
                in immediate termination of membership without refund.
              </p>
            </Section>

            <Section title="3. Member Accounts">
              <p>
                When you register for a member account, you are responsible for maintaining the
                confidentiality of your login credentials. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Provide accurate, current, and complete information during registration.</li>
                <li>Update your profile information to keep it accurate and current.</li>
                <li>Not share your account credentials with any third party.</li>
                <li>Notify RENISA immediately of any unauthorised use of your account.</li>
              </ul>
              <p className="mt-3">
                RENISA will not be liable for any loss or damage arising from your failure to
                safeguard your account credentials.
              </p>
            </Section>

            <Section title="4. Acceptable Use">
              <p>You agree not to use the RENISA website or portal to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Post or transmit content that is defamatory, offensive, obscene, or unlawful.</li>
                <li>Impersonate any person or entity, or misrepresent your affiliation with RENISA.</li>
                <li>Engage in any activity that could damage, disable, or impair the website's functionality.</li>
                <li>Collect or harvest personal data of other members without consent.</li>
                <li>Use automated tools (bots, scrapers) to access any part of the website.</li>
                <li>Send unsolicited communications (spam) to other members.</li>
              </ul>
            </Section>

            <Section title="5. Intellectual Property">
              <p>
                All content on this website — including text, images, logos, graphics, videos, and
                documents — is the exclusive property of RENISA or its content contributors and is
                protected by Nigerian and international copyright law. You may not reproduce,
                distribute, modify, or republish any content without the prior written consent of RENISA.
              </p>
              <p className="mt-3">
                You may share links to RENISA content for non-commercial purposes with appropriate
                attribution.
              </p>
            </Section>

            <Section title="6. Donations and Payments">
              <p>
                All donations made through the RENISA platform are voluntary and non-refundable unless
                a payment error can be demonstrated. RENISA commits to using donations for the stated
                purposes including member welfare, events, and operational costs. Donation
                acknowledgment receipts will be issued upon request.
              </p>
            </Section>

            <Section title="7. Member Directory and Public Profiles">
              <p>
                By registering as a member, you consent to your name, sport, state, and membership
                status being listed in the RENISA member directory (unless you opt out in your
                profile settings). Detailed personal information such as contact details will not
                be published publicly without your explicit consent.
              </p>
            </Section>

            <Section title="8. Disclaimer of Warranties">
              <p>
                The RENISA website and all content are provided on an "as is" and "as available"
                basis without any warranties of any kind, express or implied. RENISA does not warrant
                that the website will be uninterrupted, error-free, or free of viruses or other harmful
                components. Use of the website is at your own risk.
              </p>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                To the fullest extent permitted by Nigerian law, RENISA shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages arising from your
                use of, or inability to use, the website or services. RENISA's total liability for
                any claim shall not exceed the amount paid (if any) by you to RENISA in the twelve
                months preceding the claim.
              </p>
            </Section>

            <Section title="10. Governing Law">
              <p>
                These Terms of Use are governed by and construed in accordance with the laws of the
                Federal Republic of Nigeria. Any disputes arising from these terms shall be subject
                to the exclusive jurisdiction of the courts of Lagos State, Nigeria.
              </p>
            </Section>

            <Section title="11. Amendments">
              <p>
                RENISA reserves the right to amend these Terms of Use at any time. Revised terms
                will be posted on this page with an updated effective date. Continued use of the
                website after any changes constitutes acceptance of the revised terms. We encourage
                you to review this page periodically.
              </p>
            </Section>

            <Section title="12. Contact">
              <p>For any questions regarding these Terms of Use, please contact:</p>
              <div className="mt-3 bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                <p className="font-semibold text-gray-900">RENISA — Association of Retired Nigerian Sports Men &amp; Women</p>
                <p>Email: <span className="text-[#1a6b3a]">legal@renisa.org</span></p>
                <p>Address: RENISA Secretariat, National Stadium Complex, Surulere, Lagos, Nigeria</p>
              </div>
            </Section>

          </div>
        </div>
      </section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 font-serif mb-3 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}
