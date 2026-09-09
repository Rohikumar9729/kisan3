import React from 'react'
import BlurCircle from '../components/Blurcircle'

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, list a product, or contact us for support. This includes your name, email address, phone number, and delivery address.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to operate, maintain, and improve our services; process transactions; send you technical notices and support messages; and respond to your comments and questions.`,
  },
  {
    title: '3. Sharing of Information',
    content: `We do not share your personal information with third parties except in the following cases: with your consent; to comply with laws; to protect the rights and safety of Kisan and others; or with service providers who assist us in operating our platform.`,
  },
  {
    title: '4. Data Security',
    content: `We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. All data is encrypted in transit using SSL/TLS.`,
  },
  {
    title: '5. Cookies',
    content: `We use cookies and similar tracking technologies to track activity on our platform and to hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`,
  },
  {
    title: '6. Your Rights',
    content: `You have the right to access, correct, or delete your personal data at any time. You may also opt out of marketing communications. To exercise these rights, please contact us at privacy@kisan.com.`,
  },
  {
    title: '7. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date below.`,
  },
]

const Privacy = () => {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <BlurCircle top="-5%" right="-10%" />

      <div className="px-6 md:px-16 lg:px-36 pt-36 pb-28 max-w-4xl">
        <span className="inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full mb-5">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12">Effective Date: September 1, 2026</p>

        <p className="text-gray-400 mb-10 leading-relaxed">
          At Kisan, we are committed to protecting your privacy. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit our platform.
          Please read this policy carefully.
        </p>

        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <div key={s.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#CEC382]/30 transition">
              <h2 className="font-semibold text-white text-lg mb-3">{s.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-xs mt-12">
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href="/Contactus" className="text-[#CEC382] hover:underline">contact@kisan.com</a>.
        </p>
      </div>
    </div>
  )
}

export default Privacy
