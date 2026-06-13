const Admin = require('./models/Admin');
const User = require('./models/User');
const Provider = require('./models/Provider');
const Booking = require('./models/Booking');
const { Review, Notification } = require('./models/Other');

const seedAll = async () => {
  // 1. First Admin
  const existingAdmin = await Admin.findOne({ isFirstAdmin: true }).catch(() => null);
  if (!existingAdmin) {
    const admin = new Admin({
      fullName: 'Ridmi P',
      email: 'jayawardhanaridmi0125@gmail.com',
      username: 'ridmi_p',
      password: '12345678rP@',
      role: 'super_admin',
      isFirstAdmin: true,
      mustChangePassword: false,
      twoFactorEnabled: false,
      isActive: true,
    });
    await admin.save();
    console.log('✅ Super Admin seeded: ridmi_p / 12345678rP@');
  }

  // 2. Demo Customers
  const customerData = [
    { fullName: 'Amara Perera',       email: 'amara@demo.com',  phone: '0771234567', city: 'Colombo',  password: 'Demo@1234' },
    { fullName: 'Kasun Silva',        email: 'kasun@demo.com',  phone: '0712345678', city: 'Kandy',    password: 'Demo@1234' },
    { fullName: 'Nimali De Mel',      email: 'nimali@demo.com', phone: '0761234567', city: 'Gampaha',  password: 'Demo@1234' },
    { fullName: 'Roshan Jayawardena', email: 'roshan@demo.com', phone: '0753456789', city: 'Negombo',  password: 'Demo@1234' },
  ];
  const createdCustomers = [];
  for (const c of customerData) {
    let u = await User.findOne({ email: c.email });
    if (!u) u = await User.create({ ...c, role: 'customer', isVerified: true });
    createdCustomers.push(u);
  }
  console.log(`✅ ${createdCustomers.length} demo customers ready`);

  // 3. Demo Providers
  const providerData = [
    { fullName: 'Chamara Bandara',    email: 'chamara@demo.com',  phone: '0774567890', nic: '901234567V', category: 'Electrician',   skills: 'Wiring, fault finding, panel upgrades, solar installation',      experience: 8,  hourlyRate: 1800, city: 'Colombo', bio: 'Certified electrician with 8 years experience. Available 24/7.', rating: 4.8, totalReviews: 42, completedJobs: 67, totalEarnings: 180000, password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
    { fullName: 'Suranga Kumara',     email: 'suranga@demo.com',  phone: '0765432109', nic: '881122334V', category: 'Plumber',       skills: 'Pipe fitting, leak repair, bathroom renovation, water heater', experience: 6,  hourlyRate: 1500, city: 'Colombo', bio: 'Expert plumber for residential and commercial solutions.',       rating: 4.6, totalReviews: 31, completedJobs: 48, totalEarnings: 120000, password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face' },
    { fullName: 'Priya Weerasinghe',  email: 'priya@demo.com',    phone: '0723456789', nic: '951234567V', category: 'Tutor',         skills: 'Mathematics, Physics, Chemistry, A/L and O/L',                 experience: 5,  hourlyRate: 1200, city: 'Kandy',   bio: '95% of my students achieve A grades. Patient and effective.',    rating: 4.9, totalReviews: 58, completedJobs: 120,totalEarnings: 90000,  password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face' },
    { fullName: 'Dilshan Rathnayake', email: 'dilshan@demo.com',  phone: '0754321098', nic: '870987654V', category: 'Cleaner',       skills: 'Deep cleaning, carpet cleaning, office cleaning',              experience: 4,  hourlyRate: 1000, city: 'Gampaha', bio: 'Professional cleaning with eco-friendly products.',              rating: 4.5, totalReviews: 27, completedJobs: 89, totalEarnings: 75000,  password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face' },
    { fullName: 'Ajith Fernando',     email: 'ajith@demo.com',    phone: '0711234567', nic: '851234567V', category: 'Mechanic',      skills: 'Engine overhaul, AC repair, electrical faults, servicing',     experience: 12, hourlyRate: 2000, city: 'Negombo', bio: 'Expert mechanic for all vehicle brands. Fast diagnostics.',      rating: 4.7, totalReviews: 63, completedJobs: 145,totalEarnings: 320000, password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face' },
    { fullName: 'Nimal Gunawardena',  email: 'nimal@demo.com',    phone: '0742345678', nic: '920123456V', category: 'Carpenter',     skills: 'Custom furniture, kitchen cabinets, wardrobes, repairs',       experience: 9,  hourlyRate: 1700, city: 'Colombo', bio: 'Master carpenter crafting quality woodwork to specification.',   rating: 4.8, totalReviews: 39, completedJobs: 72, totalEarnings: 210000, password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=300&fit=crop&crop=face' },
    { fullName: 'Samanthi Rodrigo',   email: 'samanthi@demo.com', phone: '0731234567', nic: '971234567V', category: 'Painter',       skills: 'Interior painting, exterior painting, texture finishes',       experience: 7,  hourlyRate: 1400, city: 'Colombo', bio: 'Flawless finishes for homes and commercial spaces.',             rating: 4.6, totalReviews: 22, completedJobs: 54, totalEarnings: 140000, password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b76c?w=300&h=300&fit=crop&crop=face' },
    { fullName: 'Rukshan Mendis',     email: 'rukshan@demo.com',  phone: '0768901234', nic: '891234567V', category: 'AC Repair',     skills: 'AC installation, servicing, gas refilling, all brands',        experience: 10, hourlyRate: 2200, city: 'Kandy',   bio: 'Authorized AC technician. Same-day service available.',          rating: 4.9, totalReviews: 71, completedJobs: 190,totalEarnings: 450000, password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face' },
    { fullName: 'Kavinda Jayasena',   email: 'kavinda@demo.com',  phone: '0779012345', nic: '931234567V', category: 'Technician',    skills: 'Computer repair, CCTV, networking, appliance repair',          experience: 6,  hourlyRate: 1600, city: 'Colombo', bio: 'IT & electronics expert. Quick turnaround, warranty on work.',  rating: 4.7, totalReviews: 35, completedJobs: 82, totalEarnings: 160000, password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face' },
    { fullName: 'Thilak Senaratne',   email: 'thilak@demo.com',   phone: '0756789012', nic: '861234567V', category: 'Garden Worker', skills: 'Lawn mowing, landscaping, tree trimming, pest control',        experience: 5,  hourlyRate: 900,  city: 'Gampaha', bio: 'Transform your garden into a paradise. Weekly or one-off jobs.',rating: 4.4, totalReviews: 18, completedJobs: 60, totalEarnings: 45000,  password: 'Demo@1234', profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face' },
  ];

  const createdProviders = [];
  for (const pd of providerData) {
    let provUser = await User.findOne({ email: pd.email });
    if (!provUser) provUser = await User.create({ fullName: pd.fullName, email: pd.email, phone: pd.phone, password: pd.password, role: 'provider', isVerified: true });
    let prov = await Provider.findOne({ email: pd.email });
    if (!prov) {
      prov = await Provider.create({
        user: provUser._id, fullName: pd.fullName, email: pd.email, phone: pd.phone,
        nic: pd.nic, category: pd.category, skills: pd.skills, experience: pd.experience,
        hourlyRate: pd.hourlyRate, city: pd.city, bio: pd.bio,
        isApproved: true, isAvailable: true, isActive: true,
        rating: pd.rating, totalReviews: pd.totalReviews,
        completedJobs: pd.completedJobs, totalEarnings: pd.totalEarnings,
        profilePhoto: pd.profilePhoto,
      });
    }
    createdProviders.push(prov);
  }
  console.log(`✅ ${createdProviders.length} demo providers ready`);

  // 4. Bookings
  const bookingCount = await Booking.countDocuments();
  if (bookingCount === 0 && createdCustomers.length && createdProviders.length) {
    const bData = [
      { customer: createdCustomers[0]._id, provider: createdProviders[0]._id, service: 'Fix electrical fault in kitchen',   scheduledDate: new Date(Date.now()-5*86400000), scheduledTime:'10:00', address:'12 Galle Rd, Colombo',   status:'completed', amount:3600, paymentStatus:'paid' },
      { customer: createdCustomers[1]._id, provider: createdProviders[1]._id, service: 'Fix leaking bathroom pipe',         scheduledDate: new Date(Date.now()-3*86400000), scheduledTime:'09:00', address:'45 Peradeniya Rd, Kandy', status:'completed', amount:2500, paymentStatus:'paid' },
      { customer: createdCustomers[2]._id, provider: createdProviders[2]._id, service: 'A/L Mathematics tutoring session',  scheduledDate: new Date(Date.now()+2*86400000), scheduledTime:'16:00', address:'8 Station Rd, Gampaha',   status:'accepted',  amount:2400 },
      { customer: createdCustomers[3]._id, provider: createdProviders[4]._id, service: 'Full vehicle service & oil change', scheduledDate: new Date(Date.now()+1*86400000), scheduledTime:'08:00', address:'22 Sea St, Negombo',     status:'pending',   amount:8000 },
      { customer: createdCustomers[0]._id, provider: createdProviders[3]._id, service: 'Deep clean 3-bedroom house',        scheduledDate: new Date(Date.now()-1*86400000), scheduledTime:'08:30', address:'12 Galle Rd, Colombo',   status:'completed', amount:5000, paymentStatus:'paid' },
      { customer: createdCustomers[1]._id, provider: createdProviders[5]._id, service: 'Build custom wardrobe unit',        scheduledDate: new Date(Date.now()+4*86400000), scheduledTime:'09:00', address:'45 Peradeniya Rd, Kandy', status:'accepted',  amount:15000 },
      { customer: createdCustomers[2]._id, provider: createdProviders[7]._id, service: 'AC installation and gas refill',    scheduledDate: new Date(Date.now()-2*86400000), scheduledTime:'11:00', address:'8 Station Rd, Gampaha',   status:'completed', amount:6500, paymentStatus:'paid' },
      { customer: createdCustomers[3]._id, provider: createdProviders[6]._id, service: 'Repaint living room walls',         scheduledDate: new Date(Date.now()+7*86400000), scheduledTime:'07:30', address:'22 Sea St, Negombo',     status:'pending',   amount:12000 },
    ];
    await Booking.insertMany(bData);
    await Review.insertMany([
      { customer: createdCustomers[0]._id, provider: createdProviders[0]._id, rating: 5, comment: 'Chamara was excellent! Fixed the issue fast and explained everything clearly.' },
      { customer: createdCustomers[1]._id, provider: createdProviders[1]._id, rating: 5, comment: 'Suranga sorted the leaking pipe in under an hour. Very professional.' },
      { customer: createdCustomers[2]._id, provider: createdProviders[2]._id, rating: 5, comment: 'Priya is a fantastic tutor. My son improved from C to A in one term.' },
      { customer: createdCustomers[0]._id, provider: createdProviders[3]._id, rating: 4, comment: 'Great deep cleaning job, house looks brand new. Will book again.' },
      { customer: createdCustomers[3]._id, provider: createdProviders[4]._id, rating: 5, comment: 'Ajith diagnosed and fixed my car the same day. Highly recommend.' },
      { customer: createdCustomers[2]._id, provider: createdProviders[7]._id, rating: 5, comment: 'Perfect AC installation. No issues at all. Very punctual.' },
    ]);
    await Notification.insertMany([
      { user: createdCustomers[0]._id, title: 'Booking Completed', message: 'Your electrical repair booking with Chamara Bandara is complete.', type: 'booking', isRead: false },
      { user: createdCustomers[2]._id, title: 'Booking Accepted',  message: 'Priya Weerasinghe accepted your tutoring booking.', type: 'booking', isRead: false },
      { user: createdCustomers[3]._id, title: 'New Booking',       message: 'Your vehicle service booking is awaiting confirmation.', type: 'booking', isRead: true },
    ]);
    console.log('✅ Demo bookings, reviews, and notifications seeded');
  }

  console.log('\n🎉 DEMO CREDENTIALS');
  console.log('   Admin    → ridmi_p / 12345678rP@');
  console.log('   Customer → amara@demo.com / Demo@1234');
  console.log('   Provider → chamara@demo.com / Demo@1234');
};

module.exports = seedAll;
