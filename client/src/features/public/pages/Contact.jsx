import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, AlertCircle } from 'lucide-react';
import { publicService } from '../services/publicService';
import Button from '../../../components/common/Button';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await publicService.submitInquiry(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 6000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-base font-sans min-h-screen">
      {/* Header Banner */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-emerald-950 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000"
            alt="Contact Background"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Get In <span className="text-amber-400">Touch</span>
          </h1>
          <p className="text-xl text-emerald-100/90 font-light leading-relaxed max-w-2xl mx-auto">
            Whether you have a question about therapies, customized panchakarma, or our facilities, our team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-24 relative z-10 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Contact Details Card */}
            <div className="lg:col-span-5 bg-emerald-900 p-10 lg:p-12 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform duration-700 group-hover:scale-150"></div>

              <h3 className="text-3xl font-extrabold mb-8 relative z-10">
                Contact Information
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="flex items-start group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-5 shrink-0 group-hover/item:bg-amber-600 transition-colors duration-300">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-white">Visit Us</h4>
                    <p className="text-emerald-100/80 font-light leading-relaxed">
                      123 Wellness Avenue<br />
                      Farrukhabad, Uttar Pradesh<br />
                      India - 209625
                    </p>
                  </div>
                </div>

                <div className="flex items-start group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-5 shrink-0 group-hover/item:bg-amber-600 transition-colors duration-300">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-white">Call Us</h4>
                    <p className="text-emerald-100/80 font-light leading-relaxed">
                      +91 98765 43210<br />
                      +91 98765 01234
                    </p>
                  </div>
                </div>

                <div className="flex items-start group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-5 shrink-0 group-hover/item:bg-amber-600 transition-colors duration-300">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-white">Email Us</h4>
                    <p className="text-emerald-100/80 font-light leading-relaxed">
                      info@drkavitaayurveda.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-5 shrink-0 group-hover/item:bg-amber-600 transition-colors duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-white">Opening Hours</h4>
                    <p className="text-emerald-100/80 font-light leading-relaxed">
                      Mon - Sat: 9:00 AM - 8:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white p-10 lg:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 relative">
              <h3 className="text-3xl font-extrabold text-slate-800 mb-2">
                Send a Message
              </h3>
              <p className="text-slate-500 font-light mb-8">
                We would love to hear from you. Fill out the form below.
              </p>

              {submitStatus === 'success' && (
                <div className="mb-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3 border border-emerald-200 shadow-sm text-sm">
                  <ShieldCheck className="w-6 h-6 shrink-0" />
                  <span className="font-semibold">
                    Thank you! Your inquiry has been sent successfully.
                  </span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-8 p-4 bg-rose-50 text-rose-700 rounded-2xl flex items-center gap-3 border border-rose-200 shadow-sm text-sm">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <span className="font-semibold">
                    Failed to send message. Please try again later.
                  </span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm text-slate-800"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm text-slate-800"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm text-slate-800"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm text-slate-800"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none resize-none text-sm text-slate-800"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  isLoading={isSubmitting}
                  icon={Send}
                  iconPosition="right"
                  className="w-full md:w-auto"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
