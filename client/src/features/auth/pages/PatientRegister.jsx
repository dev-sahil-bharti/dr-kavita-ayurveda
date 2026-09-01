import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Eye, EyeOff, ShieldAlert, Check } from 'lucide-react';
import { authService } from '../services/authService';
import doctorIllustration from '../../../assets/doctor_illustration.png';
import Button from '../../../components/common/Button';

export const PatientRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    gender: 'select-gender',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/patient/appointments';
  const { registerPatient } = useAuth();


  const handleSendOtp = async () => {
    if (!formData.mobile) {
      setError('Please enter a mobile number first.');
      return;
    }
    setOtpLoading(true);
    setError('');
    try {
      await authService.sendOtp(formData.mobile);
      setOtpSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setError('Please enter the OTP.');
      return;
    }
    setOtpLoading(true);
    setError('');
    try {
      await authService.verifyOtp(formData.mobile, otpCode);
      setOtpVerified(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registerPatient(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
          <div className="w-full max-w-md mx-auto space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Account
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Join Dr. Kavita Ayurveda today for personalized healthcare.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none bg-slate-50 focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-medium text-xs">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="mobile"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          handleChange({ target: { name: 'mobile', value: val } });
                        }}
                        disabled={otpVerified || otpSent}
                        className="block w-full pl-9 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none bg-slate-50 focus:bg-white text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || !formData.mobile}
                        className="whitespace-nowrap px-3 py-2 border border-transparent rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none disabled:opacity-60"
                      >
                        {otpSent ? 'Resend' : 'Get OTP'}
                      </button>
                    )}
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="6-digit OTP"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-slate-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otpLoading || !otpCode}
                        className="whitespace-nowrap px-3 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
                      >
                        Verify
                      </button>
                    </div>
                  )}

                  {otpVerified && (
                    <p className="mt-1 text-xs text-emerald-600 font-semibold flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1" /> Verified
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-sm cursor-pointer"
                  >
                    <option value="select-gender">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none bg-slate-50 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none bg-slate-50 focus:bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  disabled={isLoading || !otpVerified}
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>

              <div className="mt-4 text-center text-sm font-medium text-slate-600">
                Already Registered?{' '}
                <Link
                  to="/patient/login"
                  className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                >
                  Sign In instead
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 p-8 sm:p-12 flex-col items-center justify-center relative overflow-hidden order-1 lg:order-2">
          <img
            src={doctorIllustration}
            alt="Doctor Illustration"
            className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
          />

          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>

          <div className="absolute top-10 left-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold shadow-lg">
                10k+
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Satisfied Patients</p>
                <p className="text-emerald-100 text-xs">Holistic Healing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
