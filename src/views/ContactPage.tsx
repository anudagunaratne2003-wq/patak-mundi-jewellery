'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { supabase } from '@/lib/supabase';

export function ContactPage() {
  const { pushToast } = useStore();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    setSubmitting(false);

    if (error) {
      pushToast('Something went wrong sending your message. Please try again.', 'error');
      return;
    }
    pushToast('Message sent — we will reply within 24 hours', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputClass =
    'w-full border border-charcoal-200 bg-white px-4 py-3 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-champagne-400 focus:outline-none';

  return (
    <div className="animate-fade-in">
      <div className="border-b border-charcoal-100 bg-ivory-100">
        <div className="container-lux py-14 text-center lg:py-20">
          <p className="text-xs uppercase tracking-ultra text-champagne-600">We're Here to Help</p>
          <h1 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm font-light text-charcoal-500">
            Questions about a piece, an order, or a custom commission? Our client advisors
            are at your service.
          </p>
        </div>
      </div>

      <div className="container-lux py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Form */}
          <div>
            <h2 className="font-serif text-2xl text-charcoal-900">Send a Message</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`mt-2 ${inputClass}`} />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Email</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`mt-2 ${inputClass}`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Subject</label>
                <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={`mt-2 ${inputClass}`} />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-charcoal-600">Message</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`mt-2 ${inputClass}`} />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500 disabled:opacity-60"
              >
                <Send size={15} /> {submitting ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="lg:pl-8">
            <h2 className="font-serif text-2xl text-charcoal-900">Reach Us Directly</h2>
            <div className="mt-6 space-y-6">
              {[
                { icon: MapPin, title: 'Atelier', lines: ['12 Rue de la Paix', '75002 Paris, France'] },
                { icon: Phone, title: 'Phone', lines: ['+33 1 42 60 12 34'] },
                { icon: Mail, title: 'Email', lines: ['clients@lumierejewels.com'] },
                { icon: Clock, title: 'Hours', lines: ['Mon–Sat: 10am – 7pm CET', 'Sun: By appointment'] },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory-100">
                    <Icon size={20} className="text-champagne-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-charcoal-500">{title}</p>
                    {lines.map((l) => (
                      <p key={l} className="text-sm text-charcoal-800">{l}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-ivory-100 p-6">
              <h3 className="font-serif text-lg text-charcoal-900">Private Appointments</h3>
              <p className="mt-2 text-sm font-light text-charcoal-600">
                Book a private viewing in our atelier for a personalised consultation with
                one of our jewellery advisors.
              </p>
              <button
                type="button"
                onClick={() => pushToast('Appointment request received', 'success')}
                className="mt-4 border border-charcoal-300 px-6 py-3 text-xs font-medium uppercase tracking-widest text-charcoal-700 transition-colors hover:border-champagne-400 hover:text-champagne-700"
              >
                Request Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
