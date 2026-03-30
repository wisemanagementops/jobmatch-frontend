import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Chrome, Download, CheckCircle2, Zap, Shield,
  Briefcase, Target, FileText, ChevronRight, Play,
  ArrowRight, Star, Check, AlertCircle
} from 'lucide-react';

export default function JobDiscovery() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const supportedSites = [
    { name: 'LinkedIn', color: 'bg-blue-600', jobs: '10M+ jobs' },
    { name: 'Indeed', color: 'bg-purple-600', jobs: '15M+ jobs' },
    { name: 'Glassdoor', color: 'bg-green-600', jobs: '2M+ jobs' },
    { name: 'Greenhouse', color: 'bg-teal-600', jobs: 'Tech startups' },
    { name: 'Lever', color: 'bg-orange-600', jobs: 'Tech companies' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'One-Click Analysis',
      description: 'Analyze any job posting while browsing. No copy-paste needed.'
    },
    {
      icon: Target,
      title: 'Smart Match Scores',
      description: 'AI compares your resume to job requirements instantly.'
    },
    {
      icon: FileText,
      title: 'Uses Your Resume',
      description: 'Automatically uses the resume from your account. No re-uploading.'
    },
    {
      icon: Shield,
      title: 'No API Keys Needed',
      description: 'Everything works through your account. Just sign in and go.'
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Download Extension',
      description: 'Click the download button to get the Chrome extension zip file.'
    },
    {
      number: 2,
      title: 'Unzip the File',
      description: 'Extract the downloaded zip to a folder (e.g., Desktop).'
    },
    {
      number: 3,
      title: 'Open Chrome Extensions',
      description: 'Go to chrome://extensions and turn ON "Developer mode" (top right).'
    },
    {
      number: 4,
      title: 'Load & Sign In',
      description: 'Click "Load unpacked", select the folder, then sign in with your account.'
    },
  ];

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/extension/download`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jobmatch-ai-extension.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      setActiveStep(2);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadError('Could not download. Make sure the server is running.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 mb-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Chrome className="w-4 h-4" />
              Chrome Extension
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Jobs Smarter,<br />Not Harder
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-lg">
              Install our Chrome extension to analyze jobs on LinkedIn, Indeed, and more. 
              Uses your saved resume automatically - no setup needed!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {downloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Extension
                  </>
                )}
              </button>
              <a
                href="#how-to-install"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
              >
                <Play className="w-5 h-5" />
                How to Install
              </a>
            </div>
            
            {downloadError && (
              <div className="mt-4 flex items-center gap-2 text-red-200 bg-red-500/20 px-4 py-2 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                {downloadError}
              </div>
            )}
          </div>
          
          {/* Extension Preview */}
          <div className="flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-2xl p-4 w-72 transform rotate-2 hover:rotate-0 transition-transform">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎯</span>
                  <span className="font-bold">JobMatch AI</span>
                </div>
                <p className="text-sm text-white/80">Signed in as {user?.email?.split('@')[0] || 'you'}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Resume Synced</p>
                    <p className="text-xs text-gray-500">From your account</p>
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600 mb-1 font-medium">Job Detected!</p>
                  <p className="font-medium text-gray-900 text-sm">Senior Software Engineer</p>
                  <p className="text-xs text-gray-500">Google • Mountain View</p>
                </div>
                <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm">
                  ✨ Analyze Job Match
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefit Banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Your Account is Already Set Up!</h3>
            <p className="text-green-700">
              The extension uses your existing JobMatch AI account. Just download, install, and sign in with 
              the same email ({user?.email || 'your email'}). Your resume and everything will be ready to use!
            </p>
          </div>
        </div>
      </div>

      {/* Supported Sites */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Works on All Major Job Sites</h2>
          <p className="text-gray-600">One extension, millions of job opportunities</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {supportedSites.map((site) => (
            <div key={site.name} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`w-12 h-12 ${site.color} rounded-xl flex items-center justify-center mb-3`}>
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">{site.name}</p>
              <p className="text-xs text-gray-500">{site.jobs}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* How to Install */}
      <div id="how-to-install" className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How to Install</h2>
          <p className="text-gray-600">Ready in under 2 minutes</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative p-6 rounded-xl transition-all cursor-pointer ${
                activeStep === step.number
                  ? 'bg-white shadow-lg border-2 border-indigo-500'
                  : activeStep > step.number
                    ? 'bg-white shadow border border-green-300'
                    : 'bg-white/50 hover:bg-white hover:shadow'
              }`}
              onClick={() => setActiveStep(step.number)}
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-6 h-6 text-gray-300" />
                </div>
              )}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
                activeStep === step.number
                  ? 'bg-indigo-600 text-white'
                  : activeStep > step.number
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {activeStep > step.number ? <Check className="w-5 h-5" /> : step.number}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70"
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Downloading...' : 'Download Extension Now'}
          </button>
        </div>
      </div>

      {/* How It Works Together */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It All Works Together</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">1️⃣</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Create Resume Here</h3>
            <p className="text-gray-600 text-sm">Use our AI Resume Builder to create your resume. It's saved to your account.</p>
            <Link to="/resumes" className="inline-flex items-center gap-1 text-indigo-600 text-sm mt-2 hover:underline">
              Go to Resumes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">2️⃣</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Install Extension</h3>
            <p className="text-gray-600 text-sm">Download and install the Chrome extension. Sign in with your same account.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">3️⃣</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Browse & Analyze</h3>
            <p className="text-gray-600 text-sm">Visit any job on LinkedIn, Indeed, etc. Click the extension to analyze!</p>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-xl italic mb-4">
              "Finally, an extension that just works! No API keys, no re-uploading my resume. 
              I analyzed 30 jobs in one afternoon and found 5 that were great matches."
            </p>
            <p className="font-semibold">— Product Manager, Seattle</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold">500+</p>
              <p className="text-white/80 text-sm">Users</p>
            </div>
            <div className="w-px h-16 bg-white/30"></div>
            <div className="text-center">
              <p className="text-4xl font-bold">10K+</p>
              <p className="text-white/80 text-sm">Jobs Analyzed</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Find Your Perfect Match?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop applying blindly. Use AI to find jobs where you're actually a great fit.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors"
          >
            <Chrome className="w-5 h-5" />
            Download Chrome Extension
          </button>
          <Link
            to="/resumes"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Create Your Resume First
          </Link>
        </div>
      </div>
    </div>
  );
}
