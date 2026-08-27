import React from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-white/10 pt-20 pb-8 relative overflow-hidden text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-surface-strong/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-surface-muted/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Column 1: Logo & About */}
          <div className="flex flex-col space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Dr. Kavita Ayurveda Logo" className="h-20 w-auto rounded-full bg-white p-1" />
              <div className="font-bold text-2xl tracking-tight">
                Dr. Kavita <span className="text-surface-strong">Ayurveda</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Conceptualised to bring all the facets of Ayurved under one roof. Providing authentic, personalized treatments to thousands of seeking wellness.
            </p>
            <div>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-surface-strong hover:text-white transition-all text-gray-400"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z" /></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-surface-strong hover:text-white transition-all text-gray-400"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-surface-strong hover:text-white transition-all text-gray-400"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-surface-strong hover:text-white transition-all text-gray-400"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-surface-strong hover:text-white transition-all text-gray-400"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg></a>
 
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {[
                { name: 'Home', path: '/' },
                { name: 'Panchakarma', path: '/panchakarma' },
                { name: 'Therapies', path: '/therapies' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Admin Dashboard', path: '/admin/login' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-surface-strong transition-colors flex items-center group">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-surface-strong" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white tracking-wide">Get In Touch</h4>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-surface-strong shrink-0 mt-0.5" />
                <span className="leading-relaxed">Main Market Rd, Farrukhabad,<br />Uttar Pradesh, India</span>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-surface-strong shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  <a href="tel:+918755828557" className="hover:text-white transition-colors">+91 87558 28557</a>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-surface-strong shrink-0 mt-0.5" />
                <a href="mailto:drkavita@gmail.com" className="hover:text-white transition-colors">drkavita@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Column 4: Location Map */}
          <div className="flex flex-col h-full min-h-[250px] lg:min-h-0">
            <h4 className="font-bold text-lg mb-6 text-white tracking-wide">Our Location</h4>
            <div className="w-full flex-grow rounded-xl overflow-hidden shadow-lg relative h-48 lg:h-full border border-white/10 group">
              <iframe
                src="https://maps.google.com/maps?q=Farrukhabad,+Uttar+Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
                title="Clinic Location"
                className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-6">
          <p>
            © {new Date().getFullYear()} Dr. Kavita Ayurveda. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy-policy" className="hover:text-surface-strong transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-surface-strong transition-colors duration-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>

  );
};

export default Footer;