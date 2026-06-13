import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home size={17} className="text-white" />
              </div>
              <span className="text-2xl font-black">Homents</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Your trusted platform for finding nearby professional home service providers. Quick, reliable, and affordable.
            </p>
            <div className="flex gap-2.5">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-sky-500 rounded-xl flex items-center justify-center transition-all duration-300">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {[['/', 'Home'], ['/services', 'Services'], ['/providers', 'Find Providers'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-400 hover:text-sky-400 transition-colors text-sm font-medium">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Services</h3>
            <ul className="space-y-2.5">
              {['Electrician','Plumber','Cleaner','Tutor','Mechanic','Carpenter','Painter','AC Repair'].map(s => (
                <li key={s}>
                  <Link to={`/providers?category=${s}`} className="text-slate-400 hover:text-sky-400 transition-colors text-sm font-medium">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Contact Info</h3>
            <ul className="space-y-3">
              {[
                [Mail,  'support@homents.com'],
                [Phone, '+94 77 123 4567'],
                [MapPin,'Colombo, Sri Lanka'],
              ].map(([Icon, text], i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="w-8 h-8 bg-sky-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-sky-400" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">2024 Homents. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  );
}
