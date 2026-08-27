import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, HeartPulse, Activity, CheckCircle, ShieldCheck, Sparkles, Droplets, Flower2, Clock } from 'lucide-react';

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const heroImages = [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-surface-base font-sans overflow-hidden selection:bg-surface-strong/30 selection:text-surface-strong">
      
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${index === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          >
            <img src={img} alt="Hero Background" className="w-full h-full object-cover origin-center" />
          </div>
        ))}
        
        {/* Soft elegant gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-muted/60 to-transparent z-0 mix-blend-multiply" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs md:text-sm font-semibold tracking-wide uppercase mb-6 shadow-xl animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-surface-strong animate-pulse" />
            <span className="opacity-90">Welcome to Dr. Kavita Ayurveda</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 max-w-4xl leading-[1.1] text-white animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Awaken Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-surface-strong to-orange-300">Natural Harmony</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-12 max-w-2xl font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Experience deep rejuvenation and holistic healing through 5,000-year-old authentic Ayurvedic wisdom, personalized just for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link
              to="/patient/register"
              className="group flex items-center justify-center gap-3 text-lg font-bold px-8 py-4 bg-surface-strong hover:bg-surface-strong/90 text-white rounded-full shadow-[0_8px_30px_rgb(224,122,95,0.3)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(224,122,95,0.5)] hover:-translate-y-1"
            >
              Start Healing Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#specialities"
              className="group flex items-center justify-center gap-3 text-lg font-bold px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
            >
              Explore Therapies
            </a>
          </div>

          <div className="flex gap-3 mt-20 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-1.5 rounded-full transition-all duration-500 ${index === currentImage ? 'w-12 bg-surface-strong shadow-[0_0_10px_rgba(224,122,95,0.8)]' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy / About Section */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-surface-muted/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-surface-strong/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Image Composition */}
            <div className="order-2 lg:order-1 relative group h-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-surface-muted/20 to-surface-strong/10 rounded-3xl transform -rotate-3 scale-[1.03] group-hover:rotate-0 transition-transform duration-700 ease-out"></div>
              <img
                src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=1000"
                alt="Ayurvedic Herbs"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-[500px] lg:h-[600px] transform transition-transform duration-700 hover:scale-[1.01]"
              />
              
              {/* Floating Glass Card */}
              <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-white/80 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-2xl border border-white/50 flex items-center gap-6 transform transition-transform duration-500 hover:-translate-y-2">
                <div className="bg-surface-muted p-4 rounded-2xl text-white shadow-lg shadow-surface-muted/30">
                  <HeartPulse className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-surface-muted">15k+</p>
                  <p className="text-sm font-bold text-text-tertiary uppercase tracking-widest mt-1">Lives Touched</p>
                </div>
              </div>
            </div>
            
            {/* Text Content */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-muted/5 text-surface-muted rounded-full text-sm font-bold uppercase tracking-widest border border-surface-muted/10">
                <Leaf className="w-4 h-4" /> The Root of Healing
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.15]">
                Balance your <span className="text-transparent bg-clip-text bg-gradient-to-r from-surface-muted to-green-600">Body & Mind</span>
              </h2>
              <p className="text-lg md:text-xl text-text-tertiary leading-relaxed font-light">
                At Dr. Kavita Ayurveda, we don’t just treat symptoms; we seek the root cause. Using personalized holistic therapies, rare herbal formulations, and timeless Vedic science, we restore your body's innate ability to heal itself.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                {[
                  { text: 'Nadi Pariksha Diagnosis', icon: Activity },
                  { text: 'Authentic Panchakarma', icon: Droplets },
                  { text: 'Customized Diet Plans', icon: Flower2 },
                  { text: 'Pure Herbal Medicines', icon: CheckCircle }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-surface-base p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-surface-muted/10">
                    <div className="bg-surface-strong/10 p-2 rounded-lg text-surface-strong">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-text-primary">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6">
                <Link to="/about" className="group inline-flex items-center gap-3 font-bold text-lg text-surface-muted hover:text-surface-muted/80 transition-colors">
                  <span className="border-b-2 border-surface-muted/30 group-hover:border-surface-muted transition-colors pb-1">Discover Our Philosophy</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPDs / Specialities Section */}
      <section id="specialities" className="py-24 lg:py-32 bg-surface-base relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20 max-w-3xl mx-auto space-y-6">
            <span className="inline-block px-4 py-2 bg-surface-strong/10 text-surface-strong rounded-full text-sm font-bold uppercase tracking-widest">Targeted Healing</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary">Clinical Specialities</h2>
            <p className="text-xl text-text-tertiary font-light">
              Expert care for chronic conditions through natural, time-tested Ayurvedic protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Panchakarma', desc: 'Deep cellular detoxification and rejuvenation of mind and body.', icon: Droplets, color: 'from-blue-500/20 to-blue-600/20', text: 'text-blue-600' },
              { title: 'Joint & Spine', desc: 'Therapies for arthritis, sciatica, and chronic musculoskeletal pain.', icon: Activity, color: 'from-surface-strong/20 to-orange-500/20', text: 'text-surface-strong' },
              { title: 'Skin & Hair', desc: 'Root-cause healing for psoriasis, eczema, acne, and hair fall.', icon: Sparkles, color: 'from-pink-500/20 to-rose-500/20', text: 'text-pink-600' },
              { title: 'Women\'s Health', desc: 'Holistic management of PCOD, menopause, and hormonal imbalances.', icon: HeartPulse, color: 'from-purple-500/20 to-purple-600/20', text: 'text-purple-600' },
              { title: 'Gut Health', desc: 'Lasting treatments for IBS, chronic acidity, and digestive disorders.', icon: Leaf, color: 'from-surface-muted/20 to-green-600/20', text: 'text-surface-muted' },
              { title: 'Stress & Sleep', desc: 'Shirodhara and therapies for anxiety, depression, and insomnia.', icon: Flower2, color: 'from-indigo-500/20 to-indigo-600/20', text: 'text-indigo-600' },
            ].map((spec, i) => (
              <div key={i} className="group relative bg-white p-8 rounded-3xl border border-black/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500 z-0"></div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10 bg-gradient-to-br ${spec.color}`}>
                  <spec.icon className={`h-8 w-8 ${spec.text}`} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4 relative z-10">{spec.title}</h3>
                <p className="text-text-tertiary leading-relaxed relative z-10 font-light">{spec.desc}</p>
                
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-text-primary group-hover:text-surface-strong transition-colors relative z-10">
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Journey Section */}
      <section className="py-24 lg:py-32 bg-surface-muted text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=2000')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-surface-muted via-surface-muted/95 to-surface-muted/90"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-bold uppercase tracking-widest backdrop-blur-md mb-6 border border-white/20">The Process</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">Four Steps to Wellness</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            {[
              { step: '01', title: 'Consultation', desc: 'In-depth Nadi Pariksha and personalized Dosha analysis.', icon: Activity },
              { step: '02', title: 'Treatment Plan', desc: 'Customized herbal formulations and dietary protocols.', icon: Leaf },
              { step: '03', title: 'Therapies', desc: 'Authentic Panchakarma and external healing treatments.', icon: Droplets },
              { step: '04', title: 'Rejuvenation', desc: 'Rasayana therapies for lasting immunity and vitality.', icon: Sparkles },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-surface-muted text-white rounded-full flex items-center justify-center border-2 border-white/30 shadow-xl mb-8 group-hover:bg-white group-hover:text-surface-muted group-hover:scale-110 transition-all duration-500 relative">
                  <item.icon className="w-8 h-8" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-surface-strong text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/70 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-surface-strong/20 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-surface-muted/20 to-transparent rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-surface-strong/10 text-surface-strong rounded-full mb-8">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 text-text-primary tracking-tight">
            Your Time for <span className="text-surface-strong">Healing</span> is Now.
          </h2>
          <p className="text-xl md:text-2xl text-text-tertiary mb-12 font-light max-w-3xl mx-auto">
            Take the first step towards a balanced, disease-free life. Book an expert consultation with our experienced Vaidyas today.
          </p>
          <Link to="/patient/book" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-surface-strong text-white font-bold text-xl rounded-full shadow-[0_10px_40px_rgba(224,122,95,0.4)] hover:shadow-[0_15px_50px_rgba(224,122,95,0.6)] hover:-translate-y-2 transition-all duration-300">
            Schedule Appointment <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
