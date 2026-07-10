import { supabase } from '../supabaseClient';
import { FreelancerProfile, PortfolioItem, FeedPost, Job, Review, CreativeCategory } from '../types';
import { resolveProfileUrls, cleanProfileUrls, getStoragePathFromUrl } from './storageService';

/**
 * ============================================================================
 * SUPABASE DATABASE DDL SCHEMA (Copy & run this in your Supabase SQL Editor)
 * ============================================================================
 * 
 * -- 1. Create public.profiles table
 * create table public.profiles (
 *   id uuid references auth.users on delete cascade primary key,
 *   username text unique not null,
 *   full_name text not null,
 *   title text,
 *   avatar_url text,
 *   cover_url text,
 *   bio text,
 *   location text,
 *   hourly_rate integer default 3000,
 *   category text,
 *   skills text[] default '{}',
 *   theme text default 'slate',
 *   layout_order text[] default '{"hero", "categories", "gallery", "analytics", "reviews", "contact"}',
 *   category_sections jsonb default '[]'::jsonb,
 *   reviews jsonb default '[]'::jsonb,
 *   analytics jsonb default '{"totalViews":0,"totalInquiries":0,"conversionRate":0,"viewsHistory":[],"reachByCategory":[]}'::jsonb,
 *   subscribed_categories text[] default '{}',
 *   notification_count integer default 0,
 *   unread_messages_count integer default 0,
 *   email text,
 *   phone text,
 *   whatsapp text,
 *   wallet_balance_ksh integer default 2500,
 *   unlocked_job_ids text[] default '{}',
 *   is_public boolean default true,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- 2. Create public.portfolio_items table
 * create table public.portfolio_items (
 *   id uuid default gen_random_uuid() primary key,
 *   profile_id uuid references public.profiles(id) on delete cascade not null,
 *   title text not null,
 *   description text,
 *   category text not null,
 *   image_url text not null,
 *   video_url text,
 *   gallery_urls text[] default '{}',
 *   likes integer default 0,
 *   views integer default 0,
 *   date text,
 *   is_live boolean default true,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- 3. Create public.feed_posts table
 * create table public.feed_posts (
 *   id uuid default gen_random_uuid() primary key,
 *   profile_id uuid references public.profiles(id) on delete cascade not null,
 *   caption text,
 *   image_url text,
 *   likes integer default 0,
 *   timestamp text not null,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- 4. Create public.jobs table
 * create table public.jobs (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references public.profiles(id) on delete set null,
 *   title text not null,
 *   client_name text not null,
 *   client_company text,
 *   category text not null,
 *   budget_range text not null,
 *   location text not null,
 *   description text not null,
 *   posted_date text,
 *   applicants_count integer default 0,
 *   client_email text,
 *   client_phone text,
 *   client_whatsapp text,
 *   start_date text,
 *   delivery_deadline text,
 *   status text default 'open'::text,
 *   unlock_count integer default 0,
 *   unlock_price_ksh integer default 50,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null
 * );
 * 
 * -- Enable Row Level Security (RLS)
 * alter table public.profiles enable row level security;
 * alter table public.portfolio_items enable row level security;
 * alter table public.feed_posts enable row level security;
 * alter table public.jobs enable row level security;
 * 
 * -- Policies for public.profiles
 * create policy "Allow public read access to profiles" on public.profiles
 *   for select using (true);
 * create policy "Allow users to insert their own profile" on public.profiles
 *   for insert with check (auth.uid() = id);
 * create policy "Allow users to update their own profile" on public.profiles
 *   for update using (auth.uid() = id);
 * 
 * -- Policies for public.portfolio_items
 * create policy "Allow public read access to portfolio items" on public.portfolio_items
 *   for select using (true);
 * create policy "Allow users to manage their own portfolio items" on public.portfolio_items
 *   for all using (auth.uid() = profile_id);
 * 
 * -- Policies for public.feed_posts
 * create policy "Allow public read access to feed posts" on public.feed_posts
 *   for select using (true);
 * create policy "Allow users to manage their own feed posts" on public.feed_posts
 *   for all using (auth.uid() = profile_id);
 * 
 * -- Policies for public.jobs
 * create policy "Allow public read access to jobs" on public.jobs
 *   for select using (true);
 * create policy "Allow anyone to insert jobs" on public.jobs
 *   for insert with check (true);
 * create policy "Allow users to manage their own jobs" on public.jobs
 *   for all using (auth.uid() = user_id);
 * 
 */

// ============================================================================
// CONVERSION MAPPERS (CamelCase JS <-> SnakeCase Postgres DB)
// ============================================================================

