import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
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
    } else if (!/^[a-zA-Z0-9_-]*$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, _ and -'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
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
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Join <span className="text-emerald-600 font-semibold">EcoBerg</span> today
          </p>
        </div>

        {/* Registration */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          
          {/* Email  */}
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
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="text-xs font-medium text-red-500 mt-0.5">{errors.email}</span>}
          </div>

          {/* Username  */}
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
              placeholder="Choose your username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <span className="text-xs font-medium text-red-500 mt-0.5">{errors.username}</span>}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.password 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
              }`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="text-xs font-medium text-red-500 mt-0.5">{errors.password}</span>}
          </div>

         
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password2" className="text-sm font-semibold text-slate-700">Confirm Password</label>
            <input
              id="password2"
              type="password"
              name="password2"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.password2 
                  ? 'border-red-400 focus:ring-red-200' 
                  : 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-100'
              }`}
              placeholder="••••••••"
              value={formData.password2}
              onChange={handleChange}
            />
            {errors.password2 && <span className="text-xs font-medium text-red-500 mt-0.5">{errors.password2}</span>}
          </div>

          { /* Submit  */ }
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-6 px-5 py-3 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-md transition-all duration-150 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-4 border-t border-slate-100 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-all">
            Sign in
          </Link>
        </div>

        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600"></div>
      </div>
    </div>
  )
}

export default Register