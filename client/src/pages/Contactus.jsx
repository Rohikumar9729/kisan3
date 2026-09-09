import React, { useState } from 'react'
import BlurCircle from '../components/Blurcircle'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const contactInfo = [
  { icon: <Mail className="w-5 h-5 text-[#CEC382]" />, label: 'Email', value: 'contact@kisan.com' },
  { icon: <Phone className="w-5 h-5 text-[#CEC382]" />, label: 'Phone', value: '+91 98765 43210' },
  { icon: <MapPin className="w-5 h-5 text-[#CEC382]" />, label: 'Address', value: 'New Delhi, India 110001' },
]

const Contactus = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSent(true)
    toast.success('Message sent! We\'ll get back to you soon.')
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BlurCircle top="-5%" right="-10%" />
      <BlurCircle bottom="5%" left="-10%" />

      {/* Header */}
      <section className="px-6 md:px-16 lg:px-36 pt-36 pb-16 text-center">
        <span className="inline-block px-4 py-1 text-xs font-semibold tracking-widest uppercase bg-[#CEC382]/15 text-[#CEC382] rounded-full mb-5">
          Get In Touch
        </span>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          We'd Love to <span className="text-[#CEC382]">Hear</span> From You
        </h1>
        <p className="mt-5 text-gray-400 max-w-xl mx-auto">
          Whether you have a question, a suggestion, or just want to say hello — our team is here for you.
        </p>
      </section>

      <section className="px-6 md:px-16 lg:px-36 pb-28 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info */}
        <div className="flex flex-col gap-5">
          {contactInfo.map((c) => (
            <div
              key={c.label}
              className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#CEC382]/40 transition"
            >
              <div className="bg-[#CEC382]/10 rounded-xl p-3 shrink-0">{c.icon}</div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">{c.label}</p>
                <p className="text-white font-medium mt-1">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <CheckCircle className="w-16 h-16 text-[#CEC382]" />
              <h2 className="text-2xl font-bold">Message Received!</h2>
              <p className="text-gray-400 max-w-sm">
                Thank you for reaching out. Our team will respond to you within 24 hours.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="mt-4 px-6 py-2 bg-[#CEC382] hover:bg-[#b8a56e] text-black font-medium rounded-full transition text-sm"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Full Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rohit Kumar"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#CEC382]/50 transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-[#CEC382] hover:bg-[#b8a56e] text-black font-semibold rounded-full transition self-start text-sm"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

export default Contactus
