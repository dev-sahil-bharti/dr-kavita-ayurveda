import React from 'react';
import { FileSignature, AlertTriangle, CalendarX2, RefreshCw } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="bg-surface-base font-sans min-h-screen">
      
      {/* Header Banner */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-white border-b border-black/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-surface-strong/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-surface-muted/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-strong/10 text-surface-strong rounded-full mb-6">
            <FileSignature className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-text-primary">
            Terms of Service
          </h1>
          <p className="text-lg text-text-tertiary font-light">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-black/5 space-y-12">
            
            <div className="flex gap-6">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 bg-surface-muted/10 rounded-xl flex items-center justify-center">
                  <FileSignature className="w-5 h-5 text-surface-muted" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">1. Agreement to Terms</h2>
                <p className="text-text-tertiary leading-relaxed font-light">
                  By accessing our website and using our services at Dr. Kavita Ayurveda, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">2. Medical Disclaimer</h2>
                <p className="text-text-tertiary leading-relaxed font-light">
                  The information provided on this website and our services is for general informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Do not disregard professional medical advice or delay in seeking it because of something you have read on this website.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                  <CalendarX2 className="w-5 h-5 text-rose-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">3. Appointments and Cancellations</h2>
                <p className="text-text-tertiary leading-relaxed font-light">
                  We value your time and the time of our Vaidyas. We require at least 24 hours' notice for the cancellation of scheduled appointments. Failure to provide sufficient notice or a no-show may result in a cancellation fee or forfeiture of your booking deposit.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">4. Changes to Terms</h2>
                <p className="text-text-tertiary leading-relaxed font-light">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default TermsOfService;
