/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BrowseTalent from './components/BrowseTalent';
import JobsBoard from './components/JobsBoard';
import Inbox from './components/Inbox';
import Dashboard from './components/Dashboard';
import PortfolioView from './components/PortfolioView';
import Home from './components/Home';
import TermsAndConditions from './components/TermsAndConditions';
import { FreelancerProfile, Job, Conversation, PlatformNotification, Review, Message, CreativeCategory } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Info, Sparkles, CheckCircle, Database, Wrench, Settings, Trash2, X } from 'lucide-react';
import { supabase } from './supabaseClient';
import { 
  loadFreelancerProfilesFromSupabase, 
  upsertFreelancerProfile, 
  deleteFreelancerProfile, 
  savePortfolioItems, 
  saveFeedPosts, 
  loadJobsFromSupabase, 
  upsertJobInSupabase, 
  deleteJobFromSupabase,
  generateUUID,
  deleteAllProfilesAndJobsFromSupabase
} from './utils/supabaseService';
import { 
  processProfileUploads, 
  resolveProfileUrls, 
  findRemovedStoragePaths, 
  deleteStorageFiles,
  getAllStoragePaths
} from './utils/storageService';

function getStockImage(category: string): string {
  const images: Record<string, string> = {
    photography: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop',
    videography: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop',
    design: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop',
    webdev: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
    fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop',
    beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop',
    baking: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
    marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    content: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&auto=format&fit=crop',
    events: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
    illustration: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
    actors: 'https://images.unsplash.com/photo-1460889418202-1384b50d4d1e?w=800&auto=format&fit=crop',
    writers: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
    branding: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800&auto=format&fit=crop',
    interiordesign: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop',
    florists: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop',
    hospitality: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    organizers: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop',
    decorators: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop',
    musicproducers: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop',
    fineartist: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop',
  };
  return images[category] || 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=800&auto=format&fit=crop';
}

function pruneBase64Recursively(obj: any, activeIdOrUsername: string | null, pruneActiveProfileToo: boolean, category: string = ''): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    if (obj.startsWith('data:image/')) {
      if (pruneActiveProfileToo) {
        return getStockImage(category);
      }
      return obj;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => pruneBase64Recursively(item, activeIdOrUsername, pruneActiveProfileToo, category));
  }

  if (typeof obj === 'object') {
    const isProfile = obj.hasOwnProperty('id') && obj.hasOwnProperty('username') && obj.hasOwnProperty('portfolio');
    const isInactive = isProfile && activeIdOrUsername && (obj.id !== activeIdOrUsername) && (obj.username !== activeIdOrUsername);
    const itemCategory = obj.category || category;
    
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      const pruneThisNode = pruneActiveProfileToo || isInactive;
      newObj[key] = pruneBase64Recursively(obj[key], activeIdOrUsername, pruneThisNode, itemCategory);
    }
    return newObj;
  }

  return obj;
}

function safeLocalStorageSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    const isQuotaExceeded = error instanceof DOMException && (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22 ||
      error.name === 'quota'
    );
    if (isQuotaExceeded) {
      console.warn(`LocalStorage quota exceeded for key "${key}". Attempting to free up space...`);
      try {
        // 1. Remove non-essential keys
        localStorage.removeItem('vivid_notifications');
        
        // 2. If saving freelancers list, prune base64 images from other inactive profiles to make space
        if (key === 'vivid_freelancers') {
          const freelancersList = JSON.parse(value);
          if (Array.isArray(freelancersList)) {
            const activeRole = localStorage.getItem('vivid_active_role') || 'client';
            
            // Phase A: Prune inactive freelancers' base64 data
            const prunedInactive = pruneBase64Recursively(freelancersList, activeRole, false);
            try {
              localStorage.setItem(key, JSON.stringify(prunedInactive));
              console.log("Successfully pruned other freelancers' base64 data to fit active freelancer data!");
              return;
            } catch (innerError) {
              // Phase B: Prune active freelancer's base64 data too if it still exceeds quota
              console.warn("Saving still failed after pruning inactive. Pruning active freelancer's base64 images too...");
              const prunedAll = pruneBase64Recursively(freelancersList, activeRole, true);
              localStorage.setItem(key, JSON.stringify(prunedAll));
              console.log("Successfully pruned all freelancers' base64 data to make space!");
              return;
            }
          }
        }
        
        // Retry writing
        localStorage.setItem(key, value);
      } catch (retryError) {
        console.error(`Critical: Failed to save to localStorage even after pruning for key "${key}":`, retryError);
      }
    } else {
      console.error(`localStorage error for key "${key}":`, error);
    }
  }
}

