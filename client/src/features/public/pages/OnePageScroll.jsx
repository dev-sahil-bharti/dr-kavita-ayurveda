import React, { useEffect } from 'react';
import Home from './Home';
import Panchakarma from './Panchakarma';
import Therapies from './Therapies';
import Gallery from './Gallery';
import About from './About';
import Contact from './Contact';

const OnePageScroll = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="w-full">
      <section id="home">
        <Home />
      </section>
      <section id="panchakarma">
        <Panchakarma />
      </section>
      <section id="therapies">
        <Therapies />
      </section>
      <section id="gallery">
        <Gallery />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </div>
  );
};

export default OnePageScroll;
