import React from 'react';
import { Leaf } from 'lucide-react';

const Panchakarma = () => {
  const therapies = [
    { title: 'Vamana', desc: 'Therapeutic vomiting to eliminate excess Kapha.' },
    { title: 'Virechana', desc: 'Purgation therapy to cleanse toxins associated with Pitta.' },
    { title: 'Basti', desc: 'Herbal enema to balance Vata disorders.' },
    { title: 'Nasya', desc: 'Nasal administration of medicated oils for head and neck issues.' },
    { title: 'Raktamokshana', desc: 'Blood-letting therapy to purify the blood.' },
  ];

  return (
    <div className="bg-surface-base min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-sm font-bold text-surface-strong uppercase tracking-wider mb-2">Detoxification</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Panchakarma Therapies</h2>
        </div>
        
        <div className="bg-surface-base p-8 rounded-2xl shadow-sm border border-black/5 mb-12">
          <p className="text-lg text-text-inverse mb-4">
            Panchakarma is Ayurveda's primary purification and detoxification treatment. It means "five actions" which refers to the five different deeply purifying and rejuvenating procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {therapies.map((item, idx) => (
            <div key={idx} className="bg-surface-base p-6 rounded-2xl shadow-sm border border-black/5 flex items-start hover:shadow-md transition-shadow">
              <div className="bg-surface-muted/10 p-3 rounded-xl mr-4">
                <Leaf className="h-6 w-6 text-surface-muted" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-inverse">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Panchakarma;
