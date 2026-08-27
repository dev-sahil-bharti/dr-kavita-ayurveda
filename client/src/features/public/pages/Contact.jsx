import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from 'lucide-react';
import api from '../../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await api.post('/inquiries', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
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
      <section className="relative pt-32 pb-24 overflow-hidden bg-surface-muted text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000" 
            alt="Contact Background" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-muted to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-surface-strong to-orange-300">Touch</span>
          </h1>
          <p className="text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
            Whether you have a question about therapies, pricing, or our facilities, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-24 relative z-10 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Contact Details Card */}
            <div className="lg:col-span-5 bg-surface-muted p-10 lg:p-12 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform duration-700 group-hover:scale-150"></div>
              
              <h3 className="text-3xl font-bold mb-8 relative z-10">Contact Information</h3>
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-start group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-5 shrink-0 group-hover/item:bg-surface-strong transition-colors duration-300">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-white/90">Visit Us</h4>
                    <p className="text-white/70 font-light leading-relaxed">123 Wellness Avenue<br/>Farrukhabad, Uttar Pradesh<br/>India - 209625</p>
                  </div>
                </div>
                
                <div className="flex items-start group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-5 shrink-0 group-hover/item:bg-surface-strong transition-colors duration-300">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-white/90">Call Us</h4>
                    <p className="text-white/70 font-light leading-relaxed">+91 98765 43210<br/>+91 98765 01234</p>
                  </div>
                </div>
                
                <div className="flex items-start group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-5 shrink-0 group-hover/item:bg-surface-strong transition-colors duration-300">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-white/90">Email Us</h4>
                    <p className="text-white/70 font-light leading-relaxed">info@drkavitaayurveda.com</p>
                  </div>
                </div>
                
                <div className="flex items-start group/item">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-5 shrink-0 group-hover/item:bg-surface-strong transition-colors duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-white/90">Opening Hours</h4>
                    <p className="text-white/70 font-light leading-relaxed">Mon - Sat: 9:00 AM - 8:00 PM<br/>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-white p-10 lg:p-12 rounded-[2.5rem] shadow-xl border border-black/5 relative">
              <h3 className="text-3xl font-bold text-text-primary mb-2">Send a Message</h3>
              <p className="text-text-tertiary font-light mb-8">We would love to hear from you. Fill out the form below.</p>
              
              {submitStatus === 'success' && (
                <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 border border-green-200">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="font-medium">Thank you! Your inquiry has been sent successfully.</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center gap-3 border border-red-200">
                  <span className="font-medium">Failed to send message. Please try again later.</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required 
                      className="w-full p-4 bg-surface-base border border-transparent rounded-2xl focus:bg-white focus:border-surface-muted focus:ring-4 focus:ring-surface-muted/10 transition-all outline-none" 
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required 
                      className="w-full p-4 bg-surface-base border border-transparent rounded-2xl focus:bg-white focus:border-surface-muted focus:ring-4 focus:ring-surface-muted/10 transition-all outline-none" 
                      placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Mobile Number</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required 
                      className="w-full p-4 bg-surface-base border border-transparent rounded-2xl focus:bg-white focus:border-surface-muted focus:ring-4 focus:ring-surface-muted/10 transition-all outline-none" 
                      placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-primary mb-2">Subject</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required 
                      className="w-full p-4 bg-surface-base border border-transparent rounded-2xl focus:bg-white focus:border-surface-muted focus:ring-4 focus:ring-surface-muted/10 transition-all outline-none" 
                      placeholder="How can we help?" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required 
                    className="w-full p-4 bg-surface-base border border-transparent rounded-2xl focus:bg-white focus:border-surface-muted focus:ring-4 focus:ring-surface-muted/10 transition-all outline-none resize-none" 
                    placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} 
                  className="w-full md:w-auto inline-flex justify-center items-center gap-2 bg-surface-strong text-white font-bold py-4 px-10 rounded-full hover:bg-surface-strong/90 hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default Contact;
