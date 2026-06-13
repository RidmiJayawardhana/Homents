import { motion } from 'framer-motion';
import { Star, PackageSearch,
  Zap, Droplets, BookOpen, Wind, Car, Hammer, Brush, AirVent, Monitor, Leaf } from 'lucide-react';

/* ── Loading Spinner ─────────────────────────────────────────────────── */
export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm:'w-5 h-5', md:'w-10 h-10', lg:'w-14 h-14' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin`} />
      {text && <p className="text-slate-500 text-sm">{text}</p>}
    </div>
  );
};

/* ── Full-page Loader ────────────────────────────────────────────────── */
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-sky-50">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 border-4 border-sky-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="font-black text-xl bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Homents</p>
      <p className="text-slate-400 text-sm mt-1">Loading…</p>
    </div>
  </div>
);

/* ── Skeleton Card ───────────────────────────────────────────────────── */
export const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-sky-100 overflow-hidden animate-pulse">
    <div className="skeleton h-24 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded-xl" />
      <div className="skeleton h-3 w-1/2 rounded-xl" />
      <div className="skeleton h-3 w-2/3 rounded-xl" />
      <div className="skeleton h-9 w-full rounded-xl mt-4" />
    </div>
  </div>
);

/* ── Star Rating ─────────────────────────────────────────────────────── */
export const StarRating = ({ rating = 0, size = 16, showNumber = true, reviews = null }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={size}
        className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
      />
    ))}
    {showNumber && <span className="text-sm font-semibold text-slate-600 ml-1">{Number(rating).toFixed(1)}</span>}
    {reviews !== null && <span className="text-xs text-slate-400">({reviews})</span>}
  </div>
);

/* ── Status Badge ────────────────────────────────────────────────────── */
export const StatusBadge = ({ status }) => {
  const map = {
    pending:     'bg-amber-100 text-amber-700 border border-amber-200',
    accepted:    'bg-sky-100 text-sky-700 border border-sky-200',
    in_progress: 'bg-blue-100 text-blue-700 border border-blue-200',
    completed:   'bg-emerald-100 text-emerald-700 border border-emerald-200',
    cancelled:   'bg-red-100 text-red-700 border border-red-200',
    rejected:    'bg-rose-100 text-rose-700 border border-rose-200',
    approved:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
    active:      'bg-emerald-100 text-emerald-700 border border-emerald-200',
    open:        'bg-amber-100 text-amber-700 border border-amber-200',
    in_review:   'bg-blue-100 text-blue-700 border border-blue-200',
    resolved:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
    closed:      'bg-slate-100 text-slate-600 border border-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${map[status] || 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
};

/* ── Empty State ─────────────────────────────────────────────────────── */
export const EmptyState = ({ icon: Icon = PackageSearch, title = 'Nothing here yet', description = '', action = null }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-4 border border-sky-100">
      <Icon size={36} className="text-sky-400" />
    </div>
    <h3 className="text-lg font-bold text-slate-700 mb-2">{title}</h3>
    {description && <p className="text-slate-400 text-sm max-w-xs mb-6 leading-relaxed">{description}</p>}
    {action}
  </motion.div>
);

/* ── Modal ───────────────────────────────────────────────────────────── */
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-slate-800">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600 font-bold text-lg leading-none">
            ×
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

/* ── Category Config (for detail pages) ─────────────────────────────── */
export const categoryConfig = {
  'Electrician':   { color:'from-yellow-400 to-orange-500',  bg:'bg-amber-50',   text:'text-amber-700',   Icon: Zap     },
  'Plumber':       { color:'from-blue-400 to-cyan-500',       bg:'bg-blue-50',    text:'text-blue-700',    Icon: Droplets },
  'Tutor':         { color:'from-purple-400 to-pink-500',     bg:'bg-purple-50',  text:'text-purple-700',  Icon: BookOpen },
  'Cleaner':       { color:'from-emerald-400 to-teal-500',    bg:'bg-emerald-50', text:'text-emerald-700', Icon: Wind     },
  'Mechanic':      { color:'from-slate-500 to-gray-700',      bg:'bg-slate-50',   text:'text-slate-700',   Icon: Car      },
  'Carpenter':     { color:'from-amber-500 to-orange-600',    bg:'bg-amber-50',   text:'text-amber-700',   Icon: Hammer   },
  'Painter':       { color:'from-pink-400 to-rose-500',       bg:'bg-pink-50',    text:'text-pink-700',    Icon: Brush    },
  'AC Repair':     { color:'from-cyan-400 to-sky-600',        bg:'bg-cyan-50',    text:'text-cyan-700',    Icon: AirVent  },
  'Technician':    { color:'from-sky-400 to-blue-600',        bg:'bg-sky-50',     text:'text-sky-700',     Icon: Monitor  },
  'Garden Worker': { color:'from-green-400 to-emerald-600',   bg:'bg-green-50',   text:'text-green-700',   Icon: Leaf     },
};
