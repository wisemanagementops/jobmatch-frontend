import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function ApplicationQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState('priority');
  const [backendError, setBackendError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadQueue();
  }, [filter, sortBy]);

  async function loadQueue() {
    try {
      setLoading(true);
      setBackendError(false);
      
      // Try to load from backend (will fail until backend is ready)
      // This endpoint doesn't exist yet, so we'll catch the error
      const response = await fetch(`http://localhost:3000/api/applications/queue?status=${filter}&sortBy=${sortBy}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQueue(data.queue || []);
      } else {
        // Backend endpoint doesn't exist yet
        setBackendError(true);
        setQueue([]);
      }
    } catch (error) {
      // Backend not ready or endpoint doesn't exist
      console.log('Queue endpoint not ready yet:', error.message);
      setBackendError(true);
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/applications/queue/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        await loadQueue();
        alert('✅ Application approved!');
      } else {
        alert('Backend endpoint not ready yet');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Backend endpoint not ready yet');
    }
  }

  async function handleReject(id, reason) {
    try {
      const response = await fetch(`http://localhost:3000/api/applications/queue/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      if (response.ok) {
        await loadQueue();
        alert('Application rejected');
      } else {
        alert('Backend endpoint not ready yet');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Backend endpoint not ready yet');
    }
  }

  async function handleBulkApprove() {
    if (selectedItems.size === 0) {
      alert('Please select items to approve');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/applications/queue/bulk-approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queueIds: Array.from(selectedItems)
        })
      });
      
      if (response.ok) {
        setSelectedItems(new Set());
        await loadQueue();
        alert(`✅ ${selectedItems.size} applications approved!`);
      } else {
        alert('Backend endpoint not ready yet');
      }
    } catch (error) {
      console.error('Bulk approve error:', error);
      alert('Backend endpoint not ready yet');
    }
  }

  function toggleSelection(id) {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  }

  function selectAll() {
    if (selectedItems.size === queue.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(queue.map(item => item.id)));
    }
  }

  if (loading) {
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
        <h1 className="text-3xl font-bold text-gray-900">Application Queue</h1>
        <p className="mt-2 text-gray-600">
          Review and approve jobs before they're submitted automatically
        </p>
      </div>

      {/* Backend Not Ready Warning */}
      {backendError && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-amber-600 text-lg">⚠️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">Backend APIs Not Ready</h3>
              <p className="text-sm text-amber-700 mb-2">
                The Application Queue backend endpoints haven't been created yet. This page will work once the following APIs are implemented:
              </p>
              <ul className="text-sm text-amber-700 list-disc list-inside space-y-1">
                <li><code className="bg-amber-100 px-1 rounded">GET /api/applications/queue</code></li>
                <li><code className="bg-amber-100 px-1 rounded">POST /api/applications/queue/add</code></li>
                <li><code className="bg-amber-100 px-1 rounded">PUT /api/applications/queue/:id/approve</code></li>
                <li><code className="bg-amber-100 px-1 rounded">GET /api/applications/queue/:id/versions</code></li>
              </ul>
              <p className="text-sm text-amber-700 mt-2">
                See <strong>IMPLEMENTATION-GUIDE.md</strong> for complete API specifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          label="Pending Review" 
          value={queue.filter(q => !q.user_approved && !q.user_rejected).length}
          color="yellow"
        />
        <StatsCard 
          label="Approved" 
          value={queue.filter(q => q.user_approved).length}
          color="green"
        />
        <StatsCard 
          label="Ready to Submit" 
          value={queue.filter(q => q.status === 'ready').length}
          color="blue"
        />
        <StatsCard 
          label="In Progress" 
          value={queue.filter(q => q.status === 'processing').length}
          color="purple"
        />
      </div>

      {/* Filters and Actions */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <FilterButton 
              active={filter === 'pending'} 
              onClick={() => setFilter('pending')}
            >
              Pending ({queue.filter(q => !q.user_approved && !q.user_rejected).length})
            </FilterButton>
            <FilterButton 
              active={filter === 'approved'} 
              onClick={() => setFilter('approved')}
            >
              Approved ({queue.filter(q => q.user_approved).length})
            </FilterButton>
            <FilterButton 
              active={filter === 'ready'} 
              onClick={() => setFilter('ready')}
            >
              Ready ({queue.filter(q => q.status === 'ready').length})
            </FilterButton>
            <FilterButton 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              All ({queue.length})
            </FilterButton>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="priority">Priority</option>
              <option value="match_score">Match Score</option>
              <option value="created_at">Date Added</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.size > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedItems.size} items selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
              >
                Approve Selected
              </button>
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Queue Items */}
      {queue.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs in queue</h3>
          <p className="text-gray-600 mb-4">
            Start by analyzing jobs and adding them to your queue
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          {filter === 'pending' && queue.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md">
              <input
                type="checkbox"
                checked={selectedItems.size === queue.length}
                onChange={selectAll}
                className="h-4 w-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700 font-medium">Select All</span>
            </div>
          )}

          {/* Queue Cards */}
          {queue.map((item) => (
            <QueueCard
              key={item.id}
              item={item}
              selected={selectedItems.has(item.id)}
              onToggleSelect={() => toggleSelection(item.id)}
              onApprove={() => handleApprove(item.id)}
              onReject={(reason) => handleReject(item.id, reason)}
              onRefresh={loadQueue}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({ label, value, color }) {
  const colors = {
    yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    green: 'bg-green-50 text-green-800 border-green-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200'
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-1">{label}</div>
    </div>
  );
}

// Filter Button Component
function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

// Simplified Queue Card Component (version dropdowns removed until backend ready)
function QueueCard({ item, selected, onToggleSelect, onApprove, onReject }) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  function handleRejectSubmit() {
    onReject(rejectReason);
    setShowRejectDialog(false);
    setRejectReason('');
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    failed: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        {!item.user_approved && !item.user_rejected && (
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="mt-1 h-5 w-5 text-indigo-600 rounded"
          />
        )}

        {/* Job Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{item.job_title}</h3>
              <p className="text-gray-600">{item.company_name}</p>
              {item.job_location && (
                <p className="text-sm text-gray-500 mt-1">📍 {item.job_location}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {item.match_score && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {item.match_score}%
                  </div>
                  <div className="text-xs text-gray-500">Match</div>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
            {item.user_approved && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Approved
              </span>
            )}
            {item.user_rejected && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ✗ Rejected
              </span>
            )}
          </div>

          {/* Documents Status */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className={item.resume_generated ? 'text-green-600' : 'text-gray-400'}>
                {item.resume_generated ? '✓' : '○'}
              </span>
              <span className="text-gray-700">Resume Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={item.cover_letter_generated ? 'text-green-600' : 'text-gray-400'}>
                {item.cover_letter_generated ? '✓' : '○'}
              </span>
              <span className="text-gray-700">Cover Letter Generated</span>
            </div>
          </div>

          {/* Action Buttons */}
          {!item.user_approved && !item.user_rejected && (
            <div className="flex gap-2">
              <button
                onClick={onApprove}
                disabled={!item.resume_generated || !item.cover_letter_generated}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                ✓ Approve & Queue for Submission
              </button>
              <button
                onClick={() => setShowRejectDialog(true)}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 font-medium"
              >
                ✗ Skip
              </button>
            </div>
          )}

          {/* Job Link */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href={item.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View Original Job Posting →
            </a>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <p className="text-sm font-medium text-gray-900 mb-2">Why are you rejecting this application?</p>
          <select
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
          >
            <option value="">Select a reason...</option>
            <option value="not_interested">Not interested in this role</option>
            <option value="salary_too_low">Salary too low</option>
            <option value="location">Location not suitable</option>
            <option value="requirements">Requirements don't match</option>
            <option value="company">Not interested in company</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleRejectSubmit}
              disabled={!rejectReason}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 text-sm font-medium"
            >
              Confirm Rejection
            </button>
            <button
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
