import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import AuthContext from '../utils/AuthContext';

const ChangePassword = () => {
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password2: '',
  });

  const [show, setShow] = useState({
    current_password: false,
    new_password: false,
    new_password2: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordChecks = [
    { label: 'At least 8 characters', pass: form.new_password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(form.new_password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(form.new_password) },
    { label: 'Passwords match', pass: form.new_password.length > 0 && form.new_password === form.new_password2 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null, non_field: null }));
  };

  const toggleShow = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await axios.post(
        'http://127.0.0.1:8000/account/change-password/',
        form,
        { headers: { Authorization: `Bearer ${authTokens?.access}` } }
      );
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      const data = err.response?.data || {};
      const mapped = {};
      if (data.current_password) mapped.current_password = data.current_password;
      if (data.new_password) mapped.new_password = Array.isArray(data.new_password) ? data.new_password[0] : data.new_password;
      if (data.non_field_errors) mapped.non_field = data.non_field_errors[0];
      if (data.detail) mapped.non_field = data.detail;
      if (!Object.keys(mapped).length) mapped.non_field = 'Something went wrong. Please try again.';
      setErrors(mapped);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gradient-to-b from-white to-emerald-50/30 px-4 py-12 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-emerald-100 shadow-xl">

        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Password Changed!</h2>
            <p className="text-sm text-slate-500 mb-2">Your password has been updated successfully.</p>
            <p className="text-xs text-slate-400">Redirecting to dashboard in 3 seconds...</p>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Change Password</h1>
              <p className="mt-2 text-sm text-slate-500">Update your password to keep your account secure.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {errors.non_field && (
                <p className="text-xs font-medium text-red-600">{errors.non_field}</p>
              )}

              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Current Password</label>
                <div className="relative">
                  <input
                    type={show.current_password ? 'text' : 'password'}
                    name="current_password"
                    placeholder="••••••••"
                    value={form.current_password}
                    onChange={handleChange}
                    required
                    className={`block w-full rounded-xl border px-4 py-3 pr-11 text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.current_password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                  <button type="button" onClick={() => toggleShow('current_password')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show.current_password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.current_password && (
                  <p className="text-xs font-medium text-red-600">{errors.current_password}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">New Password</label>
                <div className="relative">
                  <input
                    type={show.new_password ? 'text' : 'password'}
                    name="new_password"
                    placeholder="••••••••"
                    value={form.new_password}
                    onChange={handleChange}
                    required
                    className={`block w-full rounded-xl border px-4 py-3 pr-11 text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.new_password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                  />
                  <button type="button" onClick={() => toggleShow('new_password')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show.new_password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="text-xs font-medium text-red-600">{errors.new_password}</p>
                )}
              </div>

              {/* Re-enter New Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Re-enter New Password</label>
                <div className="relative">
                  <input
                    type={show.new_password2 ? 'text' : 'password'}
                    name="new_password2"
                    placeholder="••••••••"
                    value={form.new_password2}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm transition-all focus:outline-none focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                  <button type="button" onClick={() => toggleShow('new_password2')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show.new_password2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password checklist */}
              {form.new_password.length > 0 && (
                <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 space-y-1.5">
                  {passwordChecks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${check.pass ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                        {check.pass ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <X className="w-2.5 h-2.5 text-slate-400" />}
                      </div>
                      <span className={`text-xs font-medium ${check.pass ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center rounded-full bg-emerald-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-800 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>

              <p className="text-center text-xs text-slate-400">
                Forgot your current password?{' '}
                <Link to="/forgot-password" className="text-emerald-600 hover:underline font-medium">
                  Reset via email
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;