export default function App() {
  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<'home' | 'browse' | 'jobs' | 'inbox' | 'dashboard' | 'terms'>(() => {
    const saved = localStorage.getItem('vivid_current_tab');
    return (saved as 'home' | 'browse' | 'jobs' | 'inbox' | 'dashboard' | 'terms') || 'home';
  });

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('vivid_is_logged_in');
    return saved === null ? true : saved === 'true';
  });
  
  // Personas / Identity simulation
  const [activeRole, setActiveRole] = useState<'client' | string>(() => {
    const saved = localStorage.getItem('vivid_active_role');
    return saved || 'client';
  });
  
  // Category selected for filter sync
  const [selectedCategory, setSelectedCategory] = useState<CreativeCategory | 'all'>('all');

  // Deep-linking shared profile username detector
  const [sharedUsername, setSharedUsername] = useState<string | null>(null);

  // Deep-linking job detail view selection
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Core Persistent State
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>(() => {
    const saved = localStorage.getItem('vivid_freelancers');
    const parsed: FreelancerProfile[] = saved ? JSON.parse(saved) : [];
    // Sanitize by filtering out any legacy mock profiles
    return parsed.filter(f => !f.id.startsWith('f')).map(f => ({
      ...f,
      walletBalanceKsh: typeof f.walletBalanceKsh === 'number' ? f.walletBalanceKsh : 2500,
      unlockedJobIds: f.unlockedJobIds || []
    }));
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('vivid_jobs');
    const parsed: Job[] = saved ? JSON.parse(saved) : [];
    // Sanitize by filtering out any legacy mock jobs
    return parsed.filter(j => !j.id.startsWith('j')).map((job, idx) => ({
      ...job,
      status: job.status || 'open',
      unlockCount: typeof job.unlockCount === 'number' ? job.unlockCount : 0,
      unlockPriceKsh: 50
    }));
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('vivid_conversations');
    const parsed: Conversation[] = saved ? JSON.parse(saved) : [];
    // Sanitize by filtering out any legacy mock conversations
    return parsed.filter(c => !c.id.startsWith('c'));
  });

  const [notifications, setNotifications] = useState<PlatformNotification[]>(() => {
    const saved = localStorage.getItem('vivid_notifications');
    const defaultNotifs: PlatformNotification[] = [
      {
        id: 'n_welcome',
        title: 'Platform Guide',
        message: 'Welcome to Talanta Hub. Toggle roles in the navbar to preview other portfolios!',
        timestamp: 'Just now',
        read: false
      }
    ];
    return saved ? JSON.parse(saved) : defaultNotifs;
  });

  // Global Toast Toast Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info'>('success');
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Sync state with localStorage on changes
  useEffect(() => {
    safeLocalStorageSetItem('vivid_freelancers', JSON.stringify(freelancers));
  }, [freelancers]);

  useEffect(() => {
    safeLocalStorageSetItem('vivid_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    safeLocalStorageSetItem('vivid_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    safeLocalStorageSetItem('vivid_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    safeLocalStorageSetItem('vivid_current_tab', currentTab);
    window.scrollTo(0, 0);
  }, [currentTab]);

  useEffect(() => {
    safeLocalStorageSetItem('vivid_active_role', activeRole);
  }, [activeRole]);

  // Load data from Supabase and check session on mount
  useEffect(() => {
    async function loadSupabaseDataAndSession() {
      let activeFreelancers: FreelancerProfile[] = freelancers;

      // Resolve local cached profiles if any exist
      if (freelancers.length > 0) {
        try {
          const resolvedLocal = await Promise.all(freelancers.map(resolveProfileUrls));
          setFreelancers(resolvedLocal);
          activeFreelancers = resolvedLocal;
        } catch (err) {
          console.warn("Error resolving cached local profile URLs:", err);
        }
      }

      try {
        const dbFreelancers = await loadFreelancerProfilesFromSupabase();
        if (dbFreelancers !== null) {
          setFreelancers(dbFreelancers);
          activeFreelancers = dbFreelancers;
        }
      } catch (err) {
        console.error("Error loading freelancers from Supabase:", err);
      }

      try {
        const dbJobs = await loadJobsFromSupabase();
        if (dbJobs !== null) {
          setJobs(dbJobs);
        }
      } catch (err) {
        console.error("Error loading jobs from Supabase:", err);
      }

      // Check active Supabase session on mount
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const userId = session.user.id;
          const hasProfile = activeFreelancers.some(f => f.id === userId);
          const isRegistering = document.getElementById('profile-setup-form') !== null || sessionStorage.getItem('signup_success_email') !== null;
          
          if (hasProfile || isRegistering) {
            setIsLoggedIn(true);
            localStorage.setItem('vivid_is_logged_in', 'true');
            setActiveRole(userId);
            localStorage.setItem('vivid_active_role', userId);
          } else {
            // No profile row exists, and not in registration setup. Force sign out to clean state.
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            localStorage.setItem('vivid_is_logged_in', 'false');
            setActiveRole('client');
            localStorage.setItem('vivid_active_role', 'client');
          }
        }
      } catch (err) {
        console.error("Error checking session:", err);
      }
    }
    loadSupabaseDataAndSession();

    // Listen for auth changes safely
    let subscription: any = null;
    try {
      const res = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
          const userId = session.user.id;
          let profileExists = false;
          try {
            const { data: profile, error } = await supabase.from('profiles').select('id').eq('id', userId).maybeSingle();
            if (!error && profile) {
              profileExists = true;
            }
          } catch (e) {
            console.warn("Error checking profile in auth state listener:", e);
          }

          const isRegistering = document.getElementById('profile-setup-form') !== null || sessionStorage.getItem('signup_success_email') !== null;

          if (profileExists || isRegistering) {
            setIsLoggedIn(true);
            localStorage.setItem('vivid_is_logged_in', 'true');
            setActiveRole(userId);
            localStorage.setItem('vivid_active_role', userId);
          } else {
            // Profile does not exist (deleted or filtered) and not in signup setup. Clean signout.
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            localStorage.setItem('vivid_is_logged_in', 'false');
            setActiveRole('client');
            localStorage.setItem('vivid_active_role', 'client');
          }
        } else {
          setIsLoggedIn(false);
          localStorage.setItem('vivid_is_logged_in', 'false');
          setActiveRole('client');
          localStorage.setItem('vivid_active_role', 'client');
        }
      });
      if (res && res.data) {
        subscription = res.data.subscription;
      }
    } catch (err) {
      console.warn("Could not listen to auth state changes (offline failover active):", err);
    }

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (unsubErr) {
          console.warn("Error unsubscribing from auth:", unsubErr);
        }
      }
    };
  }, []);

  // Deep Link router (?profile=alex_video)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profileUser = params.get('profile');
    if (profileUser) {
      // Find matching creative
      const found = freelancers.find(f => f.username === profileUser);
      if (found) {
        setSharedUsername(profileUser);
      }
    }
  }, [freelancers]);

  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Callback to update freelancer details
  const handleUpdateProfile = async (updated: FreelancerProfile) => {
    let uploadedProfile = updated;
    let resolvedProfile = updated;

    try {
      // 1. Process and upload any new base64 data URLs to Supabase Storage
      uploadedProfile = await processProfileUploads(updated);

      // 2. Resolve storage paths to signed URLs for local UI rendering
      resolvedProfile = await resolveProfileUrls(uploadedProfile);

      // 3. Track and delete old, replaced files from Storage
      const oldProfile = freelancers.find(f => f.id === updated.id);
      if (oldProfile) {
        const removedPaths = findRemovedStoragePaths(oldProfile, uploadedProfile);
        if (removedPaths.length > 0) {
          deleteStorageFiles(removedPaths);
        }
      }
    } catch (err) {
      console.error("Error processing storage uploads/resolutions:", err);
    }

    let finalProfile = resolvedProfile;
    setFreelancers(prev => prev.map(f => {
      if (f.id === updated.id) {
        // If the owner themselves is editing this profile, enforce draft vs publish separation
        const isEditingSelf = activeRole === f.id;
        
        if (isEditingSelf) {
          // If hasUnpublishedChanges is false, it's an explicit publish action
          if (updated.hasUnpublishedChanges === false) {
            finalProfile = resolvedProfile;
          } else {
            // It's a draft change. Keep/set hasUnpublishedChanges to true.
            // Cache the original profile (prior to this update) if publishedVersion isn't set yet.
            let publishedCopy = f.publishedVersion;
            if (!publishedCopy) {
              const cleanF = { ...f };
              delete cleanF.publishedVersion;
              publishedCopy = cleanF;
            }
            finalProfile = {
              ...resolvedProfile,
              hasUnpublishedChanges: true,
              publishedVersion: publishedCopy
            };
          }
        } else {
          finalProfile = resolvedProfile;
        }
        return finalProfile;
      }
      return f;
    }));

    try {
      await upsertFreelancerProfile(uploadedProfile);
      if (uploadedProfile.portfolio) {
        await savePortfolioItems(uploadedProfile.id, uploadedProfile.portfolio);
      }
      if (uploadedProfile.feedPosts) {
        await saveFeedPosts(uploadedProfile.id, uploadedProfile.feedPosts);
      }
    } catch (err) {
      console.error("Error syncing profile update to Supabase:", err);
    }
  };

  // Callback to permanently delete a profile
  const handleDeleteProfile = async (freelancerId: string) => {
    const oldProfile = freelancers.find(f => f.id === freelancerId);
    
    setFreelancers(prev => prev.filter(f => f.id !== freelancerId));
    setActiveRole('client');
    setCurrentTab('home');
    setToastMessage('Your creative profile was permanently deleted.');
    setToastType('info');
    setTimeout(() => setToastMessage(null), 4000);

    try {
      if (oldProfile) {
        const paths = getAllStoragePaths(oldProfile);
        if (paths.length > 0) {
          await deleteStorageFiles(paths);
        }
      }
      await deleteFreelancerProfile(freelancerId);
    } catch (err) {
      console.error("Error deleting profile from Supabase:", err);
    }
  };

  // Helper to filter public, active, and published profiles
  const getPublicFreelancersList = (list: FreelancerProfile[]) => {
    return list
      .filter(f => f.isPublic !== false || activeRole === f.id)
      .map(f => {
        if (activeRole === f.id) {
          return f; // Creator always sees their latest working draft
        }
        return f.publishedVersion || f; // Visitors see the last published snapshot
      });
  };

  // Callback to add public reviews (freelancers cannot delete them!)
  const handleAddReview = async (freelancerId: string, reviewBrief: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      id: `r_${Date.now()}`,
      authorName: reviewBrief.authorName,
      authorRole: reviewBrief.authorRole || 'Client Visitor',
      rating: reviewBrief.rating,
      comment: reviewBrief.comment,
      date: new Date().toISOString().split('T')[0]
    };

    let updatedF: FreelancerProfile | null = null;
    setFreelancers(prev => prev.map(f => {
      if (f.id === freelancerId) {
        updatedF = {
          ...f,
          reviews: [...f.reviews, newReview]
        };
        return updatedF;
      }
      return f;
    }));
    triggerToast(`Star Review posted!`);

    if (updatedF) {
      try {
        await upsertFreelancerProfile(updatedF);
      } catch (err) {
        console.error("Error saving review to Supabase:", err);
      }
    }
  };

  // Callback to update a job brief (e.g., status, unlock counts)
  const handleUpdateJob = async (updatedJob: Job) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    try {
      await upsertJobInSupabase(updatedJob, activeRole !== 'client' ? activeRole : null);
    } catch (err) {
      console.error("Error updating job in Supabase:", err);
    }
  };

  // Callback to post new freelance job briefs
  const handlePostJob = async (newBrief: Omit<Job, 'id' | 'postedDate' | 'applicantsCount'>) => {
    const newJob: Job = {
      id: generateUUID(),
      title: newBrief.title,
      clientName: newBrief.clientName,
      clientCompany: newBrief.clientCompany || undefined,
      category: newBrief.category,
      budgetRange: newBrief.budgetRange,
      location: newBrief.location,
      description: newBrief.description,
      postedDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      clientEmail: newBrief.clientEmail,
      clientPhone: newBrief.clientPhone,
      clientWhatsapp: newBrief.clientWhatsapp,
      startDate: newBrief.startDate,
      deliveryDeadline: newBrief.deliveryDeadline,
      status: 'open',
      unlockCount: 0,
      unlockPriceKsh: 50
    };

    setJobs(prev => [newJob, ...prev]);
    triggerToast(`Brief "${newJob.title}" published! Subscribed talents notified.`);

    // Add platform level notifications for matching talents
    setFreelancers(prevFreelancers => {
      const matches = prevFreelancers.filter(f => f.subscribedCategories.includes(newBrief.category));
      
      const newNotifs: PlatformNotification[] = matches.map(f => ({
        id: `n_brief_${Date.now()}_${f.id}`,
        title: `⚡ New Brief in ${newBrief.category}`,
        message: `"${newJob.title}" with a budget of ${newJob.budgetRange} matches your specialties.`,
        category: newBrief.category,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        jobId: newJob.id,
        read: false
      }));

      setNotifications(prevNotifsList => [...newNotifs, ...prevNotifsList]);

      return prevFreelancers.map(f => {
        if (f.subscribedCategories.includes(newBrief.category)) {
          return {
            ...f,
            notificationCount: f.notificationCount + 1
          };
        }
        return f;
      });
    });

    try {
      await upsertJobInSupabase(newJob, activeRole !== 'client' ? activeRole : null);
    } catch (err) {
      console.error("Error creating job in Supabase:", err);
    }
  };

  const handleJoinAsCreative = async (newCreative: {
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
  }) => {
    // Attempt to match with current authenticated Supabase user
    let profileId = `f_join_${Date.now()}`;
    let authenticatedEmail = newCreative.email;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        profileId = user.id;
        if (user.email) authenticatedEmail = user.email;
      }
    } catch (authErr) {
      console.warn("Auth check during join deferred:", authErr);
    }

    const primaryCategory = newCreative.categories[0] || 'photography';
    const newProfile: FreelancerProfile = {
      id: profileId,
      username: newCreative.username.toLowerCase().replace(/\s+/g, '_'),
      fullName: newCreative.fullName,
      title: `${primaryCategory.charAt(0).toUpperCase() + primaryCategory.slice(1)} Professional`,
      avatarUrl: newCreative.avatarUrl || '',
      coverUrl: newCreative.coverUrl || '',
      bio: newCreative.bio,
      location: newCreative.location,
      hourlyRate: newCreative.hourlyRate,
      category: primaryCategory,
      skills: newCreative.skills,
      theme: 'slate',
      layoutOrder: ['hero', 'categories', 'gallery', 'analytics', 'reviews', 'contact'],
      subscribedCategories: newCreative.categories.length > 0 ? newCreative.categories : ['photography'],
      notificationCount: 0,
      unreadMessagesCount: 0,
      email: authenticatedEmail,
      phone: newCreative.phone,
      whatsapp: newCreative.whatsapp,
      categorySections: [
        {
          category: 'videography',
          title: 'Cinematic Work & Reels',
          customThumbnail: 'https://images.unsplash.com/photo-1579165466541-74e2beb67a3a?auto=format&fit=crop&q=80&w=600',
          description: 'High-quality storytelling through professional moving pictures.',
          visible: newCreative.categories.includes('videography')
        },
        {
          category: 'photography',
          title: 'Fine Art & Commercial Captures',
          customThumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600',
          description: 'Capturing precise details, lighting, and unforgettable moments.',
          visible: newCreative.categories.includes('photography')
        },
        {
          category: 'design',
          title: 'Visual Identity & Branding Projects',
          customThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
          description: 'Vector layout designs, custom typography, and complete visual schemes.',
          visible: newCreative.categories.includes('design')
        },
        {
          category: 'illustration',
          title: 'Concept Painting & Digital Artworks',
          customThumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600',
          description: 'Stylized 2D and 3D artwork crafted from imagination.',
          visible: newCreative.categories.includes('illustration')
        }
      ],
      portfolio: [],
      reviews: [],
      feedPosts: [
        {
          id: `f_join_post_${Date.now()}`,
          caption: "Welcome to my Talanta Hub profile!\n\nI'm excited to share my work, creative journey, and the projects I'm passionate about. Here you'll find my latest updates, portfolio highlights, and the services I offer.\n\nFeel free to connect, explore my work, and reach out if you'd like to collaborate on your next project.",
          likes: 0,
          timestamp: new Date().toISOString(),
          isLikedByUser: false
        }
      ],
      analytics: {
        totalViews: 0,
        totalInquiries: 0,
        conversionRate: 0,
        viewsHistory: [
          { label: 'Week 1', count: 0 },
          { label: 'Week 2', count: 0 },
          { label: 'Week 3', count: 0 },
          { label: 'Week 4', count: 0 }
        ],
        reachByCategory: newCreative.categories.map(cat => ({
          category: cat,
          percentage: Math.round(100 / newCreative.categories.length)
        }))
      }
    };

    setFreelancers([newProfile, ...freelancers]);
    setActiveRole(newProfile.id);
    setIsLoggedIn(true);
    localStorage.setItem('vivid_is_logged_in', 'true');
    setCurrentTab('dashboard');
    triggerToast(`Welcome to Talanta Hub, ${newProfile.fullName}!`);

    try {
      await upsertFreelancerProfile(newProfile);
      if (newProfile.feedPosts) {
        await saveFeedPosts(newProfile.id, newProfile.feedPosts);
      }
    } catch (err) {
      console.error("Error saving newly joined profile to Supabase:", err);
    }
  };

  // Contact form submission triggers a direct messaging flow!
  const handleSendMessageFromContact = (freelancerId: string, messageText: string, clientName: string) => {
    setFreelancers(prevFreelancers => {
      const targetFreelancer = prevFreelancers.find(f => f.id === freelancerId);
      if (!targetFreelancer) return prevFreelancers;

      const newMsg: Message = {
        id: `m_${Date.now()}`,
        senderId: 'client',
        senderName: clientName,
        content: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prevConvs => {
        const existing = prevConvs.find(c => c.freelancerId === freelancerId && c.clientName === clientName);
        if (existing) {
          return prevConvs.map(c => {
            if (c.id === existing.id) {
              return {
                ...c,
                messages: [...c.messages, newMsg],
                lastMessageText: messageText,
                lastMessageTime: 'Just now',
                unread: true
              };
            }
            return c;
          });
        } else {
          const newConv: Conversation = {
            id: `c_${Date.now()}`,
            freelancerId: freelancerId,
            freelancerName: targetFreelancer.fullName,
            freelancerAvatar: targetFreelancer.avatarUrl,
            clientName: clientName,
            messages: [newMsg],
            lastMessageText: messageText,
            lastMessageTime: 'Just now',
            unread: true
          };
          return [newConv, ...prevConvs];
        }
      });

      triggerToast(`Your secure inquiry has been delivered directly to ${targetFreelancer.fullName}!`);

      return prevFreelancers.map(f => {
        if (f.id === freelancerId) {
          return {
            ...f,
            unreadMessagesCount: f.unreadMessagesCount + 1,
            analytics: {
              ...f.analytics,
              totalInquiries: f.analytics.totalInquiries + 1
            }
          };
        }
        return f;
      });
    });
  };

  // Send messaging in secure chats
  const handleSendMessage = (conversationId: string, text: string, senderId: string) => {
    const senderName = senderId === 'client' ? 'Client Partner' : (freelancers.find(f => f.id === senderId)?.fullName || 'Freelancer');
    
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      senderId,
      senderName,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessageText: text,
          lastMessageTime: 'Just now',
          unread: senderId === 'client' ? true : c.unread
        };
      }
      return c;
    }));
  };

  // Notifications utility
  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Switch routing based on view selected
  const selectedDeepProfile = freelancers.find(f => f.username === sharedUsername);

  if (selectedDeepProfile) {
    const isOwner = activeRole === selectedDeepProfile.id;
    const displayedProfile = isOwner ? selectedDeepProfile : (selectedDeepProfile.publishedVersion || selectedDeepProfile);
    const isProfilePrivate = displayedProfile.isPublic === false;

    if (isProfilePrivate && !isOwner) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="h-14 w-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">Profile is Private</h1>
              <p className="text-sm text-slate-400">
                This creative partner's profile is currently offline or set to private.
              </p>
            </div>
            <button
              onClick={() => {
                window.history.pushState({}, '', window.location.pathname);
                setSharedUsername(null);
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      );
    }

    return (
      <PortfolioView
        profile={displayedProfile}
        activeRole={activeRole}
        onUpdateProfile={handleUpdateProfile}
        onAddReview={handleAddReview}
        onSendMessageFromContact={handleSendMessageFromContact}
        onBackToMarketplace={() => {
          // Clear query params to return
          window.history.pushState({}, '', window.location.pathname);
          setSharedUsername(null);
        }}
        allFreelancers={freelancers}
        onSelectFreelancer={(id) => {
          const selected = freelancers.find(f => f.id === id);
          if (selected) {
            setSharedUsername(selected.username);
          }
        }}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  const handleDeleteAllAccounts = async () => {
    // Delete all storage files for all active freelancers before purging
    try {
      const allPaths = freelancers.flatMap(getAllStoragePaths);
      if (allPaths.length > 0) {
        await deleteStorageFiles(allPaths);
      }
    } catch (err) {
      console.warn("Could not delete storage files during global purge:", err);
    }

    // 1. Set freelancers to empty
    setFreelancers([]);
    localStorage.setItem('vivid_freelancers', JSON.stringify([]));
    
    // 2. Reset conversations & jobs to start fully clean
    setConversations([]);
    localStorage.setItem('vivid_conversations', JSON.stringify([]));
    setJobs([]);
    localStorage.setItem('vivid_jobs', JSON.stringify([]));
    
    // 3. Reset session
    setIsLoggedIn(false);
    localStorage.setItem('vivid_is_logged_in', 'false');
    setActiveRole('client');
    localStorage.setItem('vivid_active_role', 'client');
    
    // 4. Sign out from Supabase Auth
    try {
      await supabase.auth.signOut();
    } catch (authErr) {
      console.warn("Supabase auth signout deferred during delete all accounts:", authErr);
    }
    
    // 5. Delete from Supabase
    const success = await deleteAllProfilesAndJobsFromSupabase();
    
    if (success) {
      triggerToast("All existing user accounts and data have been deleted successfully!");
    } else {
      triggerToast("Local accounts cleared (Supabase is currently offline).");
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    localStorage.setItem('vivid_is_logged_in', 'false');
    setActiveRole('client');
    try {
      await supabase.auth.signOut();
    } catch (authErr) {
      console.warn("Supabase auth signout error during logout:", authErr);
    }
    triggerToast("You have been signed out successfully.");
  };

  const handleLogin = (roleId: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('vivid_is_logged_in', 'true');
    setActiveRole(roleId);
    const userProfile = freelancers.find(f => f.id === roleId);
    triggerToast(`Welcome back, ${userProfile ? userProfile.fullName : 'Client Partner'}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      
      {/* Dynamic persistent app header */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        activeRole={activeRole}
        onChangeRole={setActiveRole}
        freelancers={freelancers}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearNotifications={handleClearNotifications}
        onPostJob={handlePostJob}
        onJoinAsCreative={handleJoinAsCreative}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentTab('browse');
        }}
        onUpdateProfile={handleUpdateProfile}
        onSelectJobId={setSelectedJobId}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onDeleteAllAccounts={handleDeleteAllAccounts}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE */}
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Home
                freelancers={getPublicFreelancersList(freelancers)}
                jobs={jobs}
                onSelectFreelancer={(id) => {
                  const selected = freelancers.find(f => f.id === id);
                  if (selected) {
                    setSharedUsername(selected.username);
                  }
                }}
                onChangeTab={setCurrentTab}
                isLoggedIn={isLoggedIn}
              />
            </motion.div>
          )}
          
          {/* BROWSE PORTFOLIOS TABS */}
          {currentTab === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BrowseTalent
                freelancers={getPublicFreelancersList(freelancers)}
                onSelectFreelancer={(id) => {
                  const selected = freelancers.find(f => f.id === id);
                  if (selected) {
                    setSharedUsername(selected.username);
                  }
                }}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </motion.div>
          )}

          {/* OPPORTUNITIES JOB BOARD */}
          {currentTab === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <JobsBoard
                jobs={jobs}
                onPostJob={handlePostJob}
                currentRole={activeRole}
                initialJobId={selectedJobId}
                onClearInitialJobId={() => setSelectedJobId(null)}
                freelancers={freelancers}
                onUpdateFreelancer={handleUpdateProfile}
                onUpdateJob={handleUpdateJob}
                isLoggedIn={isLoggedIn}
              />
            </motion.div>
          )}

          {/* SECURE INBOX MESSAGING */}
          {currentTab === 'inbox' && (
            <motion.div
              key="inbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Inbox
                conversations={conversations}
                onSendMessage={handleSendMessage}
                currentUserId={activeRole}
                currentUserName={activeRole === 'client' ? 'Client Partner' : (freelancers.find(f => f.id === activeRole)?.fullName || 'Creative')}
              />
            </motion.div>
          )}

          {/* FREELANCER CUSTOMIZATION PANEL */}
          {currentTab === 'dashboard' && activeRole !== 'client' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {(() => {
                const freelancer = freelancers.find(f => f.id === activeRole);
                return freelancer ? (
                  <Dashboard
                     profile={freelancer}
                     onUpdateProfile={handleUpdateProfile}
                     onDeleteProfile={handleDeleteProfile}
                     allJobs={jobs}
                     onViewJob={(jobId) => {
                       setSelectedJobId(jobId);
                       setCurrentTab('jobs');
                     }}
                     onUpdateJob={handleUpdateJob}
                  />
                ) : (
                  <div className="text-center py-12">Creative Profile not found.</div>
                );
              })()}
            </motion.div>
          )}

          {/* TERMS AND CONDITIONS VIEW */}
          {currentTab === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TermsAndConditions onBackToHome={() => setCurrentTab('home')} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Slide-in Notifications toast alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold"
          >
            <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* humble footer info */}
      <footer className="border-t border-slate-100 bg-white py-8 mt-12 text-center text-xs text-slate-400 font-bold uppercase tracking-widest space-y-3">
        <div className="flex flex-wrap justify-center gap-4 text-slate-500 font-extrabold">
          <button onClick={() => setCurrentTab('home')} className="hover:text-indigo-600 transition-colors cursor-pointer">Home</button>
          <span>&bull;</span>
          <button onClick={() => setCurrentTab('browse')} className="hover:text-indigo-600 transition-colors cursor-pointer">Explore Talents</button>
          <span>&bull;</span>
          <button onClick={() => setCurrentTab('jobs')} className="hover:text-indigo-600 transition-colors cursor-pointer">Job Market</button>
          <span>&bull;</span>
          <button onClick={() => setCurrentTab('terms')} className="hover:text-indigo-600 transition-colors cursor-pointer">Terms & Conditions</button>
        </div>
        <div>
          Where Talent Meets Opportunity
        </div>
      </footer>

      {/* Floating System Admin Dashboard */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
        <AnimatePresence>
          {showAdminPanel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-80 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl p-4 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-black uppercase tracking-wider">System Admin Panel</span>
                </div>
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close Panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-[11px] font-semibold text-slate-300">
                <div className="flex justify-between">
                  <span>Database Mode:</span>
                  <span className="text-indigo-400 uppercase font-black">Supabase + Cache</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Accounts:</span>
                  <span className="text-emerald-400 font-extrabold">{freelancers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Role:</span>
                  <span className="text-indigo-400 font-extrabold truncate max-w-[150px]">
                    {activeRole === 'client' ? 'Client Partner' : (freelancers.find(f => f.id === activeRole)?.fullName || 'Creative')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete ALL registered user accounts, profiles, and associated data from both local storage and the database? This cannot be undone.")) {
                      await handleDeleteAllAccounts();
                      setShowAdminPanel(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer uppercase tracking-wider"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete All Accounts</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="h-12 w-12 bg-slate-900 hover:bg-slate-850 text-white rounded-full flex items-center justify-center shadow-2xl border border-slate-800 cursor-pointer transition-all hover:scale-105 active:scale-95"
          title="System Admin & Database Panel"
        >
          <Settings className={`h-5 w-5 text-indigo-400 ${showAdminPanel ? 'rotate-90' : ''} transition-transform duration-300`} />
        </button>
      </div>

    </div>
  );
}
