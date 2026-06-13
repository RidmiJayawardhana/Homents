import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Star, Heart, CheckCircle,
  Zap, Droplets, BookOpen, Wind, Car, Hammer, Brush, AirVent, Monitor, Leaf } from 'lucide-react';

const categoryMeta = {
  'Electrician':   { Icon: Zap,     color: 'from-yellow-400 to-orange-500',   bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'Plumber':       { Icon: Droplets, color: 'from-blue-400 to-cyan-500',        bg: 'bg-blue-50',    text: 'text-blue-700'    },
  'Tutor':         { Icon: BookOpen, color: 'from-purple-400 to-pink-500',      bg: 'bg-purple-50',  text: 'text-purple-700'  },
  'Cleaner':       { Icon: Wind,     color: 'from-emerald-400 to-teal-500',     bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Mechanic':      { Icon: Car,      color: 'from-slate-500 to-gray-700',       bg: 'bg-slate-50',   text: 'text-slate-700'   },
  'Carpenter':     { Icon: Hammer,   color: 'from-amber-500 to-orange-600',     bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'Painter':       { Icon: Brush,    color: 'from-pink-400 to-rose-500',        bg: 'bg-pink-50',    text: 'text-pink-700'    },
  'AC Repair':     { Icon: AirVent,  color: 'from-cyan-400 to-sky-600',         bg: 'bg-cyan-50',    text: 'text-cyan-700'    },
  'Technician':    { Icon: Monitor,  color: 'from-sky-400 to-blue-600',         bg: 'bg-sky-50',     text: 'text-sky-700'     },
  'Garden Worker': { Icon: Leaf,     color: 'from-green-400 to-emerald-600',    bg: 'bg-green-50',   text: 'text-green-700'   },
};

export default function ProviderCard({ provider, onFavorite, isFavorited = false }) {
  const meta = categoryMeta[provider.category] || { Icon: Briefcase, color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50', text: 'text-sky-700' };
  const { Icon } = meta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.18 } }}
      className="bg-white rounded-3xl border border-sky-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-sky-100 transition-all duration-300 group"
    >
      {/* Header band */}
      <div className={`h-24 bg-gradient-to-r ${meta.color} relative overflow-hidden`}>
        {/* subtle pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />

        {/* availability badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur ${
          provider.isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-black/30 text-white/80'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${provider.isAvailable ? 'bg-white animate-pulse' : 'bg-white/60'}`} />
          {provider.isAvailable ? 'Available' : 'Busy'}
        </div>

        {/* favourite button */}
        {onFavorite && (
          <button
            onClick={() => onFavorite(provider._id)}
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur rounded-xl flex items-center justify-center transition-all"
          >
            <Heart size={14} className={isFavorited ? 'fill-white text-white' : 'text-white'} />
          </button>
        )}

        {/* verified badge */}
        {provider.isApproved && (
          <div className="absolute bottom-3 right-3">
            <div className="w-6 h-6 bg-white/25 backdrop-blur rounded-lg flex items-center justify-center">
              <CheckCircle size={13} className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="px-5 -mt-7 relative z-10">
        <div className={`w-14 h-14 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
          {provider.profilePhoto
            ? <img src={provider.profilePhoto} alt={provider.fullName} className="w-full h-full object-cover" />
            : <Icon size={22} className="text-white" />}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2">
        <div className="mb-3">
          <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-sky-700 transition-colors">
            {provider.fullName}
          </h3>
          <span className={`text-xs font-semibold ${meta.text} ${meta.bg} px-2 py-0.5 rounded-lg`}>
            {provider.category}
          </span>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={12}
              className={s <= Math.round(provider.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
            />
          ))}
          <span className="text-xs font-semibold text-slate-600 ml-1">{Number(provider.rating||0).toFixed(1)}</span>
          <span className="text-xs text-slate-400">({provider.totalReviews||0})</span>
        </div>

        {/* Meta info */}
        <div className="space-y-1.5 mb-4">
          {provider.city && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={11} className="text-sky-400 flex-shrink-0" /> {provider.city}
            </div>
          )}
          {provider.experience > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock size={11} className="text-sky-400 flex-shrink-0" /> {provider.experience} yrs experience
            </div>
          )}
          {provider.hourlyRate > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <DollarSign size={11} className="text-sky-400 flex-shrink-0" /> LKR {provider.hourlyRate}/hr
            </div>
          )}
        </div>

        <Link to={`/providers/${provider._id}`}
          className="btn-primary w-full text-sm py-2.5 flex items-center justify-center rounded-xl">
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}
