import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail } from 'lucide-react';
import logo from '../../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src={logo} alt="Dr. Kavita Ayurveda Logo" className="h-20 w-auto rounded-full bg-white p-1" />
        </div>
        <h2 className="mt-6 text-center text-4xl font-bold text-text-primary">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-lg text-text-inverse">
          Sign in to manage Dr. Kavita Ayurveda Clinic
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-3 sm:rounded-xs sm:px-10 border border-text-inverse/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xs text-lg font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-lg font-bold text-text-primary">Email address</label>
              <div className="mt-1 relative rounded-xs shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-inverse" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 px-3 py-2 border border-text-inverse rounded-xs focus:ring-surface-strong focus:border-surface-strong text-lg transition-colors focus-visible:outline-none focus-visible:shadow-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold text-text-primary">Password</label>
              <div className="mt-1 relative rounded-xs shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-inverse" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 px-3 py-2 border border-text-inverse rounded-xs focus:ring-surface-strong focus:border-surface-strong text-lg transition-colors focus-visible:outline-none focus-visible:shadow-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-surface-muted focus:ring-surface-muted border-text-inverse rounded-xs" />
                <label htmlFor="remember-me" className="ml-2 block text-lg text-text-primary">
                  Remember me
                </label>
              </div>
              <div className="text-lg">
                <a href="#" className="brand-link">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 btn-primary"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
