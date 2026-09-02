import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Check, 
  X, 
  User, 
  Mail, 
  Search, 
  RefreshCw,
  BarChart3,
  Activity,
  Layers,
  Sparkles,
  Zap,
  BookOpen,
  GraduationCap,
  Briefcase,
  Camera,
  ShieldCheck,
  Quote,
  Download,
  FileText,
  ArrowRight,
  Eye,
  Clock,
  Award,
  Flame,
  Filter,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { 
  fetchAllUsersAdmin, 
  updateUserStatusAdmin, 
  fetchAdminDashboard,
  fetchUserProgressAdmin 
} from '../services/api';

const FEATURE_ICONS = {
  paraphrase: <BookOpen className="w-4 h-4 text-sky-500" />,
  humanize: <Zap className="w-4 h-4 text-amber-500" />,
  batch: <Layers className="w-4 h-4 text-purple-500" />,
  ocr: <Camera className="w-4 h-4 text-emerald-500" />,
  personas: <Sparkles className="w-4 h-4 text-pink-500" />,
  sentence_editor: <Activity className="w-4 h-4 text-indigo-500" />,
  ai_detector: <Shield className="w-4 h-4 text-rose-500" />,
  originality: <ShieldCheck className="w-4 h-4 text-teal-500" />,
  citations: <Quote className="w-4 h-4 text-blue-500" />,
  docx_export: <Download className="w-4 h-4 text-cyan-500" />
};

