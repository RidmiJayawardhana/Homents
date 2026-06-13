import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Star, Briefcase } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProviderCard from '../../components/common/ProviderCard';
import { SkeletonCard, EmptyState } from '../../components/common/index.jsx';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['All','Electrician','Plumber','Tutor','Cleaner','Mechanic','Carpenter','Painter','Technician','AC Repair','Garden Worker'];

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters]     = useState({ category:'', city:'', minRating:'', isAvailable:'', sort:'createdAt' });
  const [search, setSearch]       = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const q   = searchParams.get('search')   || '';
    setFilters(f => ({ ...f, category: cat }));
    setSearch(q);
  }, [searchParams]);

  useEffect(() => { fetchProviders(); }, [filters, search]);
  useEffect(() => { if (user) fetchFavorites(); }, [user]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category)    params.append('category', filters.category);
      if (filters.city)        params.append('city', filters.city);
      if (filters.minRating)   params.append('minRating', filters.minRating);
      if (filters.isAvailable) params.append('isAvailable', filters.isAvailable);
      if (filters.sort)        params.append('sort', filters.sort);
      if (search)              params.append('search', search);
      const { data } = await api.get(`/providers?${params}`);
      setProviders(data.providers);
    } catch { toast.error('Failed to load providers'); }
    finally { setLoading(false); }
  };

  const fetchFavorites = async () => {
    try { const { data } = await api.get('/users/favorites'); setFavorites(data.favorites.map(f => f._id)); } catch {}
  };

  const handleFavorite = async (providerId) => {
    if (!user) return toast.error('Please sign in to save favourites');
    try {
      await api.put(`/users/favorites/${providerId}`);
      setFavorites(prev => prev.includes(providerId) ? prev.filter(f => f !== providerId) : [...prev, providerId]);
    } catch {}
  };

  const clearFilters = () => { setFilters({ category:'', city:'', minRating:'', isAvailable:'', sort:'createdAt' }); setSearch(''); };

  const hasActiveFilter = filters.category || filters.city || filters.minRating || filters.isAvailable || search;

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />

      {/* Header */}
      <div className="relative bg-gradient-to-r from-sky-600 to-blue-700 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&h=400&fit=crop"
            alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-3">Find Service Providers</h1>
            <p className="text-sky-200 text-lg mb-8">
              {loading ? 'Searching…' : `${providers.length} verified professional${providers.length !== 1 ? 's' : ''} available`}
            </p>
            {/* Search bar */}
            <div className="flex gap-3 max-w-2xl">
              <div className="flex-1 flex items-center gap-3 bg-white/15 backdrop-blur border border-white/25 rounded-2xl px-4">
                <Search size={17} className="text-white/70 flex-shrink-0" />
                <input
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/50 py-3 text-sm"
                  placeholder="Search by name, skill or category…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch('')}><X size={15} className="text-white/60 hover:text-white" /></button>
                )}
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all ${
                  showFilters || hasActiveFilter ? 'bg-white text-sky-700 shadow-lg' : 'bg-white/15 border border-white/25 text-white hover:bg-white/25'
                }`}>
                <SlidersHorizontal size={16} />
                Filters {hasActiveFilter ? '•' : ''}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setFilters(f => ({ ...f, category: cat === 'All' ? '' : cat }))}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                (cat === 'All' && !filters.category) || filters.category === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
                  : 'bg-white border border-sky-200 text-slate-600 hover:border-sky-400 hover:text-sky-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
            className="bg-white rounded-2xl border border-sky-100 p-5 mb-6 shadow-sm"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">City</label>
                <input className="input text-sm" placeholder="Any city"
                  value={filters.city} onChange={e => setFilters(f=>({...f,city:e.target.value}))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Min Rating</label>
                <select className="input bg-white text-sm" value={filters.minRating} onChange={e=>setFilters(f=>({...f,minRating:e.target.value}))}>
                  <option value="">Any rating</option>
                  {[3,3.5,4,4.5].map(r => <option key={r} value={r}>{r}+ stars</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Availability</label>
                <select className="input bg-white text-sm" value={filters.isAvailable} onChange={e=>setFilters(f=>({...f,isAvailable:e.target.value}))}>
                  <option value="">Any</option>
                  <option value="true">Available now</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Sort By</label>
                <select className="input bg-white text-sm" value={filters.sort} onChange={e=>setFilters(f=>({...f,sort:e.target.value}))}>
                  <option value="createdAt">Newest first</option>
                  <option value="rating">Highest rated</option>
                  <option value="price">Lowest price</option>
                  <option value="experience">Most experienced</option>
                </select>
              </div>
            </div>
            {hasActiveFilter && (
              <button onClick={clearFilters} className="mt-4 text-sm text-red-500 hover:text-red-700 font-semibold">
                Clear all filters
              </button>
            )}
          </motion.div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-500 text-sm">
            {loading ? 'Loading…' : `Showing ${providers.length} provider${providers.length!==1?'s':''}`}
            {filters.category ? ` in ${filters.category}` : ''}
            {filters.city ? ` near ${filters.city}` : ''}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_,i) => <SkeletonCard key={i} />)}
          </div>
        ) : providers.length === 0 ? (
          <EmptyState
            title="No providers found"
            description="Try adjusting your filters or searching a different keyword."
            action={
              <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {providers.map(provider => (
              <ProviderCard
                key={provider._id}
                provider={provider}
                onFavorite={handleFavorite}
                isFavorited={favorites.includes(provider._id)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
