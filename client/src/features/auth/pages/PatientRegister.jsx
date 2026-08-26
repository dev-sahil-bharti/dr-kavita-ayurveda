import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api';
import doctorIllustration from '../../../assets/doctor_illustration.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    gender: 'select-gender', // default
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
  const { registerPatient } = useAuth();

  const handleSendOtp = async () => {
    if (!formData.mobile) {
      setError('Please enter a mobile number first.');
      return;
    }
    setOtpLoading(true);
    setError('');
    try {
      await api.post('/otp/send', { mobile: formData.mobile });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
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
      await api.post('/otp/verify', { mobile: formData.mobile, otp: otpCode });
      setOtpVerified(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
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
      navigate('/patient');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-slate-50 relative overflow-hidden font-sans">
      {/* Modern Dotted pattern background */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{ backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '32px 32px' }}
      ></div>

      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 relative">

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 xl:p-16 flex flex-col justify-center order-2 lg:order-1">
          <div className="w-full max-w-md mx-auto space-y-6">
            <div>
              {/* <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Create Account</h2> */}
              <p className="mt-2 text-sm sm:text-base text-slate-500">Join Dr. Kavita Ayurveda today.</p>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 sm:py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-medium">
                          +91
                        </span>
                        <input
                          type="text"
                          name="mobile"
                          required
                          maxLength={10}
                          placeholder="0000000000"
                          value={formData.mobile}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            handleChange({ target: { name: 'mobile', value: val } });
                          }}
                          disabled={otpVerified || otpSent}
                          className="block w-full pl-10 pr-4 py-3 sm:py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                      </div>
                      {!otpVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpLoading || !formData.mobile}
                          className="whitespace-nowrap px-4 py-3 sm:py-3.5 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {otpSent ? 'Resend' : 'Get OTP'}
                        </button>
                      )}
                    </div>

                    {otpSent && !otpVerified && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="block w-full px-4 py-3 sm:py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={otpLoading || !otpCode}
                          className="whitespace-nowrap px-4 py-3 sm:py-3.5 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          Verify
                        </button>
                      </div>
                    )}
                    {otpVerified && (
                      <p className="mt-1.5 text-xs text-emerald-600 font-semibold flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Mobile number verified
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 sm:py-3.5 border border-slate-200 rounded-xl text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="select-gender">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 sm:py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 sm:py-3.5 pr-12 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-teal-600 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !otpVerified}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-teal-500/20 text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>

              <div className="mt-6 text-center text-sm font-medium text-slate-600">
                Already Registered?{' '}
                <Link to="/patient/login" className="text-teal-600 font-bold hover:text-teal-500 transition-colors">
                  Sign In instead
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Modern Responsive Illustration */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 p-8 sm:p-12 flex-col items-center justify-center relative overflow-hidden order-1 lg:order-2 lg:min-h-full">
          <div className="text-center mb-6 relative z-10 lg:hidden">
            <h2 className="text-3xl font-bold text-white mb-2">Join Us</h2>
          </div>

          <img
            src={doctorIllustration}
            alt="Doctor Illustration"
            className="relative z-10 w-40 sm:w-56 lg:w-full lg:max-w-md object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
          />

          {/* Modern Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-300 opacity-30 rounded-full blur-3xl mix-blend-multiply"></div>

          {/* Glassmorphism card overlay element (optional flair) */}
          <div className="absolute hidden lg:block top-12 left-12 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-400 flex items-center justify-center text-white font-bold shadow-lg">10k+</div>
              <div>
                <p className="text-white font-semibold text-sm">Happy Patients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
