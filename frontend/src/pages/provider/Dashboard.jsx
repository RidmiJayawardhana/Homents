import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, DollarSign, User, LogOut, Home,
  CheckCircle, XCircle, Clock, ToggleLeft, ToggleRight,
  TrendingUp, Star, ChevronRight, Settings, Package, MapPin,
  ArrowRight, Briefcase, Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { StatusBadge, EmptyState, LoadingSpinner, StarRating } from '../../components/common/index.jsx';
import toast from 'react-hot-toast';

const BANNER = 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&h=300&fit=crop';

export default function ProviderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [dash, setDash] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => { loadDash(); loadBookings(); }, []);

  const loadDash = async () => {
    try {
      const { data } = await api.get('/providers/dashboard');
      setDash(data);
      setProfileForm({
        fullName: data.provider?.fullName||'', phone: data.provider?.phone||'',
        city: data.provider?.city||'', skills: data.provider?.skills||'',
        experience: data.provider?.experience||0, hourlyRate: data.provider?.hourlyRate||0,
        bio: data.provider?.bio||'', address: data.provider?.address||''
      });
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };
  const loadBookings = async () => {
    try { const { data } = await api.get('/bookings/provider'); setBookings(data.bookings); } catch {}
  };

  const toggleAvail = async () => {
    try {
      const newVal = !dash.provider.isAvailable;
      await api.put('/providers/availability', { isAvailable: newVal });
      setDash(prev => ({ ...prev, provider: { ...prev.provider, isAvailable: newVal } }));
      toast.success(newVal ? 'You are now available' : 'You are now unavailable');
    } catch { toast.error('Update failed'); }
  };

  const handleBookingAction = async (id, status) => {
    try { await api.put(`/bookings/${id}/status`, { status }); toast.success(`Booking ${status}`); loadBookings(); loadDash(); }
    catch { toast.error('Action failed'); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try { const { data } = await api.put('/providers/profile', profileForm); setDash(p=>({...p,provider:data.provider})); toast.success('Profile updated'); }
    catch { toast.error('Update failed'); }
  };

  const sidebarItems = [
    { id:'overview',  icon: LayoutDashboard, label:'Dashboard'       },
    { id:'bookings',  icon: Calendar,        label:'Bookings'         },
    { id:'earnings',  icon: DollarSign,      label:'Earnings'         },
    { id:'profile',   icon: User,            label:'My Profile'       },
    { id:'settings',  icon: Settings,        label:'Settings'         },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <LoadingSpinner size="lg" text="Loading your dashboard..." />
    </div>
  );

  const p = dash?.provider;
  const s = dash?.stats || {};

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 fixed h-full z-40 flex flex-col shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Home size={15} className="text-white" />
            </div>
            <span className="font-black text-lg bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Homents</span>
          </Link>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-2xl mb-3">
            {p?.profilePhoto
              ? <img src={p.profilePhoto} alt={p.fullName} className="w-10 h-10 rounded-xl object-cover" />
              : <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                  {p?.fullName?.[0]}
                </div>}
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">{p?.fullName}</p>
              <p className="text-xs text-sky-600 font-medium">{p?.category}</p>
            </div>
          </div>
          {/* availability toggle */}
          <button onClick={toggleAvail}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-sm font-semibold ${p?.isAvailable?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${p?.isAvailable?'bg-emerald-500 animate-pulse':'bg-slate-400'}`} />
              {p?.isAvailable ? 'Available' : 'Unavailable'}
            </span>
            {p?.isAvailable ? <ToggleRight size={20} className="text-emerald-500" /> : <ToggleLeft size={20} className="text-slate-400" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`sidebar-item w-full ${tab===item.id?'active':''}`}>
              <item.icon size={17} />{item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button onClick={() => { logout(); navigate('/'); }} className="sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600 flex">
            <LogOut size={17} />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-8">

        {/* OVERVIEW */}
        {tab==='overview' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            {/* banner */}
            <div className="relative rounded-3xl overflow-hidden mb-8 h-40">
              <img src={BANNER} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-sky-700/90 to-blue-800/80 flex items-center px-8">
                <div>
                  <h1 className="text-2xl font-black text-white">Provider Dashboard</h1>
                  <p className="text-sky-200 mt-1">Manage your bookings and grow your business</p>
                </div>
                {p && !p.isApproved && (
                  <div className="ml-auto bg-amber-500/20 border border-amber-400/30 rounded-xl px-4 py-2 backdrop-blur">
                    <p className="text-amber-300 text-xs font-semibold">Pending Admin Approval</p>
                  </div>
                )}
              </div>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                { icon: Calendar,    label:'Total Bookings',  value: s.totalBookings||0,    color:'from-sky-400 to-blue-500'     },
                { icon: Clock,       label:'Pending',          value: s.pendingBookings||0,  color:'from-amber-400 to-orange-500' },
                { icon: CheckCircle, label:'Completed',        value: s.completedBookings||0,color:'from-emerald-400 to-teal-500' },
                { icon: DollarSign,  label:'Total Earnings',  value:`LKR ${(s.totalEarnings||0).toLocaleString()}`,color:'from-purple-400 to-pink-500'},
              ].map((stat,i) => (
                <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-11 h-11 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                    <stat.icon size={19} className="text-white" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* panels */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* rating + performance */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Your Performance</h3>
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="text-5xl font-black bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">{Number(s.rating||0).toFixed(1)}</div>
                  <div>
                    <StarRating rating={s.rating||0} size={18} />
                    <p className="text-slate-400 text-xs mt-1">{s.totalReviews||0} total reviews</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label:'Jobs Done',    value: p?.completedJobs||0 },
                    { label:'Avg Rating',   value: Number(s.rating||0).toFixed(1) },
                  ].map((m,i)=>(
                    <div key={i} className="bg-sky-50 rounded-xl p-3 text-center">
                      <div className="font-black text-xl text-sky-700">{m.value}</div>
                      <div className="text-xs text-sky-500">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* recent bookings */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Recent Bookings</h3>
                  <button onClick={()=>setTab('bookings')} className="text-xs text-sky-600 font-semibold flex items-center gap-1">View all <ChevronRight size={12}/></button>
                </div>
                {dash?.recentBookings?.length === 0 ? (
                  <div className="text-center py-8"><Package size={36} className="text-slate-300 mx-auto mb-2" /><p className="text-slate-400 text-sm">No bookings yet</p></div>
                ) : (
                  <div className="space-y-3">
                    {dash?.recentBookings?.map(b=>(
                      <div key={b._id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 font-bold text-xs">
                            {b.customer?.fullName?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{b.customer?.fullName}</p>
                            <p className="text-xs text-slate-400">{b.service}</p>
                          </div>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* BOOKINGS */}
        {tab==='bookings' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Booking Requests</h2>
            {bookings.length === 0 ? (
              <EmptyState title="No bookings yet" description="Booking requests will appear here once customers find and book your services." />
            ) : (
              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                          {b.customer?.fullName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{b.customer?.fullName}</p>
                          <p className="text-sky-600 font-semibold text-sm">{b.service}</p>
                          <div className="flex flex-wrap gap-3 mt-1.5">
                            <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10}/>{new Date(b.scheduledDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} at {b.scheduledTime}</span>
                            {b.address && <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10}/>{b.address}</span>}
                          </div>
                          {b.description && <p className="text-slate-500 text-xs mt-1.5 max-w-md">{b.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                        {b.amount > 0 && <span className="text-sm font-bold text-slate-700">LKR {b.amount.toLocaleString()}</span>}
                        <StatusBadge status={b.status} />
                        {b.status==='pending' && (
                          <>
                            <button onClick={()=>handleBookingAction(b._id,'accepted')} className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-all">
                              <CheckCircle size={12}/> Accept
                            </button>
                            <button onClick={()=>handleBookingAction(b._id,'rejected')} className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-xl transition-all">
                              <XCircle size={12}/> Reject
                            </button>
                          </>
                        )}
                        {b.status==='accepted' && (
                          <button onClick={()=>handleBookingAction(b._id,'completed')} className="flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-100 hover:bg-sky-200 px-3 py-1.5 rounded-xl transition-all">
                            <CheckCircle size={12}/> Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* EARNINGS */}
        {tab==='earnings' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Earnings Overview</h2>
            <div className="grid grid-cols-3 gap-5 mb-8">
              {[
                { label:'Total Earnings',    value:`LKR ${(s.totalEarnings||0).toLocaleString()}`, color:'from-sky-500 to-blue-600'     },
                { label:'Jobs Completed',    value: p?.completedJobs||0,                           color:'from-emerald-500 to-teal-600' },
                { label:'Average per Job',   value: p?.completedJobs>0 ? `LKR ${Math.round((s.totalEarnings||0)/p.completedJobs).toLocaleString()}` : 'N/A', color:'from-purple-500 to-pink-600' },
              ].map((c,i) => (
                <div key={i} className={`bg-gradient-to-r ${c.color} rounded-2xl p-6 text-white shadow-lg`}>
                  <div className="text-sm text-white/80 mb-1">{c.label}</div>
                  <div className="text-2xl font-black">{c.value}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Completed Jobs</h3>
              {bookings.filter(b=>b.status==='completed').length === 0 ? (
                <EmptyState title="No completed bookings" description="Earnings will show here after you complete jobs." />
              ) : (
                <div className="space-y-3">
                  {bookings.filter(b=>b.status==='completed').map(b => (
                    <div key={b._id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{b.service}</p>
                        <p className="text-slate-400 text-xs">{b.customer?.fullName} &bull; {new Date(b.scheduledDate).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">LKR {(b.amount||0).toLocaleString()}</p>
                        <StatusBadge status="completed" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PROFILE */}
        {tab==='profile' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="max-w-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">My Provider Profile</h2>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              {p?.profilePhoto && (
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <img src={p.profilePhoto} alt={p.fullName} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                  <div>
                    <p className="font-bold text-slate-900 text-lg">{p.fullName}</p>
                    <p className="text-sky-600 font-medium">{p.category}</p>
                    <StarRating rating={p.rating} reviews={p.totalReviews} size={13} />
                  </div>
                </div>
              )}
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label><input className="input" value={profileForm.fullName||''} onChange={e=>setProfileForm({...profileForm,fullName:e.target.value})} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label><input className="input" value={profileForm.phone||''} onChange={e=>setProfileForm({...profileForm,phone:e.target.value})} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-2">City</label><input className="input" value={profileForm.city||''} onChange={e=>setProfileForm({...profileForm,city:e.target.value})} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-2">Experience (yrs)</label><input type="number" className="input" value={profileForm.experience||''} onChange={e=>setProfileForm({...profileForm,experience:e.target.value})} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-2">Hourly Rate (LKR)</label><input type="number" className="input" value={profileForm.hourlyRate||''} onChange={e=>setProfileForm({...profileForm,hourlyRate:e.target.value})} /></div>
                  <div className="col-span-2"><label className="block text-sm font-semibold text-slate-700 mb-2">Skills</label><textarea className="input min-h-[80px] resize-none" value={profileForm.skills||''} onChange={e=>setProfileForm({...profileForm,skills:e.target.value})} /></div>
                  <div className="col-span-2"><label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label><textarea className="input min-h-[80px] resize-none" value={profileForm.bio||''} onChange={e=>setProfileForm({...profileForm,bio:e.target.value})} /></div>
                </div>
                <button type="submit" className="btn-primary py-3">Save Changes</button>
              </form>
            </div>
          </motion.div>
        )}

        {/* SETTINGS */}
        {tab==='settings' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="max-w-lg">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Settings</h2>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              {[
                { label:'Account Status', value: p?.isApproved ? 'Approved' : 'Pending Approval', color: p?.isApproved ? 'text-emerald-600' : 'text-amber-600' },
                { label:'Availability',   value: p?.isAvailable ? 'Available' : 'Unavailable',     color: p?.isAvailable ? 'text-emerald-600' : 'text-slate-500' },
                { label:'Category',       value: p?.category||'-',   color:'text-sky-700' },
                { label:'Email',          value: user?.email||'-',   color:'text-slate-600' },
              ].map((item,i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500 font-medium">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
              <button onClick={toggleAvail} className="btn-outline w-full py-3 mt-2">
                Toggle Availability
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
