/**
 * Settings - User account and preferences
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield,
  LogOut,
  Trash2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Settings() {
  const { user, logout, refreshUser, isPro } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  const [preferences, setPreferences] = useState({
    targetJobTitles: user?.preferences?.targetJobTitles?.join(', ') || '',
    targetLocations: user?.preferences?.targetLocations?.join(', ') || '',
    remotePreference: user?.preferences?.remotePreference || 'hybrid'
  });

  async function saveProfile() {
    setSaving(true);
    try {
      await api.updatePreferences({
        fullName: profile.fullName
      });
      await refreshUser();
      alert('Profile updated!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  async function savePreferences() {
    setSaving(true);
    try {
      await api.updatePreferences({
        targetJobTitles: preferences.targetJobTitles.split(',').map(t => t.trim()).filter(Boolean),
        targetLocations: preferences.targetLocations.split(',').map(t => t.trim()).filter(Boolean),
        remotePreference: preferences.remotePreference
      });
      await refreshUser();
      alert('Preferences updated!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  }

  async function openBillingPortal() {
    try {
      const result = await api.getPortalUrl();
      window.open(result.data.url, '_blank');
    } catch (error) {
      console.error('Portal error:', error);
      alert('Could not open billing portal');
    }
  }

  function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Job Titles
                </label>
                <input
                  type="text"
                  value={preferences.targetJobTitles}
                  onChange={(e) => setPreferences({ ...preferences, targetJobTitles: e.target.value })}
                  placeholder="Software Engineer, Developer, Programmer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Comma-separated list</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Locations
                </label>
                <input
                  type="text"
                  value={preferences.targetLocations}
                  onChange={(e) => setPreferences({ ...preferences, targetLocations: e.target.value })}
                  placeholder="San Francisco, New York, Remote"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remote Preference
                </label>
                <select
                  value={preferences.remotePreference}
                  onChange={(e) => setPreferences({ ...preferences, remotePreference: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="remote">Remote only</option>
                  <option value="hybrid">Hybrid (remote or on-site)</option>
                  <option value="onsite">On-site only</option>
                </select>
              </div>

              <button
                onClick={savePreferences}
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Current Plan</p>
                    <p className="text-sm text-gray-500">
                      {isPro ? (
                        <>
                          Pro {user?.subscription?.type === 'annual' ? 'Annual' : 
                               user?.subscription?.type === 'lifetime' ? 'Lifetime' : 'Monthly'}
                        </>
                      ) : (
                        'Free'
                      )}
                    </p>
                  </div>
                  {!isPro && (
                    <Link
                      to="/pricing"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                    >
                      Upgrade to Pro
                    </Link>
                  )}
                </div>
              </div>

              {isPro && user?.subscription?.type !== 'lifetime' && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Your subscription renews on {user?.subscription?.endsAt 
                        ? new Date(user.subscription.endsAt).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                    <button
                      onClick={openBillingPortal}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                    >
                      <CreditCard className="w-4 h-4" />
                      Manage Subscription
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Usage This Month</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Analyses today</span>
                    <span className="font-medium">
                      {user?.usage?.today || 0} / {user?.usage?.dailyLimit === 999999 ? '∞' : user?.usage?.dailyLimit || 3}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Total analyses</span>
                    <span className="font-medium">{user?.usage?.total || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Password</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Change your password to keep your account secure
                </p>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Change Password →
                </button>
              </div>

              <hr />

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Sessions</h3>
                <p className="text-sm text-gray-500 mb-3">
                  You're currently logged in
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>

              <hr />

              <div>
                <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Permanently delete your account and all associated data
                </p>
                <button className="flex items-center gap-2 text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
