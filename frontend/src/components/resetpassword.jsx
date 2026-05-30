import  { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordChecks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(password) },
    { label: 'Passwords match', pass: password.length > 0 && password === password2 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    setError('');
    try {
      await axios.post(`http://127.0.0.1:8000/account/reset-password/${uid}/${token}/`, {
        password,
        password2,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gradient-to-b from-white to-emerald-50/30 px-4 py-12 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-emerald-100 shadow-xl">

        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Password Reset!</h2>
            <p className="text-sm text-slate-500 mb-2">Your password has been reset successfully.</p>
            <p className="text-xs text-slate-400">Redirecting to login in 3 seconds...</p>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reset Password</h1>
              <p className="mt-2 text-sm text-slate-500">Enter your new password below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="block w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword2 ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password2}
                    onChange={(e) => { setPassword2(e.target.value); setError(''); }}
                    className="block w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                  <button type="button" onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checklist */}
              {password.length > 0 && (
                <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 space-y-1.5">
                  {passwordChecks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${check.pass ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                        {check.pass ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <X className="w-2.5 h-2.5 text-slate-400" />}
                      </div>
                      <span className={`text-xs font-medium ${check.pass ? 'text-emerald-700' : 'text-slate-400'}`}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {error && <p className="text-xs font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center rounded-full bg-emerald-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-800 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;