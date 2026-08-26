import React, { useState, useEffect } from 'react';
import { Phone, Mail, Calendar, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const PublicNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'HOME', path: '/home' },
    { name: 'PANCHAKARMA', path: '/panchakarma' },
    { name: 'THERAPIES', path: '/therapies', hasDropdown: true },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  return (
    <header className="w-full font-sans shadow-md">

      {/* Secondary Top Bar - Golden */}
      <div className="bg-[#b48608] text-white py-2 px-4 md:px-8 text-sm hidden lg:flex justify-between items-center transition-all duration-300">

        {/* Left Side: Contact Info & Socials */}
        <div className="flex items-center space-x-6">
          <a href="tel:+919370466953" className="flex items-center hover:text-white/80 transition-colors font-medium">
            <Phone className="h-4 w-4 mr-2" />
            +91-9370466953
          </a>

          <div className="w-px h-4 bg-white/30"></div>

          <a href="mailto:info@ayurvedgram.in" className="flex items-center hover:text-white/80 transition-colors font-medium">
            <Mail className="h-4 w-4 mr-2" />
            info@ayurvedgram.in
          </a>

          <div className="w-px h-4 bg-white/30"></div>

          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-white/80 transition-colors"><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.324V1.325C24 .597 23.403 0 22.675 0z" /></svg></a>
            <a href="#" className="hover:text-white/80 transition-colors"><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg></a>
            <a href="#" className="hover:text-white/80 transition-colors"><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg></a>
            <a href="#" className="hover:text-white/80 transition-colors"><svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg></a>
          </div>
        </div>

        {/* Right Side: Appointment & Cart */}
        <div className="flex items-center space-x-6 font-medium">
          <Link to="/patient/login" className="flex items-center hover:text-white/80 transition-colors">
            Login
          </Link>
          <div className="w-px h-4 bg-white/30"></div>
          <Link to="/patient/register" className="flex items-center hover:text-white/80 transition-colors">
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Link>
          <a href="#" className="flex items-center hover:text-white/80 transition-colors">
            <ShoppingCart className="h-4 w-4 mr-2" />
            0 / $0.00
          </a>
        </div>
      </div>

      {/* Main Navbar - Dark Green */}
      <div className={`w-full bg-[#0f3c35] text-white transition-all duration-300 ${isScrolled ? 'fixed top-0 z-50 shadow-lg py-2' : 'relative py-4'}`}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Dr. Kavita Ayurveda Logo" className="h-16 w-auto rounded-full" />
            <span className='text-3xl text-boald'>
              Dr. Kavita Ayurveda
            </span>
          </Link>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center">
            <nav className="flex items-center space-x-7 font-bold text-[13px] tracking-wider mr-8">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative group flex items-center hover:text-[#b48608] transition-colors py-2"
                >
                  {item.name}
                  {item.hasDropdown && <ChevronDown className="w-4 h-4 ml-1 opacity-70" />}

                  {/* Hover Underline */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b48608] transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
            <Link 
              to="/patient/register" 
              className="bg-[#b48608] hover:bg-[#9a7307] text-white px-6 py-2.5 rounded-full font-bold text-[13px] tracking-widest shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              BOOK APPOINTMENT
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`lg:hidden absolute left-0 w-full bg-[#0f3c35] text-white shadow-xl transition-all duration-300 origin-top overflow-hidden z-40 ${isMobileMenuOpen ? 'max-h-screen border-t border-white/10' : 'max-h-0'}`}>
        <nav className="flex flex-col p-4 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="px-4 py-3 rounded-lg hover:bg-white/10 hover:text-[#b48608] transition-colors font-bold text-sm tracking-wider flex justify-between items-center"
            >
              {item.name}
              {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
            </Link>
          ))}

          <div className="h-px bg-white/10 my-4 mx-4"></div>

          <a href="tel:+919370466953" className="flex items-center px-4 py-2 hover:text-[#b48608] font-medium">
            <Phone className="w-4 h-4 mr-3" />
            +91-9370466953
          </a>
          <a href="mailto:info@ayurvedgram.in" className="flex items-center px-4 py-2 hover:text-[#b48608] font-medium">
            <Mail className="w-4 h-4 mr-3" />
            info@ayurvedgram.in
          </a>

          <Link to="/patient/book" className="mx-4 mt-4 bg-[#b48608] hover:bg-[#9a7307] text-white flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-bold tracking-wide transition-colors">
            <Calendar className="w-4 h-4" />
            Book Appointment
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default PublicNavbar;
