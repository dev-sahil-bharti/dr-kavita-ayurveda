import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-surface-muted px-8 py-10 text-white relative">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <h1 className="text-3xl font-bold mb-2 relative z-10">Privacy Policy</h1>
          <p className="text-white/80 relative z-10">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="p-8 prose prose-slate max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed">
              At Dr. Kavita Ayurveda, we collect information that you provide directly to us when you use our services, including when you register for an account, book a consultation, or contact us. This may include your name, email address, phone number, and any medical information you choose to share for treatment purposes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services. This includes personalizing your experience, processing your bookings, and communicating with you about appointments, treatments, and other related services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions or comments about this privacy policy, you may email us at <a href="mailto:drkavita@gmail.com" className="text-surface-strong hover:underline">drkavita@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
