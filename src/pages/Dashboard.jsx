/**
 * Dashboard.jsx
 * Clean, minimal dashboard with auto-refresh and skeleton loading
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { 
  FileText, Briefcase, Bell, TrendingUp, Plus, 
  Target, ChevronRight, Sparkles, Zap, RefreshCw
} from 'lucide-react';

// Onboarding components
import OnboardingModal from '../components/OnboardingModal';
import OnboardingChecklist from '../components/OnboardingChecklist';

// Skeleton loader component
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Analysis item skeleton
const AnalysisSkeleton = () => (
  <div className="flex items-center gap-4 px-5 py-4">
    <Skeleton className="w-11 h-11 rounded-lg" />
    <div className="flex-1">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

// Stat card skeleton
const StatSkeleton = () => (
  <div className="bg-white rounded-xl p-4 border border-gray-200">
    <div className="flex items-center gap-2 mb-2">
      <Skeleton className="w-4 h-4 rounded" />
      <Skeleton className="w-12 h-3" />
    </div>
    <Skeleton className="h-7 w-16 mb-1" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  // Load dashboard data
  const loadDashboardData = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    
    try {
      const [historyRes, jobsRes] = await Promise.all([
        api.getAnalysisHistory(5, 0).catch(() => ({ data: { analyses: [] } })),
        api.getJobMatches('all', 5, 0).catch(() => ({ data: { matches: [] } })),
      ]);
      
      const analyses = historyRes.data?.analyses || historyRes.data || [];
      const matches = jobsRes.data?.matches || jobsRes.data || [];
      
      setRecentAnalyses(Array.isArray(analyses) ? analyses : []);
      setJobMatches(Array.isArray(matches) ? matches : []);
      
      // Check for new analyses (for notification)
      const newCount = Array.isArray(analyses) ? analyses.length : 0;
      if (lastCount > 0 && newCount > lastCount) {
        // New analysis detected - data refreshed automatically
      }
      setLastCount(newCount);
      
      setStats({
        analysesToday: user?.analyses_today || 0,
        analysesLimit: user?.subscription_status === 'free' ? 3 : '∞',
        totalAnalyses: user?.analyses_total || 0,
        matchedJobs: Array.isArray(matches) ? matches.length : 0,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user, lastCount]);

  // Initial load
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-refresh every 8 seconds to catch new analyses from extension
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Refresh when tab becomes visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadDashboardData(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [loadDashboardData]);

  // Check if should show onboarding
  useEffect(() => {
    if (user && !user.onboarding_completed && !localStorage.getItem('onboarding_shown')) {
      setShowOnboarding(true);
      localStorage.setItem('onboarding_shown', 'true');
    }
  }, [user]);

  const isPro = user?.subscription_status === 'pro' || user?.subscription_status === 'lifetime';
  const hasResume = recentAnalyses.length > 0 || user?.analyses_total > 0;
  const hasAnalysis = user?.analyses_total > 0 || recentAnalyses.length > 0;

  const getScoreColor = (score) => {
    if (score >= 75) return 'bg-emerald-100 text-emerald-700';
    if (score >= 50) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          setShowOnboarding(false);
          loadDashboardData();
        }}
        userName={user?.full_name}
      />

      {/* Onboarding Checklist */}
      {!user?.onboarding_completed && (
        <OnboardingChecklist
          hasResume={hasResume}
          extensionInstalled={user?.extension_installed}
          hasAnalysis={hasAnalysis}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-gray-500 text-sm">Your job search overview</p>
        </div>
        <button
          onClick={() => loadDashboardData(true)}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Link 
          to="/resume-builder"
          className="flex items-center gap-3 p-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium text-sm">Build Resume</span>
        </Link>

        <Link 
          to="/resumes"
          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <FileText className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-sm text-gray-700">Resumes</span>
        </Link>

        <Link 
          to="/jobs"
          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-sm text-gray-700">Jobs</span>
        </Link>

        <Link 
          to="/job-alerts"
          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-sm text-gray-700">Alerts</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>Today</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.analysesToday || 0}
                <span className="text-sm font-normal text-gray-400">/{stats?.analysesLimit}</span>
              </p>
              <p className="text-xs text-gray-500">Analyses</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Total</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalAnalyses || 0}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Matches</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900">{stats?.matchedJobs || 0}</p>
              <p className="text-xs text-gray-500">Jobs</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan</span>
              </div>
              <p className="text-2xl font-semibold text-gray-900 capitalize">{user?.subscription_status || 'Free'}</p>
              <p className="text-xs text-gray-500">{isPro ? 'Pro' : 'Basic'}</p>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Analyses */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-medium text-gray-900 text-sm">Recent Analyses</h2>
            <Link to="/history" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="divide-y divide-gray-100">
              <AnalysisSkeleton />
              <AnalysisSkeleton />
              <AnalysisSkeleton />
            </div>
          ) : recentAnalyses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm mb-1">No analyses yet</p>
              <p className="text-gray-400 text-xs">Use the Chrome extension to analyze jobs</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentAnalyses.map((analysis) => (
                <Link 
                  key={analysis.id}
                  to={`/history/${analysis.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${getScoreColor(analysis.match_score)}`}>
                    {analysis.match_score}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{analysis.job_title}</p>
                    <p className="text-xs text-gray-500 truncate">{analysis.company_name}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Job Matches */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-medium text-gray-900 text-sm">Job Matches</h2>
            <Link to="/jobs" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="divide-y divide-gray-100">
              <AnalysisSkeleton />
              <AnalysisSkeleton />
              <AnalysisSkeleton />
            </div>
          ) : jobMatches.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm mb-1">No job matches</p>
              <Link to="/job-alerts" className="text-xs text-indigo-600 hover:text-indigo-700">
                Set up job alerts →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {jobMatches.map((job) => (
                <Link 
                  key={job.id}
                  to={`/jobs?id=${job.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold ${getScoreColor(job.match_score)}`}>
                    {job.match_score}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{job.title}</p>
                    <p className="text-xs text-gray-500 truncate">{job.company}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Banner */}
      {!isPro && (
        <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Upgrade to Pro</h3>
              <p className="text-indigo-100 text-sm">Unlimited analyses & AI resume tailoring</p>
            </div>
            <Link 
              to="/pricing"
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
