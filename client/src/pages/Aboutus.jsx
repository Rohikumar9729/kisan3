import React from 'react'
import BlurCircle from '../components/Blurcircle'
import { Leaf, Users, ShieldCheck, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Farmers Empowered', value: '12,000+' },
  { label: 'Seed Varieties', value: '500+' },
  { label: 'States Covered', value: '18' },
  { label: 'Orders Delivered', value: '80,000+' },
]

const values = [
  {
    icon: <Leaf className="w-7 h-7 text-[#CEC382]" />,
    title: 'Sustainable Farming',
    desc: 'We promote eco-friendly agricultural practices that preserve soil health and reduce chemical dependency.',
  },
  {
    icon: <Users className="w-7 h-7 text-[#CEC382]" />,
    title: 'Community First',
    desc: 'Our platform is built by farmers, for farmers — fostering peer-to-peer knowledge and resource sharing.',
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-[#CEC382]" />,
    title: 'Quality Assured',
    desc: 'Every seed and product listed goes through rigorous quality checks to ensure the best yields.',
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-[#CEC382]" />,
    title: 'Fair Pricing',
    desc: 'We cut out middlemen so farmers get the best price — both when buying and when selling.',
  },
]

const Aboutus = () => {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <BlurCircle top="-5%" left="-10%" />
      <BlurCircle bottom="10%" right="-10%" />

      {/* Hero */}
      <section className="px-6 md:px-16 lg:px-36 pt-36 pb-20 text-center">
        <span className="inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full mb-5">
          Our Story
        </span>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto">
          Connecting Farmers to a&nbsp;
          <span className="text-[#CEC382]">Better Future</span>
        </h1>
        <p className="mt-6 text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Kisan was founded with a single mission — to give Indian farmers a
          direct, digital marketplace where they can buy quality seeds, sell
          surplus produce, and learn modern growing techniques, all in one place.
        </p>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-16 lg:px-36 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-[#CEC382]/40 transition"
            >
              <p className="text-3xl md:text-4xl font-bold text-[#CEC382]">{s.value}</p>
              <p className="text-gray-400 text-sm mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="px-6 md:px-16 lg:px-36 py-20">
        <p className="text-gray-300 font-medium text-lg mb-10">What We Stand For</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 flex gap-5 hover:border-[#CEC382]/40 hover:-translate-y-1 transition duration-300"
            >
              <div className="shrink-0 bg-[#CEC382]/10 rounded-xl p-3 h-fit">{v.icon}</div>
              <div>
                <h2 className="font-semibold text-white text-lg">{v.title}</h2>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Banner */}
      <section className="px-6 md:px-16 lg:px-36 pb-28">
        <div className="bg-[#CEC382]/10 border border-[#CEC382]/25 rounded-3xl p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#CEC382] mb-4">Our Mission</h2>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            To digitise and democratise Indian agriculture — making quality inputs accessible,
            providing fair prices, and empowering every farmer with technology that actually works
            in the field.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Aboutus
