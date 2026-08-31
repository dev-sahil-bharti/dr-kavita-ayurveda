import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import logo from '../../../assets/logo.png';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import Button from '../../../components/common/Button';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, false);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute top-[20%] -right-[10%] w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-800 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <img
              src={logo}
              alt="Dr. Kavita Ayurveda Logo"
              className="relative h-20 w-auto rounded-full bg-white p-2 shadow-xl ring-1 ring-black/5 object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-800 tracking-tight">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          Sign in to manage Dr. Kavita Ayurveda Clinic
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white/80 backdrop-blur-xl py-10 px-6 shadow-xl sm:rounded-3xl sm:px-10 border border-white/60">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 px-4 py-3 rounded-r-lg text-sm font-medium flex items-center gap-3 shadow-sm">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                Email address
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-slate-400"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span />
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full shadow-lg shadow-emerald-700/20"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign in to Dashboard
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          Secure admin access portal &copy; {new Date().getFullYear()} Dr. Kavita Ayurveda
        </p>
      </div>

      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userType="admin"
      />
    </div>
  );
};

export default AdminLogin;
