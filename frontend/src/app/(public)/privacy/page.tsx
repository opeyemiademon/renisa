export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 1, 2025'

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-white font-serif">Privacy Policy</h1>
          <p className="text-white/70 mt-3 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">

            <div className="bg-[#1a6b3a]/5 border border-[#1a6b3a]/15 rounded-xl p-5 text-sm text-gray-600 leading-relaxed">
              This Privacy Policy explains how the Association of Retired Nigerian Sports Men &amp; Women
              (<strong>RENISA</strong>) collects, uses, and protects the personal information you provide
              when using our website and services. By accessing our website, you consent to the practices
              described in this policy.
            </div>

            <Section title="1. Information We Collect">
              <p>We may collect the following types of personal information:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Identity Information:</strong> Full name, date of birth, gender, nationality.</li>
                <li><strong>Contact Information:</strong> Email address, phone number, residential address, state of origin.</li>
                <li><strong>Sports History:</strong> Sport discipline(s), years of active competition, achievements, representative roles.</li>
                <li><strong>Account Credentials:</strong> Username and encrypted password for member portal access.</li>
                <li><strong>Payment Information:</strong> Bank transfer details or donation references (we do not store card data).</li>
                <li><strong>Usage Data:</strong> IP address, browser type, pages visited, and time spent on our website.</li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>RENISA uses your personal information to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Process and manage your membership registration and renewals.</li>
                <li>Communicate updates, events, newsletters, and important announcements.</li>
                <li>Administer awards, welfare programmes, and member benefits.</li>
                <li>Process donations and issue acknowledgment receipts.</li>
                <li>Maintain accurate records of our membership database.</li>
                <li>Improve the functionality and content of our website.</li>
                <li>Comply with legal and regulatory obligations.</li>
              </ul>
            </Section>

            <Section title="3. Sharing of Information">
              <p>
                RENISA does not sell, trade, or rent your personal information to third parties.
                We may share your data only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>With government agencies or the Nigerian Sports Ministry where required by law.</li>
                <li>With service providers who assist in operating our website (under strict confidentiality agreements).</li>
                <li>When you have given explicit consent for your profile to be featured on our public directory.</li>
                <li>In connection with legal proceedings or to enforce our Terms of Use.</li>
              </ul>
            </Section>

            <Section title="4. Data Security">
              <p>
                We implement appropriate technical and organisational measures to protect your personal
                information against unauthorised access, alteration, disclosure, or destruction.
                These include secure servers, encrypted data transmission (HTTPS), and access controls
                limited to authorised RENISA personnel. However, no method of transmission over the
                internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </Section>

            <Section title="5. Cookies">
              <p>
                Our website uses cookies to enhance your browsing experience. Cookies are small data
                files stored on your device. We use them to remember your login session, understand
                site usage patterns, and improve performance. You may disable cookies through your
                browser settings, but this may affect certain features of the website.
              </p>
            </Section>

            <Section title="6. Your Rights">
              <p>As a member or visitor, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Access the personal information we hold about you.</li>
                <li>Request correction of inaccurate or incomplete data.</li>
                <li>Request deletion of your personal data (subject to legal obligations).</li>
                <li>Opt out of marketing communications at any time.</li>
                <li>Withdraw consent where processing is based on consent.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at{' '}
                <span className="text-[#1a6b3a] font-medium">info@renisa.org</span>.
              </p>
            </Section>

            <Section title="7. Data Retention">
              <p>
                We retain your personal information for as long as your membership is active and for
                a period of seven (7) years thereafter, or as required by Nigerian law. Usage data
                collected through cookies is retained for up to 12 months.
              </p>
            </Section>

            <Section title="8. Children's Privacy">
              <p>
                RENISA's website is intended for adults aged 18 and over. We do not knowingly collect
                personal information from children under the age of 18. If you believe a child has
                provided us with personal information, please contact us immediately.
              </p>
            </Section>

            <Section title="9. Third-Party Links">
              <p>
                Our website may contain links to third-party websites. RENISA is not responsible for
                the privacy practices of those sites and encourages you to read their respective
                privacy policies before submitting any personal information.
              </p>
            </Section>

            <Section title="10. Changes to This Policy">
              <p>
                RENISA reserves the right to update this Privacy Policy at any time. Changes will be
                posted on this page with an updated date. Continued use of our website after changes
                are posted constitutes your acceptance of the revised policy.
              </p>
            </Section>

            <Section title="11. Contact Us">
              <p>If you have any questions or concerns about this Privacy Policy, please contact:</p>
              <div className="mt-3 bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                <p className="font-semibold text-gray-900">RENISA — Association of Retired Nigerian Sports Men &amp; Women</p>
                <p>Email: <span className="text-[#1a6b3a]">info@renisa.org</span></p>
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
