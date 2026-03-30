/**
 * AnalysisHistory.jsx
 * Clean analysis history with auto-refresh, search, and skeleton loading
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { 
  History, Trash2, Target, ChevronRight, RefreshCw, Search, X
} from 'lucide-react';
import toast from 'react-hot-toast';

// Skeleton component
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const AnalysisSkeleton = () => (
  <div className="flex items-center gap-4 p-4">
    <Skeleton className="w-12 h-12 rounded-lg" />
    <div className="flex-1">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-1" />
      <Skeleton className="h-3 w-20" />
    </div>
    <Skeleton className="w-16 h-6 rounded-full" />
  </div>
);

export default function AnalysisHistory() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastCount, setLastCount] = useState(0);

  const loadAnalyses = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    
    try {
      const response = await api.getAnalysisHistory(100, 0);
      const data = response.data?.analyses || response.data || [];
      const analysesArray = Array.isArray(data) ? data : [];
      setAnalyses(analysesArray);
      
      // Check for new analyses
      if (lastCount > 0 && analysesArray.length > lastCount) {
        toast.success('New analysis completed!', { 
          duration: 3000,
          icon: '🎉'
        });
      }
      setLastCount(analysesArray.length);
    } catch (error) {
      console.error('Failed to load analyses:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [lastCount]);

  // Initial load
  useEffect(() => {
    loadAnalyses();
  }, []);

  // Auto-refresh every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadAnalyses(false);
    }, 8000);
    return () => clearInterval(interval);
  }, [loadAnalyses]);

  // Refresh when tab becomes visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadAnalyses(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [loadAnalyses]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this analysis?')) return;
    
    try {
      await api.deleteAnalysis(id);
      setAnalyses(prev => prev.filter(a => a.id !== id));
      toast.success('Analysis deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'bg-emerald-100 text-emerald-700';
    if (score >= 50) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Great';
    if (score >= 50) return 'Good';
    return 'Low';
  };

  // Filter analyses
  const filteredAnalyses = analyses.filter(a => 
    a.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analysis History</h1>
          <p className="text-gray-500 text-sm">
            {loading ? 'Loading...' : `${analyses.length} total analyses`}
          </p>
        </div>
        <button
          onClick={() => loadAnalyses(true)}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Search */}
      {!loading && analyses.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map(i => <AnalysisSkeleton key={i} />)}
          </div>
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-7 h-7 text-gray-400" />
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Use the Chrome extension to analyze job postings against your resume
          </p>
        </div>
      ) : filteredAnalyses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No results for "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredAnalyses.map((analysis) => (
              <div 
                key={analysis.id}
                onClick={() => navigate(`/history/${analysis.id}`)}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                {/* Score */}
                <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center ${getScoreColor(analysis.match_score)}`}>
                  <span className="text-base font-bold leading-none">{analysis.match_score}%</span>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                    {analysis.job_title}
                  </h3>
                  <p className="text-gray-500 text-sm truncate">{analysis.company_name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {new Date(analysis.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(analysis.match_score)}`}>
                    {getScoreLabel(analysis.match_score)}
                  </span>
                  <button
                    onClick={(e) => handleDelete(analysis.id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auto-refresh indicator */}
      {!loading && analyses.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-4">
          Auto-refreshes every 8 seconds
        </p>
      )}
    </div>
  );
}
