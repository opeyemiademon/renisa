'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { Input, Textarea } from '@/components/shared/Input'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Message sent! We will get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-[#0d4a25] to-[#1a6b3a] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#d4a017] font-medium text-sm uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h1 className="text-4xl font-bold text-white font-serif">Contact Us</h1>
          <p className="text-white/80 mt-3 max-w-xl mx-auto">
            Have questions or want to reach us? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <Input
                  label="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="How can we help?"
                  required
                />
                <Textarea
                  label="Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message here..."
                  rows={5}
                  required
                />
                <Button type="submit" loading={loading} iconLeft={<Send className="w-4 h-4" />}>
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-serif mb-6">
                  Contact Information
                </h2>
                <div className="space-y-5">
                  {[
                    {
                      icon: <MapPin className="w-5 h-5 text-[#d4a017]" />,
                      label: 'Address',
                      value: 'National Sports Commission Complex, Surulere, Lagos, Nigeria',
                    },
                    {
                      icon: <Phone className="w-5 h-5 text-[#d4a017]" />,
                      label: 'Phone',
                      value: '+234 800 000 0000',
                    },
                    {
                      icon: <Mail className="w-5 h-5 text-[#d4a017]" />,
                      label: 'Email',
                      value: 'info@renisa.org.ng',
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-[#1a6b3a]/10 rounded-lg flex-shrink-0">{item.icon}</div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p className="text-gray-800 text-sm mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a6b3a] rounded-xl p-6 text-white">
                <h3 className="font-semibold text-[#d4a017] mb-3">Office Hours</h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span>9:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM – 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-red-300">Closed</span>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-gray-200 rounded-xl h-56 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">Map placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
