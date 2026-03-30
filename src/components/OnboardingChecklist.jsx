/**
 * OnboardingChecklist.jsx
 * Progress checklist widget for Dashboard
 * 
 * ADD THIS FILE TO: webapp/src/components/OnboardingChecklist.jsx
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, Circle, ChevronRight, X, Sparkles,
  FileText, Chrome, Target, ExternalLink
} from 'lucide-react';

// ⚠️ IMPORTANT: Update this URL when you publish your extension to Chrome Web Store
// Format: https://chrome.google.com/webstore/detail/jobmatch-ai/YOUR_EXTENSION_ID
// For now, this will open a placeholder. Users can install manually from your extension folder.
const CHROME_EXTENSION_URL = 'https://chrome.google.com/webstore/category/extensions';

export default function OnboardingChecklist({ 
  hasResume = false, 
  extensionInstalled = false, 
  hasAnalysis = false,
  onDismiss 
}) {
  const [dismissed, setDismissed] = useState(false);

  // Check localStorage for dismissed state
  useEffect(() => {
    const isDismissed = localStorage.getItem('onboarding_checklist_dismissed');
    if (isDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('onboarding_checklist_dismissed', 'true');
    setDismissed(true);
    onDismiss?.();
  };

  // Calculate progress
  const items = [
    { id: 'account', label: 'Create account', completed: true, icon: Check },
    { 
      id: 'resume', 
      label: 'Upload or build resume', 
      completed: hasResume, 
      icon: FileText,
      action: '/resumes',
      actionLabel: 'Add Resume'
    },
    { 
      id: 'extension', 
      label: 'Install Chrome extension', 
      completed: extensionInstalled, 
      icon: Chrome,
      action: CHROME_EXTENSION_URL,
      actionLabel: 'Install',
      external: true
    },
    { 
      id: 'analysis', 
      label: 'Analyze your first job', 
      completed: hasAnalysis, 
      icon: Target,
      action: 'https://linkedin.com/jobs',
      actionLabel: 'Find Jobs',
      external: true,
      hint: 'Use the extension on any job posting'
    },
  ];

  const completedCount = items.filter(i => i.completed).length;
  const progress = (completedCount / items.length) * 100;
  const allComplete = completedCount === items.length;

  // Don't show if dismissed or all complete
  if (dismissed || allComplete) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Getting Started</h3>
            <p className="text-xs text-gray-500">{completedCount} of {items.length} complete</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Dismiss button */}
          <button 
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Checklist items */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div 
            key={item.id}
            className={`flex items-center gap-4 px-5 py-3 ${
              item.completed ? 'bg-gray-50' : 'hover:bg-gray-50'
            }`}
          >
            {/* Status icon */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              item.completed 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {item.completed ? (
                <Check className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>

            {/* Label */}
            <div className="flex-1">
              <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                {item.label}
              </span>
              {item.hint && !item.completed && (
                <p className="text-xs text-gray-400 mt-0.5">{item.hint}</p>
              )}
            </div>

            {/* Action button */}
            {!item.completed && item.action && (
              item.external ? (
                <a
                  href={item.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  {item.actionLabel}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <Link
                  to={item.action}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  {item.actionLabel}
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )
            )}

            {/* Completed check */}
            {item.completed && (
              <span className="text-xs text-green-600 font-medium">Done!</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
