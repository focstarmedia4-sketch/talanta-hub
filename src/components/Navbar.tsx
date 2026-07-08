/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  MessageSquare, 
  LayoutDashboard, 
  Bell, 
  X, 
  PlusCircle, 
  UserPlus, 
  Check, 
  MapPin, 
  DollarSign, 
  FileText,
  ChevronDown,
  Home as HomeIcon,
  Search,
  Trash2,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';
import { FreelancerProfile, PlatformNotification, CreativeCategory, Job } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ImageCropperModal } from './ImageCropperModal';

const NAV_CATEGORIES: { id: CreativeCategory; label: string; icon: string }[] = [
  { id: 'actors', label: 'Actors and Performing Artists', icon: '🎭' },
  { id: 'baking', label: 'Baking & Cake Art', icon: '🎂' },
  { id: 'beauty', label: 'BEAUTY AND MAKEUP ARTISTS', icon: '💄' },
  { id: 'branding', label: 'BRANDING', icon: '🏷️' },
  { id: 'content', label: 'Content Creation', icon: '✍️' },
  { id: 'marketing', label: 'Digital Marketing', icon: '📈' },
  { id: 'organizers', label: 'EVENT ORGANIZERS', icon: '📅' },
  { id: 'decorators', label: 'EVENT STYLISTS AND DECORATORS', icon: '✨' },
  { id: 'hospitality', label: 'EVENT USHERS AND HOSPITALITY', icon: '🤝' },
  { id: 'events', label: 'Events (MCs, Decor, DJs, Sound)', icon: '🎤' },
  { id: 'fashion', label: 'Fashion', icon: '👗' },
  { id: 'fineartist', label: 'FINE ARTISTS', icon: '🎨' },
  { id: 'florists', label: 'FLORISTS AND FLORAL DESIGNERS', icon: '💐' },
  { id: 'design', label: 'Graphic Design', icon: '🎨' },
  { id: 'illustration', label: 'Illustration', icon: '✏️' },
  { id: 'interiordesign', label: 'INTERIOR DESIGN', icon: '🏠' },
  { id: 'musicproducers', label: 'MUSIC PRODUCERS', icon: '🎹' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'writers', label: 'Scripts Writers', icon: '📝' },
  { id: 'videography', label: 'Videography', icon: '🎥' },
  { id: 'webdev', label: 'Web Design & Development', icon: '💻' }
];

const KENYAN_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka-Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

