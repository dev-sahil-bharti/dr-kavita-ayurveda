import React from 'react';

const Gallery = () => {
  const images = [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
  ];

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-sm font-bold text-surface-strong uppercase tracking-wider mb-2">Our Gallery</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">Visual Tour of Dr. Kavita Ayurveda</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div key={idx} className="overflow-hidden rounded-xs shadow-3 group">
              <img src={img} alt={`Gallery ${idx}`} className="w-full h-64 object-cover transform transition-transform duration-[400ms] group-hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
