import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react';
import useAxios from '../utils/Axios';

const Contact = () => {
  const axiosInstance = useAxios();
  const [form, setForm] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/account/contact/', form);
      setSubmitted(true);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-gradient-to-b from-white to-emerald-50/30 px-4 py-12 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
          </div>
          <p className="text-sm text-slate-500 ml-12">We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Message Sent!</h2>
              <p className="text-slate-500 text-sm mb-6">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ subject: '', message: '' }); }}
                className="px-6 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold rounded-full transition"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none"
                />
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-xs text-slate-500">You can also reach us directly at <span className="font-semibold text-emerald-700">support@ecoberg.com</span></p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-full text-sm font-semibold bg-emerald-900 hover:bg-emerald-800 text-white shadow transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;