/**
 * Pricing Page
 * $24/mo, $79/year, $149 lifetime
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  Star,
  Users,
  Calculator
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '',
    description: 'Perfect for trying out JobMatch AI',
    features: [
      '3 job analyses per day',
      'Basic resume builder',
      '1 resume version',
      'Match score & feedback',
      'Basic ATS tips'
    ],
    limitations: [
      'No job alerts',
      'No tailored resumes',
      'No cover letters'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 24,
    period: '/month',
    description: 'For active job seekers',
    features: [
      'Unlimited job analyses',
      'AI resume builder',
      'Unlimited resume versions',
      'Tailored resume generation',
      'Cover letter generation',
      'Smart job alerts',
      'LinkedIn import',
      'Priority support'
    ],
    cta: 'Start Pro Monthly',
    popular: false
  },
  {
    id: 'annual',
    name: 'Pro Annual',
    price: 79,
    period: '/year',
    monthlyEquivalent: 6.58,
    savings: 209,
    description: 'Best value - save 73%',
    features: [
      'Everything in Pro Monthly',
      '73% savings',
      'Priority email support',
      'Early access to new features'
    ],
    cta: 'Start Pro Annual',
    popular: true
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 149,
    period: 'one-time',
    description: 'Never pay again',
    features: [
      'Everything in Pro',
      'Lifetime access',
      'All future updates',
      'Priority support forever',
      'No recurring charges'
    ],
    cta: 'Get Lifetime Access',
    popular: false,
    badge: 'LIMITED'
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isPro } = useAuth();
  const [loading, setLoading] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [salary, setSalary] = useState(75000);

  async function handleSubscribe(planId) {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (planId === 'free') {
      navigate('/dashboard');
      return;
    }

    setLoading(planId);
    try {
      const result = await api.createCheckout(planId);
      window.location.href = result.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  const weeklyWage = Math.round(salary / 52);
  const roi = Math.round((weeklyWage / 79) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-indigo-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            70% cheaper than competitors
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Land Your Dream Job Faster
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            AI-powered resume optimization and job matching at a fraction of the cost.
            Join thousands of job seekers who've already upgraded their search.
          </p>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <button 
            onClick={() => setShowCalculator(!showCalculator)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Is JobMatch AI worth it?</h3>
                <p className="text-sm text-gray-500">Calculate your potential ROI</p>
              </div>
            </div>
            <ArrowRight className={`w-5 h-5 text-gray-400 transition ${showCalculator ? 'rotate-90' : ''}`} />
          </button>
          
          {showCalculator && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your target salary
                </label>
                <input
                  type="range"
                  min="40000"
                  max="250000"
                  step="5000"
                  value={salary}
                  onChange={(e) => setSalary(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$40k</span>
                  <span className="font-semibold text-gray-900">${(salary / 1000).toFixed(0)}k/year</span>
                  <span>$250k</span>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  If you land a job just <strong>1 week faster</strong>:
                </p>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  +${weeklyWage.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  extra income earned
                </p>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-gray-600">
                    JobMatch AI Pro costs <strong>$79/year</strong>
                  </p>
                  <p className="text-lg font-semibold text-green-700">
                    Your ROI: {roi.toLocaleString()}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 ${
                plan.popular 
                  ? 'border-indigo-500 shadow-xl' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-full">
                    <Star className="w-3 h-3" /> BEST VALUE
                  </span>
                </div>
              )}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                
                <div className="flex items-baseline justify-center gap-1">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold text-gray-900">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500">{plan.period}</span>
                    </>
                  )}
                </div>
                
                {plan.monthlyEquivalent && (
                  <p className="text-sm text-green-600 mt-1">
                    Just ${plan.monthlyEquivalent}/month
                  </p>
                )}
                {plan.savings && (
                  <p className="text-xs text-gray-500 mt-1">
                    Save ${plan.savings} vs monthly
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-2 opacity-50">
                    <span className="w-5 h-5 flex items-center justify-center text-gray-400">✕</span>
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id || (isPro && plan.id !== 'lifetime')}
                className={`w-full py-3 px-4 rounded-xl font-medium transition ${
                  plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : plan.id === 'free'
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  'Processing...'
                ) : isPro && plan.id !== 'lifetime' ? (
                  'Current Plan'
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5 text-green-600" />
              <span>Secure payments via Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-green-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5 text-green-600" />
              <span>10,000+ job seekers</span>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Compare with competitors
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-900">Feature</th>
                  <th className="p-4 font-medium text-indigo-600">JobMatch AI</th>
                  <th className="p-4 font-medium text-gray-500">Teal ($29/mo)</th>
                  <th className="p-4 font-medium text-gray-500">Jobscan ($50/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  ['Price', '$24/mo or $79/yr', '$29/mo', '$49.95/mo'],
                  ['Job Detection', '✅', '✅', '❌'],
                  ['Resume Analysis', '✅', '✅', '✅'],
                  ['Tailored Resumes', '✅', '✅', '❌'],
                  ['Score Improvement Tracking', '✅ Unique!', '❌', '❌'],
                  ['Conversational Resume Builder', '✅ Unique!', '❌', '❌'],
                  ['Smart Job Alerts', '✅ Unique!', '❌', '❌'],
                  ['Cover Letters', '✅', '❌', '❌'],
                ].map(([feature, ...values], index) => (
                  <tr key={index}>
                    <td className="p-4 text-gray-900">{feature}</td>
                    {values.map((value, i) => (
                      <td key={i} className={`p-4 text-center ${i === 0 ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! You can cancel your subscription at any time. Your access continues until the end of your billing period.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, Amex) through our secure payment processor, Stripe.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Our free plan lets you try JobMatch AI with 3 analyses per day. No credit card required.'
              },
              {
                q: 'What happens to my data if I cancel?',
                a: 'Your resumes and analysis history are saved for 30 days after cancellation. You can export them anytime.'
              }
            ].map((faq, index) => (
              <details key={index} className="bg-white rounded-xl border border-gray-200 p-4 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition" />
                </summary>
                <p className="mt-3 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
