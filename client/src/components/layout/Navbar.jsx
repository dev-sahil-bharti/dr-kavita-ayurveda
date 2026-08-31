import React, { useState, useEffect } from 'react';
import { Phone, Mail, Calendar, Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

export const PublicNavbar = () => {
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'HOME', path: '/home#home' },
    { name: 'PANCHAKARMA', path: '/home#panchakarma' },
    { name: 'THERAPIES', path: '/home#therapies', hasDropdown: true },
    { name: 'GALLERY', path: '/home#gallery' },
    { name: 'ABOUT US', path: '/home#about' },
    { name: 'CONTACT US', path: '/home#contact' },
  ];

  const handleNavClick = (e, path) => {
    if (path.startsWith('/home#')) {
      const hash = path.split('#')[1];
      if (location.pathname === '/home' || location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="w-full font-sans shadow-md">
      {/* Secondary Top Bar - Golden */}
      <div className="bg-[#b48608] text-white py-2 px-4 md:px-8 text-xs sm:text-sm hidden lg:flex justify-between items-center transition-all duration-300">
        {/* Left Side: Contact Info */}
        <div className="flex items-center space-x-6">
          <a
            href="tel:+919370466953"
            className="flex items-center hover:text-white/80 transition-colors font-medium"
          >
            <Phone className="h-4 w-4 mr-2" />
            +91-9370466953
          </a>

          <div className="w-px h-4 bg-white/30"></div>

          <a
            href="mailto:info@drkavitaayurveda.com"
            className="flex items-center hover:text-white/80 transition-colors font-medium"
          >
            <Mail className="h-4 w-4 mr-2" />
            info@drkavitaayurveda.com
          </a>
        </div>

        {/* Right Side: Auth Links */}
        <div className="flex items-center space-x-6 font-medium">
          <Link
            to="/patient/login"
            className="flex items-center hover:text-white/80 transition-colors"
          >
            Patient Login
          </Link>
          <div className="w-px h-4 bg-white/30"></div>
          <Link
            to="/admin/login"
            className="flex items-center hover:text-white/80 transition-colors"
          >
            Admin Portal
          </Link>
          <div className="w-px h-4 bg-white/30"></div>
          <Link
            to="/patient/book"
            className="flex items-center hover:text-white/80 transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Main Navbar - Dark Green */}
      <div
        className={`w-full bg-[#0f3c35] text-white transition-all duration-300 ${
          isScrolled ? 'fixed top-0 z-50 shadow-lg py-2' : 'relative py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Dr. Kavita Ayurveda Logo"
              className="h-14 w-auto rounded-full bg-white p-0.5"
            />
            <span className="text-2xl font-bold tracking-tight text-white">
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
                  onClick={(e) => handleNavClick(e, item.path)}
                  className="relative group flex items-center hover:text-[#b48608] transition-colors py-2"
                >
                  {item.name}
                  {item.hasDropdown && (
                    <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b48608] transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
            <Link
              to="/patient/book"
              className="bg-[#b48608] hover:bg-[#9a7307] text-white px-6 py-2.5 rounded-full font-bold text-[13px] tracking-widest shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              BOOK APPOINTMENT
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        className={`lg:hidden bg-[#0f3c35] text-white shadow-xl transition-all duration-300 origin-top overflow-hidden z-40 ${
          isMobileMenuOpen ? 'max-h-screen border-t border-white/10 py-4' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col px-4 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className="px-4 py-3 rounded-xl hover:bg-white/10 hover:text-[#b48608] transition-colors font-bold text-sm tracking-wider flex justify-between items-center"
            >
              {item.name}
              {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
            </Link>
          ))}

          <div className="h-px bg-white/10 my-4 mx-4"></div>

          <Link
            to="/patient/login"
            className="px-4 py-2 hover:text-[#b48608] font-medium text-sm block"
          >
            Patient Login
          </Link>
          <Link
            to="/admin/login"
            className="px-4 py-2 hover:text-[#b48608] font-medium text-sm block"
          >
            Admin Portal
          </Link>

          <Link
            to="/patient/book"
            className="mx-4 mt-4 bg-[#b48608] hover:bg-[#9a7307] text-white flex justify-center items-center gap-2 px-6 py-3 rounded-xl font-bold tracking-wide transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default PublicNavbar;
