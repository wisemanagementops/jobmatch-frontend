import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Bell, Plus, Edit, Trash2, Loader2, X, Check, 
  MapPin, Briefcase, Zap
} from 'lucide-react';

export default function JobAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    alertName: 'My Job Alert',
    jobTitles: '',
    locations: '',
    includeRemote: true,
    minSalary: '',
    minMatchScore: 60,
    frequency: 'daily',
  });

  const isPro = user?.subscription_status === 'pro' || user?.subscription_status === 'lifetime';

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await api.getJobAlerts();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPro) {
      toast.error('Upgrade to Pro to create job alerts');
      return;
    }

    const alertData = {
      alertName: formData.alertName,
      jobTitles: formData.jobTitles.split(',').map(t => t.trim()).filter(t => t),
      locations: formData.locations.split(',').map(l => l.trim()).filter(l => l),
      includeRemote: formData.includeRemote,
      minSalary: formData.minSalary ? parseInt(formData.minSalary) : null,
      minMatchScore: formData.minMatchScore,
      frequency: formData.frequency,
    };

    try {
      if (editingAlert) {
        await api.updateJobAlert(editingAlert.id, alertData);
        toast.success('Alert updated');
      } else {
        await api.createJobAlert(alertData);
        toast.success('Alert created');
      }
      setShowModal(false);
      setEditingAlert(null);
      resetForm();
      loadAlerts();
    } catch (error) {
      toast.error('Failed to save alert');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job alert?')) return;
    
    try {
      await api.deleteJobAlert(id);
      toast.success('Alert deleted');
      loadAlerts();
    } catch (error) {
      toast.error('Failed to delete alert');
    }
  };

  const openEditModal = (alert) => {
    setEditingAlert(alert);
    setFormData({
      alertName: alert.alert_name,
      jobTitles: (alert.job_titles || []).join(', '),
      locations: (alert.locations || []).join(', '),
      includeRemote: alert.include_remote,
      minSalary: alert.min_salary || '',
      minMatchScore: alert.min_match_score || 60,
      frequency: alert.frequency || 'daily',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      alertName: 'My Job Alert',
      jobTitles: '',
      locations: '',
      includeRemote: true,
      minSalary: '',
      minMatchScore: 60,
      frequency: 'daily',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Alerts</h1>
          <p className="text-gray-600">Get notified when new jobs match your criteria</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingAlert(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Alert
        </button>
      </div>

      {!isPro && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Upgrade to Pro for Job Alerts</h3>
              <p className="text-indigo-100">
                Create unlimited job alerts and get notified instantly when jobs match your profile.
              </p>
            </div>
            <Link
              to="/pricing"
              className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No job alerts yet</h2>
          <p className="text-gray-600 mb-6">
            Create alerts to get notified when jobs matching your criteria are posted
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" />
            Create Your First Alert
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    alert.is_active ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Bell className={`w-5 h-5 ${alert.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{alert.alert_name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{alert.frequency} alerts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(alert)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(alert.job_titles || []).map((title, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                    <Briefcase className="w-3 h-3" />
                    {title}
                  </span>
                ))}
                {(alert.locations || []).map((loc, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    <MapPin className="w-3 h-3" />
                    {loc}
                  </span>
                ))}
                {alert.include_remote && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Remote OK
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingAlert ? 'Edit Alert' : 'Create Job Alert'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAlert(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Name
                </label>
                <input
                  type="text"
                  value={formData.alertName}
                  onChange={(e) => setFormData({ ...formData, alertName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Titles (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.jobTitles}
                  onChange={(e) => setFormData({ ...formData, jobTitles: e.target.value })}
                  placeholder="Software Engineer, Data Scientist, Product Manager"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Locations (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.locations}
                  onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                  placeholder="San Francisco, New York, Remote"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeRemote"
                  checked={formData.includeRemote}
                  onChange={(e) => setFormData({ ...formData, includeRemote: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="includeRemote" className="text-sm text-gray-700">
                  Include remote jobs
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Match Score: {formData.minMatchScore}%
                </label>
                <input
                  type="range"
                  min="40"
                  max="90"
                  step="10"
                  value={formData.minMatchScore}
                  onChange={(e) => setFormData({ ...formData, minMatchScore: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Digest</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAlert(null);
                  }}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isPro}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {editingAlert ? 'Save Changes' : 'Create Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
