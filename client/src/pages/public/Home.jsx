import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, HeartPulse, Activity, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import heroImg1 from '../../assets/hero/ayurveda_hero_1_1786086680036.png';
import heroImg2 from '../../assets/hero/ayurveda_hero_2_1786086694932.png';
import heroImg3 from '../../assets/hero/ayurveda_hero_3_1786086707590.png';
import heroImg4 from '../../assets/hero/ayurveda_hero_4_1786086718930.png';
import heroImg5 from '../../assets/hero/ayurveda_hero_5_1786086733286.png';

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const heroImages = [
    heroImg1, // Modern Luxury Clinic Interior
    heroImg2, // Shirodhara Treatment
    heroImg3, // Authentic Herbs & Mortar
    heroImg4, // Panchakarma Therapy Room
    heroImg5  // Authentic Wellness setup with Neem and Diyas
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % heroImages.length);
    }, 4000); // 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white">

      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Background image carousel */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentImage ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
          >
            <img
              src={img} 
              alt={`Ayurveda Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Gradient overlays for mood & readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-strong/30 to-transparent z-0 mix-blend-multiply" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-start text-left">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-semibold tracking-wide uppercase mb-8 shadow-xl animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-surface-strong" />
            Welcome to Dr. Kavita Ayurveda
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-3xl leading-tight text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Authentic Ayurvedic <br className="hidden sm:block" />
            Healing in <span className="text-surface-strong">Farrukhabad</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Experience profound healing, authentic wellness, and personalized treatments rooted in the 5,000-year-old ancient wisdom of Ayurveda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/patient/register"
              className="group flex items-center justify-center gap-2 text-lg font-bold px-8 py-4 bg-surface-strong hover:bg-surface-strong/90 text-white rounded-full shadow-lg shadow-surface-strong/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Book Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#specialities"
              className="flex items-center justify-center text-lg font-bold px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Specialities
            </a>
          </div>

          {/* Image indicator dots */}
          <div className="flex gap-3 mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all duration-500 ${index === currentImage ? 'w-10 bg-surface-strong' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-surface-muted/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-surface-strong/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-surface-strong/20 rounded-2xl transform rotate-3 scale-[1.02] group-hover:rotate-6 transition-transform duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800"
                alt="Ayurvedic Herbs"
                className="relative rounded-2xl shadow-xl object-cover w-full h-[400px] sm:h-[500px] transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2"
              />
              <div className="absolute -bottom-8 -left-4 sm:-left-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-5 transform transition-transform duration-500 group-hover:-translate-y-4">
                <div className="bg-surface-muted/10 p-4 rounded-xl text-surface-strong">
                  <HeartPulse className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900">15k+</p>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Happy Patients</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-strong/10 text-surface-strong rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                <Leaf className="w-4 h-4" /> About Us
              </div>
              <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                The Ancient Path to <br/> <span className="text-surface-strong">Modern Wellness</span>
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Ayurveda is a 5,000-year-old system of natural healing that has its origins in the Vedic culture of India. It is considered by many scholars to be the oldest healing science.
                At Dr. Kavita Ayurveda Panchakarma Clinic, we offer authentic treatments that focus on the root cause of the disease rather than just the symptoms.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {[
                  '100% Authentic Treatments',
                  'Expert Vaidyas',
                  'Personalized Diet Plans',
                  'Modern Panchakarma Facilities'
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-gray-800 font-medium bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <CheckCircle className="h-5 w-5 text-surface-strong mr-3 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              
              <Link to="/about" className="inline-flex items-center gap-2 font-bold text-lg text-surface-strong hover:text-surface-strong/80 transition-colors group">
                Discover our full journey 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OPDs / Specialities Section */}
      <section id="specialities" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <span className="inline-block px-3 py-1 bg-surface-muted/10 text-surface-muted rounded-full text-sm font-bold uppercase tracking-wider mb-4">Our Specialities</span>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">Holistic Care Domains</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We specialize in deep healing through targeted OPDs and authentic Panchakarma therapies led by experienced vaidyas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Panchakarma Therapy', desc: 'Complete detoxification and rejuvenation of the body, mind, and spirit.', icon: Leaf },
              { title: 'Joint & Spine Care', desc: 'Effective natural treatments for arthritis, spondylosis, and chronic back pain.', icon: Activity },
              { title: 'Skin & Hair Care', desc: 'Root-cause Ayurvedic solutions for psoriasis, eczema, and persistent hair fall.', icon: ShieldCheck },
              { title: 'Women\'s Health', desc: 'Specialized holistic care for PCOD, menopause, and infertility issues.', icon: HeartPulse },
              { title: 'Digestive Disorders', desc: 'Lasting treatments for IBS, chronic acidity, and persistent constipation.', icon: Activity },
              { title: 'Stress Management', desc: 'Calming Shirodhara and targeted therapies for anxiety, depression, and insomnia.', icon: Leaf },
            ].map((spec, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 bg-surface-muted/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-surface-strong group-hover:scale-110 transition-all duration-300">
                  <spec.icon className="h-8 w-8 text-surface-muted group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-surface-strong transition-colors">{spec.title}</h4>
                <p className="text-gray-600 leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-surface-strong/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-3 py-1 bg-surface-strong/20 text-surface-strong rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-surface-strong/30">The Journey</span>
            <h3 className="text-4xl sm:text-5xl font-extrabold mb-6">Our Healing Process</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative">
            <div className="hidden lg:block absolute top-10 left-12 right-12 h-0.5 bg-white/20 -z-0 rounded-full"></div>
            
            {[
              { step: '1', title: 'Consultation', desc: 'Detailed Nadi Pariksha and personalized diagnosis.' },
              { step: '2', title: 'Treatment Plan', desc: 'Custom therapy & dietary chart creation.' },
              { step: '3', title: 'Panchakarma', desc: 'Authentic detoxification therapies at our clinic.' },
              { step: '4', title: 'Rejuvenation', desc: 'Follow-up care ensuring lasting, holistic wellness.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center group">
                <div className="w-20 h-20 bg-slate-800 text-white rounded-full flex items-center justify-center text-3xl font-bold border-4 border-surface-strong shadow-lg mb-6 group-hover:bg-surface-strong group-hover:scale-110 transition-all duration-300 relative">
                  {item.step}
                  <div className="absolute inset-0 bg-surface-strong rounded-full animate-ping opacity-20 hidden group-hover:block"></div>
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-gray-400 max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-surface-strong text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-lg text-white/80 mb-10">Book a consultation with our expert Vaidyas and take the first step towards a healthier, balanced life.</p>
          <Link to="/patient/book" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-surface-strong font-bold text-lg rounded-full shadow-xl hover:bg-gray-50 hover:scale-105 transition-all">
            Book Appointment <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        {/* Background shapes */}
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2"></div>
      </section>

    </div>
  );
};

export default Home;
