import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import doctorIllustration from '../../assets/doctor_illustration.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password, true);
      navigate('/patient');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
      
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 relative">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 xl:p-16 flex flex-col justify-center order-2 lg:order-1">
          <div className="w-full max-w-md mx-auto space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Welcome Back!</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-500">Sign in to your patient portal to continue.</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {error}
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3.5 pr-12 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
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

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4.5 w-4.5 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer accent-teal-600 transition-colors" 
                  />
                  <label htmlFor="remember-me" className="ml-2.5 block text-sm text-slate-600 cursor-pointer font-medium hover:text-slate-900 transition-colors">
                    Remember Me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                    Forgot Password?
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-teal-500/20 text-base font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Logging in...' : 'Sign In'}
                </button>
              </div>
              
              <div className="mt-8 text-center text-sm font-medium text-slate-600">
                Not Registered Yet?{' '}
                <Link to="/patient/register" className="text-teal-600 font-bold hover:text-teal-500 transition-colors">
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right Side - Modern Responsive Illustration */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden order-1 lg:order-2 min-h-[300px] lg:min-h-full">
           <div className="text-center mb-8 relative z-10 lg:hidden">
              <h2 className="text-3xl font-bold text-white mb-2">Patient Portal</h2>
              <p className="text-teal-50">Manage your appointments easily</p>
           </div>
           
           <img 
              src={doctorIllustration} 
              alt="Doctor Illustration" 
              className="relative z-10 w-48 sm:w-64 lg:w-full lg:max-w-md object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105" 
           />
           
           {/* Modern Decorative elements */}
           <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>
           <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-teal-300 opacity-30 rounded-full blur-3xl mix-blend-multiply"></div>
           
           {/* Glassmorphism card overlay element (optional flair) */}
           <div className="absolute hidden lg:block bottom-12 right-12 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl z-20">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold shadow-lg">✓</div>
                 <div>
                    <p className="text-white font-semibold text-sm">Verified Doctor</p>
                    <p className="text-teal-100 text-xs">Expert Ayurveda Care</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