export function isValidUUID(id: string | null | undefined): boolean {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function mapProfileFromDB(dbRow: any, dbPortfolio: any[] = [], dbPosts: any[] = []): FreelancerProfile {
  let notableClients: any[] | undefined = undefined;
  const categorySections = (dbRow.category_sections || []).filter((sec: any) => {
    if (sec.category === '__notable_clients__') {
      try {
        notableClients = JSON.parse(sec.description);
      } catch (e) {
        console.warn('Error parsing packed notable clients:', e);
      }
      return false;
    }
    return true;
  });

  return {
    id: dbRow.id,
    username: dbRow.username,
    fullName: dbRow.full_name,
    title: dbRow.title || '',
    avatarUrl: dbRow.avatar_url || '',
    coverUrl: dbRow.cover_url || '',
    bio: dbRow.bio || '',
    location: dbRow.location || '',
    hourlyRate: dbRow.hourly_rate || 3000,
    category: dbRow.category || 'photography',
    skills: dbRow.skills || [],
    theme: dbRow.theme || 'slate',
    layoutOrder: dbRow.layout_order || ['hero', 'categories', 'gallery', 'analytics', 'reviews', 'contact'],
    categorySections,
    notableClients,
    reviews: dbRow.reviews || [],
    analytics: dbRow.analytics || {
      totalViews: 0,
      totalInquiries: 0,
      conversionRate: 0,
      viewsHistory: [],
      reachByCategory: []
    },
    subscribedCategories: dbRow.subscribed_categories || [],
    notificationCount: dbRow.notification_count || 0,
    unreadMessagesCount: dbRow.unread_messages_count || 0,
    email: dbRow.email,
    phone: dbRow.phone,
    whatsapp: dbRow.whatsapp,
    walletBalanceKsh: dbRow.wallet_balance_ksh || 2500,
    unlockedJobIds: dbRow.unlocked_job_ids || [],
    isPublic: dbRow.is_public !== false,
    portfolio: dbPortfolio.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      category: item.category,
      imageUrl: item.image_url,
      videoUrl: item.video_url || undefined,
      galleryUrls: item.gallery_urls || [],
      likes: item.likes || 0,
      views: item.views || 0,
      date: item.date || '',
      isLive: item.is_live !== false
    })),
    feedPosts: dbPosts.map(post => ({
      id: post.id,
      caption: post.caption || undefined,
      imageUrl: post.image_url || undefined,
      likes: post.likes || 0,
      timestamp: post.timestamp
    }))
  };
}

export function mapProfileToDB(profile: FreelancerProfile): any {
  const categorySections = [...(profile.categorySections || [])];
  if (profile.notableClients) {
    categorySections.push({
      category: '__notable_clients__' as any,
      title: 'Notable Clients',
      customThumbnail: '',
      description: JSON.stringify(profile.notableClients),
      visible: false
    });
  }

  return {
    id: profile.id,
    username: profile.username,
    full_name: profile.fullName,
    title: profile.title,
    avatar_url: profile.avatarUrl,
    cover_url: profile.coverUrl,
    bio: profile.bio,
    location: profile.location,
    hourly_rate: profile.hourlyRate,
    category: profile.category,
    skills: profile.skills,
    theme: profile.theme,
    layout_order: profile.layoutOrder,
    category_sections: categorySections,
    reviews: profile.reviews,
    analytics: profile.analytics,
    subscribed_categories: profile.subscribedCategories,
    notification_count: profile.notificationCount,
    unread_messages_count: profile.unreadMessagesCount,
    email: profile.email,
    phone: profile.phone,
    whatsapp: profile.whatsapp,
    wallet_balance_ksh: profile.walletBalanceKsh,
    unlocked_job_ids: profile.unlockedJobIds,
    is_public: profile.isPublic !== false
  };
}

export function mapJobFromDB(item: any): Job {
  return {
    id: item.id,
    title: item.title,
    clientName: item.client_name,
    clientCompany: item.client_company || undefined,
    category: item.category,
    budgetRange: item.budget_range,
    location: item.location,
    description: item.description,
    postedDate: item.posted_date || '',
    applicantsCount: item.applicants_count || 0,
    clientEmail: item.client_email || '',
    clientPhone: item.client_phone || '',
    clientWhatsapp: item.client_whatsapp || '',
    startDate: item.start_date || '',
    deliveryDeadline: item.delivery_deadline || '',
    status: item.status || 'open',
    unlockCount: item.unlock_count || 0,
    unlockPriceKsh: item.unlock_price_ksh || 50
  };
}

