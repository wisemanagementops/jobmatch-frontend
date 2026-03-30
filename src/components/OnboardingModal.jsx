/**
 * OnboardingModal.jsx
 * Multi-step onboarding flow for new users
 * 
 * ADD THIS FILE TO: webapp/src/components/OnboardingModal.jsx
 */

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import { 
  Sparkles, Upload, Wand2, Chrome, ArrowRight, 
  Check, X, FileText, Loader2, ExternalLink
} from 'lucide-react';

// ⚠️ IMPORTANT: Update this URL when you publish your extension to Chrome Web Store
// Format: https://chrome.google.com/webstore/detail/jobmatch-ai/YOUR_EXTENSION_ID
// For now, this will open a placeholder. Users can install manually from your extension folder.
const CHROME_EXTENSION_URL = 'https://chrome.google.com/webstore/category/extensions';

export default function OnboardingModal({ isOpen, onClose, onComplete, userName }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: welcome, 2: resume choice, 3: extension
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('name', file.name.replace(/\.[^/.]+$/, ''));
      await api.uploadResume(formData);
      toast.success('Resume uploaded successfully!');
      setStep(3); // Move to extension step
    } catch (error) {
      toast.error(error.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const goToResumeBuilder = () => {
    // Mark onboarding as seen but not complete
    api.updateOnboarding({ step: 'resume_builder' }).catch(() => {});
    onClose();
    navigate('/resume-builder');
  };

  const skipResume = () => {
    setStep(3);
  };

  const openExtensionStore = () => {
    window.open(CHROME_EXTENSION_URL, '_blank');
  };

  const completeOnboarding = async () => {
    try {
      await api.updateOnboarding({ completed: true, step: 'complete' });
    } catch (error) {
      console.error('Failed to update onboarding status:', error);
    }
    onComplete?.();
    onClose();
  };

  const skipExtension = () => {
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Progress indicator */}
        <div className="flex gap-1 p-4 bg-gray-50">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome{userName ? `, ${userName.split(' ')[0]}` : ''}! 🎉
            </h2>
            
            <p className="text-gray-600 mb-8">
              Let's get you job-ready in just 2 minutes.
            </p>

            <div className="space-y-4 text-left mb-8">
              {[
                { num: '1', text: 'Upload or build your resume', done: false },
                { num: '2', text: 'Install Chrome extension', done: false },
                { num: '3', text: 'Analyze your first job posting', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-sm">
                    {item.num}
                  </div>
                  <span className="text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Resume Choice */}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
              How would you like to create your resume?
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Choose the option that works best for you
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Upload Option */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50/50 ${
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                />
                
                {uploading ? (
                  <Loader2 className="w-10 h-10 text-indigo-600 mx-auto mb-3 animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
                )}
                
                <p className="font-semibold text-gray-900 mb-1">Upload Existing</p>
                <p className="text-xs text-gray-500">PDF, DOCX, TXT</p>
              </div>

              {/* Build with AI Option */}
              <div
                className="border-2 border-gray-300 rounded-xl p-6 text-center cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50/50"
                onClick={goToResumeBuilder}
              >
                <Wand2 className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 mb-1">Build with AI</p>
                <p className="text-xs text-gray-500">Guided, ~5 min</p>
              </div>
            </div>

            <button
              onClick={skipResume}
              className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip for now — I'll do this later
            </button>
          </div>
        )}

        {/* Step 3: Extension Install */}
        {step === 3 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Chrome className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Install the Chrome Extension
            </h2>
            
            <p className="text-gray-600 mb-6">
              Analyze jobs while you browse LinkedIn, Indeed, Glassdoor, and more.
            </p>

            {/* Visual demo */}
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-700 font-bold text-sm">85%</span>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">Senior Software Engineer</p>
                  <p className="text-xs text-gray-500">Google • Mountain View, CA</p>
                </div>
                <Check className="w-5 h-5 text-green-600 ml-auto" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ↑ See match scores instantly on job pages
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['LinkedIn', 'Indeed', 'Glassdoor', 'Greenhouse', 'Lever'].map((site) => (
                <span key={site} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {site}
                </span>
              ))}
            </div>

            <button
              onClick={openExtensionStore}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mb-3"
            >
              <Chrome className="w-5 h-5" />
              Add to Chrome — It's Free
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={skipExtension}
              className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
