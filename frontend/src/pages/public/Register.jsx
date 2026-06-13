import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, ArrowRight, Home, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', city: '', address: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setUserId(data.userId);
      setStep(2);
      toast.success('OTP sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { userId, otp });
      login(data.user, data.token);
      toast.success('Email verified! Welcome to Homents!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-sky-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Homents</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900">{step === 1 ? 'Create Account' : 'Verify Email'}</h1>
          <p className="text-slate-500 mt-2">{step === 1 ? 'Join thousands of happy customers' : `Enter the OTP sent to ${form.email}`}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-gradient-to-r from-sky-400 to-blue-600' : 'bg-sky-100'}`} />
          ))}
        </div>

        <div className="glass rounded-3xl border border-sky-200 shadow-2xl shadow-sky-100 p-8">
          {step === 1 && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input required className="input pl-11" placeholder="John Doe"
                      value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input type="email" required className="input pl-11" placeholder="you@email.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input className="input pl-11" placeholder="+94 77..."
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input className="input pl-11" placeholder="Colombo"
                      value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input type={showPass ? 'text' : 'password'} required className="input pl-11 pr-11" placeholder="Min 8 chars"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input type="password" required className="input pl-11" placeholder="Confirm"
                      value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6 text-center">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
                <Mail size={36} className="text-sky-500" />
              </div>
              <p className="text-slate-600 text-sm">Enter the 6-digit code sent to <strong>{form.email}</strong></p>
              <input
                className="input text-center text-3xl tracking-widest font-bold py-4"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle size={16} /> Verify Email</>}
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 pt-6 border-t border-sky-100 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-sky-600 font-semibold hover:text-sky-800">Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