export default function AdminView({ onNotify }) {
  const [users, setUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeView, setActiveView] = useState('users'); // 'overview' | 'users'

  // User Deep Dive Inspector Modal State
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [userProgressData, setUserProgressData] = useState(null);
  const [loadingUserProgress, setLoadingUserProgress] = useState(false);
  const [inspectorTab, setInspectorTab] = useState('matrix'); // 'matrix' | 'history' | 'activity' | 'personas'
  const [historySearch, setHistorySearch] = useState('');
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.allSettled([
        fetchAllUsersAdmin(),
        fetchAdminDashboard()
      ]);

      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value.users || []);
      } else {
        onNotify('Failed to fetch user accounts.', 'error');
      }

      if (statsRes.status === 'fulfilled') {
        setDashboardStats(statsRes.value);
      }
    } catch {
      onNotify('Failed to load admin analytics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (email, newStatus) => {
    try {
      await updateUserStatusAdmin(email, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, status: newStatus } : u))
      );
      if (userProgressData && userProgressData.user.email === email) {
        setUserProgressData((prev) => ({
          ...prev,
          user: { ...prev.user, status: newStatus }
        }));
      }
      onNotify(`Updated access status for ${email} to ${newStatus.toUpperCase()}`, 'success');
    } catch {
      onNotify('Failed to update status.', 'error');
    }
  };

  const handleOpenInspector = async (email) => {
    setSelectedUserEmail(email);
    setLoadingUserProgress(true);
    setInspectorTab('matrix');
    try {
      const data = await fetchUserProgressAdmin(email);
      setUserProgressData(data);
    } catch {
      onNotify('Failed to load detailed user progress.', 'error');
      setSelectedUserEmail(null);
    } finally {
      setLoadingUserProgress(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.status || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.mastery_badge || '').toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && u.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Administrator Console</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Monitor real-time user progress, feature usage analytics, and manage access
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Switch View Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveView('users')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeView === 'users'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Accounts ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveView('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeView === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Platform Intelligence</span>
            </button>
          </div>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Global KPI Stats Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-panel p-4 rounded-3xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Total Registered</span>
              <User className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {dashboardStats.total_users}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="text-emerald-700 font-bold">{dashboardStats.accepted_users} approved</span> &bull; {dashboardStats.pending_users} pending
            </div>
          </div>

          <div className="glass-panel p-4 rounded-3xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Words Transformed</span>
              <FileText className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {dashboardStats.total_words_transformed.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Across all user sessions
            </div>
          </div>

          <div className="glass-panel p-4 rounded-3xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Total Transformations</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {dashboardStats.total_transformations}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Paraphrasing, Batch & Humanize runs
            </div>
          </div>

          <div className="glass-panel p-4 rounded-3xl space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Feature Invocations</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {(dashboardStats.feature_popularity || []).reduce((a, b) => a + b.count, 0)}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Across 10 enterprise tools
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM INTELLIGENCE VIEW */}
      {activeView === 'overview' && dashboardStats && (
        <div className="space-y-6 animate-fadeIn">
          {/* Feature Adoption Breakdown */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  Enterprise Feature Adoption Across Platform
                </h3>
                <p className="text-xs text-slate-500">Live breakdown of which features users engage with the most</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {(dashboardStats.feature_popularity || []).map((feat) => {
                const totalInvocations = Math.max(1, (dashboardStats.feature_popularity || []).reduce((a, b) => a + b.count, 0));
                const pct = Math.round((feat.count / totalInvocations) * 100);

                return (
                  <div key={feat.feature_id} className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        {FEATURE_ICONS[feat.feature_id] || <Sparkles className="w-4 h-4 text-slate-500" />}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                        {feat.category}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{feat.name}</div>
                      <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                        {feat.count} <span className="text-xs font-medium text-slate-400">uses</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(feat.count > 0 ? 5 : 0, pct))}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 text-right">{pct}% share</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Feed & Top Users */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real-time platform activity log */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Recent Platform Events
                  </h3>
                  <p className="text-xs text-slate-500">Live chronological audit stream of user activities</p>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {(dashboardStats.recent_activity || []).length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No recent activity logs recorded yet.</div>
                ) : (
                  (dashboardStats.recent_activity || []).map((ev) => (
                    <div key={ev.id} className="p-3 rounded-2xl bg-white/80 border border-slate-100 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-sky-50 text-sky-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {ev.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">
                            {ev.user_name} <span className="font-medium text-slate-500">({ev.email})</span>
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            <span className="font-bold text-indigo-600">{ev.feature_name}:</span> {ev.action}
                            {ev.details && <span className="text-slate-400 italic"> &bull; {ev.details}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{ev.timestamp ? ev.timestamp.split(' ')[1] || ev.timestamp : ''}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Active Users */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Most Active Wordsmiths
                </h3>
                <p className="text-xs text-slate-500">Top users by transformation volume</p>
              </div>

              <div className="space-y-3">
                {(dashboardStats.top_users || []).map((u, idx) => (
                  <div key={u.email} className="p-3 rounded-2xl bg-white/70 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-800">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenInspector(u.email)}
                      className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[11px] border border-sky-200/80 transition-all cursor-pointer"
                    >
                      {u.transformations} runs
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER ACCOUNTS & PROGRESS VIEW */}
      {activeView === 'users' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filter Bar */}
          <div className="glass-panel p-3 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-grow max-w-md bg-white/80 rounded-xl px-3 py-1.5 border border-slate-200/80">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, status, mastery..."
                className="w-full bg-transparent text-xs text-slate-800 focus:outline-none placeholder-slate-400 font-medium"
              />
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {['all', 'accepted', 'pending', 'rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {st === 'all' ? 'All Accounts' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Users List / Grid */}
          {loading ? (
            <div className="p-16 text-center text-slate-400 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-300" />
              Loading user accounts & progress statistics...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center shadow-xs">
              <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-700">No Users Found</h4>
              <p className="text-xs text-slate-500 mt-1">No user accounts matched the filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((u) => {
                const isAccepted = u.status === 'accepted';
                const isRejected = u.status === 'rejected';

                const masteryColors = {
                  Master: 'bg-purple-50 text-purple-700 border-purple-200/80',
                  Advanced: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
                  Intermediate: 'bg-sky-50 text-sky-700 border-sky-200/80',
                  Novice: 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                };

                return (
                  <div
                    key={u.email}
                    className="glass-panel rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 border border-slate-200/80"
                  >
                    {/* User Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200/80 font-extrabold text-base flex items-center justify-center shadow-xs shrink-0">
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{u.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium truncate mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize shrink-0 ${
                          isAccepted
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                            : isRejected
                            ? 'bg-rose-50 text-rose-800 border border-rose-200/80'
                            : 'bg-amber-50 text-amber-800 border border-amber-200/80'
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>

                    {/* Progress Metrics Indicators */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-white/70 border border-slate-100 text-center">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Runs</div>
                        <div className="text-sm font-extrabold text-slate-900">{u.transformations_count}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Words</div>
                        <div className="text-sm font-extrabold text-slate-900">{u.words_count.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Features</div>
                        <div className="text-sm font-extrabold text-indigo-600">{u.features_used_count}/10</div>
                      </div>
                    </div>

                    {/* Badges & Meta */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className={`px-2 py-0.5 rounded-xl font-bold text-[10px] border ${masteryColors[u.mastery_badge] || 'bg-slate-50 text-slate-600'}`}>
                        {u.mastery_badge} Tier
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {u.last_active ? u.last_active.split(' ')[0] : 'Never'}
                      </span>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenInspector(u.email)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>Inspect Progress</span>
                      </button>

                      <div className="flex items-center gap-1">
                        {!isAccepted && (
                          <button
                            onClick={() => handleStatusChange(u.email, 'accepted')}
                            title="Approve User Access"
                            className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {!isRejected && (
                          <button
                            onClick={() => handleStatusChange(u.email, 'rejected')}
                            title="Revoke User Access"
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* USER DEEP-DIVE INSPECTOR MODAL */}
      {selectedUserEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
          <div className="glass-modal max-w-4xl w-full rounded-3xl p-5 sm:p-8 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200/80">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 font-extrabold text-lg flex items-center justify-center shadow-xs">
                  {userProgressData?.user?.name ? userProgressData.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xl text-slate-900">
                      {userProgressData?.user?.name || selectedUserEmail}
                    </h3>
                    {userProgressData?.mastery && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                        {userProgressData.mastery.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>{selectedUserEmail}</span>
                    &bull;
                    <span className="capitalize font-bold text-slate-700">{userProgressData?.user?.status || 'Active'}</span>
                    &bull;
                    <span>Last active: {userProgressData?.user?.last_active || 'Recent'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserEmail(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingUserProgress || !userProgressData ? (
              <div className="py-24 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-7 h-7 animate-spin mx-auto text-indigo-500" />
                <div className="text-sm font-medium">Aggregating user progress & feature history...</div>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto space-y-6 pt-4 pr-1">
                {/* Summary Progress Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Transformed</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {userProgressData.metrics.total_transformations} <span className="text-xs text-slate-400 font-medium">runs</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Words Processed</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {userProgressData.metrics.total_words_processed.toLocaleString()} <span className="text-xs text-slate-400 font-medium">words</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Feature Adoption</div>
                    <div className="text-xl font-extrabold text-indigo-600 mt-0.5">
                      {userProgressData.metrics.feature_adoption_rate}%
                    </div>
                    <div className="text-[10px] text-slate-400">{userProgressData.metrics.features_used_count} of 10 tools used</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Est. Time Saved</div>
                    <div className="text-xl font-extrabold text-emerald-600 mt-0.5">
                      {userProgressData.metrics.time_saved_minutes} <span className="text-xs text-slate-400 font-medium">min</span>
                    </div>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex border-b border-slate-200 gap-2">
                  <button
                    onClick={() => setInspectorTab('matrix')}
                    className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
                      inspectorTab === 'matrix'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Feature Usage Matrix ({userProgressData.metrics.features_used_count}/10)
                  </button>
                  <button
                    onClick={() => setInspectorTab('history')}
                    className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
                      inspectorTab === 'history'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Transformation History ({userProgressData.history?.length || 0})
                  </button>
                  <button
                    onClick={() => setInspectorTab('activity')}
                    className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
                      inspectorTab === 'activity'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Activity Audit Trail ({userProgressData.activity_logs?.length || 0})
                  </button>
                  <button
                    onClick={() => setInspectorTab('personas')}
                    className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
                      inspectorTab === 'personas'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Personas ({userProgressData.personas?.length || 0})
                  </button>
                </div>

                {/* TAB 1: FEATURE MATRIX */}
                {inspectorTab === 'matrix' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(userProgressData.feature_matrix || []).map((feat) => {
                        const isUsed = feat.status === 'Active';

                        return (
                          <div
                            key={feat.id}
                            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                              isUsed
                                ? 'bg-white border-slate-200/90 shadow-xs'
                                : 'bg-slate-50/70 border-slate-200/50 opacity-70'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                                {FEATURE_ICONS[feat.id] || <Sparkles className="w-4 h-4 text-slate-500" />}
                              </span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-xs text-slate-900">{feat.name}</h5>
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 uppercase">
                                    {feat.category}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{feat.desc}</p>
                                {feat.last_used && (
                                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>Last used: {feat.last_used}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                  isUsed
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                {isUsed ? `${feat.usage_count} uses` : 'Unexplored'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tone Preferences */}
                    {userProgressData.favorite_tones?.length > 0 && (
                      <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 space-y-2">
                        <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                          Favorite Writing & Transformation Tones
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {userProgressData.favorite_tones.map((t) => (
                            <span key={t.tone} className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                              {t.tone}: <span className="text-indigo-600">{t.count} runs</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: TRANSFORMATION HISTORY */}
                {inspectorTab === 'history' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2 bg-white/90 rounded-xl px-3 py-1.5 border border-slate-200 text-xs">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        placeholder="Search text in user transformations..."
                        className="w-full bg-transparent focus:outline-none placeholder-slate-400 font-medium"
                      />
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {userProgressData.history?.filter((h) => 
                        (h.original_text || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                        (h.paraphrased_text || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                        (h.difficulty || '').toLowerCase().includes(historySearch.toLowerCase())
                      ).length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-xs">No transformation records found for this user.</div>
                      ) : (
                        userProgressData.history
                          .filter((h) => 
                            (h.original_text || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                            (h.paraphrased_text || '').toLowerCase().includes(historySearch.toLowerCase()) ||
                            (h.difficulty || '').toLowerCase().includes(historySearch.toLowerCase())
                          )
                          .map((item) => {
                            const isExpanded = expandedHistoryId === item.id;

                            return (
                              <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
                                      {item.difficulty}
                                    </span>
                                    <span className="text-slate-400 text-[11px]">
                                      {item.original_word_count} words &rarr; {item.paraphrased_word_count} words
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.timestamp}
                                  </span>
                                </div>

                                <div className="space-y-2 text-xs">
                                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Source Text:</div>
                                    <div className={`font-medium ${isExpanded ? '' : 'line-clamp-2'}`}>{item.original_text}</div>
                                  </div>

                                  <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-slate-900">
                                    <div className="text-[10px] font-bold text-sky-600 uppercase mb-1">Transformed Output:</div>
                                    <div className={`font-medium ${isExpanded ? '' : 'line-clamp-3'}`}>{item.paraphrased_text}</div>
                                  </div>
                                </div>

                                <div className="flex justify-end pt-1">
                                  <button
                                    onClick={() => setExpandedHistoryId(isExpanded ? null : item.id)}
                                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                  >
                                    {isExpanded ? 'Collapse View' : 'Show Full Comparison'}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: ACTIVITY LOGS */}
                {inspectorTab === 'activity' && (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1 animate-fadeIn">
                    {(userProgressData.activity_logs || []).length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs">No activity event records logged yet.</div>
                    ) : (
                      userProgressData.activity_logs.map((log) => (
                        <div key={log.id} className="p-3 rounded-2xl bg-white border border-slate-100 flex items-start justify-between gap-3 text-xs">
                          <div className="flex items-start gap-2.5">
                            <span className="p-1.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                              {FEATURE_ICONS[log.feature_name?.toLowerCase()] || <Activity className="w-3.5 h-3.5 text-indigo-500" />}
                            </span>
                            <div>
                              <div className="font-bold text-slate-800">
                                <span className="text-indigo-600 font-extrabold">{log.feature_name}:</span> {log.action}
                              </div>
                              {log.details && <div className="text-slate-500 text-[11px] mt-0.5">{log.details}</div>}
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                            {log.timestamp}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* TAB 4: PERSONAS */}
                {inspectorTab === 'personas' && (
                  <div className="space-y-3 animate-fadeIn">
                    {(userProgressData.personas || []).length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs">This user has not created any custom personas yet.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {userProgressData.personas.map((p) => (
                          <div key={p.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-xl bg-pink-50 text-pink-600 border border-pink-200">
                                <Sparkles className="w-4 h-4" />
                              </span>
                              <h5 className="font-bold text-xs text-slate-900">{p.title}</h5>
                            </div>
                            <p className="text-xs text-slate-600 font-medium line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              "{p.instruction}"
                            </p>
                            <div className="text-[10px] text-slate-400 text-right">Created: {p.created_at}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
