import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Briefcase, Calendar, AlertTriangle,
  FileText, Settings, LogOut, Shield, TrendingUp, CheckCircle,
  XCircle, Clock, BarChart2, ChevronRight, PlusCircle, Home,
  Search, Ban, UserCheck, Eye, RefreshCw, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { useAdmin } from '../../context/AdminContext';
import api from '../../utils/api';
import { StatusBadge, EmptyState, LoadingSpinner } from '../../components/common/index.jsx';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#0ea5e9','#38bdf8','#7dd3fc','#0284c7','#0369a1','#075985','#164e63','#bae6fd','#e0f2fe','#f0f9ff'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-sky-100 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{color:p.color}} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const { admin, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [dash, setDash] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [provFilter, setProvFilter] = useState('all');
  const [newAdmin, setNewAdmin] = useState({ fullName:'', email:'', username:'', password:'', confirmPassword:'', phone:'' });

  useEffect(() => { loadDash(); }, []);
  useEffect(() => {
    if (tab === 'users')     loadUsers();
    if (tab === 'providers') loadProviders();
    if (tab === 'bookings')  loadBookings();
    if (tab === 'complaints')loadComplaints();
    if (tab === 'audit')     loadAudit();
  }, [tab]);

  const loadDash      = async () => { try { const {data} = await api.get('/admin/dashboard'); setDash(data); } catch {} finally { setLoading(false); } };
  const loadUsers     = async () => { try { const {data} = await api.get('/admin/users?role=customer'); setUsers(data.users); } catch {} };
  const loadProviders = async () => { try { const {data} = await api.get('/admin/providers'); setProviders(data.providers); } catch {} };
  const loadBookings  = async () => { try { const {data} = await api.get('/admin/bookings'); setBookings(data.bookings); } catch {} };
  const loadComplaints= async () => { try { const {data} = await api.get('/admin/complaints'); setComplaints(data.complaints); } catch {} };
  const loadAudit     = async () => { try { const {data} = await api.get('/admin/audit-logs'); setAuditLogs(data.logs); } catch {} };

  const banUser    = async (id, isBanned) => { try { await api.put(`/admin/users/${id}/ban`); toast.success(`User ${isBanned?'unbanned':'banned'}`); loadUsers(); } catch { toast.error('Action failed'); } };
  const approveProvider = async (id, cur) => { try { await api.put(`/admin/providers/${id}/approve`,{isApproved:!cur}); toast.success(!cur?'Provider approved':'Approval revoked'); loadProviders(); } catch { toast.error('Action failed'); } };
  const updateComplaint = async (id, status) => { try { await api.put(`/admin/complaints/${id}`,{status}); toast.success('Updated'); loadComplaints(); } catch {} };

  const createAdmin = async (e) => {
    e.preventDefault();
    if (newAdmin.password !== newAdmin.confirmPassword) return toast.error('Passwords do not match');
    try {
      await api.post('/admin/create', newAdmin);
      toast.success('Support Admin created successfully');
      setNewAdmin({ fullName:'', email:'', username:'', password:'', confirmPassword:'', phone:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create admin'); }
  };

  const filteredUsers = users.filter(u =>
    !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProviders = providers.filter(p => {
    const matchSearch = !search || p.fullName?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = provFilter === 'all' || (provFilter === 'approved' && p.isApproved) || (provFilter === 'pending' && !p.isApproved);
    return matchSearch && matchFilter;
  });

  const sidebarItems = [
    { id:'overview',        icon: LayoutDashboard, label:'Dashboard'          },
    { id:'users',           icon: Users,           label:'Users'              },
    { id:'providers',       icon: Briefcase,       label:'Providers'          },
    { id:'bookings',        icon: Calendar,        label:'Bookings'           },
    { id:'complaints',      icon: AlertTriangle,   label:'Complaints'         },
    { id:'audit',           icon: FileText,        label:'Audit Logs'         },
    ...(admin?.role === 'super_admin' ? [{ id:'new-admin', icon: PlusCircle, label:'New Admin' }] : []),
    { id:'settings',        icon: Settings,        label:'Settings'           },
  ];

  const StatCard = ({ icon: Icon, label, value, color, delta, onClick }) => (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={`bg-slate-800/50 border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-slate-700/50 transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon size={19} className="text-white" />
        </div>
        {delta && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${delta.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {delta}
          </span>
        )}
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="text-slate-400 text-sm mt-0.5">{label}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-64 bg-slate-900 border-r border-white/10 fixed h-full z-40 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield size={17} className="text-white" />
            </div>
            <div>
              <div className="text-white font-black text-sm">Homents Admin</div>
              <div className="text-sky-400 text-xs font-medium capitalize">{admin?.role?.replace('_',' ')}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
              {admin?.fullName?.[0]}
            </div>
            <div className="min-w-0">
              <div className="text-white text-sm font-semibold truncate">{admin?.fullName}</div>
              <div className="text-sky-400 text-xs">@{admin?.username}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setSearch(''); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === item.id
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={17} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link to="/" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-sky-400 hover:bg-white/5 transition-all mb-1">
            <Home size={17} /> Visit Site
          </Link>
          <button onClick={() => { adminLogout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────── */}
      <main className="ml-64 flex-1 p-8">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* ══════════ OVERVIEW ══════════ */}
        {!loading && tab === 'overview' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-white">Dashboard Overview</h1>
                <p className="text-slate-400 mt-1">Platform analytics and live metrics</p>
              </div>
              <button onClick={loadDash} className="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors">
                <RefreshCw size={15} /> Refresh
              </button>
            </div>

            {/* primary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <StatCard icon={Users}        label="Total Customers"     value={dash?.stats?.totalUsers||0}        color="from-sky-400 to-blue-500"     delta="+12%" onClick={()=>setTab('users')} />
              <StatCard icon={Briefcase}    label="Total Providers"     value={dash?.stats?.totalProviders||0}    color="from-emerald-400 to-teal-500" delta="+8%"  onClick={()=>setTab('providers')} />
              <StatCard icon={Calendar}     label="Active Bookings"     value={dash?.stats?.activeBookings||0}    color="from-amber-400 to-orange-500" delta="+24%" onClick={()=>setTab('bookings')} />
              <StatCard icon={AlertTriangle}label="Open Complaints"     value={dash?.stats?.openComplaints||0}    color="from-red-400 to-rose-500"     delta="-5%"  onClick={()=>setTab('complaints')} />
            </div>

            {/* secondary stats */}
            <div className="grid grid-cols-3 gap-5 mb-8">
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle size={18} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{dash?.stats?.completedBookings||0}</div>
                  <div className="text-slate-400 text-xs">Completed Bookings</div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Clock size={18} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{dash?.stats?.pendingProviders||0}</div>
                  <div className="text-slate-400 text-xs">Pending Approvals</div>
                </div>
              </div>
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Activity size={18} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">{dash?.stats?.approvedProviders||0}</div>
                  <div className="text-slate-400 text-xs">Verified Providers</div>
                </div>
              </div>
            </div>

            {/* charts row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* monthly users bar chart */}
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-1">Monthly User Growth</h3>
                <p className="text-slate-400 text-xs mb-5">New customer registrations per month</p>
                {dash?.monthlyUsers?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={dash.monthlyUsers} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="_id.month" stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" tick={{fill:'#94a3b8',fontSize:11}} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{fill:'rgba(255,255,255,0.03)'}} />
                      <Bar dataKey="count" name="Users" fill="url(#barGrad)" radius={[6,6,0,0]} />
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">No data yet</div>
                )}
              </div>

              {/* category pie chart */}
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-1">Providers by Category</h3>
                <p className="text-slate-400 text-xs mb-5">Distribution across service types</p>
                {dash?.categoryStats?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={dash.categoryStats} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} innerRadius={45}
                        label={({_id,percent}) => percent > 0.06 ? `${_id.slice(0,8)} ${(percent*100).toFixed(0)}%` : ''} labelLine={false}>
                        {dash.categoryStats.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">No data yet</div>
                )}
              </div>
            </div>

            {/* recent activity */}
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold">Recent Bookings</h3>
                <button onClick={()=>setTab('bookings')} className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-3">
                {dash?.recentBookings?.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-6">No bookings yet</p>
                )}
                {dash?.recentBookings?.map(b => (
                  <div key={b._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 font-bold text-xs">
                        {b.customer?.fullName?.[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{b.customer?.fullName}</p>
                        <p className="text-slate-500 text-xs">{b.service} &bull; {b.provider?.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</span>
                      <StatusBadge status={b.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════ USERS ══════════ */}
        {tab === 'users' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">User Management</h2>
                <p className="text-slate-400 text-sm">{filteredUsers.length} customers registered</p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <Search size={16} className="text-slate-400" />
                <input className="bg-transparent outline-none text-white text-sm placeholder:text-slate-500 w-52"
                  placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Customer','Email','City','Verified','Status','Joined','Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-slate-400 text-xs font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/3 transition-all">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center text-sky-400 font-bold text-xs flex-shrink-0">
                            {u.fullName?.[0]}
                          </div>
                          <span className="text-white text-sm font-medium">{u.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm">{u.email}</td>
                      <td className="px-5 py-4 text-slate-400 text-sm">{u.city || '—'}</td>
                      <td className="px-5 py-4">
                        {u.isVerified
                          ? <span className="text-emerald-400 text-xs font-medium">Verified</span>
                          : <span className="text-amber-400 text-xs font-medium">Unverified</span>}
                      </td>
                      <td className="px-5 py-4">
                        {u.isBanned
                          ? <span className="text-red-400 text-xs font-semibold">Banned</span>
                          : <span className="text-emerald-400 text-xs font-semibold">Active</span>}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <button onClick={() => banUser(u._id, u.isBanned)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                            u.isBanned
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          }`}
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={7} className="py-12 text-center text-slate-500">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ══════════ PROVIDERS ══════════ */}
        {tab === 'providers' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">Provider Management</h2>
                <p className="text-slate-400 text-sm">{filteredProviders.length} providers found</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {['all','approved','pending'].map(f => (
                  <button key={f} onClick={() => setProvFilter(f)}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all capitalize ${
                      provFilter === f ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <Search size={14} className="text-slate-400" />
                  <input className="bg-transparent outline-none text-white text-sm placeholder:text-slate-500 w-40"
                    placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredProviders.map(p => (
                <div key={p._id} className="bg-slate-800/50 border border-white/10 rounded-2xl p-5 hover:bg-slate-700/50 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {p.profilePhoto
                        ? <img src={p.profilePhoto} alt={p.fullName} className="w-12 h-12 rounded-xl object-cover ring-2 ring-sky-500/20" />
                        : <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400 font-bold text-lg">{p.fullName?.[0]}</div>}
                      <div>
                        <p className="text-white font-bold">{p.fullName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sky-400 text-xs font-semibold">{p.category}</span>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="text-slate-400 text-xs">{p.city}</span>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="text-slate-400 text-xs">LKR {p.hourlyRate}/hr</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1">{p.email} &bull; NIC: {p.nic}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
                      <div className="text-right">
                        <p className="text-white text-sm font-bold">{Number(p.rating||0).toFixed(1)} ★</p>
                        <p className="text-slate-500 text-xs">{p.totalReviews||0} reviews</p>
                      </div>
                      {p.isApproved
                        ? <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-lg font-semibold">Approved</span>
                        : <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-lg font-semibold">Pending</span>}
                      <button onClick={() => approveProvider(p._id, p.isApproved)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                          p.isApproved
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
                        }`}
                      >
                        {p.isApproved ? 'Revoke' : 'Approve'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProviders.length === 0 && (
                <div className="py-16 text-center text-slate-500 bg-slate-800/30 rounded-2xl border border-white/5">No providers found</div>
              )}
            </div>
          </motion.div>
        )}

        {/* ══════════ BOOKINGS ══════════ */}
        {tab === 'bookings' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">All Bookings</h2>
              <span className="text-slate-400 text-sm">{bookings.length} total</span>
            </div>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Service','Customer','Provider','Date & Time','Amount','Status'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-slate-400 text-xs font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} className="border-b border-white/5 hover:bg-white/3 transition-all">
                      <td className="px-5 py-4 text-white text-sm font-medium max-w-[160px]">
                        <p className="truncate">{b.service}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-sm">{b.customer?.fullName}</td>
                      <td className="px-5 py-4 text-slate-400 text-sm">
                        <p>{b.provider?.fullName}</p>
                        <p className="text-slate-500 text-xs">{b.provider?.category}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs">
                        {new Date(b.scheduledDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
                        <br />{b.scheduledTime}
                      </td>
                      <td className="px-5 py-4 text-sky-400 text-sm font-semibold">
                        {b.amount > 0 ? `LKR ${b.amount.toLocaleString()}` : '—'}
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-slate-500">No bookings found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ══════════ COMPLAINTS ══════════ */}
        {tab === 'complaints' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Complaints Management</h2>
              <span className="text-slate-400 text-sm">{complaints.length} total</span>
            </div>
            {complaints.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-800/30 rounded-2xl border border-white/5">No complaints filed</div>
            ) : (
              <div className="space-y-4">
                {complaints.map(c => (
                  <div key={c._id} className="bg-slate-800/50 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-bold">{c.subject}</p>
                        <p className="text-slate-400 text-sm mt-0.5">
                          Filed by <span className="text-sky-400">{c.complainant?.fullName}</span> &bull; {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-slate-400 text-sm mb-4 bg-white/5 rounded-xl p-3">{c.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {c.status === 'open' && (
                        <button onClick={() => updateComplaint(c._id, 'in_review')} className="text-xs px-3 py-1.5 bg-sky-500/20 text-sky-400 rounded-lg hover:bg-sky-500/30 transition-all font-semibold">Mark In Review</button>
                      )}
                      {c.status === 'in_review' && (
                        <button onClick={() => updateComplaint(c._id, 'resolved')} className="text-xs px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all font-semibold">Mark Resolved</button>
                      )}
                      {!['closed','resolved'].includes(c.status) && (
                        <button onClick={() => updateComplaint(c._id, 'closed')} className="text-xs px-3 py-1.5 bg-slate-500/20 text-slate-400 rounded-lg hover:bg-slate-500/30 transition-all font-semibold">Close</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════ AUDIT LOGS ══════════ */}
        {tab === 'audit' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Audit Logs</h2>
              <span className="text-slate-400 text-sm">Last {auditLogs.length} actions</span>
            </div>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Admin','Action','Target','Details','Timestamp'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-slate-400 text-xs font-semibold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log._id} className="border-b border-white/5 hover:bg-white/3 transition-all">
                      <td className="px-5 py-3 text-sky-400 text-sm font-medium">@{log.admin?.username || 'system'}</td>
                      <td className="px-5 py-3">
                        <code className="bg-sky-500/20 text-sky-400 text-xs px-2.5 py-1 rounded-lg font-mono">{log.action}</code>
                      </td>
                      <td className="px-5 py-3 text-slate-400 text-sm">{log.targetType || '—'}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs font-mono max-w-[160px] truncate">
                        {log.details ? JSON.stringify(log.details).slice(0,50) : '—'}
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr><td colSpan={5} className="py-12 text-center text-slate-500">No audit logs yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ══════════ NEW ADMIN ══════════ */}
        {tab === 'new-admin' && admin?.role === 'super_admin' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="max-w-2xl">
            <h2 className="text-2xl font-black text-white mb-2">Register Support Admin</h2>
            <p className="text-slate-400 text-sm mb-8">Create a new support admin account. They will receive 2FA on login.</p>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6">
              <form onSubmit={createAdmin} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label:'Full Name *',         field:'fullName',         type:'text',     ph:'John Silva'           },
                    { label:'Email Address *',     field:'email',            type:'email',    ph:'john@example.com'     },
                    { label:'Username *',          field:'username',         type:'text',     ph:'john_silva'           },
                    { label:'Phone Number',        field:'phone',            type:'text',     ph:'+94 77 123 4567'      },
                    { label:'Password *',          field:'password',         type:'password', ph:'Strong password'      },
                    { label:'Confirm Password *',  field:'confirmPassword',  type:'password', ph:'Confirm password'     },
                  ].map(({ label, field, type, ph }) => (
                    <div key={field} className={field === 'fullName' || field === 'email' ? 'col-span-2' : ''}>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                      <input
                        type={type} required={label.includes('*')} placeholder={ph}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all text-sm"
                        value={newAdmin[field]}
                        onChange={e => setNewAdmin({ ...newAdmin, [field]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 text-sky-300 text-sm">
                  <strong>Note:</strong> The new admin will have Support Admin privileges. Only you (Super Admin) can create admins.
                </div>
                <button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-sky-500/30 transition-all">
                  Create Support Admin
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ══════════ SETTINGS ══════════ */}
        {tab === 'settings' && (
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="max-w-2xl">
            <h2 className="text-2xl font-black text-white mb-6">System Settings</h2>
            <div className="space-y-4">
              {[
                { title:'Platform Version', value:'Homents v1.0.0', sub:'Nearby Home Service Platform' },
                { title:'Admin Account',    value:`@${admin?.username}`,                 sub: admin?.role?.replace('_',' ') },
                { title:'Database',         value:'MongoDB Local',                       sub:'Connected — mongodb://localhost:27017/homents' },
                { title:'Authentication',   value:'JWT + bcrypt + 2FA',                  sub:'Role-based access control enabled' },
                { title:'Real-time',        value:'Socket.IO Active',                    sub:'Chat and live notifications powered by WebSockets' },
                { title:'Email Service',    value:'Nodemailer',                          sub:'Configure SMTP in backend/.env' },
              ].map((s,i) => (
                <div key={i} className="bg-slate-800/50 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">{s.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{s.sub}</p>
                    </div>
                    <span className="text-sky-400 text-sm font-semibold">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
