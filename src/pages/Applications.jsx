import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchCompany, setSearchCompany] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
    loadStats();
  }, [filter]);

  async function loadApplications() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (searchCompany) params.append('company', searchCompany);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      
      const response = await api.get(`/applications?${params.toString()}`);
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Load applications error:', error);
      alert('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const response = await api.get('/applications/stats/summary');
      setStats(response.data);
    } catch (error) {
      console.error('Load stats error:', error);
    }
  }

  function getStatusColor(status) {
    const colors = {
      queued: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      submitting: 'bg-purple-100 text-purple-800',
      submitted: 'bg-indigo-100 text-indigo-800',
      interviewing: 'bg-cyan-100 text-cyan-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-emerald-100 text-emerald-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-2 text-gray-600">
          Track all your job applications in one place
        </p>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Applications"
            value={stats.overview.total || 0}
            icon="📊"
            color="blue"
          />
          <StatsCard
            title="Submitted"
            value={stats.overview.submitted || 0}
            icon="✉️"
            color="green"
          />
          <StatsCard
            title="Responses"
            value={stats.overview.interviewing || 0}
            icon="📞"
            color="purple"
          />
          <StatsCard
            title="Response Rate"
            value={`${stats.overview.response_rate || 0}%`}
            icon="📈"
            color="indigo"
          />
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Applications</option>
              <option value="queued">Queued</option>
              <option value="submitted">Submitted</option>
              <option value="interviewing">Interviewing</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          {/* Company Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              value={searchCompany}
              onChange={(e) => setSearchCompany(e.target.value)}
              placeholder="Search by company..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={loadApplications}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              setSearchCompany('');
              setDateFrom('');
              setDateTo('');
              setFilter('all');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-4">
            Start by adding jobs to your queue
          </p>
          <button
            onClick={() => navigate('/queue')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            Go to Application Queue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <ApplicationCard
              key={app.id}
              application={app}
              onClick={() => navigate(`/applications/${app.id}`)}
            />
          ))}
        </div>
      )}

      {/* Monthly Chart (if stats available) */}
      {stats && stats.monthly && stats.monthly.length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Application Activity
          </h3>
          <div className="space-y-2">
            {stats.monthly.map((month, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm text-gray-600">
                  {new Date(month.month).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  })}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                      style={{ width: `${Math.min((month.count / 50) * 100, 100)}%` }}
                    >
                      {month.count > 0 && month.count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    indigo: 'bg-indigo-50 border-indigo-200'
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <div className="text-sm font-medium text-gray-700">{title}</div>
    </div>
  );
}

// Application Card Component
function ApplicationCard({ application, onClick }) {
  const statusColor = getStatusColor(application.status);
  
  const daysAgo = Math.floor(
    (Date.now() - new Date(application.submitted_at || application.created_at).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return (
    <div 
      onClick={onClick}
      className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {application.job_title}
              </h3>
              <p className="text-gray-600 mb-2">{application.company_name}</p>
              {application.job_location && (
                <p className="text-sm text-gray-500 mb-2">
                  📍 {application.job_location}
                </p>
              )}
            </div>

            {/* Match Score */}
            {application.match_score && (
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {application.match_score}%
                </div>
                <div className="text-xs text-gray-500">Match</div>
              </div>
            )}
          </div>

          {/* Status and Date */}
          <div className="flex items-center gap-3 mt-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
            {application.submitted_at ? (
              <span className="text-sm text-gray-500">
                Submitted {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                Added {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}
              </span>
            )}
            {application.response_received && (
              <span className="text-sm font-medium text-green-600">
                ✓ Response Received
              </span>
            )}
          </div>

          {/* Documents Info */}
          {(application.resume_version || application.has_cover_letter) && (
            <div className="flex gap-4 mt-3 text-sm text-gray-600">
              {application.resume_version && (
                <span>📄 {application.resume_version}</span>
              )}
              {application.has_cover_letter && (
                <span>📝 Cover Letter</span>
              )}
            </div>
          )}

          {/* Response Type Badge */}
          {application.response_type && (
            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                application.response_type === 'interview_request' 
                  ? 'bg-green-100 text-green-800'
                  : application.response_type === 'rejection'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {application.response_type === 'interview_request' && '🎉 Interview Request'}
                {application.response_type === 'rejection' && 'Not Selected'}
                {application.response_type === 'assessment' && '📝 Assessment'}
                {application.response_type === 'offer' && '🎊 Offer'}
              </span>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="text-gray-400 text-2xl ml-4">→</div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    queued: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    submitting: 'bg-purple-100 text-purple-800',
    submitted: 'bg-indigo-100 text-indigo-800',
    interviewing: 'bg-cyan-100 text-cyan-800',
    rejected: 'bg-red-100 text-red-800',
    accepted: 'bg-emerald-100 text-emerald-800',
    withdrawn: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
