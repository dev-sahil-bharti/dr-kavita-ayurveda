import React from 'react';
import { HeartPulse, Leaf } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-sm font-bold text-surface-strong uppercase tracking-wider mb-2">Our Story</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">About Dr. Kavita Ayurveda</h2>
        </div>
        
        <div className="bg-white p-8 md:p-12 rounded-xs shadow-3 border border-text-inverse/10">
          <p className="text-lg text-text-inverse mb-6 leading-relaxed">
            Welcome to Dr. Kavita Ayurveda Panchakarma Clinic, a sanctuary of traditional healing located in the heart of Farrukhabad. 
            Our clinic is dedicated to bringing you the profound wisdom of Ayurveda, a 5,000-year-old system of natural healing.
          </p>
          <p className="text-lg text-text-inverse mb-8 leading-relaxed">
            Led by expert Vaidyas, we specialize in authentic Panchakarma therapies designed to detoxify the body, rejuvenate the mind, 
            and restore your natural state of balance and health.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 border-t border-text-inverse/10 pt-8">
            <div className="flex items-start">
              <div className="bg-surface-muted/10 p-4 rounded-xs mr-4">
                <HeartPulse className="h-8 w-8 text-surface-muted" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Our Mission</h3>
                <p className="text-text-inverse">To provide holistic, root-cause healing through authentic Ayurvedic practices and lifestyle guidance.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-surface-strong/10 p-4 rounded-xs mr-4">
                <Leaf className="h-8 w-8 text-surface-strong" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Our Vision</h3>
                <p className="text-text-inverse">To be the most trusted destination for natural healing, empowering our community to live disease-free.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
