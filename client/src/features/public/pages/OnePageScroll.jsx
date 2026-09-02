import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Home from './Home';
import Panchakarma from './Panchakarma';
import Therapies from './Therapies';
import Gallery from './Gallery';
import About from './About';
import Contact from './Contact';

const OnePageScroll = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle initial hash on page load / route navigation
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          window.scrollTo({
            top: offsetPosition > 0 ? offsetPosition : 0,
            behavior: 'smooth',
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div className="w-full">
      <section id="home" className="scroll-mt-24">
        <Home />
      </section>
      <section id="panchakarma" className="scroll-mt-24">
        <Panchakarma />
      </section>
      <section id="therapies" className="scroll-mt-24">
        <Therapies />
      </section>
      <section id="gallery" className="scroll-mt-24">
        <Gallery />
      </section>
      <section id="about" className="scroll-mt-24">
        <About />
      </section>
      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>
    </div>
  );
};

export default OnePageScroll;
