import React from 'react';
import { Leaf, Award, Users, HeartPulse, Clock, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-surface-base font-sans min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000" 
            alt="Yoga and Wellness" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-base/40 via-surface-base/80 to-surface-base"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-strong/10 text-surface-strong rounded-full text-sm font-bold uppercase tracking-widest mb-6 border border-surface-strong/20">
            <Sparkles className="w-4 h-4" /> Our Story
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-text-primary mb-6 tracking-tight">
            Rooted in <span className="text-transparent bg-clip-text bg-gradient-to-r from-surface-strong to-orange-400">Tradition</span>, <br className="hidden sm:block" />
            Designed for Today.
          </h1>
          <p className="text-xl md:text-2xl text-text-tertiary font-light leading-relaxed max-w-3xl mx-auto">
            Discover the 5,000-year-old wisdom of Ayurveda, brought to life through authentic Panchakarma therapies and compassionate care.
          </p>
        </div>
      </section>

      {/* Main Content: The Philosophy */}
      <section className="py-16 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight">
                Healing the <span className="text-surface-muted">Root Cause</span>
              </h2>
              <div className="prose prose-lg text-text-tertiary font-light">
                <p>
                  At Dr. Kavita Ayurveda, we believe that true health is more than just the absence of disease—it is a vibrant state of balance between body, mind, and spirit.
                </p>
                <p>
                  Founded with a vision to bring authentic, unadulterated Ayurvedic treatments to Farrukhabad, our clinic specializes in Nadi Pariksha (Pulse Diagnosis) and complete Panchakarma therapies. We do not offer temporary fixes; we provide lifelong wellness solutions.
                </p>
                <p>
                  Every patient is unique. That is why our expert Vaidyas meticulously craft customized treatment protocols, dietary guidelines, and lifestyle modifications based on your specific Prakriti (body constitution).
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-black/5">
                <div>
                  <h4 className="text-4xl font-extrabold text-surface-strong mb-2">10+</h4>
                  <p className="text-sm font-bold text-text-inverse uppercase tracking-widest">Years Experience</p>
                </div>
                <div>
                  <h4 className="text-4xl font-extrabold text-surface-muted mb-2">15k+</h4>
                  <p className="text-sm font-bold text-text-inverse uppercase tracking-widest">Patients Healed</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-surface-strong/10 rounded-[3rem] transform rotate-3 scale-105"></div>
              <img 
                src="https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=1000" 
                alt="Ayurvedic Clinic" 
                className="relative rounded-[3rem] shadow-2xl object-cover h-[600px] w-full"
              />
            </div>
            
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">Our Core Values</h2>
            <p className="text-xl text-text-tertiary font-light max-w-2xl mx-auto">The principles that guide our practice and patient care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: 'Authenticity', desc: 'Strict adherence to classical Ayurvedic texts and preparation methods.' },
              { icon: HeartPulse, title: 'Compassion', desc: 'Patient-first approach with deep empathy for your healing journey.' },
              { icon: Award, title: 'Excellence', desc: 'Highest standards of hygiene, therapy administration, and herbal purity.' },
              { icon: Users, title: 'Holism', desc: 'Treating the whole person—body, mind, and spirit simultaneously.' }
            ].map((val, idx) => (
              <div key={idx} className="bg-surface-base p-8 rounded-3xl text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-surface-muted/10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6 text-surface-muted group-hover:bg-surface-muted group-hover:text-white transition-colors duration-300">
                  <val.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">{val.title}</h3>
                <p className="text-text-tertiary font-light leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