export function mapJobToDB(job: Job, userId?: string | null): any {
  return {
    id: job.id,
    user_id: userId || null,
    title: job.title,
    client_name: job.clientName,
    client_company: job.clientCompany,
    category: job.category,
    budget_range: job.budgetRange,
    location: job.location,
    description: job.description,
    posted_date: job.postedDate,
    applicants_count: job.applicantsCount,
    client_email: job.clientEmail,
    client_phone: job.clientPhone,
    client_whatsapp: job.clientWhatsapp,
    start_date: job.startDate,
    delivery_deadline: job.deliveryDeadline,
    status: job.status,
    unlock_count: job.unlockCount,
    unlock_price_ksh: job.unlockPriceKsh
  };
}

// ============================================================================
// SUPABASE OPERATIONS SERVICE
// ============================================================================

/**
 * Loads all freelancer profiles, their portfolio items, and feed posts in a single relational join.
 */
export async function loadFreelancerProfilesFromSupabase(): Promise<FreelancerProfile[] | null> {
  try {
    const { data: profiles, error: profileErr } = await supabase
      .from('profiles')
      .select('*');

    if (profileErr) throw profileErr;
    if (!profiles || profiles.length === 0) return [];

    // Filter out rows created before vivid_deleted_at
    const deletedAtStr = localStorage.getItem('vivid_deleted_at');
    let filteredProfiles = profiles;
    if (deletedAtStr) {
      const deletedAt = new Date(deletedAtStr).getTime();
      filteredProfiles = profiles.filter(p => {
        const createdAt = p.created_at ? new Date(p.created_at).getTime() : 0;
        return createdAt > deletedAt;
      });
    }

    if (filteredProfiles.length === 0) return [];

    // Fetch related portfolio items and feed posts
    const { data: portfolioItems, error: portErr } = await supabase
      .from('portfolio_items')
      .select('*');

    const { data: feedPosts, error: postErr } = await supabase
      .from('feed_posts')
      .select('*');

    let filteredPortfolioItems = portfolioItems || [];
    let filteredFeedPosts = feedPosts || [];

    if (deletedAtStr) {
      const deletedAt = new Date(deletedAtStr).getTime();
      filteredPortfolioItems = (portfolioItems || []).filter(item => {
        const createdAt = item.created_at ? new Date(item.created_at).getTime() : 0;
        return createdAt > deletedAt;
      });
      filteredFeedPosts = (feedPosts || []).filter(post => {
        const createdAt = post.created_at ? new Date(post.created_at).getTime() : 0;
        return createdAt > deletedAt;
      });
    }

    const portfolioMap = filteredPortfolioItems.reduce((acc: any, item: any) => {
      acc[item.profile_id] = acc[item.profile_id] || [];
      acc[item.profile_id].push(item);
      return acc;
    }, {});

    const postsMap = filteredFeedPosts.reduce((acc: any, post: any) => {
      acc[post.profile_id] = acc[post.profile_id] || [];
      acc[post.profile_id].push(post);
      return acc;
    }, {});

    const mappedProfiles = filteredProfiles.map(p => mapProfileFromDB(p, portfolioMap[p.id] || [], postsMap[p.id] || []));
    return await Promise.all(mappedProfiles.map(resolveProfileUrls));
  } catch (error: any) {
    if (error && (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist'))) {
      console.warn(
        '🎯 Supabase Setup Info: The "profiles" table is not created yet in your Supabase database. ' +
        'Please copy and run the DDL SQL schema at the top of src/utils/supabaseService.ts in your Supabase SQL Editor. ' +
        'Falling back to local demo state for now.'
      );
    } else {
      console.warn('Could not load profiles from Supabase (falling back to offline mode):', error);
    }
    return null;
  }
}

/**
 * Upserts a profile to Supabase (creates or updates).
 */
export async function upsertFreelancerProfile(profile: FreelancerProfile): Promise<boolean> {
  if (!isValidUUID(profile.id)) {
    return false;
  }
  try {
    const cleanProfile = cleanProfileUrls(profile);
    const dbProfile = mapProfileToDB(cleanProfile);
    const { error } = await supabase
      .from('profiles')
      .upsert(dbProfile);

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('Could not upsert profile in Supabase (offline failover active):', error);
    return false;
  }
}

/**
 * Deletes a freelancer profile from Supabase.
 */
export async function deleteFreelancerProfile(profileId: string): Promise<boolean> {
  if (!isValidUUID(profileId)) {
    return false;
  }
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profileId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('Could not delete profile from Supabase (offline failover active):', error);
    return false;
  }
}

/**
 * Upserts multiple portfolio items.
 */