function CountySelector({
  value,
  onChange
}: {
  value: string;
  onChange: (county: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm cursor-pointer text-left"
      >
        <span className="text-slate-700 font-medium">{value} County</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[70] flex flex-col overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-150 sticky top-0 z-10">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Kenyan Counties</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Close Dropdown"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
            {KENYAN_COUNTIES.map((county) => (
              <button
                key={county}
                type="button"
                onClick={() => {
                  onChange(county);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer block ${
                  value === county 
                    ? 'bg-indigo-50/70 font-extrabold text-indigo-600' 
                    : 'text-slate-700'
                }`}
              >
                {county} County
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface NavbarProps {
  currentTab: 'home' | 'browse' | 'jobs' | 'inbox' | 'dashboard';
  onChangeTab: (tab: 'home' | 'browse' | 'jobs' | 'inbox' | 'dashboard') => void;
  activeRole: 'client' | string; // string is freelancer.id
  onChangeRole: (role: 'client' | string) => void;
  freelancers: FreelancerProfile[];
  notifications: PlatformNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onPostJob: (newJob: Omit<Job, 'id' | 'postedDate' | 'applicantsCount'>) => void;
  onJoinAsCreative: (newCreative: {
    fullName: string;
    username: string;
    categories: CreativeCategory[];
    hourlyRate: number;
    bio: string;
    location: string;
    skills: string[];
    email?: string;
    phone?: string;
    whatsapp?: string;
    avatarUrl?: string;
    coverUrl?: string;
    password?: string;
  }) => void;
  selectedCategory: CreativeCategory | 'all';
  onSelectCategory: (cat: CreativeCategory | 'all') => void;
  onUpdateProfile?: (updated: FreelancerProfile) => void;
  onSelectJobId?: (id: string | null) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onLogin?: (roleId: string) => void;
}

export default function Navbar({
  currentTab,
  onChangeTab,
  activeRole,
  onChangeRole,
  freelancers,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onPostJob,
  onJoinAsCreative,
  selectedCategory,
  onSelectCategory,
  onUpdateProfile,
  onSelectJobId,
  isLoggedIn = true,
  onLogout = () => {},
  onLogin = () => {}
}: NavbarProps) {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const mobileCategoryDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const mobileNotificationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        categoryDropdownRef.current && 
        !categoryDropdownRef.current.contains(event.target as Node) &&
        (!mobileCategoryDropdownRef.current || !mobileCategoryDropdownRef.current.contains(event.target as Node))
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        accountDropdownRef.current && 
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
      }
      if (
        notificationDropdownRef.current && 
        !notificationDropdownRef.current.contains(event.target as Node) &&
        (!mobileNotificationDropdownRef.current || !mobileNotificationDropdownRef.current.contains(event.target as Node))
      ) {
        setShowNotificationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  
  // Post Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [jobCategory, setJobCategory] = useState<CreativeCategory>('videography');
  const [jobBudget, setJobBudget] = useState('');
  const [jobLocation, setJobLocation] = useState('Nairobi County');
  const [jobDescription, setJobDescription] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deliveryDeadline, setDeliveryDeadline] = useState('');

  // Location Tab States
  const [creativeLocationTab, setCreativeLocationTab] = useState<'county' | 'custom'>('county');
  const [creativeCounty, setCreativeCounty] = useState('Nairobi');

  const [jobLocationTab, setJobLocationTab] = useState<'county' | 'custom'>('county');
  const [jobCounty, setJobCounty] = useState('Nairobi');

  const handleCreativeLocationTabChange = (tab: 'county' | 'custom') => {
    setCreativeLocationTab(tab);
    if (tab === 'county') {
      setCreativeLocation(creativeCounty + " County");
    } else {
      setCreativeLocation('');
    }
  };

  const handleCreativeCountyChange = (county: string) => {
    setCreativeCounty(county);
    setCreativeLocation(county + " County");
  };

  const handleJobLocationTabChange = (tab: 'county' | 'custom') => {
    setJobLocationTab(tab);
    if (tab === 'county') {
      setJobLocation(jobCounty + " County");
    } else {
      setJobLocation('');
    }
  };

  const handleJobCountyChange = (county: string) => {
    setJobCounty(county);
    setJobLocation(county + " County");
  };

  // Join Creative form state
  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
  ];

  const COVER_PRESETS = [
    'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200'
  ];

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [creativeCategories, setCreativeCategories] = useState<CreativeCategory[]>([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState('');
  const [cropperType, setCropperType] = useState<'avatar' | 'banner'>('avatar');

  const handleCropperSave = (croppedDataUrl: string, zoom: number, pan: { x: number; y: number }, originalImageSrc: string) => {
    if (isFreelancer && selectedFreelancer && onUpdateProfile) {
      if (cropperType === 'avatar') {
        onUpdateProfile({
          ...selectedFreelancer,
          avatarUrl: croppedDataUrl,
          avatarZoom: zoom,
          avatarPanX: pan.x,
          avatarPanY: pan.y,
          originalAvatarUrl: originalImageSrc || croppedDataUrl
        });
      } else {
        onUpdateProfile({
          ...selectedFreelancer,
          coverUrl: croppedDataUrl,
          coverZoom: zoom,
          coverPanX: pan.x,
          coverPanY: pan.y,
          originalCoverUrl: originalImageSrc || croppedDataUrl
        });
      }
    } else {
      if (cropperType === 'avatar') {
        setAvatarUrl(croppedDataUrl);
      } else {
        setCoverUrl(croppedDataUrl);
      }
    }
    setCropperOpen(false);
  };
  const [hourlyRate, setHourlyRate] = useState<string>('3500');
  const [creativeLocation, setCreativeLocation] = useState('Nairobi County');
  const [bio, setBio] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [creativeEmail, setCreativeEmail] = useState('');
  const [creativePhone, setCreativePhone] = useState('');
  const [creativeWhatsapp, setCreativeWhatsapp] = useState('');

  // Unified Authentication States
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const unreadNotifications = notifications.filter(n => !n.read);
  const selectedFreelancer = freelancers.find(f => f.id === activeRole);
  const isFreelancer = isLoggedIn && activeRole !== 'client';

  const preferredCategoryNotifications = notifications.filter(n => {
    if (!isFreelancer || !selectedFreelancer) return false;
    const isForMe = n.id.endsWith(`_${selectedFreelancer.id}`);
    const isPreferredCategory = n.category && selectedFreelancer.subscribedCategories?.includes(n.category);
    return isForMe || isPreferredCategory;
  });
  const preferredCategoryUnreadCount = preferredCategoryNotifications.filter(n => !n.read).length;

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !clientName || !jobBudget || !jobLocation || !jobDescription || !clientEmail || !clientPhone || !clientWhatsapp || !startDate || !deliveryDeadline) return;

    onPostJob({
      title: jobTitle,
      clientName,
      clientCompany: clientCompany || undefined,
      category: jobCategory,
      budgetRange: jobBudget,
      location: jobLocation,
      description: jobDescription,
      clientEmail,
      clientPhone,
      clientWhatsapp,
      startDate,
      deliveryDeadline
    });

    // Reset fields & close
    setJobTitle('');
    setClientName('');
    setClientCompany('');
    setJobBudget('');
    setJobLocation('Nairobi County');
    setJobLocationTab('county');
    setJobCounty('Nairobi');
    setJobDescription('');
    setClientEmail('');
    setClientPhone('');
    setClientWhatsapp('');
    setStartDate('');
    setDeliveryDeadline('');
    setShowPostModal(false);
    onChangeTab('jobs');
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!signinEmail || !signinPassword) {
      setAuthError('Please fill in all fields.');
      return;
    }

    // Try to find matching user in freelancers list
    const found = freelancers.find(f => f.email?.toLowerCase().trim() === signinEmail.toLowerCase().trim());
    if (found) {
      const actualPassword = found.password || 'password123';
      if (signinPassword === actualPassword) {
        // Success login!
        onChangeRole(found.id);
        onLogin(found.id);
        onChangeTab('dashboard');
        setShowJoinModal(false);
        setSigninEmail('');
        setSigninPassword('');
        setAuthSuccess('Logged in successfully!');
      } else {
        setAuthError('Incorrect password. Please try again.');
      }
    } else {
      setAuthError('No creative profile registered under this email. Go to the Sign Up tab to register.');
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!forgotEmail) {
      setAuthError('Please enter your email.');
      return;
    }

    // Check if matching email exists in our freelancers list
    const found = freelancers.find(f => f.email?.toLowerCase().trim() === forgotEmail.toLowerCase().trim());
    if (found) {
      const actualPassword = found.password || 'password123';
      setAuthSuccess(`Account recovered! A secure recovery link has been sent to ${forgotEmail}. For quick local testing, your password is "${actualPassword}".`);
    } else {
      setAuthError('No registered profile found with that email.');
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!fullName || !username || !bio || !creativeLocation || !creativeEmail || !creativePhone || !creativeWhatsapp || !signupPassword) {
      setAuthError("Please fill in all required fields including password.");
      return;
    }

    if (signupPassword.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setAuthError("Confirm password does not match password.");
      return;
    }

    if (creativeCategories.length === 0) {
      setAuthError("Please select at least one creative field.");
      return;
    }

    // Check if username already exists
    if (freelancers.some(f => f.username === username.toLowerCase().trim())) {
      setAuthError("Username is already taken. Please choose another.");
      return;
    }

    // Check if email already exists
    if (freelancers.some(f => f.email?.toLowerCase().trim() === creativeEmail.toLowerCase().trim())) {
      setAuthError("A profile is already registered with this email. Please Sign In.");
      return;
    }

    // Parse comma separated skills
    const skills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    onJoinAsCreative({
      fullName,
      username: username.toLowerCase().replace(/\s+/g, '_'),
      categories: creativeCategories,
      hourlyRate: parseInt(hourlyRate) || 3500,
      bio,
      location: creativeLocation,
      skills: skills.length > 0 ? skills : ['Creative Production', 'Visuals'],
      email: creativeEmail,
      phone: creativePhone,
      whatsapp: creativeWhatsapp,
      avatarUrl,
      coverUrl,
      password: signupPassword
    });

    // Reset fields & close
    setFullName('');
    setUsername('');
    setBio('');
    setSkillsText('');
    setCreativeEmail('');
    setCreativePhone('');
    setCreativeWhatsapp('');
    setCreativeLocation('Nairobi County');
    setCreativeLocationTab('county');
    setCreativeCounty('Nairobi');
    setCreativeCategories([]);
    setAvatarUrl('');
    setCoverUrl('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setShowJoinModal(false);
  };

  return (
    <header className="bg-[#87cefa] border-b border-[#72bbf0] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left side: Branding and navigation links */}
        <div className="flex items-center gap-6 xl:gap-8 shrink-0">
          {/* 1. LOGO */}
          <div 
            id="brand_logo"
            onClick={() => onChangeTab('home')}
            className="flex items-center justify-center cursor-pointer shrink-0 hover:opacity-95 transition-opacity bg-white px-3 py-1.5 rounded-xl shadow-sm border border-white/30 h-12 overflow-hidden"
          >
            <img 
              src="/logo.png" 
              className="h-11 w-auto max-w-[180px] object-contain transition-transform duration-200 scale-140"
              alt="Talanta Hub Logo"
            />
          </div>

          {/* Navigation links (Home, Explore Talents, Job Market, Post a Job) */}
          <nav className="hidden lg:flex items-center gap-4">
            {/* 1. HOME */}
            <button
              onClick={() => onChangeTab('home')}
              className={`h-10 flex items-center gap-1.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                currentTab === 'home' 
                  ? 'bg-indigo-950 text-white font-extrabold border-indigo-950 shadow-inner' 
                  : 'bg-black/5 text-indigo-950 hover:text-indigo-950 hover:bg-black/10 border-indigo-900/10'
              }`}
            >
              <span>Home</span>
            </button>

            {/* 2. EXPLORE TALENTS WITH CATEGORY SELECTOR */}
            <div ref={categoryDropdownRef} className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={`h-10 flex items-center gap-1.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  currentTab === 'browse' 
                    ? 'bg-indigo-950 text-white font-extrabold border-indigo-950 shadow-inner' 
                    : 'bg-black/5 text-indigo-950 hover:text-indigo-950 hover:bg-black/10 border-indigo-900/10'
                }`}
              >
                <span>{selectedCategory !== 'all' ? (NAV_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Explore Talents') : 'Explore Talents'}</span>
                <span className="text-[9px] opacity-60 ml-0.5">▼</span>
              </button>

              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 grid grid-cols-1 gap-1 max-h-72 overflow-y-auto"
                  >
                    <button
                      onClick={() => {
                        onSelectCategory('all');
                        setShowCategoryDropdown(false);
                      }}
                      className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-indigo-600 text-white font-extrabold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>All Creatives</span>
                    </button>

                    <div className="h-px bg-slate-100 my-1" />

                    {NAV_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.id);
                          setShowCategoryDropdown(false);
                        }}
                        className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-indigo-600 text-white font-extrabold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{cat.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* 3. JOB MARKET */}
            <button
              onClick={() => onChangeTab('jobs')}
              className={`h-10 flex items-center gap-1.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                currentTab === 'jobs' 
                  ? 'bg-indigo-950 text-white font-extrabold border-indigo-950 shadow-inner' 
                  : 'bg-black/5 text-indigo-950 hover:text-indigo-950 hover:bg-black/10 border-indigo-900/10'
              }`}
            >
              <span>Job Market</span>
            </button>

            {/* 4. POST A JOB */}
            <button
              onClick={() => setShowPostModal(true)}
              className="h-10 flex items-center gap-1.5 px-4 bg-black/5 hover:bg-black/10 text-indigo-950 hover:text-indigo-950 border border-indigo-900/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-emerald-600" />
              <span>Post a Job</span>
            </button>
          </nav>
        </div>

        {/* Right side actions and user session controls grouped beautifully */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* 5. JOIN AS CREATIVE or MY DASHBOARD with Notification Bell */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {isFreelancer ? (
                <>
                  <button
                    onClick={() => onChangeTab('dashboard')}
                    className={`h-10 flex items-center gap-1.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98 border ${
                      currentTab === 'dashboard'
                        ? 'bg-[#517f9b] text-white border-[#517f9b] hover:bg-[#436b84]'
                        : 'bg-black/5 hover:bg-black/10 text-indigo-950 border border-indigo-900/10'
                    }`}
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-indigo-600" />
                    <span>My Dashboard</span>
                  </button>

                  {/* Preferred Category Notification Bell */}
                  <div ref={notificationDropdownRef} className="relative">
                    <button
                      onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                      className={`relative h-10 w-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                        showNotificationDropdown
                          ? 'bg-indigo-950 border-indigo-950 text-white'
                          : 'bg-black/5 hover:bg-black/10 border-indigo-900/10 text-indigo-950'
                      }`}
                      title="Preferred Category Job Alerts"
                    >
                      <Bell className="h-4 w-4" />
                      {preferredCategoryUnreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-[#87cefa] animate-bounce">
                          {preferredCategoryUnreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {showNotificationDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-white"
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black uppercase tracking-wider text-indigo-300">Job Alerts</span>
                              {preferredCategoryUnreadCount > 0 && (
                                <span className="text-[10px] bg-indigo-950 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded-full">
                                  {preferredCategoryUnreadCount} New
                                </span>
                              )}
                            </div>
                            {preferredCategoryNotifications.length > 0 && (
                              <button
                                onClick={() => {
                                  preferredCategoryNotifications.forEach(n => onMarkNotificationRead(n.id));
                                }}
                                className="text-[10px] text-indigo-400 hover:underline font-bold"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>

                          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                            {preferredCategoryNotifications.length === 0 ? (
                              <div className="py-8 text-center text-slate-500">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30 stroke-1" />
                                <p className="text-xs font-semibold text-slate-400">No job alerts yet</p>
                                <p className="text-[10px] mt-1 max-w-[200px] mx-auto leading-relaxed text-slate-500">
                                  You will be notified here whenever clients publish briefs matching your subscribed specialties.
                                </p>
                              </div>
                            ) : (
                              preferredCategoryNotifications.map((notif) => (
                                <div
                                  key={notif.id}
                                  onClick={() => {
                                    onMarkNotificationRead(notif.id);
                                    if (notif.jobId && onSelectJobId) {
                                      onSelectJobId(notif.jobId);
                                    }
                                    onChangeTab('jobs');
                                    setShowNotificationDropdown(false);
                                  }}
                                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                                    notif.read
                                      ? 'bg-slate-950/40 border-slate-800 hover:bg-slate-850/50'
                                      : 'bg-indigo-950/20 border-indigo-900/60 hover:bg-indigo-950/35'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-1 mb-1">
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${notif.read ? 'text-slate-400' : 'text-indigo-400'}`}>
                                      {notif.title}
                                    </span>
                                    <span className="text-[9px] text-slate-500 font-medium shrink-0">
                                      {notif.timestamp}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                                    {notif.message}
                                  </p>
                                  <div className="mt-1.5 flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-indigo-400 group-hover:underline">
                                      Click to view brief
                                    </span>
                                    {!notif.read && (
                                      <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full" />
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalTab('signup');
                    setAuthError(null);
                    setAuthSuccess(null);
                    setShowJoinModal(true);
                  }}
                  className="h-10 flex items-center gap-1.5 px-4 bg-[#517f9b] hover:bg-[#436b84] text-white border border-[#4e7994] rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98"
                >
                  <UserPlus className="h-3.5 w-3.5 text-indigo-100" />
                  <span>Join as Creative</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalTab('signin');
                  setAuthError(null);
                  setAuthSuccess(null);
                  setShowJoinModal(true);
                }}
                className="h-10 flex items-center gap-2 px-4 bg-[#517f9b] hover:bg-[#436b84] text-white border border-[#4e7994] rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98"
              >
                <UserPlus className="h-3.5 w-3.5 text-indigo-100" />
                <span>Signup/Sign In</span>
              </button>
            </div>
          )}

          {/* Vertical Separator */}
          {isLoggedIn && <div className="h-6 w-px bg-indigo-900/20 self-center" />}

          {/* Active Session & Account Customizer Dropdown */}
          {isLoggedIn && (
            <div ref={accountDropdownRef} className="relative">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="h-10 flex items-center gap-2 px-3.5 bg-black/5 hover:bg-black/10 border border-indigo-900/10 rounded-xl transition-all cursor-pointer text-indigo-950 text-xs font-extrabold shadow-sm"
              >
                <div className="h-6 w-6 rounded-full overflow-hidden border border-indigo-900/20 shrink-0 bg-slate-800">
                  {isFreelancer && selectedFreelancer?.avatarUrl ? (
                    <img src={selectedFreelancer.avatarUrl} alt={selectedFreelancer.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-950 flex items-center justify-center text-indigo-200 text-[10px] font-black">
                      CL
                    </div>
                  )}
                </div>
                <span className="max-w-[100px] truncate uppercase tracking-wider text-[11px]">
                  {isFreelancer ? selectedFreelancer?.fullName : 'Client Partner'}
                </span>
                <ChevronDown className={`h-3 w-3 text-indigo-950 transition-transform duration-200 ${showAccountDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showAccountDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-100 shadow-2xl p-4 z-50 space-y-4 text-left text-slate-800"
                  >
                    {/* Primary Navigation Shortcuts */}
                    <div className="space-y-1 pt-1">
                      {isFreelancer && (
                        <>
                          <button
                            onClick={() => {
                              onChangeTab('dashboard');
                              setShowAccountDropdown(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                          >
                            <LayoutDashboard className="h-4 w-4 text-indigo-600" />
                            <span>Go to My Dashboard</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              onChangeTab('browse');
                              // Inject query parameter to focus their profile
                              const url = new URL(window.location.href);
                              url.searchParams.set('profile', selectedFreelancer?.username || '');
                              window.history.pushState({}, '', url);
                              // trigger tab update in React
                              onChangeTab('browse');
                              setShowAccountDropdown(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                          >
                            <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span>View My Live Portfolio</span>
                          </button>
                        </>
                      )}

                      {!isFreelancer && (
                        <button
                          onClick={() => {
                            setShowJoinModal(true);
                            setShowAccountDropdown(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-sm text-center justify-center uppercase tracking-wider"
                        >
                          <UserPlus className="h-4 w-4 text-indigo-200" />
                          <span>Join as a Creative</span>
                        </button>
                      )}
                    </div>

                    {/* Log Out Option */}
                    <div className="pt-3 border-t border-slate-150">
                      <button
                        onClick={() => {
                          onLogout();
                          onChangeTab('home');
                          setShowAccountDropdown(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-black rounded-xl transition-all cursor-pointer border border-rose-100 uppercase tracking-wider"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
      </div>
    </div>

      {/* Mobile sub-tabs */}
      <div ref={mobileCategoryDropdownRef} className="relative flex lg:hidden items-center justify-around bg-[#87cefa] border-t border-[#72bbf0] p-2 text-[11px] font-bold">
        {/* Mobile Category Dropdown List */}
        <AnimatePresence>
          {showCategoryDropdown && (
            <>
              <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40" onClick={() => setShowCategoryDropdown(false)} />
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute bottom-16 left-4 right-4 bg-slate-900 border border-slate-800 rounded-2xl max-h-72 overflow-y-auto shadow-2xl p-2 z-50 grid grid-cols-1 gap-1 text-left"
              >
                <div className="px-3.5 py-1.5 text-[9px] uppercase tracking-wider text-indigo-300 font-extrabold border-b border-slate-800 mb-1">
                  Select Creative Specialty
                </div>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    setShowCategoryDropdown(false);
                  }}
                  className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'text-indigo-200/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>All Creatives</span>
                </button>

                {NAV_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setShowCategoryDropdown(false);
                    }}
                    className={`flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white font-extrabold'
                        : 'text-indigo-200/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <button 
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'home' ? 'text-indigo-950 font-extrabold' : 'text-indigo-900/60 hover:text-indigo-950'}`}
        >
          <HomeIcon className="h-4 w-4" />
          <span>Home</span>
        </button>

        <button 
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'browse' ? 'text-indigo-950 font-extrabold' : 'text-indigo-900/60 hover:text-indigo-950'}`}
        >
          <Sparkles className="h-4 w-4" />
          <span className="flex items-center gap-0.5">{selectedCategory !== 'all' ? (NAV_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Explore') : 'Explore'} <span className="text-[7px]">▼</span></span>
        </button>
        <button 
          onClick={() => onChangeTab('jobs')}
          className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'jobs' ? 'text-indigo-950 font-extrabold' : 'text-indigo-900/60 hover:text-indigo-950'}`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Market</span>
        </button>
        <button 
          onClick={() => setShowPostModal(true)}
          className="flex flex-col items-center gap-1 p-2 text-indigo-900/60 hover:text-indigo-950"
        >
          <PlusCircle className="h-4 w-4 text-emerald-600" />
          <span>Post Job</span>
        </button>
        {isFreelancer ? (
          <>
            <button 
              onClick={() => onChangeTab('dashboard')}
              className={`flex flex-col items-center gap-1 p-2 ${currentTab === 'dashboard' ? 'text-indigo-950 font-extrabold' : 'text-indigo-900/60 hover:text-indigo-950'}`}
            >
              <LayoutDashboard className="h-4 w-4 text-indigo-950" />
              <span>Dashboard</span>
            </button>

            <div ref={mobileNotificationDropdownRef} className="relative">
              <button 
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className={`flex flex-col items-center gap-1 p-2 relative ${showNotificationDropdown ? 'text-indigo-950 font-extrabold' : 'text-indigo-900/60 hover:text-indigo-950'}`}
              >
                <div className="relative">
                  <Bell className="h-4 w-4 text-indigo-950" />
                  {preferredCategoryUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 text-[6px] font-black text-white" />
                  )}
                </div>
                <span>Alerts</span>
              </button>

              <AnimatePresence>
                {showNotificationDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute bottom-16 right-0 w-72 bg-slate-900 border border-slate-800 rounded-2xl max-h-72 overflow-y-auto shadow-2xl p-4 z-50 text-white text-left"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-300">Job Alerts</span>
                        {preferredCategoryUnreadCount > 0 && (
                          <span className="text-[10px] bg-indigo-950 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded-full">
                            {preferredCategoryUnreadCount} New
                          </span>
                        )}
                      </div>
                      {preferredCategoryNotifications.length > 0 && (
                        <button
                          onClick={() => {
                            preferredCategoryNotifications.forEach(n => onMarkNotificationRead(n.id));
                          }}
                          className="text-[10px] text-indigo-400 hover:underline font-bold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {preferredCategoryNotifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-30 stroke-1" />
                          <p className="text-xs font-semibold text-slate-400">No job alerts yet</p>
                          <p className="text-[10px] mt-1 max-w-[200px] mx-auto leading-relaxed text-slate-500">
                            You'll be notified of matching jobs in your preferred categories.
                          </p>
                        </div>
                      ) : (
                        preferredCategoryNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              onMarkNotificationRead(notif.id);
                              if (notif.jobId && onSelectJobId) {
                                onSelectJobId(notif.jobId);
                              }
                              onChangeTab('jobs');
                              setShowNotificationDropdown(false);
                            }}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer group ${
                              notif.read
                                ? 'bg-slate-950/40 border-slate-800 hover:bg-slate-850/50'
                                : 'bg-indigo-950/20 border-indigo-900/60 hover:bg-indigo-950/35'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <span className={`text-[10px] font-black uppercase tracking-wider ${notif.read ? 'text-slate-400' : 'text-indigo-400'}`}>
                                {notif.title}
                              </span>
                              <span className="text-[9px] text-slate-500 font-medium shrink-0">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <div className="mt-1.5 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-indigo-400 group-hover:underline">
                                Click to view brief
                              </span>
                              {!notif.read && (
                                <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {
                setAuthModalTab('signin');
                setAuthError(null);
                setAuthSuccess(null);
                setShowJoinModal(true);
              }}
              className="flex flex-col items-center gap-1 p-2 text-indigo-200/60 cursor-pointer"
            >
              <UserPlus className="h-4 w-4 text-indigo-300" />
              <span>Sign In</span>
            </button>
            <button 
              onClick={() => {
                setAuthModalTab('signup');
                setAuthError(null);
                setAuthSuccess(null);
                setShowJoinModal(true);
              }}
              className="flex flex-col items-center gap-1 p-2 text-indigo-200/60 cursor-pointer"
            >
              <UserPlus className="h-4 w-4 text-indigo-400" />
              <span>Join</span>
            </button>
          </div>
        )}
      </div>

      {/* A. POST A JOB MODAL */}
      <AnimatePresence>
        {showPostModal && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setShowPostModal(false)}
          >
            {/* Shouting close button outside the modal card */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPostModal(false);
              }}
              className="fixed top-4 right-4 md:top-8 md:right-8 p-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-[60] flex items-center justify-center border-2 border-white group"
              title="Close"
            >
              <X className="h-7 w-7 stroke-[2.5]" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative max-h-[90vh] flex flex-col text-left overflow-hidden cursor-default"
            >
              <div className="overflow-y-auto p-6 md:p-8 space-y-6 flex-1 pr-12 md:pr-14">
                <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Post a Job Brief</h2>
                </div>
                <p className="text-xs md:text-sm text-slate-400">Specify requirements for Kenya's leading creatives to view and bid.</p>
              </div>

              <form onSubmit={handlePostJobSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Foster"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Company / Org</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Agency"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Graphic Designer for Packaging rebrand"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Core Category *</label>
                    <select
                      value={jobCategory}
                      onChange={(e: any) => setJobCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm cursor-pointer"
                    >
                      {NAV_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Budget Allocation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KSh 30,000 - 50,000"
                      value={jobBudget}
                      onChange={(e) => setJobBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Location Requirements *</label>
                    {/* Location selector tabs */}
                    <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => handleJobLocationTabChange('county')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          jobLocationTab === 'county'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Select County
                      </button>
                      <button
                        type="button"
                        onClick={() => handleJobLocationTabChange('custom')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          jobLocationTab === 'custom'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Custom Location
                      </button>
                    </div>
                  </div>

                  {jobLocationTab === 'county' ? (
                    <CountySelector
                      value={jobCounty}
                      onChange={handleJobCountyChange}
                    />
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Remote / Nairobi / Westlands"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Project Execution Date *</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Delivery Deadline *</label>
                    <input
                      type="date"
                      required
                      value={deliveryDeadline}
                      onChange={(e) => setDeliveryDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Project Specifications & Scope *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Detail the deliverable, aesthetic guides, timelines, and tools required..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm resize-none"
                  />
                </div>

                {/* Required Contact Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block font-bold">Required Contact Details</div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. j.foster@agency.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Call Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +254 712 345678"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +254 712 345678"
                        value={clientWhatsapp}
                        onChange={(e) => setClientWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer text-sm uppercase tracking-wider"
                  >
                    Publish Project Brief
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* B. JOIN AS CREATIVE MODAL */}
      <AnimatePresence>
        {showJoinModal && (
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setShowJoinModal(false)}
          >
            {/* Shouting close button outside the modal card */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowJoinModal(false);
              }}
              className="fixed top-4 right-4 md:top-8 md:right-8 p-3.5 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer z-[60] flex items-center justify-center border-2 border-white group"
              title="Close"
            >
              <X className="h-7 w-7 stroke-[2.5]" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative max-h-[90vh] flex flex-col text-left overflow-hidden cursor-default"
            >
              <div className="overflow-y-auto p-6 md:p-8 space-y-6 flex-1 pr-12 md:pr-14">
                {/* Unified Auth Header / Tabs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                      {authModalTab === 'signin' && "Creative Sign In"}
                      {authModalTab === 'signup' && "Join as a Creative"}
                      {authModalTab === 'forgot' && "Recover Creative Account"}
                    </h2>
                  </div>
                  
                  {/* Tab Selector */}
                  <div className="flex border-b border-slate-100 gap-4 text-xs font-bold text-slate-450 pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalTab('signin');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className={`pb-2 border-b-2 transition-all cursor-pointer ${
                        authModalTab === 'signin'
                          ? 'border-indigo-600 text-indigo-600 font-black'
                          : 'border-transparent hover:text-slate-700'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalTab('signup');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className={`pb-2 border-b-2 transition-all cursor-pointer ${
                        authModalTab === 'signup'
                          ? 'border-indigo-600 text-indigo-600 font-black'
                          : 'border-transparent hover:text-slate-700'
                      }`}
                    >
                      Sign Up (Join)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalTab('forgot');
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className={`pb-2 border-b-2 transition-all cursor-pointer ${
                        authModalTab === 'forgot'
                          ? 'border-indigo-600 text-indigo-600 font-black'
                          : 'border-transparent hover:text-slate-700'
                      }`}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 bg-rose-50 border border-rose-150 text-rose-600 text-xs rounded-xl flex items-center gap-2 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {authSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {/* SIGN IN VIEW */}
                {authModalTab === 'signin' && (
                  <>
                    <form onSubmit={handleSignInSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. creative@domain.com"
                          value={signinEmail}
                          onChange={(e) => setSigninEmail(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white p-3 font-semibold text-slate-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Password *</label>
                        <input
                          type="password"
                          required
                          placeholder="Enter password"
                          value={signinPassword}
                          onChange={(e) => setSigninPassword(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white p-3 font-semibold text-slate-900"
                        />
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer text-xs uppercase tracking-wider"
                        >
                          Sign In as Creative
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowJoinModal(false)}
                          className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>


                  </>
                )}

                {/* FORGOT PASSWORD VIEW */}
                {authModalTab === 'forgot' && (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Enter the email address registered with your creative workspace. We will search for your account details and retrieve your password for local testing.
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Registered Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. creative@domain.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white p-3 font-semibold text-slate-900"
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer text-xs uppercase tracking-wider"
                      >
                        Search & Retrieve Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowJoinModal(false)}
                        className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* SIGN UP VIEW */}
                {authModalTab === 'signup' && (
                  <form onSubmit={handleJoinSubmit} className="space-y-4">
                {/* INTERACTIVE PROFILE BANNER & PROFILE PHOTO PREVIEW & CUSTOMIZER */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Customize Profile Visuals</span>
                  <div className="relative h-28 sm:h-32 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                    {/* Banner Image */}
                    {coverUrl ? (
                      <img 
                        src={coverUrl} 
                        alt="Banner Preview" 
                        className="w-full h-full object-cover transition-opacity duration-300" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />
                    )}
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Banner Pencil Overlay Edit Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setCropperImageSrc(coverUrl);
                        setCropperType('banner');
                        setCropperOpen(true);
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border border-white/10 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 z-10 flex items-center gap-1 px-2 text-[10px] font-bold"
                      title="Edit Banner Image"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit Banner</span>
                    </button>

                    {/* Avatar circle centered overlay */}
                    <div className="absolute inset-x-0 bottom-2 flex flex-col items-center justify-center">
                      <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-white bg-slate-100 shadow-md overflow-hidden group/avatar flex items-center justify-center">
                        {avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt="Avatar Preview" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-150 flex items-center justify-center text-slate-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all duration-200" />
                        
                        {/* Avatar Pencil Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setCropperImageSrc(avatarUrl);
                            setCropperType('avatar');
                            setCropperOpen(true);
                          }}
                          className="absolute inset-0 flex items-center justify-center text-white cursor-pointer transition-all hover:scale-110"
                          title="Edit Profile Photo"
                        >
                          <svg className="h-4 w-4 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Macharia"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Creative Username *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. macharia_visuals"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm font-semibold text-indigo-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                      Creative Fields *
                    </label>
                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {creativeCategories.length} Selected
                    </span>
                  </div>

                  {/* Dropdown Toggle Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs sm:text-sm font-semibold text-slate-750 flex items-center justify-between transition-all cursor-pointer shadow-sm hover:bg-slate-50"
                    >
                      <span className="truncate pr-4 text-slate-600">
                        {creativeCategories.length === 0
                          ? 'Choose fields...'
                          : creativeCategories
                              .map((id) => {
                                const matched = [
                                  { id: 'photography', label: 'Photography' },
                                  { id: 'videography', label: 'Videography' },
                                  { id: 'design', label: 'Graphic Design' },
                                  { id: 'webdev', label: 'Web Design & Dev' },
                                  { id: 'fashion', label: 'Fashion' },
                                  { id: 'beauty', label: 'Beauty & Makeup' },
                                  { id: 'baking', label: 'Baking & Cake Art' },
                                  { id: 'marketing', label: 'Digital Marketing' },
                                  { id: 'content', label: 'Content Creation' },
                                  { id: 'events', label: 'Events (DJs/Sound)' },
                                  { id: 'illustration', label: 'Illustration' },
                                  { id: 'actors', label: 'Actors & Performing' },
                                  { id: 'writers', label: 'Script Writers' },
                                  { id: 'branding', label: 'Branding' },
                                  { id: 'interiordesign', label: 'Interior Design' },
                                  { id: 'florists', label: 'Florists & Floral' },
                                  { id: 'hospitality', label: 'Event Hospitality' },
                                  { id: 'organizers', label: 'Event Organizers' },
                                  { id: 'decorators', label: 'Stylists & Decorators' }
                                ].find((item) => item.id === id);
                                return matched ? matched.label : id;
                              })
                              .join(', ')}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isCategoryDropdownOpen ? 'rotate-180 text-indigo-500' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Content Menu */}
                    {isCategoryDropdownOpen && (
                      <div className="absolute z-35 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-3 animate-in fade-in duration-200 max-h-[350px] overflow-hidden flex flex-col">
                        {/* Search Bar & Search Button */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search creative fields..."
                              value={categorySearchQuery}
                              onChange={(e) => setCategorySearchQuery(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder-slate-400"
                            />
                          </div>
                          <button
                            type="button"
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer hover:shadow-md active:scale-95"
                          >
                            <Search className="h-3 w-3" />
                            <span>Search</span>
                          </button>
                        </div>

                        {/* Controls: Clear All / Select All */}
                        <div className="flex justify-between items-center bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Fields List
                          </span>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setCreativeCategories([])}
                              className="text-[10px] font-black uppercase text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Clear All</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCreativeCategories([
                                  'actors',
                                  'baking',
                                  'beauty',
                                  'branding',
                                  'content',
                                  'marketing',
                                  'organizers',
                                  'decorators',
                                  'hospitality',
                                  'events',
                                  'fashion',
                                  'fineartist',
                                  'florists',
                                  'design',
                                  'illustration',
                                  'interiordesign',
                                  'musicproducers',
                                  'photography',
                                  'writers',
                                  'videography',
                                  'webdev'
                                ])
                              }
                              className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors"
                            >
                              Select All
                            </button>
                          </div>
                        </div>

                        {/* Creative Field Selection List */}
                        <div className="grid grid-cols-2 gap-1.5 overflow-y-auto max-h-44 pr-1 custom-scrollbar">
                          {([
                            { id: 'actors', label: 'Actors & Performing' },
                            { id: 'baking', label: 'Baking & Cake Art' },
                            { id: 'beauty', label: 'Beauty & Makeup' },
                            { id: 'branding', label: 'Branding' },
                            { id: 'content', label: 'Content Creation' },
                            { id: 'marketing', label: 'Digital Marketing' },
                            { id: 'hospitality', label: 'Event Hospitality' },
                            { id: 'organizers', label: 'Event Organizers' },
                            { id: 'events', label: 'Events (DJs/Sound)' },
                            { id: 'fashion', label: 'Fashion' },
                            { id: 'fineartist', label: 'Fine Artists' },
                            { id: 'florists', label: 'Florists & Floral' },
                            { id: 'design', label: 'Graphic Design' },
                            { id: 'illustration', label: 'Illustration' },
                            { id: 'interiordesign', label: 'Interior Design' },
                            { id: 'musicproducers', label: 'Music Producers' },
                            { id: 'photography', label: 'Photography' },
                            { id: 'writers', label: 'Script Writers' },
                            { id: 'decorators', label: 'Stylists & Decorators' },
                            { id: 'videography', label: 'Videography' },
                            { id: 'webdev', label: 'Web Design & Dev' }
                          ] as const)
                            .filter((cat) =>
                              cat.label.toLowerCase().includes(categorySearchQuery.toLowerCase())
                            )
                            .map((cat) => {
                              const isSelected = creativeCategories.includes(cat.id);
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setCreativeCategories(
                                        creativeCategories.filter((id) => id !== cat.id)
                                      );
                                    } else {
                                      setCreativeCategories([...creativeCategories, cat.id]);
                                    }
                                  }}
                                  className={`py-2 px-2.5 rounded-xl border text-[10px] sm:text-xs font-bold transition-all flex items-center justify-start gap-2 cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm font-black'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                  }`}
                                >
                                  {isSelected ? (
                                    <span className="w-2 h-2 rounded-full bg-white shrink-0 animate-pulse" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                                  )}
                                  <span className="truncate">{cat.label}</span>
                                </button>
                              );
                            })}
                          {[
                            { id: 'actors', label: 'Actors & Performing' },
                            { id: 'baking', label: 'Baking & Cake Art' },
                            { id: 'beauty', label: 'Beauty & Makeup' },
                            { id: 'branding', label: 'Branding' },
                            { id: 'content', label: 'Content Creation' },
                            { id: 'marketing', label: 'Digital Marketing' },
                            { id: 'hospitality', label: 'Event Hospitality' },
                            { id: 'organizers', label: 'Event Organizers' },
                            { id: 'events', label: 'Events (DJs/Sound)' },
                            { id: 'fashion', label: 'Fashion' },
                            { id: 'fineartist', label: 'Fine Artists' },
                            { id: 'florists', label: 'Florists & Floral' },
                            { id: 'design', label: 'Graphic Design' },
                            { id: 'illustration', label: 'Illustration' },
                            { id: 'interiordesign', label: 'Interior Design' },
                            { id: 'musicproducers', label: 'Music Producers' },
                            { id: 'photography', label: 'Photography' },
                            { id: 'writers', label: 'Script Writers' },
                            { id: 'decorators', label: 'Stylists & Decorators' },
                            { id: 'videography', label: 'Videography' },
                            { id: 'webdev', label: 'Web Design & Dev' }
                          ].filter((cat) =>
                            cat.label.toLowerCase().includes(categorySearchQuery.toLowerCase())
                          ).length === 0 && (
                            <div className="col-span-2 text-center py-4 text-xs font-bold text-slate-400">
                              No creative fields match your search
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Base Location *</label>
                    {/* Location selector tabs */}
                    <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => handleCreativeLocationTabChange('county')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          creativeLocationTab === 'county'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Select County
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCreativeLocationTabChange('custom')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          creativeLocationTab === 'custom'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Custom Location
                      </button>
                    </div>
                  </div>

                  {creativeLocationTab === 'county' ? (
                    <CountySelector
                      value={creativeCounty}
                      onChange={handleCreativeCountyChange}
                    />
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Westlands, Nairobi"
                      value={creativeLocation}
                      onChange={(e) => setCreativeLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                    />
                  )}
                </div>

                {/* Required Contact Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">Required Contact Details</div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. macharia@vividvisuals.co.ke"
                      value={creativeEmail}
                      onChange={(e) => setCreativeEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Call Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +254 712 345678"
                        value={creativePhone}
                        onChange={(e) => setCreativePhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +254 712 345678"
                        value={creativeWhatsapp}
                        onChange={(e) => setCreativeWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Professional Bio *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Introduce yourself to prospective clients, your experience, and artistic philosophies..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Key Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Portraiture, Studio Lighting, Lightroom, Logo Design"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
                  />
                </div>

                {/* Security Credentials */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">Security Credentials</div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer text-sm uppercase tracking-wider"
                  >
                    Activate Profile & Go to Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperImageSrc}
        cropType={cropperType}
        initialZoom={
          cropperType === 'avatar'
            ? selectedFreelancer?.avatarZoom
            : selectedFreelancer?.coverZoom
        }
        initialPan={
          cropperType === 'avatar'
            ? (selectedFreelancer?.avatarPanX !== undefined ? { x: selectedFreelancer.avatarPanX, y: selectedFreelancer.avatarPanY || 0 } : undefined)
            : (selectedFreelancer?.coverPanX !== undefined ? { x: selectedFreelancer.coverPanX, y: selectedFreelancer.coverPanY || 0 } : undefined)
        }
        onSave={handleCropperSave}
        onCancel={() => setCropperOpen(false)}
      />

    </header>
  );
}
