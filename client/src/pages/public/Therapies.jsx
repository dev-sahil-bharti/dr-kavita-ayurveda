import React from 'react';
import { Activity } from 'lucide-react';

const Therapies = () => {
  const therapiesList = [
    { title: 'Shirodhara', desc: 'Continuous pouring of warm medicated oil over the forehead to relieve stress and anxiety.' },
    { title: 'Abhyanga', desc: 'Full body massage with warm herbal oils to nourish the skin and improve circulation.' },
    { title: 'Kati Basti', desc: 'Warm oil treatment specifically for lower back pain and spinal disorders.' },
    { title: 'Janu Basti', desc: 'Specialized therapy for knee joint pain and arthritis.' },
    { title: 'Netra Tarpana', desc: 'Eye rejuvenation treatment to improve vision and reduce eye strain.' },
    { title: 'Udvartana', desc: 'Herbal powder massage for weight loss and skin toning.' },
  ];

  return (
    <div className="bg-surface-base min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-sm font-bold text-surface-strong uppercase tracking-wider mb-2">Healing Procedures</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Ayurvedic Therapies</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {therapiesList.map((item, idx) => (
            <div key={idx} className="bg-surface-base p-8 rounded-2xl border border-black/5 hover:shadow-md hover:-translate-y-1 transition-all duration-[300ms] group">
              <div className="w-12 h-12 bg-surface-strong/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-surface-strong group-hover:text-white transition-colors">
                <Activity className="h-6 w-6 text-surface-strong group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{item.title}</h3>
              <p className="text-text-inverse leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Therapies;
