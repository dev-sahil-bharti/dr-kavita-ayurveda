import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-surface-base min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-surface-base rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="bg-surface-muted px-8 py-10 text-white relative">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <h1 className="text-3xl font-bold mb-2 relative z-10">Terms of Service</h1>
          <p className="text-white/80 relative z-10">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="p-8 prose prose-slate max-w-none text-text-tertiary space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing our website and using our services at Dr. Kavita Ayurveda, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">2. Medical Disclaimer</h2>
            <p className="leading-relaxed">
              The information provided on this website and our services is for general informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">3. Appointments and Cancellations</h2>
            <p className="leading-relaxed">
              We require at least 24 hours' notice for the cancellation of scheduled appointments. Failure to provide sufficient notice may result in a cancellation fee.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">4. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
