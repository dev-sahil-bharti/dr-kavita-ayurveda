import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import api from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/inquiries', formData);
      alert('Thank you! Your inquiry has been sent successfully. We will get back to you soon.');
      setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-sm font-bold text-surface-strong uppercase tracking-wider mb-2">Get In Touch</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Contact Us</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Details */}
          <div className="space-y-8 lg:col-span-1">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-surface-strong mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">Visit Us</h3>
                <p className="text-text-inverse">123 Wellness Avenue<br/>Farrukhabad, Uttar Pradesh<br/>India - 209625</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-surface-strong mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">Call Us</h3>
                <p className="text-text-inverse">+91 98765 43210<br/>+91 98765 01234</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-surface-strong mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">Email Us</h3>
                <p className="text-text-inverse">info@drkavitaayurveda.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-6 w-6 text-surface-strong mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">Opening Hours</h3>
                <p className="text-text-inverse">Mon - Sat: 9:00 AM - 8:00 PM<br/>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-slate-50 p-8 rounded-xs shadow-3 border border-text-inverse/10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-text-inverse/20 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-muted" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-text-inverse/20 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-muted" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Mobile Number</label>
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full p-3 border border-text-inverse/20 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-muted" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="w-full p-3 border border-text-inverse/20 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-muted" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required className="w-full p-3 border border-text-inverse/20 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-muted"></textarea>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary py-3 px-8 text-lg disabled:opacity-50">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