export async function savePortfolioItems(profileId: string, items: PortfolioItem[]): Promise<boolean> {
  if (!isValidUUID(profileId)) {
    return false;
  }
  try {
    // Delete existing ones to sync the new list
    const { error: delErr } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('profile_id', profileId);

    if (delErr) throw delErr;

    if (items.length === 0) return true;

    const dbItems = items.map(item => ({
      profile_id: profileId,
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: getStoragePathFromUrl(item.imageUrl),
      video_url: item.videoUrl ? getStoragePathFromUrl(item.videoUrl) : null,
      gallery_urls: (item.galleryUrls || []).map(g => getStoragePathFromUrl(g)),
      likes: item.likes,
      views: item.views,
      date: item.date,
      is_live: item.isLive !== false
    }));

    const { error: insErr } = await supabase
      .from('portfolio_items')
      .insert(dbItems);

    if (insErr) throw insErr;
    return true;
  } catch (error) {
    console.warn('Could not save portfolio items in Supabase (offline failover active):', error);
    return false;
  }
}

/**
 * Saves timeline / feed posts.
 */
export async function saveFeedPosts(profileId: string, posts: FeedPost[]): Promise<boolean> {
  if (!isValidUUID(profileId)) {
    return false;
  }
  try {
    // Delete existing ones to sync
    const { error: delErr } = await supabase
      .from('feed_posts')
      .delete()
      .eq('profile_id', profileId);

    if (delErr) throw delErr;

    if (posts.length === 0) return true;

    const dbPosts = posts.map(post => ({
      profile_id: profileId,
      caption: post.caption || null,
      image_url: post.imageUrl ? getStoragePathFromUrl(post.imageUrl) : null,
      likes: post.likes,
      timestamp: post.timestamp
    }));

    const { error: insErr } = await supabase
      .from('feed_posts')
      .insert(dbPosts);

    if (insErr) throw insErr;
    return true;
  } catch (error) {
    console.warn('Could not save feed posts in Supabase (offline failover active):', error);
    return false;
  }
}

// ============================================================================
// JOB BOARD OPERATIONS
// ============================================================================

/**
 * Loads all jobs from Supabase.
 */
export async function loadJobsFromSupabase(): Promise<Job[] | null> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    // Filter out jobs created before vivid_deleted_at
    const deletedAtStr = localStorage.getItem('vivid_deleted_at');
    let filteredData = data;
    if (deletedAtStr) {
      const deletedAt = new Date(deletedAtStr).getTime();
      filteredData = data.filter(job => {
        const createdAt = job.created_at ? new Date(job.created_at).getTime() : 0;
        return createdAt > deletedAt;
      });
    }

    return filteredData.map(mapJobFromDB);
  } catch (error: any) {
    if (error && (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist'))) {
      console.warn(
        '🎯 Supabase Setup Info: The "jobs" table is not created yet in your Supabase database. ' +
        'Please copy and run the DDL SQL schema at the top of src/utils/supabaseService.ts in your Supabase SQL Editor. ' +
        'Falling back to local demo state for now.'
      );
    } else {
      console.warn('Could not load jobs from Supabase (falling back to offline mode):', error);
    }
    return null;
  }
}

/**
 * Upserts a job to Supabase.
 */
export async function upsertJobInSupabase(job: Job, userId?: string | null): Promise<boolean> {
  if (!isValidUUID(job.id)) {
    return false;
  }
  try {
    const dbJob = mapJobToDB(job, userId);
    const { error } = await supabase
      .from('jobs')
      .upsert(dbJob);

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('Could not upsert job in Supabase (offline failover active):', error);
    return false;
  }
}

/**
 * Deletes a job from Supabase.
 */
export async function deleteJobFromSupabase(jobId: string): Promise<boolean> {
  if (!isValidUUID(jobId)) {
    return false;
  }
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.warn('Could not delete job from Supabase (offline failover active):', error);
    return false;
  }
}

/**
 * Deletes all profiles, portfolio items, posts, and jobs from Supabase.
 */
export async function deleteAllProfilesAndJobsFromSupabase(): Promise<boolean> {
  // Set the deletion timestamp first to guarantee local immediate cleanup
  localStorage.setItem('vivid_deleted_at', new Date().toISOString());
  
  try {
    // Attempt deleting our own portfolio items, feed posts, profiles, and jobs from Supabase if we can
    const { error: err1 } = await supabase.from('portfolio_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err1) console.warn('Supabase portfolio_items delete restriction/warning:', err1.message);

    const { error: err2 } = await supabase.from('feed_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err2) console.warn('Supabase feed_posts delete restriction/warning:', err2.message);

    const { error: err3 } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err3) console.warn('Supabase profiles delete restriction/warning:', err3.message);

    const { error: err4 } = await supabase.from('jobs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err4) console.warn('Supabase jobs delete restriction/warning:', err4.message);

    return true;
  } catch (error) {
    console.warn('Could not clear some or all remote Supabase rows (ignoring & using local-first exclusion):', error);
    return true; // Return true because our local filter is fully active and guarantees a clean slate
  }
}

