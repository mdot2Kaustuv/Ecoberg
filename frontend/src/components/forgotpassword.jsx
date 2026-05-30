import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email'); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post('http://127.0.0.1:8000/account/forgot-password/', { email });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gradient-to-b from-white to-emerald-50/30 px-4 py-12 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-emerald-100 shadow-xl">

        {/* Back link */}
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        {submitted ? (
          /* Success state */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Check your email</h2>
            <p className="text-sm text-slate-500 mb-6">
              If an account exists for <span className="font-semibold text-slate-700">{email}</span>, we've sent a password reset link. Check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-2.5 bg-emerald-900 text-white text-sm font-semibold rounded-full hover:bg-emerald-800 transition"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          /* Form state */
          <>
            <div className="mb-7">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Forgot Password?</h1>
              <p className="mt-2 text-sm text-slate-500">Enter your email and we'll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`block w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
                    error
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                />
                {error && <p className="text-xs font-medium text-red-600">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center rounded-full bg-emerald-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-800 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;