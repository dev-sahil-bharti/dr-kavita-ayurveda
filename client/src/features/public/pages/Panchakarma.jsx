import React from 'react';
import { Droplets, Wind, Flame, Mountain, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Panchakarma = () => {
  const therapies = [
    { 
      title: 'Vamana', 
      desc: 'Therapeutic emesis (vomiting) designed to eliminate excess Kapha dosha from the respiratory and gastrointestinal tracts. Highly effective for asthma, chronic allergies, and obesity.',
      icon: Wind,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      title: 'Virechana', 
      desc: 'Medicated purgation therapy to cleanse toxins associated with Pitta dosha from the liver and gallbladder. Recommended for skin diseases, chronic fever, and hyperacidity.',
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    { 
      title: 'Basti', 
      desc: 'Herbal enema therapy (decoction and oil based) to balance Vata disorders. Considered the mother of all Panchakarma treatments, excellent for arthritis, neurological issues, and constipation.',
      icon: Droplets,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10'
    },
    { 
      title: 'Nasya', 
      desc: 'Nasal administration of medicated oils and powders to clear the head and neck regions. Vital for treating migraines, sinusitis, hair fall, and neurological disorders of the face.',
      icon: Mountain,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    { 
      title: 'Raktamokshana', 
      desc: 'Therapeutic blood-letting (often using leeches) to purify the blood and treat severe Pitta toxicity. Used for complex skin conditions, gout, and localized swelling.',
      icon: Activity,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10'
    },
  ];

  return (
    <div className="bg-surface-base font-sans min-h-screen">
      
      {/* Header Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-surface-muted text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000" 
            alt="Detox" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-muted to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-bold uppercase tracking-widest mb-6 border border-white/20 backdrop-blur-md">
            Ultimate Detoxification
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Panchakarma
          </h1>
          <p className="text-xl text-white/80 font-light leading-relaxed">
            The five profound actions of purification. Eliminate deep-rooted toxins and restore your body's innate healing intelligence.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-xl border border-black/5 mb-16 text-center max-w-4xl mx-auto transform -translate-y-24 relative z-20">
            <h2 className="text-3xl font-bold text-text-primary mb-6">What is Panchakarma?</h2>
            <p className="text-lg text-text-tertiary font-light leading-relaxed">
              Panchakarma is Ayurveda's primary purification and detoxification treatment. Translated as "five actions", it refers to the five different deeply purifying and rejuvenating procedures. Unlike modern medicine which often suppresses symptoms, Panchakarma draws toxins out from deep within the tissues and expels them from the body permanently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 -mt-8">
            {therapies.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-black/5 group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">{item.title}</h3>
                <p className="text-text-tertiary font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-surface-muted/5 p-8 md:p-12 rounded-[3rem] border border-surface-muted/10 w-full max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold text-text-primary mb-4">Need a personalized detox plan?</h3>
              <p className="text-lg text-text-tertiary font-light mb-8">Consult with our Vaidyas to determine which Panchakarma therapies are right for your body type and current condition.</p>
              <Link to="/patient/book" className="inline-flex items-center gap-2 px-8 py-4 bg-surface-strong text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                Book a Consultation <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Panchakarma;
