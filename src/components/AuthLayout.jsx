import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </Link>
        <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">
          JobMatch AI
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Your AI-powered career companion
        </p>
      </div>

      {/* Form container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-indigo-100/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500">
        By continuing, you agree to our{' '}
        <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
      </p>
    </div>
  );
}
