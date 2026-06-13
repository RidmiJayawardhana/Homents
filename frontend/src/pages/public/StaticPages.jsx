import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, MapPin, Send, Shield, Star, Heart, CheckCircle,
  Zap, Droplets, BookOpen, Wind, Car, Hammer, Brush, AirVent, Monitor, Leaf } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const fi = { initial:{opacity:0,y:20}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.5} };

const services = [
  { name:'Electrician',   Icon:Zap,     color:'from-yellow-400 to-orange-500', img:'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500&h=320&fit=crop', desc:'Wiring, fault finding, panel upgrades, solar installation and 24/7 emergency callouts.' },
  { name:'Plumber',       Icon:Droplets, color:'from-blue-400 to-cyan-500',     img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=320&fit=crop', desc:'Pipe repairs, leak fixing, drainage solutions, bathroom and kitchen installations.' },
  { name:'Tutor',         Icon:BookOpen, color:'from-purple-400 to-pink-500',   img:'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=320&fit=crop', desc:'Home and online tutoring for all subjects and levels — O/L, A/L and university.' },
  { name:'Cleaner',       Icon:Wind,     color:'from-emerald-400 to-teal-500',  img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=320&fit=crop', desc:'Professional deep cleaning, regular housekeeping and office cleaning services.' },
  { name:'Mechanic',      Icon:Car,      color:'from-slate-500 to-gray-700',    img:'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=500&h=320&fit=crop', desc:'Vehicle servicing, repairs, diagnostics and maintenance for all vehicle types.' },
  { name:'Carpenter',     Icon:Hammer,   color:'from-amber-500 to-orange-600',  img:'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&h=320&fit=crop', desc:'Custom furniture making, woodwork repairs, cabinets and interior fittings.' },
  { name:'Painter',       Icon:Brush,    color:'from-pink-400 to-rose-500',     img:'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&h=320&fit=crop', desc:'Interior and exterior painting, wallpaper, decorative finishes and surface prep.' },
  { name:'AC Repair',     Icon:AirVent,  color:'from-cyan-400 to-sky-600',      img:'https://images.unsplash.com/photo-1631545806609-35a7d6a5cb38?w=500&h=320&fit=crop', desc:'AC installation, servicing, gas refilling and repair for all brands.' },
  { name:'Technician',    Icon:Monitor,  color:'from-sky-400 to-blue-600',      img:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=320&fit=crop', desc:'Electronics repair, appliance servicing, computer repair and CCTV installation.' },
  { name:'Garden Worker', Icon:Leaf,     color:'from-green-400 to-emerald-600', img:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=320&fit=crop', desc:'Lawn mowing, gardening, landscaping, tree trimming and pest control.' },
];

/* ─────────── SERVICES PAGE ─────────── */
export const ServicesPage = () => (
  <div className="min-h-screen bg-sky-50">
    <Navbar />
    <div className="relative bg-gradient-to-r from-sky-600 to-blue-700 pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div {...fi}>
          <h1 className="text-5xl font-black text-white mb-3">Our Services</h1>
          <p className="text-sky-200 text-xl max-w-2xl">Professional home services by verified experts. Quick booking, reliable results.</p>
        </motion.div>
      </div>
    </div>

    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, i) => (
          <motion.div key={svc.name} {...fi} transition={{...fi.transition,delay:i*0.04}}
            className="bg-white rounded-3xl border border-sky-100 overflow-hidden hover:shadow-2xl hover:shadow-sky-100 hover:-translate-y-1 transition-all duration-300 group">
            <div className="relative h-44 overflow-hidden">
              <img src={svc.img} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className={`absolute inset-0 bg-gradient-to-t ${svc.color} opacity-60`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <svc.Icon size={28} className="text-white" />
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-sky-700 transition-colors">{svc.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{svc.desc}</p>
              <Link to={`/providers?category=${svc.name}`}
                className="flex items-center gap-2 text-sky-600 font-semibold text-sm hover:text-sky-800 transition-colors">
                Find {svc.name}s <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

/* ─────────── ABOUT PAGE ─────────── */
export const AboutPage = () => (
  <div className="min-h-screen bg-sky-50">
    <Navbar />
    <div className="relative bg-gradient-to-r from-sky-600 to-blue-700 pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div {...fi}>
          <h1 className="text-5xl font-black text-white mb-3">About Homents</h1>
          <p className="text-sky-200 text-xl max-w-2xl">Connecting Sri Lanka's homeowners with trusted, verified service professionals.</p>
        </motion.div>
      </div>
    </div>

    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Mission */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <motion.div {...fi}>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            Homents was built to solve a real problem — finding a reliable, skilled professional for home repairs and services should not be difficult or risky.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We created a platform that brings transparency, trust, and convenience to the home services industry in Sri Lanka. Every provider is manually vetted by our team before they appear on the platform.
          </p>
        </motion.div>
        <motion.div {...fi} transition={{...fi.transition,delay:0.2}}>
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&h=500&fit=crop"
            alt="Team" className="w-full rounded-3xl shadow-2xl shadow-sky-100" />
        </motion.div>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {[
          { Icon: Shield, title:'Verified Professionals', desc:'Every provider is ID-verified and admin-approved before listing on the platform.', color:'from-sky-400 to-blue-600' },
          { Icon: Star,   title:'Quality Guaranteed',     desc:'Real reviews and ratings from real customers ensure consistently high quality.', color:'from-amber-400 to-orange-500' },
          { Icon: Heart,  title:'Customer First',         desc:'Easy booking, transparent pricing, and responsive support at every step.', color:'from-rose-400 to-pink-500' },
        ].map((item, i) => (
          <motion.div key={i} {...fi} transition={{...fi.transition,delay:i*0.1}}
            className="bg-white rounded-3xl border border-sky-100 p-6 text-center shadow-sm hover:shadow-xl transition-all">
            <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <item.Icon size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-2">{item.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div {...fi} className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value:'10K+', label:'Happy Customers' },
            { value:'500+', label:'Verified Providers' },
            { value:'50K+', label:'Services Completed' },
            { value:'4.8',  label:'Average Rating' },
          ].map((s,i) => (
            <div key={i}>
              <div className="text-3xl font-black mb-1">{s.value}</div>
              <div className="text-sky-100 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
    <Footer />
  </div>
);

/* ─────────── CONTACT PAGE ─────────── */
export const ContactPage = () => {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! (Configure email in backend/.env for production)');
    setForm({ name:'', email:'', subject:'', message:'' });
  };

  return (
    <div className="min-h-screen bg-sky-50">
      <Navbar />
      <div className="relative bg-gradient-to-r from-sky-600 to-blue-700 pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div {...fi}>
            <h1 className="text-5xl font-black text-white mb-3">Contact Us</h1>
            <p className="text-sky-200 text-xl">We are here to help. Reach out anytime.</p>
          </motion.div>
        </div>
      </div>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div {...fi}>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Get In Touch</h2>
            <div className="space-y-4 mb-8">
              {[
                { Icon: Mail,  label:'Email',   val:'support@homents.com' },
                { Icon: Phone, label:'Phone',   val:'+94 77 123 4567' },
                { Icon: MapPin,label:'Address', val:'Colombo 03, Western Province, Sri Lanka' },
              ].map(({ Icon, label, val }, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-sky-100 shadow-sm">
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={17} className="text-sky-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                    <p className="font-semibold text-slate-800">{val}</p>
                  </div>
                </div>
              ))}
            </div>
            <img src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&h=300&fit=crop"
              alt="Contact" className="w-full rounded-2xl object-cover shadow-md" />
          </motion.div>

          <motion.div {...fi} transition={{...fi.transition,delay:0.2}}>
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-lg mb-5">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                  <input required className="input" placeholder="John Silva" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input type="email" required className="input" placeholder="you@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <input required className="input" placeholder="How can we help?" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea required className="input min-h-[120px] resize-none" placeholder="Your message…" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
                </div>
                <button type="submit" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                  <Send size={16} /> Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
