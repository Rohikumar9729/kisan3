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
      <BlurCircle top="-5%" left="-10%" color="emerald" />
      <BlurCircle bottom="10%" right="-10%" color="gold" />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-32 sm:pt-36 pb-16 text-center">
        <span className="inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full mb-5 border border-[#CEC382]/30">
          Our Story
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl mx-auto text-white">
          Connecting Farmers to a&nbsp;
          <span className="text-[#CEC382]">Better Future</span>
        </h1>
        <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Kisan was founded with a single mission — to give Indian farmers a
          direct, digital marketplace where they can buy quality seeds, sell
          surplus produce, and learn modern growing techniques, all in one place.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#111915]/80 border border-white/10 rounded-2xl p-6 text-center hover:border-[#CEC382]/40 transition"
            >
              <p className="text-3xl md:text-4xl font-black text-[#CEC382]">{s.value}</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-16">
        <p className="text-gray-300 font-bold text-lg mb-8">What We Stand For</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-[#111915]/80 border border-white/10 rounded-2xl p-7 flex gap-5 hover:border-[#CEC382]/40 hover:-translate-y-1 transition duration-300"
            >
              <div className="shrink-0 bg-[#CEC382]/10 rounded-2xl p-3.5 h-fit">{v.icon}</div>
              <div>
                <h2 className="font-bold text-white text-lg">{v.title}</h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-24">
        <div className="bg-[#CEC382]/10 border border-[#CEC382]/25 rounded-3xl p-8 sm:p-14 text-center backdrop-blur-md">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#CEC382] mb-4">Our Mission</h2>
          <p className="text-gray-200 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
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
