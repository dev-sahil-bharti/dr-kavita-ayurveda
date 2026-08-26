import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-surface-base font-sans min-h-screen">
      
      {/* Header Banner */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-white border-b border-black/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-surface-strong/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-surface-muted/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-surface-muted/10 text-surface-muted rounded-full mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-text-primary">
            Privacy Policy
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
                  <Eye className="w-5 h-5 text-surface-muted" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">1. Information We Collect</h2>
                <p className="text-text-tertiary leading-relaxed font-light">
                  At Dr. Kavita Ayurveda, we collect information that you provide directly to us when you use our services, including when you register for an account, book a consultation, or contact us. This may include your name, email address, phone number, and any medical information you choose to share for treatment purposes. We handle all medical information with the utmost confidentiality.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 bg-surface-strong/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-surface-strong" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">2. How We Use Your Information</h2>
                <p className="text-text-tertiary leading-relaxed font-light">
                  We use the information we collect to provide, maintain, and improve our services. This includes personalizing your experience, processing your bookings, and communicating with you about appointments, treatments, and other related services. Your information helps us tailor our Ayurvedic therapies specifically to your Prakriti (body constitution).
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">3. Data Security</h2>
                <p className="text-text-tertiary leading-relaxed font-light">
                  We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. All patient records and consultation details are stored securely. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-black/5 mt-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">4. Contact Us</h2>
              <p className="text-text-tertiary leading-relaxed font-light">
                If you have any questions or comments about this privacy policy, or how we handle your personal data, you may email us at <a href="mailto:info@drkavitaayurveda.com" className="text-surface-strong font-medium hover:underline">info@drkavitaayurveda.com</a>.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default PrivacyPolicy;
