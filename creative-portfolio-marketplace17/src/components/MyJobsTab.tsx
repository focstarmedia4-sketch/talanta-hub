/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Edit2, Trash2, Lock, Unlock, Eye, Users, 
  AlertCircle, CheckCircle, Clock, MapPin, DollarSign, Calendar, 
  ChevronRight, X, ExternalLink, ShieldAlert, Filter, Sparkles
} from 'lucide-react';
import { Job, FreelancerProfile, CreativeCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { fetchJobUnlocksFromSupabase } from '../utils/supabaseService';

interface MyJobsTabProps {
  currentUserId: string;
  currentUserEmail?: string;
  allJobs: Job[];
  allFreelancers: FreelancerProfile[];
  onUpdateJob: (updatedJob: Job) => void;
  onDeleteJob: (jobId: string) => void;
  onOpenPostJobModal: () => void;
  onSelectCreativeProfile?: (username: string) => void;
}

const KENYAN_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka-Nithi",
  "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
];

export function MyJobsTab({
  currentUserId,
  currentUserEmail,
  allJobs,
  allFreelancers,
  onUpdateJob,
  onDeleteJob,
  onOpenPostJobModal,
  onSelectCreativeProfile
}: MyJobsTabProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'expired'>('all');
  
  // Modals state
  const [analyticsJob, setAnalyticsJob] = useState<Job | null>(null);
  const [analyticsUnlocks, setAnalyticsUnlocks] = useState<any[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);

  // Edit Form Fields
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<CreativeCategory>('videography');
  const [editBudgetRange, setEditBudgetRange] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState<'open' | 'closed' | 'expired'>('open');
  const [editDeliveryDeadline, setEditDeliveryDeadline] = useState('');
  const [editClientEmail, setEditClientEmail] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [editClientWhatsapp, setEditClientWhatsapp] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Filter jobs owned by this user
  const myJobs = allJobs.filter(j => {
    const isOwnerById = j.userId && j.userId === currentUserId;
    const isOwnerByEmail = currentUserEmail && j.clientEmail && j.clientEmail.toLowerCase().trim() === currentUserEmail.toLowerCase().trim();
    return isOwnerById || isOwnerByEmail;
  });

  const activeJobsCount = myJobs.filter(j => !j.status || (j.status as string) === 'open' || (j.status as string) === 'active').length;
  const closedJobsCount = myJobs.filter(j => (j.status as string) === 'closed').length;
  const expiredJobsCount = myJobs.filter(j => (j.status as string) === 'expired').length;

  const filteredJobs = myJobs.filter(j => {
    const jobStatus = j.status as string;
    if (statusFilter === 'active') return !jobStatus || jobStatus === 'open' || jobStatus === 'active';
    if (statusFilter === 'closed') return jobStatus === 'closed';
    if (statusFilter === 'expired') return jobStatus === 'expired';
    return true;
  });

  // Open Analytics modal
  const handleOpenAnalytics = async (job: Job) => {
    setAnalyticsJob(job);
    setLoadingAnalytics(true);
    try {
      const unlocks = await fetchJobUnlocksFromSupabase(job.id);
      setAnalyticsUnlocks(unlocks);
    } catch (err) {
      console.error("Error fetching job unlocks:", err);
      setAnalyticsUnlocks([]);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Open Edit modal
  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setEditTitle(job.title || '');
    setEditCategory(job.category || 'videography');
    setEditBudgetRange(job.budgetRange || '');
    setEditLocation(job.location || '');
    setEditDescription(job.description || '');
    setEditStatus((job.status as any) || 'open');
    setEditDeliveryDeadline(job.deliveryDeadline || '');
    setEditClientEmail(job.clientEmail || '');
    setEditClientPhone(job.clientPhone || '');
    setEditClientWhatsapp(job.clientWhatsapp || '');
    setEditError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    const unlocksCount = editingJob.unlockCount || 0;
    const isLocked = unlocksCount > 0;

    let updated: Job = {
      ...editingJob,
      status: editStatus,
      deliveryDeadline: editDeliveryDeadline,
      clientEmail: editClientEmail,
      clientPhone: editClientPhone,
      clientWhatsapp: editClientWhatsapp,
    };

    if (!isLocked) {
      // Major fields can be updated if no unlocks exist yet
      if (!editTitle.trim() || !editBudgetRange.trim() || !editDescription.trim()) {
        setEditError('Title, Budget Range, and Description are required.');
        return;
      }

      updated = {
        ...updated,
        title: editTitle.trim(),
        category: editCategory,
        budgetRange: editBudgetRange.trim(),
        location: editLocation.trim(),
        description: editDescription.trim()
      };
    }

    onUpdateJob(updated);
    setEditingJob(null);
  };

  // Quick Toggle Status
  const handleToggleCloseReopen = (job: Job) => {
    const isClosed = job.status === 'closed';
    const newStatus = isClosed ? 'open' : 'closed';
    onUpdateJob({
      ...job,
      status: newStatus
    });
  };

  const handleConfirmDelete = () => {
    if (!deletingJob) return;
    onDeleteJob(deletingJob.id);
    setDeletingJob(null);
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs">
              <Briefcase className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">My Job Briefs</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your posted client opportunities, view creative contact unlocks, and monitor job performance.
          </p>
        </div>

        <button
          onClick={onOpenPostJobModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-[1.02] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Job Brief</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-indigo-950 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Briefs ({myJobs.length})
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'active'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          Active ({activeJobsCount})
        </button>
        <button
          onClick={() => setStatusFilter('closed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'closed'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          Closed ({closedJobsCount})
        </button>
        <button
          onClick={() => setStatusFilter('expired')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'expired'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          Expired ({expiredJobsCount})
        </button>
      </div>

      {/* Jobs Grid / List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-10 text-center space-y-3">
          <div className="h-12 w-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No job briefs found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {myJobs.length === 0 
              ? "You haven't posted any job briefs yet. Create a brief to start receiving interest from top Kenyan creatives!"
              : "No job briefs match the selected status filter."
            }
          </p>
          <button
            onClick={onOpenPostJobModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Post a Brief Now</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => {
            const unlocksCount = job.unlockCount || 0;
            const jobStatus = job.status as string;
            const isClosed = jobStatus === 'closed';
            const isExpired = jobStatus === 'expired';
            const isActive = !jobStatus || jobStatus === 'open' || jobStatus === 'active';

            return (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all hover:border-indigo-200 ${
                  isClosed ? 'border-slate-200 opacity-85' : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Job Primary Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-900">{job.title}</h3>
                      
                      {/* Status Badge */}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-200/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Active
                        </span>
                      )}
                      {isClosed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-amber-200/60">
                          <Lock className="h-3 w-3" />
                          Closed
                        </span>
                      )}
                      {isExpired && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-rose-200/60">
                          Expired
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50/80 px-2 py-0.5 rounded-md">
                        {job.category}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                        {job.budgetRange}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Posted: {job.postedDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">
                      {job.description}
                    </p>
                  </div>

                  {/* Metrics & Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center justify-end gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    
                    {/* Unlock Analytics Button */}
                    <button
                      onClick={() => handleOpenAnalytics(job)}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      title="View creative unlocks"
                    >
                      <Users className="h-4 w-4 text-indigo-600" />
                      <span>{unlocksCount} {unlocksCount === 1 ? 'Unlock' : 'Unlocks'}</span>
                    </button>

                    {/* Edit Job Button */}
                    <button
                      onClick={() => handleOpenEdit(job)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      title="Edit job brief"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Close / Reopen Toggle */}
                    <button
                      onClick={() => handleToggleCloseReopen(job)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isClosed 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                      title={isClosed ? "Reopen job brief" : "Mark job as closed"}
                    >
                      {isClosed ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      <span>{isClosed ? 'Reopen' : 'Close'}</span>
                    </button>

                    {/* Delete Job Button */}
                    <button
                      onClick={() => setDeletingJob(job)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer"
                      title="Delete job brief"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* UNLOCK ANALYTICS MODAL */}
      <AnimatePresence>
        {analyticsJob && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Unlock Analytics</span>
                  <h3 className="text-lg font-extrabold truncate max-w-md">{analyticsJob.title}</h3>
                </div>
                <button
                  onClick={() => setAnalyticsJob(null)}
                  className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-indigo-900">Total Contact Unlocks</p>
                    <p className="text-2xl font-black text-indigo-600 mt-0.5">{analyticsUnlocks.length}</p>
                  </div>
                  <div className="p-3 bg-indigo-600 text-white rounded-xl">
                    <Users className="h-6 w-6" />
                  </div>
                </div>

                {loadingAnalytics ? (
                  <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                    Loading creative unlock history...
                  </div>
                ) : analyticsUnlocks.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed rounded-2xl">
                    No creatives have unlocked contact details for this job brief yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Creatives Who Unlocked Contact Info ({analyticsUnlocks.length})
                    </p>

                    <div className="divide-y divide-slate-100 border rounded-2xl overflow-hidden">
                      {analyticsUnlocks.map(unlock => {
                        const creativeId = unlock.buyerId || unlock.creativeId;
                        const creative = allFreelancers.find(f => f.id === creativeId);
                        
                        const fullName = creative?.fullName || 'Registered Creative';
                        const category = creative?.title || creative?.category || 'Creative Partner';
                        const location = creative?.location || 'Kenya';
                        const avatarUrl = creative?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
                        const username = creative?.username;

                        return (
                          <div key={unlock.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <img
                                src={avatarUrl}
                                alt={fullName}
                                className="h-10 w-10 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <p className="text-xs font-bold text-slate-900">{fullName}</p>
                                <p className="text-[10px] text-slate-500">{category} &bull; {location}</p>
                                <p className="text-[9px] text-indigo-600 font-semibold mt-0.5">
                                  Unlocked at: {formatDateTime(unlock.createdAt)}
                                </p>
                              </div>
                            </div>

                            {username && onSelectCreativeProfile && (
                              <button
                                onClick={() => {
                                  setAnalyticsJob(null);
                                  onSelectCreativeProfile(username);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-600 transition-colors cursor-pointer shrink-0"
                              >
                                <span>Profile</span>
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                <button
                  onClick={() => setAnalyticsJob(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* JOB EDIT MODAL WITH PROTECTIVE LOCK */}
      <AnimatePresence>
        {editingJob && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-xl w-full border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Edit Job Brief</span>
                  <h3 className="text-lg font-extrabold truncate max-w-md">{editingJob.title}</h3>
                </div>
                <button
                  onClick={() => setEditingJob(null)}
                  className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 flex-1">
                {/* Lock Protection Banner */}
                {(editingJob.unlockCount || 0) > 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl space-y-1.5 text-amber-900">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                      <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Opportunity Details Protected</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-800/90">
                      <strong>{editingJob.unlockCount} {editingJob.unlockCount === 1 ? 'creative has' : 'creatives have'}</strong> unlocked contact info for this job brief. To protect creative investment, core opportunity fields (Title, Category, Budget, Location, Description) are locked. If requirements have significantly changed, please create a new job brief instead.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200/60 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>No unlocks yet — you may freely update all job brief details.</span>
                  </div>
                )}

                {editError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                    {editError}
                  </div>
                )}

                {/* Major Fields (Locked if unlocks > 0) */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Job Title</label>
                    <input
                      type="text"
                      disabled={(editingJob.unlockCount || 0) > 0}
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                      <select
                        disabled={(editingJob.unlockCount || 0) > 0}
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 disabled:opacity-60 disabled:bg-slate-100 cursor-pointer"
                      >
                        <option value="videography">Videography</option>
                        <option value="photography">Photography</option>
                        <option value="design">Graphic Design</option>
                        <option value="branding">Branding</option>
                        <option value="events">Events</option>
                        <option value="musicproducers">Music Production</option>
                        <option value="content">Content Creation</option>
                        <option value="beauty">Beauty & Makeup</option>
                        <option value="fashion">Fashion</option>
                        <option value="webdev">Web Development</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Budget Range (KSh)</label>
                      <input
                        type="text"
                        disabled={(editingJob.unlockCount || 0) > 0}
                        value={editBudgetRange}
                        onChange={e => setEditBudgetRange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                    <input
                      type="text"
                      disabled={(editingJob.unlockCount || 0) > 0}
                      value={editLocation}
                      onChange={e => setEditLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      disabled={(editingJob.unlockCount || 0) > 0}
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 disabled:opacity-60 disabled:bg-slate-100"
                    />
                  </div>
                </div>

                <hr className="border-slate-100 my-2" />

                {/* Minor Fields (Always Editable) */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 block">
                    Editable Brief Settings
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
                      <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 cursor-pointer"
                      >
                        <option value="open">Active (Open)</option>
                        <option value="closed">Closed</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Delivery Deadline</label>
                      <input
                        type="date"
                        value={editDeliveryDeadline}
                        onChange={e => setEditDeliveryDeadline(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={editClientEmail}
                        onChange={e => setEditClientEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={editClientPhone}
                        onChange={e => setEditClientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingJob(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* JOB DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingJob && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 text-center space-y-4"
            >
              <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Job Brief?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to permanently delete <strong>"{deletingJob.title}"</strong>? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingJob(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Delete Job
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
