import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, DollarSign, Star, Heart, CheckCircle,
  Calendar, ArrowLeft, Briefcase, MessageCircle, Award,
  Zap, Droplets, BookOpen, Wind, Car, Hammer, Brush, AirVent, Monitor, Leaf
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { StarRating, StatusBadge, Modal, LoadingSpinner, categoryConfig } from '../../components/common/index.jsx';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProviderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [booking, setBooking] = useState({ service:'', description:'', scheduledDate:'', scheduledTime:'', address:'', amount:'' });

  useEffect(() => { fetchProvider(); }, [id]);

  const fetchProvider = async () => {
    try {
      const { data } = await api.get(`/providers/${id}`);
      setProvider(data.provider);
      setReviews(data.reviews);
    } catch { toast.error('Provider not found'); navigate('/providers'); }
    finally { setLoading(false); }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please sign in to book a service');
    if (user.role !== 'customer') return toast.error('Only customers can book services');
    setBookingLoading(true);
    try {
      await api.post('/bookings', { ...booking, providerId: id, amount: Number(booking.amount) });
      toast.success('Booking request sent! The provider will respond shortly.');
      setBookingModal(false);
      setBooking({ service:'', description:'', scheduledDate:'', scheduledTime:'', address:'', amount:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
    finally { setBookingLoading(false); }
  };

  const handleFavorite = async () => {
    if (!user) return toast.error('Please sign in first');
    try {
      await api.put(`/users/favorites/${id}`);
      setIsFav(!isFav);
      toast.success(isFav ? 'Removed from favourites' : 'Saved to favourites');
    } catch {}
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <LoadingSpinner size="lg" text="Loading provider profile…" />
    </div>
  );
  if (!provider) return null;

  const meta = categoryConfig[provider.category] || { color:'from-sky-400 to-blue-500', bg:'bg-sky-50', text:'text-sky-700', Icon: Briefcase };
  const { Icon: CatIcon } = meta;

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <Link to="/providers" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-700 mb-6 text-sm font-medium transition-colors">
            <ArrowLeft size={15} /> Back to Providers
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Left: profile ─────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Header card */}
              <div className="bg-white rounded-3xl border border-sky-100 overflow-hidden shadow-sm">
                {/* Banner */}
                <div className={`h-36 bg-gradient-to-r ${meta.color} relative overflow-hidden`}>
                  {provider.profilePhoto ? (
                    <img src={provider.profilePhoto} alt="" className="w-full h-full object-cover opacity-20" />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-end pr-8 opacity-15">
                    <CatIcon size={80} className="text-white" />
                  </div>
                </div>

                <div className="px-7 pb-7">
                  {/* Avatar row */}
                  <div className="flex flex-col sm:flex-row gap-4 -mt-10 mb-4">
                    <div className={`w-20 h-20 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br ${meta.color} flex items-center justify-center flex-shrink-0`}>
                      {provider.profilePhoto
                        ? <img src={provider.profilePhoto} alt={provider.fullName} className="w-full h-full object-cover" />
                        : <CatIcon size={32} className="text-white" />}
                    </div>

                    <div className="flex-1 pt-10 sm:pt-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-black text-slate-900">{provider.fullName}</h1>
                        <p className="text-sky-600 font-semibold">{provider.category}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {provider.isAvailable && (
                          <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available Now
                          </span>
                        )}
                        {provider.isApproved && (
                          <span className="bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                            <CheckCircle size={11} /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick stats row */}
                  <div className="flex flex-wrap gap-5 mb-5">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={provider.rating} reviews={provider.totalReviews} />
                    </div>
                    {provider.city && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin size={13} className="text-sky-400" /> {provider.city}
                      </div>
                    )}
                    {provider.experience > 0 && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Briefcase size={13} className="text-sky-400" /> {provider.experience} yrs experience
                      </div>
                    )}
                    {provider.hourlyRate > 0 && (
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <DollarSign size={13} className="text-sky-400" /> LKR {provider.hourlyRate}/hr
                      </div>
                    )}
                  </div>

                  {provider.bio && (
                    <p className="text-slate-600 leading-relaxed text-sm">{provider.bio}</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              {provider.skills && (
                <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                    <CheckCircle size={18} className="text-sky-500" /> Skills & Expertise
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{provider.skills}</p>
                </div>
              )}

              {/* Performance cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label:'Completed Jobs', value: provider.completedJobs||0, Icon: CheckCircle, cl:'text-emerald-500', bg:'bg-emerald-50' },
                  { label:'Total Reviews',  value: provider.totalReviews||0,  Icon: Star,         cl:'text-amber-500',  bg:'bg-amber-50'   },
                  { label:'Total Earnings', value: `LKR ${(provider.totalEarnings||0).toLocaleString()}`, Icon: DollarSign, cl:'text-sky-500', bg:'bg-sky-50' },
                ].map((s,i) => (
                  <div key={i} className="bg-white rounded-2xl border border-sky-100 p-4 text-center shadow-sm">
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                      <s.Icon size={17} className={s.cl} />
                    </div>
                    <div className="font-black text-slate-900">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 mb-5">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <div className="text-center py-10">
                    <Star size={36} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No reviews yet — be the first to rate this provider!</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {reviews.map(r => (
                      <div key={r._id} className="border-b border-sky-50 pb-5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {r.customer?.fullName?.[0] || 'C'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800 text-sm">{r.customer?.fullName || 'Customer'}</p>
                            <StarRating rating={r.rating} size={11} showNumber={false} />
                          </div>
                          <span className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</span>
                        </div>
                        {r.comment && <p className="text-slate-600 text-sm leading-relaxed pl-12">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: booking sidebar ─────────────────────── */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm sticky top-28">
                <h3 className="font-bold text-lg text-slate-800 mb-2">Book This Provider</h3>

                {provider.hourlyRate > 0 && (
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-black bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                      LKR {provider.hourlyRate}
                    </span>
                    <span className="text-slate-400 text-sm">/hr</span>
                  </div>
                )}

                <div className="space-y-2.5 mb-5 text-sm">
                  {[
                    ['Category',   provider.category],
                    ['Location',   provider.city || 'N/A'],
                    ['Experience', `${provider.experience||0} years`],
                    ['Status',     provider.isAvailable ? 'Available Now' : 'Currently Busy'],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between border-b border-sky-50 pb-2.5">
                      <span className="text-slate-400">{k}</span>
                      <span className={`font-semibold ${k==='Status' && provider.isAvailable ? 'text-emerald-600' : k==='Status' ? 'text-slate-500' : 'text-slate-700'}`}>{v}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => provider.isAvailable ? setBookingModal(true) : toast.error('Provider is currently unavailable')}
                  className={`w-full btn-primary py-3.5 mb-3 flex items-center justify-center gap-2 ${!provider.isAvailable && 'opacity-50 cursor-not-allowed'}`}
                >
                  <Calendar size={16} /> Book Now
                </button>

                <button onClick={handleFavorite}
                  className="w-full btn-outline py-3 flex items-center justify-center gap-2">
                  <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                  {isFav ? 'Saved' : 'Save Provider'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal isOpen={bookingModal} onClose={() => setBookingModal(false)} title="Book a Service">
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Service Required *</label>
            <input required className="input" placeholder="e.g. Fix electrical wiring in kitchen"
              value={booking.service} onChange={e=>setBooking({...booking,service:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea className="input min-h-[80px] resize-none" placeholder="Describe your problem in detail…"
              value={booking.description} onChange={e=>setBooking({...booking,description:e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date *</label>
              <input type="date" required className="input" min={new Date().toISOString().split('T')[0]}
                value={booking.scheduledDate} onChange={e=>setBooking({...booking,scheduledDate:e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Time *</label>
              <input type="time" required className="input"
                value={booking.scheduledTime} onChange={e=>setBooking({...booking,scheduledTime:e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Address *</label>
            <input required className="input" placeholder="Full address for the service"
              value={booking.address} onChange={e=>setBooking({...booking,address:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Agreed Amount (LKR)</label>
            <input type="number" className="input" placeholder={provider.hourlyRate ? `Suggested: ${provider.hourlyRate}` : '0'}
              value={booking.amount} onChange={e=>setBooking({...booking,amount:e.target.value})} />
          </div>
          <button type="submit" disabled={bookingLoading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
            {bookingLoading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Calendar size={16} /> Confirm Booking</>}
          </button>
        </form>
      </Modal>

      <Footer />
    </div>
  );
}
