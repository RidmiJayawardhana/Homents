import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, ArrowRight, Home, CheckCircle, Briefcase, DollarSign, FileText } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = ['Electrician','Plumber','Tutor','Cleaner','Mechanic','Carpenter','Painter','Technician','AC Repair','Garden Worker'];

const RegisterProvider = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    nic: '', category: '', skills: '', experience: '', hourlyRate: '',
    address: '', city: '', bio: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register-provider', form);
      setUserId(data.userId);
      setStep(3);
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
      await api.post('/auth/verify-otp', { userId, otp });
      toast.success('Email verified! Your profile is under review.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Homents</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900">
            {step === 3 ? 'Verify Email' : 'Become a Provider'}
          </h1>
          <p className="text-slate-500 mt-2">
            {step === 3 ? `Check ${form.email} for your OTP` : 'Join our network of trusted professionals'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className={`flex-1 h-2 rounded-full transition-all duration-500 ${s <= step ? 'bg-gradient-to-r from-sky-400 to-blue-600' : 'bg-sky-100'}`} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 -mt-6 mb-6 px-1">
          <span>Personal Info</span>
          <span>Professional</span>
          <span>Verify</span>
        </div>

        <div className="glass rounded-3xl border border-sky-200 shadow-2xl shadow-sky-100 p-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><User size={20} className="text-sky-500" /> Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input required className="input pl-11" placeholder="Your full name" value={form.fullName} onChange={set('fullName')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input type="email" required className="input pl-11" placeholder="you@email.com" value={form.email} onChange={set('email')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input required className="input pl-11" placeholder="+94 77..." value={form.phone} onChange={set('phone')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">NIC Number *</label>
                  <div className="relative">
                    <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input required className="input pl-11" placeholder="NIC number" value={form.nic} onChange={set('nic')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input required className="input pl-11" placeholder="Colombo" value={form.city} onChange={set('city')} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input type={showPass ? 'text' : 'password'} required className="input pl-11 pr-11" placeholder="Min 8 chars" value={form.password} onChange={set('password')} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input type="password" required className="input pl-11" placeholder="Confirm" value={form.confirmPassword} onChange={set('confirmPassword')} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input className="input" placeholder="Your full address" value={form.address} onChange={set('address')} />
                </div>
              </div>
              <button onClick={() => {
                if (!form.fullName || !form.email || !form.phone || !form.nic || !form.password) return toast.error('Fill all required fields');
                if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
                setStep(2);
              }} className="btn-primary w-full mt-6 py-3.5 flex items-center justify-center gap-2">
                Next Step <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleRegister}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Briefcase size={20} className="text-sky-500" /> Professional Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Service Category *</label>
                  <select required className="input bg-white" value={form.category} onChange={set('category')}>
                    <option value="">Select your category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Experience (years) *</label>
                  <input type="number" required min="0" className="input" placeholder="5" value={form.experience} onChange={set('experience')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hourly Rate (LKR)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input type="number" min="0" className="input pl-11" placeholder="1500" value={form.hourlyRate} onChange={set('hourlyRate')} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skills & Expertise</label>
                  <textarea className="input min-h-[80px] resize-none" placeholder="Describe your skills..." value={form.skills} onChange={set('skills')} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio / About You</label>
                  <textarea className="input min-h-[80px] resize-none" placeholder="Tell customers about yourself..." value={form.bio} onChange={set('bio')} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 py-3.5">← Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Submit Application <ArrowRight size={16} /></>}
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleVerifyOTP} className="space-y-6 text-center">
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto">
                <Mail size={36} className="text-sky-500" />
              </div>
              <p className="text-slate-600 text-sm">Enter the 6-digit code sent to <strong>{form.email}</strong></p>
              <input
                className="input text-center text-3xl tracking-widest font-bold py-4"
                placeholder="000000" maxLength={6} value={otp}
                onChange={e => setOtp(e.target.value)} required
              />
              <div className="bg-sky-50 rounded-2xl p-4 text-sm text-sky-700">
                <strong>Note:</strong> After verification, your profile will be reviewed by admin before going live. You'll receive a notification once approved.
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle size={16} /> Verify & Submit</>}
              </button>
            </motion.form>
          )}

          {step < 3 && (
            <p className="text-center text-sm text-slate-500 mt-4">
              Already have an account? <Link to="/login" className="text-sky-600 font-semibold">Login</Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterProvider;
