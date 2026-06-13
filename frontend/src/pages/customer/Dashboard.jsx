import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Heart, Bell, User, LogOut,
  Search, Clock, CheckCircle, XCircle, ChevronRight,
  Home, MapPin, Star, TrendingUp, Package, ArrowRight,
  MessageCircle, AlertTriangle, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { StatusBadge, EmptyState, LoadingSpinner, StarRating } from '../../components/common/index.jsx';
import toast from 'react-hot-toast';

const HERO_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=300&fit=crop';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ fullName:'', phone:'', city:'', address:'' });
  const [complaintForm, setComplaintForm] = useState({ subject:'', description:'' });

  useEffect(() => {
    if (user) {
      setProfileForm({ fullName: user.fullName||'', phone: user.phone||'', city: user.city||'', address: user.address||'' });
      loadAll();
    }
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [b, n] = await Promise.all([api.get('/bookings/my'), api.get('/notifications')]);
      setBookings(b.data.bookings);
      setNotifications(n.data.notifications);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (tab === 'favorites') api.get('/users/favorites').then(r => setFavorites(r.data.favorites)).catch(()=>{});
  }, [tab]);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await api.put(`/bookings/${id}/cancel`, { reason:'Cancelled by customer' }); toast.success('Booking cancelled'); loadAll(); }
    catch { toast.error('Cannot cancel this booking'); }
  };

  const markNotifRead = async (id) => {
    await api.put(`/notifications/${id}/read`).catch(()=>{});
    setNotifications(prev => prev.map(n => n._id === id ? {...n, isRead:true} : n));
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    try { await api.post('/complaints', complaintForm); toast.success('Complaint submitted. Our team will review it.'); setComplaintForm({subject:'',description:''}); }
    catch { toast.error('Failed to submit complaint'); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try { await api.put('/users/profile', profileForm); toast.success('Profile updated successfully'); }
    catch { toast.error('Update failed'); }
  };

  const stats = [
    { icon: Calendar,     label:'Total Bookings',  value: bookings.length,                                         color:'from-sky-400 to-blue-500',     bg:'bg-sky-50',    text:'text-sky-600'     },
    { icon: CheckCircle,  label:'Completed',        value: bookings.filter(b=>b.status==='completed').length,       color:'from-emerald-400 to-teal-500', bg:'bg-emerald-50',text:'text-emerald-600' },
    { icon: Clock,        label:'Upcoming',          value: bookings.filter(b=>['pending','accepted'].includes(b.status)).length, color:'from-amber-400 to-orange-500', bg:'bg-amber-50', text:'text-amber-600' },
    { icon: Bell,         label:'Unread Alerts',    value: notifications.filter(n=>!n.isRead).length,              color:'from-purple-400 to-pink-500',   bg:'bg-purple-50', text:'text-purple-600'  },
  ];

  const sidebarItems = [
    { id:'overview',       icon: LayoutDashboard, label:'Overview'       },
    { id:'bookings',       icon: Calendar,        label:'My Bookings'    },
    { id:'favorites',      icon: Heart,           label:'Saved Providers'},
    { id:'notifications',  icon: Bell,            label:'Notifications', badge: notifications.filter(n=>!n.isRead).length },
    { id:'complaint',      icon: AlertTriangle,   label:'Submit Complaint'},
    { id:'profile',        icon: User,            label:'Profile'        },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-100 fixed h-full z-40 flex flex-col shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Home size={15} className="text-white" />
            </div>
            <span className="font-black text-lg bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Homents</span>
          </Link>
        </div>

        {/* user card */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`sidebar-item w-full ${tab===item.id?'active':''}`}>
              <item.icon size={17} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-0.5">
          <Link to="/providers" className="sidebar-item flex">
            <Search size={17} /><span>Find Providers</span>
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} className="sidebar-item w-full text-red-500 hover:bg-red-50 hover:text-red-600 flex">
            <LogOut size={17} /><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main className="ml-64 flex-1 p-8">
        {loading && tab==='overview' && (
          <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
        )}

        {/* OVERVIEW */}
        {tab==='overview' && !loading && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            {/* banner */}
            <div className="relative rounded-3xl overflow-hidden mb-8 h-40">
              <img src={HERO_IMG} alt="banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600/90 to-blue-700/80 flex items-center px-8">
                <div>
                  <h1 className="text-2xl font-black text-white">
                    Welcome back, {user?.fullName?.split(' ')[0]}
                  </h1>
                  <p className="text-sky-200 mt-1">Manage your bookings and discover new services</p>
                </div>
                <Link to="/providers" className="ml-auto bg-white text-sky-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0">
                  <Search size={14} /> Find Services
                </Link>
              </div>
            </div>

            {/* stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {stats.map((s,i) => (
                <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-11 h-11 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                    <s.icon size={19} className="text-white" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* quick panels */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* recent bookings */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Recent Bookings</h3>
                  <button onClick={()=>setTab('bookings')} className="text-xs text-sky-600 font-semibold flex items-center gap-1 hover:text-sky-800">
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={36} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No bookings yet</p>
                    <Link to="/providers" className="text-sky-600 text-sm font-semibold mt-1 inline-block">Book your first service</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0,4).map(b => (
                      <div key={b._id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-sky-100 rounded-xl flex items-center justify-center">
                            <Calendar size={14} className="text-sky-500" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm truncate max-w-[160px]">{b.service}</p>
                            <p className="text-slate-400 text-xs">{b.provider?.fullName}</p>
                          </div>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* notifications preview */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  <button onClick={()=>setTab('notifications')} className="text-xs text-sky-600 font-semibold flex items-center gap-1 hover:text-sky-800">
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell size={36} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(0,4).map(n => (
                      <div key={n._id} onClick={()=>markNotifRead(n._id)}
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${!n.isRead?'bg-sky-50 border border-sky-100':'hover:bg-slate-50'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.isRead?'bg-sky-200':'bg-slate-100'}`}>
                          <Bell size={13} className={!n.isRead?'text-sky-600':'text-slate-400'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-xs">{n.title}</p>
                          <p className="text-slate-500 text-xs truncate">{n.message}</p>
                        </div>
                        {!n.isRead && <div className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0 mt-1" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* BOOKINGS TAB */}
        {tab==='bookings' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">My Bookings</h2>
              <Link to="/providers" className="btn-primary text-sm py-2.5 flex items-center gap-2">
                <Search size={14} /> New Booking
              </Link>
            </div>
            {bookings.length === 0 ? (
              <EmptyState title="No bookings yet" description="Find and book a service provider to get started."
                action={<Link to="/providers" className="btn-primary">Browse Providers</Link>} />
            ) : (
              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Calendar size={20} className="text-sky-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{b.service}</p>
                          <p className="text-sm text-slate-500">{b.provider?.fullName} &bull; {b.provider?.category}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock size={10} /> {new Date(b.scheduledDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})} at {b.scheduledTime}
                            </span>
                            {b.address && <span className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} />{b.address}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {b.amount > 0 && (
                          <span className="text-sm font-bold text-slate-700">LKR {b.amount.toLocaleString()}</span>
                        )}
                        <StatusBadge status={b.status} />
                        {['pending','accepted'].includes(b.status) && (
                          <button onClick={() => cancelBooking(b._id)}
                            className="text-xs text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all font-medium">
                            Cancel
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

        {/* FAVORITES */}
        {tab==='favorites' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Saved Providers</h2>
            {favorites.length === 0 ? (
              <EmptyState title="No saved providers" description="Browse providers and tap the heart icon to save them here for quick access."
                action={<Link to="/providers" className="btn-primary">Browse Providers</Link>} />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {favorites.map(p => (
                  <div key={p._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      {p.profilePhoto
                        ? <img src={p.profilePhoto} alt={p.fullName} className="w-12 h-12 rounded-xl object-cover" />
                        : <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-lg">{p.fullName?.[0]}</div>}
                      <div>
                        <p className="font-bold text-slate-800">{p.fullName}</p>
                        <p className="text-sky-600 text-sm font-medium">{p.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={p.rating} reviews={p.totalReviews} size={13} />
                      <span className="text-sm text-slate-500 font-medium">LKR {p.hourlyRate}/hr</span>
                    </div>
                    <Link to={`/providers/${p._id}`} className="btn-primary text-sm py-2 w-full flex items-center justify-center gap-2">
                      View Profile <ArrowRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* NOTIFICATIONS */}
        {tab==='notifications' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Notifications</h2>
            {notifications.length === 0 ? (
              <EmptyState title="All caught up" description="No notifications at the moment." />
            ) : (
              <div className="space-y-3">
                {notifications.map(n => (
                  <div key={n._id} onClick={() => markNotifRead(n._id)}
                    className={`bg-white rounded-2xl border p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${!n.isRead?'border-sky-300':'border-slate-100'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!n.isRead?'bg-sky-100':'bg-slate-100'}`}>
                        <Bell size={16} className={!n.isRead?'text-sky-600':'text-slate-400'} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{n.title}</p>
                        <p className="text-slate-500 text-sm mt-0.5">{n.message}</p>
                        <p className="text-slate-400 text-xs mt-1.5">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                      {!n.isRead && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full flex-shrink-0 mt-1.5" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* COMPLAINT */}
        {tab==='complaint' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="max-w-xl">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Submit a Complaint</h2>
            <p className="text-slate-500 text-sm mb-6">We take all complaints seriously. Our team will investigate and respond within 48 hours.</p>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <form onSubmit={submitComplaint} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject *</label>
                  <input required className="input" placeholder="Brief description of the issue" value={complaintForm.subject} onChange={e=>setComplaintForm({...complaintForm,subject:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
                  <textarea required className="input min-h-[120px] resize-none" placeholder="Describe the issue in detail..." value={complaintForm.description} onChange={e=>setComplaintForm({...complaintForm,description:e.target.value})} />
                </div>
                <button type="submit" className="btn-primary w-full py-3">Submit Complaint</button>
              </form>
            </div>
          </motion.div>
        )}

        {/* PROFILE */}
        {tab==='profile' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="max-w-xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Profile Settings</h2>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  {user?.fullName?.[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{user?.fullName}</p>
                  <p className="text-slate-500 text-sm">{user?.email}</p>
                  <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full mt-1 inline-block capitalize">{user?.role}</span>
                </div>
              </div>
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input className="input" value={profileForm.fullName} onChange={e=>setProfileForm({...profileForm,fullName:e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input className="input" value={profileForm.phone} onChange={e=>setProfileForm({...profileForm,phone:e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                    <input className="input" value={profileForm.city} onChange={e=>setProfileForm({...profileForm,city:e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                    <input className="input" value={profileForm.address} onChange={e=>setProfileForm({...profileForm,address:e.target.value})} />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-500 border border-slate-200">
                  Email: <strong className="text-slate-700">{user?.email}</strong> &nbsp; (cannot be changed)
                </div>
                <button type="submit" className="btn-primary py-3">Save Changes</button>
              </form>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
