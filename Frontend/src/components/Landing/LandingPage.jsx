import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Stats from './Stats';
import Services from './Services';
import Process from './Process';
import Doctors from './Doctors';
import Testimonials from './Testimonials';
import CTA from './CTA';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--white)' }}>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Process />
        <Doctors />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
