import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Star, Shield, Clock, ChevronRight, ArrowRight,
  CheckCircle, Zap, Users, Award, TrendingUp,
  Droplets, BookOpen, Wind, Car, Hammer, Brush,
  AirVent, Monitor, Leaf, MapPin, ThumbsUp
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProviderCard from '../../components/common/ProviderCard';
import api from '../../utils/api';

/* ── service categories ──────────────────────────────────────────────── */
const services = [
  { name:'Electrician',  icon: Zap,     color:'from-yellow-400 to-orange-500',  img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=280&fit=crop' },
  { name:'Plumber',      icon: Droplets, color:'from-blue-400 to-cyan-500',      img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=280&fit=crop' },
  { name:'Tutor',        icon: BookOpen, color:'from-purple-400 to-pink-500',    img:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=280&fit=crop' },
  { name:'Cleaner',      icon: Wind,     color:'from-emerald-400 to-teal-500',   img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=280&fit=crop' },
  { name:'Mechanic',     icon: Car,      color:'from-slate-500 to-gray-700',     img:'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=280&fit=crop' },
  { name:'Carpenter',    icon: Hammer,   color:'from-amber-500 to-orange-600',   img:'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=280&fit=crop' },
  { name:'Painter',      icon: Brush,    color:'from-pink-400 to-rose-500',      img:'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=280&fit=crop' },
  { name:'AC Repair',    icon: AirVent,  color:'from-cyan-400 to-sky-600',       img:'https://images.unsplash.com/photo-1631545806609-35a7d6a5cb38?w=400&h=280&fit=crop' },
  { name:'Technician',   icon: Monitor,  color:'from-sky-400 to-blue-600',       img:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=280&fit=crop' },
  { name:'Garden Worker',icon: Leaf,     color:'from-green-400 to-emerald-600',  img:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=280&fit=crop' },
];

const steps = [
  { icon: Search,       num:'01', title:'Search',  desc:'Enter your service need and location to find nearby professionals.' },
  { icon: Users,        num:'02', title:'Compare', desc:'Browse profiles, ratings and compare prices from verified providers.' },
  { icon: CheckCircle,  num:'03', title:'Book',    desc:'Schedule at your convenience with instant booking confirmation.' },
  { icon: Award,        num:'04', title:'Done',    desc:'Get the job done and leave an honest review to help others.' },
];

const stats = [
  { icon: Users,      value:'10K+', label:'Happy Customers',    color:'from-sky-400 to-blue-500'     },
  { icon: Shield,     value:'500+', label:'Verified Providers', color:'from-emerald-400 to-teal-500' },
  { icon: Star,       value:'4.8',  label:'Average Rating',     color:'from-amber-400 to-orange-500' },
  { icon: TrendingUp, value:'50K+', label:'Services Completed', color:'from-purple-400 to-pink-500'  },
];

const testimonials = [
  { name:'Priya Dias',    role:'Homeowner, Colombo',  rating:5, img:'https://images.unsplash.com/photo-1494790108755-2616b612b76c?w=80&h=80&fit=crop&crop=face', text:'Found a brilliant electrician in minutes. Super professional and very affordable. Homents changed how I think about home repairs.' },
  { name:'Roshan Perera', role:'Office Manager, Kandy', rating:5, img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', text:'Booked a cleaner for our office and the results were outstanding. The whole booking process was seamless from start to finish.' },
  { name:'Nimali Silva',  role:'Parent, Gampaha',     rating:5, img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', text:'My children\'s tutor found through Homents improved their grades significantly. Could not be happier with this platform.' },
];

const faqs = [
  { q:'How are service providers verified?', a:'Every provider submits their NIC, professional credentials, and contact details. Our admin team manually reviews and approves each profile before it appears on the platform.' },
  { q:'How do I book a service?', a:'Browse providers, select one you like, click "Book Now", choose your preferred date and time, and add your address. It really is that simple.' },
  { q:'What if I am not satisfied?', a:'You can cancel a booking before it starts. For disputes or complaints, use our in-app complaint system and our support team will resolve it promptly.' },
  { q:'Is there a booking fee?', a:'Homents is completely free for customers. You only pay the agreed service fee directly to the provider. No hidden charges whatsoever.' },
];

const fi = { initial:{opacity:0,y:30}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.55} };

export default function Landing() {
  const [search,       setSearch]       = useState('');
  const [topProviders, setTopProviders] = useState([]);
  const [openFaq,      setOpenFaq]      = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/providers?sort=rating').then(r => setTopProviders(r.data.providers?.slice(0,4) || [])).catch(()=>{});
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ════════════════════════════════════════ HERO ════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop"
            alt="Home service"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-sky-950/80 to-slate-900/60" />
        </div>

        {/* blobs */}
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none blob" />
        <div className="absolute bottom-32 right-10 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none blob blob-delay-2" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{duration:0.6}}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 border border-sky-400/30 rounded-full text-sky-300 text-sm font-semibold mb-6 backdrop-blur">
                <Zap size={13} className="text-sky-400" />
                Sri Lanka's Trusted Home Service Platform
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.08] mb-6">
                Find Skilled
                <span className="block bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                  Home Experts
                </span>
                Near You
              </h1>

              <p className="text-slate-300 text-xl leading-relaxed mb-10">
                Book verified electricians, plumbers, cleaners, tutors and more - all in one place. Fast, reliable, affordable.
              </p>

              {/* Search bar */}
              <form
                onSubmit={e => { e.preventDefault(); navigate(`/providers?search=${search}`); }}
                className="flex gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-2 mb-8 max-w-xl"
              >
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Search size={18} className="text-sky-400 flex-shrink-0" />
                  <input
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-400 text-sm"
                    placeholder="Search: electrician, plumber, tutor..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-sky-500/40 hover:scale-[1.02] transition-all flex items-center gap-2">
                  Search <ArrowRight size={15} />
                </button>
              </form>

              {/* Quick filters */}
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-400 text-sm self-center">Popular:</span>
                {['Electrician','Plumber','Cleaner','Tutor','Mechanic'].map(s => (
                  <button key={s} onClick={() => navigate(`/providers?category=${s}`)}
                    className="text-sm px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all backdrop-blur">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating stat cards */}
          <motion.div
            initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:0.6,delay:0.3}}
            className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4"
          >
            {[
              { icon: Users,  value:'10K+', label:'Customers',    color:'sky'     },
              { icon: Shield, value:'500+', label:'Providers',    color:'emerald' },
              { icon: Star,   value:'4.8',  label:'Avg Rating',   color:'amber'   },
            ].map((s,i) => (
              <motion.div key={i} animate={{y:[0,-6,0]}} transition={{duration:3,repeat:Infinity,delay:i*1}}
                className="flex items-center gap-3 bg-white/15 backdrop-blur border border-white/20 rounded-2xl px-5 py-3.5 shadow-xl min-w-[160px]">
                <div className={`w-9 h-9 rounded-xl bg-${s.color}-500/30 flex items-center justify-center`}>
                  <s.icon size={16} className={`text-${s.color}-300`} />
                </div>
                <div>
                  <div className="text-white font-black text-lg leading-tight">{s.value}</div>
                  <div className="text-slate-400 text-xs">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-3 bg-sky-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ STATS ════════════════════ */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s,i) => (
              <motion.div key={i} {...fi} transition={{...fi.transition, delay:i*0.1}} className="text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <s.icon size={22} className="text-white" />
                </div>
                <div className="text-3xl font-black text-slate-900">{s.value}</div>
                <div className="text-sm text-slate-500 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ SERVICES ═════════════════ */}
      <section className="py-24 bg-sky-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fi} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 rounded-full text-sky-700 text-sm font-semibold mb-4">
              <Shield size={14} /> All Service Categories
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Everything Your Home Needs
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              From urgent repairs to regular maintenance — trusted professionals for every need.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {services.map((svc, i) => (
              <motion.div key={svc.name} {...fi} transition={{...fi.transition,delay:i*0.04}}>
                <Link
                  to={`/providers?category=${svc.name}`}
                  className="group block bg-white rounded-3xl border border-sky-100 overflow-hidden hover:shadow-2xl hover:shadow-sky-100 hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="relative h-28 overflow-hidden">
                    <img src={svc.img} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${svc.color} opacity-70`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svc.icon size={32} className="text-white drop-shadow-md" />
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-sky-700 transition-colors">{svc.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline inline-flex items-center gap-2">
              View All Services <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ HOW IT WORKS ═════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fi} className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Book your first service in under 2 minutes. No hassle, no confusion.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200" />

            {steps.map((step, i) => (
              <motion.div key={i} {...fi} transition={{...fi.transition,delay:i*0.1}} className="relative">
                <div className="bg-white rounded-3xl border border-sky-100 p-6 text-center hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100 transition-all">
                  <div className="text-5xl font-black text-sky-50 mb-3">{step.num}</div>
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-200 relative z-10">
                    <step.icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ TOP PROVIDERS ════════════ */}
      {topProviders.length > 0 && (
        <section className="py-24 bg-sky-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div {...fi} className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-100 rounded-full text-sky-700 text-sm font-semibold mb-3">
                  <ThumbsUp size={13} /> Top Rated
                </div>
                <h2 className="text-4xl font-black text-slate-900">Trusted by Thousands</h2>
                <p className="text-slate-500 mt-1">Handpicked professionals with consistently excellent reviews</p>
              </div>
              <Link to="/providers" className="btn-outline flex items-center gap-2">
                Browse All <ArrowRight size={15} />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topProviders.map((p, i) => (
                <motion.div key={p._id} {...fi} transition={{...fi.transition,delay:i*0.1}}>
                  <ProviderCard provider={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════ TESTIMONIALS ═════════════ */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fi} className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-3">What Our Customers Say</h2>
            <p className="text-sky-300 text-lg">Real reviews from real people across Sri Lanka</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fi} transition={{...fi.transition,delay:i*0.1}}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur hover:bg-white/8 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_,j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-400/30" />
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-sky-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ FAQ ══════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fi} className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-500">Everything you need to know before booking.</p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...fi} transition={{...fi.transition,delay:i*0.08}}
                className="bg-sky-50 border border-sky-100 rounded-2xl overflow-hidden cursor-pointer hover:border-sky-300 transition-all"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex justify-between items-center p-5">
                  <h3 className="font-semibold text-slate-800 pr-4">{faq.q}</h3>
                  <ChevronRight size={18} className={`text-sky-500 flex-shrink-0 transition-transform duration-200 ${openFaq===i?'rotate-90':''}`} />
                </div>
                {openFaq === i && (
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}}
                    className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-sky-100 pt-4">
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ CTA ══════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&h=600&fit=crop" alt="Home" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/95 to-blue-700/95" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fi}>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">Ready to Get Started?</h2>
            <p className="text-sky-100 text-xl mb-10">Join thousands of satisfied customers finding trusted professionals every day.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register"
                className="bg-white text-sky-700 font-bold px-8 py-4 rounded-2xl hover:shadow-2xl hover:scale-[1.03] transition-all text-base">
                Find a Service Provider
              </Link>
              <Link to="/register-provider"
                className="border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 justify-center text-base">
                Become a Provider <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
