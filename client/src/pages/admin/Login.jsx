import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import logo from '../../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-green-50/40 to-teal-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-surface-strong/30">
      
      {/* Animated Background Elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-surface-muted/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse duration-[4000ms]"></div>
      <div className="absolute top-[20%] -right-[10%] w-[400px] h-[400px] bg-surface-strong/10 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse duration-[5000ms]" style={{ animationDelay: '1s' }}></div>
      <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] bg-emerald-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse duration-[6000ms]" style={{ animationDelay: '2s' }}></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="flex justify-center transform hover:scale-105 transition-transform duration-500 ease-out">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-surface-muted to-surface-strong rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img src={logo} alt="Dr. Kavita Ayurveda Logo" className="relative h-24 w-auto rounded-full bg-white p-2 shadow-xl ring-1 ring-black/5 object-contain" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-3xl font-extrabold text-surface-muted tracking-tight">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-text-inverse font-medium">
          Sign in to manage Dr. Kavita Ayurveda Clinic
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white/70 backdrop-blur-xl py-10 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:rounded-3xl sm:px-12 border border-white/60">
          <form className="space-y-7" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg text-sm font-medium flex items-center gap-3 shadow-sm transition-all">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="group">
              <label className="block text-sm font-semibold text-surface-muted mb-1.5 ml-1 transition-colors group-focus-within:text-surface-strong">Email address</label>
              <div className="relative rounded-2xl shadow-sm transition-all duration-300 group-focus-within:shadow-md group-focus-within:ring-2 group-focus-within:ring-surface-strong/20">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-inverse/70 group-focus-within:text-surface-strong transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white/60 border border-gray-200/80 rounded-2xl text-text-primary text-sm transition-all duration-300 focus:bg-white focus:outline-none focus:border-surface-strong placeholder-gray-400"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-surface-muted mb-1.5 ml-1 transition-colors group-focus-within:text-surface-strong">Password</label>
              <div className="relative rounded-2xl shadow-sm transition-all duration-300 group-focus-within:shadow-md group-focus-within:ring-2 group-focus-within:ring-surface-strong/20">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-inverse/70 group-focus-within:text-surface-strong transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-white/60 border border-gray-200/80 rounded-2xl text-text-primary text-sm transition-all duration-300 focus:bg-white focus:outline-none focus:border-surface-strong placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-inverse/70 hover:text-surface-muted transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="peer sr-only" 
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-surface-muted peer-checked:border-surface-muted transition-all duration-200 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <label htmlFor="remember-me" className="ml-2.5 block text-sm font-medium text-text-inverse group-hover:text-text-primary cursor-pointer transition-colors select-none">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-surface-strong hover:text-surface-muted transition-colors duration-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-2xl text-white bg-surface-muted overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-surface-muted transition-all duration-300 shadow-[0_4px_14px_0_rgba(15,60,53,0.39)] hover:shadow-[0_6px_20px_rgba(15,60,53,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                
                {isLoading ? (
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="font-semibold tracking-wide">Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10 font-semibold tracking-wide text-[15px]">
                    <span>Sign in to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Decorative footer */}
        <p className="mt-8 text-center text-xs text-text-inverse/60 font-medium">
          Secure admin access portal &copy; {new Date().getFullYear()} Dr. Kavita Ayurveda
        </p>
      </div>
    </div>
  );
};

export default Login;
