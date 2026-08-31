import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import doctorIllustration from '../../../assets/doctor_illustration.png';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import Button from '../../../components/common/Button';

export const PatientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginMethod, setLoginMethod] = useState('mobile');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, true);
      navigate('/patient/appointments');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-slate-50 relative overflow-hidden font-sans">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 relative border border-slate-100">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 xl:p-16 flex flex-col justify-center order-2 lg:order-1">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back!
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-500">
                Sign in to your patient portal to manage appointments.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-5">
                {/* Method Switch Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('mobile');
                      setEmail('');
                      setError('');
                    }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                      loginMethod === 'mobile'
                        ? 'bg-white shadow-sm text-emerald-700'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Mobile Number
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('email');
                      setEmail('');
                      setError('');
                    }}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                      loginMethod === 'email'
                        ? 'bg-white shadow-sm text-emerald-700'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Email Address
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    {loginMethod === 'email' ? 'Email Address' : 'Mobile Number'}
                  </label>

                  {loginMethod === 'email' ? (
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none bg-slate-50 focus:bg-white"
                    />
                  ) : (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                        className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none bg-slate-50 focus:bg-white"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3.5 pr-12 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none bg-slate-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                  />
                  <span className="ml-2 text-sm text-slate-600 font-medium">
                    Remember Me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Sign In
              </Button>

              <div className="mt-8 text-center text-sm font-medium text-slate-600">
                Not Registered Yet?{' '}
                <Link
                  to="/patient/register"
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Brand Illustration */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 p-8 sm:p-12 flex-col items-center justify-center relative overflow-hidden order-1 lg:order-2">
          <img
            src={doctorIllustration}
            alt="Doctor Illustration"
            className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
          />

          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>

          <div className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold shadow-lg">
                ✓
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Verified Doctors</p>
                <p className="text-emerald-100 text-xs">Authentic Ayurvedic Care</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userType="patient"
      />
    </div>
  );
};

export default PatientLogin;
