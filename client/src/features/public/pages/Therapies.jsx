import React from 'react';
import { Sparkles, Flower2, Droplets, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Therapies = () => {
  const therapies = [
    { 
      title: 'Shirodhara', 
      desc: 'A continuous, soothing flow of warm medicated oil on the forehead. Deeply relaxes the nervous system, relieves stress, anxiety, and insomnia.',
      icon: Droplets,
      img: 'https://images.unsplash.com/photo-1544161515-4abfbcece6b4?q=80&w=800'
    },
    { 
      title: 'Abhyanga', 
      desc: 'Full-body rhythmic massage using warm herb-infused oils. Improves circulation, relieves muscle tension, and nourishes the skin.',
      icon: Sparkles,
      img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800'
    },
    { 
      title: 'Kati Basti', 
      desc: 'Retaining warm medicated oil over the lower back inside an herbal dough ring. Excellent for sciatica, slipped disc, and chronic back pain.',
      icon: Flower2,
      img: 'https://images.unsplash.com/photo-1600334129128-685054110230?q=80&w=800'
    },
    { 
      title: 'Janu Basti', 
      desc: 'A specialized knee therapy using warm medicated oils. Relieves joint stiffness, osteoarthritis pain, and improves mobility.',
      icon: Sparkles,
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800'
    },
    { 
      title: 'Udvartana', 
      desc: 'Invigorating full-body massage using dry herbal powders. Highly effective for weight loss, reducing cellulite, and exfoliating the skin.',
      icon: Flower2,
      img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800'
    },
    { 
      title: 'Netra Tarpana', 
      desc: 'Rejuvenating eye treatment where pure medicated ghee is retained over the eyes. Relieves eye strain, dry eyes, and improves vision.',
      icon: Droplets,
      img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800'
    },
  ];

  return (
    <div className="bg-surface-base font-sans min-h-screen">
      
      {/* Header Banner */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-surface-muted text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2000" 
            alt="Ayurvedic Therapies" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-muted via-surface-muted/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-bold uppercase tracking-widest mb-6 border border-white/20 backdrop-blur-md">
            Holistic Treatments
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Ayurvedic Therapies
          </h1>
          <p className="text-xl text-white/80 font-light leading-relaxed max-w-2xl mx-auto">
            Experience profound relaxation and targeted healing through our authentic, time-tested external therapies.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-24 relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {therapies.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-black/5 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="h-60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur p-2 rounded-full text-surface-muted shadow-lg">
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-surface-strong transition-colors">{item.title}</h3>
                  <p className="text-text-tertiary font-light leading-relaxed mb-6">{item.desc}</p>
                  <Link to="/patient/book" className="inline-flex items-center gap-2 text-sm font-bold text-surface-muted group-hover:text-surface-strong transition-colors">
                    Book this therapy <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Therapies;
