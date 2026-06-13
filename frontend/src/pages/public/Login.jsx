import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otpData, setOtpData] = useState({ userId: '', otp: '', newPassword: '', confirmPassword: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token, data.provider);
      toast.success(`Welcome back, ${data.user.fullName.split(' ')[0]}!`);
      if (data.user.role === 'customer') navigate('/customer/dashboard');
      else if (data.user.role === 'provider') navigate('/provider/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email: forgotEmail });
      setOtpData(prev => ({ ...prev, userId: data.userId }));
      setOtpMode(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (otpData.newPassword !== otpData.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { userId: otpData.userId, otp: otpData.otp, newPassword: otpData.newPassword });
      toast.success('Password reset successful! Please login.');
      setForgotMode(false);
      setOtpMode(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Homents</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900">
            {forgotMode ? (otpMode ? 'Reset Password' : 'Forgot Password') : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 mt-2">{forgotMode ? 'We\'ll help you recover your account' : 'Sign in to your account'}</p>
        </div>

        <div className="glass rounded-3xl border border-sky-200 shadow-2xl shadow-sky-100 p-8">
          {!forgotMode && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                  <input type="email" required className="input pl-11" placeholder="you@email.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                  <input type={showPass ? 'text' : 'password'} required className="input pl-11 pr-11" placeholder="Your password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button type="button" onClick={() => setForgotMode(true)} className="text-sm text-sky-600 hover:text-sky-800 font-medium">
                  Forgot Password?
                </button>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {forgotMode && !otpMode && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                  <input type="email" required className="input pl-11" placeholder="your@email.com"
                    value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
              <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center text-sm text-slate-500 hover:text-sky-700">
                ← Back to login
              </button>
            </form>
          )}

          {forgotMode && otpMode && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">OTP Code</label>
                <input className="input text-center text-2xl tracking-widest font-bold" placeholder="000000" maxLength={6}
                  value={otpData.otp} onChange={e => setOtpData({ ...otpData, otp: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <input type="password" className="input" placeholder="New password"
                  value={otpData.newPassword} onChange={e => setOtpData({ ...otpData, newPassword: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <input type="password" className="input" placeholder="Confirm password"
                  value={otpData.confirmPassword} onChange={e => setOtpData({ ...otpData, confirmPassword: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {!forgotMode && (
            <div className="mt-6 pt-6 border-t border-sky-100 text-center space-y-3">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-sky-600 font-semibold hover:text-sky-800">Sign up free</Link>
              </p>
              <p className="text-sm text-slate-500">
                Want to offer services?{' '}
                <Link to="/register-provider" className="text-sky-600 font-semibold hover:text-sky-800">Join as Provider</Link>
              </p>
              <p className="text-sm text-slate-500">
                Admin?{' '}
                <Link to="/admin/login" className="text-sky-600 font-semibold hover:text-sky-800">Admin Login</Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
