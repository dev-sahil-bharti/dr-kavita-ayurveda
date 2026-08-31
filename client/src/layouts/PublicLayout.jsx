import React from 'react';
import PublicNavbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-base font-sans flex flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <section id="footer">
        <Footer />
      </section>
    </div>
  );
};

export default PublicLayout;
