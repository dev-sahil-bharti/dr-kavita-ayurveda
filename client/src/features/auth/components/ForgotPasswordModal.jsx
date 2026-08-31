import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../../../utils/constants';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

export const ForgotPasswordModal = ({ isOpen, onClose, userType = 'patient' }) => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const resetState = () => {
    setStep(1);
    setContact('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(userType, contact);
      setSuccess(res.message || 'OTP sent successfully!');
      setTimeout(() => {
        setSuccess('');
        setStep(2);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await authService.resetPassword(userType, {
        contact,
        otp,
        newPassword,
      });
      setSuccess(res.message || 'Password reset successfully! Logging you in...');

      if (res.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
        localStorage.setItem(STORAGE_KEYS.ROLE, userType);

        setTimeout(() => {
          handleClose();
          navigate(userType === 'admin' ? '/admin/dashboard' : '/patient/appointments');
        }, 1500);
      } else {
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? 'Forgot Password' : 'Reset Password'}
      maxWidth="max-w-md"
    >
      {error && (
        <div className="mb-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-3 text-sm font-medium flex items-center gap-2 rounded-r shadow-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-3 text-sm font-medium flex items-center gap-2 rounded-r shadow-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-6">
          <p className="text-sm text-slate-500">
            Enter your registered email address or mobile number. We will send you an OTP to reset your password.
          </p>

          <Input
            label="Email or Mobile Number"
            type="text"
            required
            icon={Mail}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="example@gmail.com or 9876543210"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
            icon={ArrowRight}
            iconPosition="right"
          >
            Send OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <p className="text-sm text-slate-500">
            OTP sent to <span className="font-semibold text-slate-800">{contact}</span>. Valid for 10 minutes.
          </p>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              6-Digit OTP
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg tracking-[0.5em] font-mono transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="------"
            />
          </div>

          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            icon={Lock}
            rightIcon={showPassword ? EyeOff : Eye}
            onRightIconClick={() => setShowPassword(!showPassword)}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Reset Password
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Back to OTP Request
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
