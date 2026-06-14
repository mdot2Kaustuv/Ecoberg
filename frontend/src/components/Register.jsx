import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import AuthContext from '../utils/AuthContext.jsx'

const Register = () => {
  const { registerUser, loading } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)

  
  const passwordChecks = [
    { label: 'At least 8 characters', pass: formData.password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(formData.password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(formData.password) },
    { label: 'Passwords match', pass: formData.password.length > 0 && formData.password === formData.password2 },
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      try {
        await registerUser(
          formData.email,
          formData.username,
          formData.password,
          formData.password2
        )
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setErrors(newErrors)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-emerald-800 font-medium">Loading...</span>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Join <span className="text-emerald-600 font-semibold">EcoBerg</span> today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
              }`}
              placeholder="you@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="text-xs font-medium text-red-500">{errors.email}</span>}
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-sm font-semibold text-slate-700">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.username
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
              }`}
              placeholder="e.g. Jhon Doe"
              value={formData.username}
              onChange={handleChange}
            />
            <span className="text-xs text-slate-400">Your full name or any display name is fine</span>
            {errors.username && <span className="text-xs font-medium text-red-500">{errors.username}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
                }`}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <span className="text-xs font-medium text-red-500">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password2" className="text-sm font-semibold text-slate-700">Confirm Password</label>
            <div className="relative">
              <input
                id="password2"
                type={showPassword2 ? 'text' : 'password'}
                name="password2"
                className={`w-full px-4 py-2.5 pr-11 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.password2
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
                }`}
                placeholder="••••••••"
                value={formData.password2}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password2 && <span className="text-xs font-medium text-red-500">{errors.password2}</span>}
          </div>

          {/* Password Checklist */}
          {formData.password.length > 0 && (
            <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 space-y-1.5">
              {passwordChecks.map((check, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    check.pass ? 'bg-emerald-100' : 'bg-slate-200'
                  }`}>
                    {check.pass
                      ? <Check className="w-2.5 h-2.5 text-emerald-600" />
                      : <X className="w-2.5 h-2.5 text-slate-400" />
                    }
                  </div>
                  <span className={`text-xs font-medium ${check.pass ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 px-5 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-md transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-5 mt-5 border-t border-slate-100 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-all">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register