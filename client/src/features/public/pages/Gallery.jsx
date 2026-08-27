import React from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
  const images = [
    { src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', alt: 'Yoga & Meditation', title: 'Holistic Wellness' },
    { src: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800', alt: 'Ayurvedic Herbs', title: 'Pure Ingredients' },
    { src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800', alt: 'Massage Therapy', title: 'Abhyanga Therapy' },
    { src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800', alt: 'Spa Environment', title: 'Tranquil Ambience' },
    { src: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800', alt: 'Essential Oils', title: 'Aromatherapy' },
    { src: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800', alt: 'Herbal Preparations', title: 'Vaidya Formulations' },
    { src: 'https://images.unsplash.com/photo-1544161515-4abfbcece6b4?auto=format&fit=crop&q=80&w=800', alt: 'Shirodhara', title: 'Shirodhara' },
    { src: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=800', alt: 'Ayurvedic Bowls', title: 'Therapeutic Tools' },
  ];

  return (
    <div className="bg-surface-base font-sans min-h-screen">
      
      {/* Header Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        
        <div className="absolute top-0 right-0 w-72 h-72 bg-surface-muted/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-surface-strong/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-muted/10 text-surface-muted rounded-full mb-6">
            <Camera className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-text-primary">
            Our <span className="text-surface-strong">Sanctuary</span>
          </h1>
          <p className="text-xl text-text-tertiary font-light leading-relaxed max-w-2xl mx-auto">
            Take a visual tour of our state-of-the-art authentic Panchakarma clinic. A space designed for profound healing and tranquility.
          </p>
        </div>
      </section>

      {/* Masonry-like Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
            {images.map((item, idx) => {
              // Creating varied spanning for a dynamic masonry look
              const spanClasses = idx === 0 ? 'md:col-span-2 md:row-span-2' : 
                                  idx === 3 ? 'md:row-span-2' : 
                                  idx === 6 ? 'md:col-span-2' : '';
                                  
              return (
                <div key={idx} className={`relative overflow-hidden rounded-[2rem] shadow-sm group bg-white ${spanClasses}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  
                  <img 
                    src={item.src} 
                    alt={item.alt} 
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-2 text-surface-strong mb-1">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/80">View Details</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Gallery;
