import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [otp, setOtp] = useState('');
  const [mustChange, setMustChange] = useState(false);
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/admin/auth/login', form);
      if (data.requireOTP) {
        setAdminId(data.adminId);
        setMustChange(data.mustChangePassword);
        setOtpMode(true);
        toast.success('OTP sent to your email');
      } else {
        adminLogin(data.admin, data.token);
        toast.success('Admin login successful');
        if (data.mustChangePassword) navigate('/admin/change-password');
        else navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/admin/auth/verify-2fa', { adminId, otp });
      adminLogin(data.admin, data.token);
      toast.success('Welcome back, Admin!');
      if (data.mustChangePassword) navigate('/admin/change-password');
      else navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Homents</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-12 h-12 bg-sky-500/20 border border-sky-500/30 rounded-2xl flex items-center justify-center">
              <Shield size={24} className="text-sky-400" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white">{otpMode ? 'Two-Factor Auth' : 'Admin Portal'}</h1>
          <p className="text-sky-400 mt-2">{otpMode ? 'Enter the OTP sent to your email' : 'Secure administrative access'}</p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8">
          {!otpMode ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-sky-200 mb-2">Username or Email</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                  <input required className="w-full px-4 py-3 pl-11 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder="ridmi_p" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-sky-200 mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                  <input type={showPass ? 'text' : 'password'} required
                    className="w-full px-4 py-3 pl-11 pr-11 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-sky-400">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3.5 rounded-2xl hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Admin Login <ArrowRight size={16} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6 text-center">
              <div className="w-16 h-16 bg-sky-500/20 rounded-full flex items-center justify-center mx-auto">
                <Shield size={28} className="text-sky-400" />
              </div>
              <p className="text-sky-200 text-sm">2FA verification required for your security</p>
              <input
                className="w-full text-center text-3xl tracking-widest font-bold py-4 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="000000" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required
              />
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3.5 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Shield size={16} /> Verify & Login</>}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link to="/" className="text-sky-400 text-sm hover:text-sky-300 transition-colors">← Back to Homents</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
