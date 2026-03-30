import { Link } from 'react-router-dom';
import { 
  Sparkles, FileText, Target, Bell, ArrowRight, Check, 
  Zap, Shield, Users, Star, ChevronRight, Menu, X 
} from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: Target,
    title: 'AI-Powered Matching',
    description: 'Get instant match scores showing exactly how well your resume fits each job posting.'
  },
  {
    icon: FileText,
    title: 'Guided Resume Builder',
    description: 'Build a professional resume from scratch through a friendly, conversational AI guide.'
  },
  {
    icon: Bell,
    title: 'Smart Job Alerts',
    description: 'Receive personalized job matches directly to your inbox based on your profile.'
  },
  {
    icon: Zap,
    title: 'ATS Optimization',
    description: 'Optimize your resume to pass Applicant Tracking Systems and get seen by recruiters.'
  },
];

const pricing = [
  {
    name: 'Free',
    price: '0',
    features: ['3 analyses per day', '1 resume version', 'Basic matching'],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '9.99',
    features: ['Unlimited analyses', 'Smart job alerts', 'Unlimited resumes', 'LinkedIn import', 'Priority support'],
    cta: 'Start Free Trial',
    popular: true
  },
];

const testimonials = [
  {
    quote: "JobMatch AI helped me land my dream job at Google. The tailored resume feature is a game-changer!",
    author: "Sarah K.",
    role: "Software Engineer",
    rating: 5
  },
  {
    quote: "I was unemployed for 6 months. Within 2 weeks of using JobMatch AI, I had 3 interviews.",
    author: "Michael T.",
    role: "Marketing Manager",
    rating: 5
  },
  {
    quote: "The conversational resume builder made creating my first professional resume so easy.",
    author: "Jessica L.",
    role: "Recent Graduate",
    rating: 5
  },
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">JobMatch AI</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-gray-600">Features</a>
              <a href="#pricing" className="text-gray-600">Pricing</a>
              <Link to="/login" className="text-gray-600">Sign In</Link>
              <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Job Search Made Simple
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Land Your Dream Job<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Without the Struggle
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              From building your first resume to finding the perfect job match, 
              JobMatch AI guides you every step of the way with personalized AI assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                View Pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required · Free plan available
            </p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '10K+', label: 'Users' },
              { value: '50K+', label: 'Jobs Matched' },
              { value: '85%', label: 'Success Rate' },
              { value: '70%', label: 'Cheaper' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Losing Your Job is Hard Enough
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We understand. When you lose your job, you're already going through trauma. 
                The last thing you need is to struggle with building a resume or endlessly 
                searching through job boards.
              </p>
              <p className="text-lg text-gray-600">
                That's why we built JobMatch AI — to make your job search journey as 
                smooth and supportive as possible. Let us handle the hard parts while 
                you focus on what matters: landing your next opportunity.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
              <div className="space-y-4">
                {[
                  'No more blank page paralysis',
                  'No more guessing if your resume fits',
                  'No more endless job board scrolling',
                  'No more wondering what you\'re missing'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Land Your Next Role
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI tools designed to simplify your job search from start to finish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to your next opportunity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Build Your Resume', desc: 'Use our conversational AI to create a professional resume, or upload your existing one.' },
              { step: '2', title: 'Set Up Alerts', desc: 'Tell us what you\'re looking for and we\'ll find matching jobs automatically.' },
              { step: '3', title: 'Apply with Confidence', desc: 'Get tailored resumes and cover letters for each application.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who've landed their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              70% cheaper than competitors like Teal and Jobscan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, i) => (
              <div 
                key={i} 
                className={`rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-200' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={plan.popular ? 'text-indigo-100' : 'text-gray-500'}>/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className={`w-5 h-5 ${plan.popular ? 'text-indigo-200' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-indigo-100' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-colors ${
                    plan.popular 
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of job seekers who've found success with JobMatch AI.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors"
          >
            Get Started for Free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">JobMatch AI</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-sm">© 2025 JobMatch AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
