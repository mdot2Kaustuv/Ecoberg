import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle } from 'lucide-react';
import useAxios from '../utils/Axios';

const Rate = () => {
  const axiosInstance = useAxios();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/account/rate/', { rating, feedback });
      setSubmitted(true);
    } catch {
      setError('Failed to submit rating. Please try again.');
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
              <Star className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rate Us</h1>
          </div>
          <p className="text-sm text-slate-500 ml-12">Your feedback helps us improve EcoBerg.</p>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl p-8">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
              <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Thank You!</h2>
              <p className="text-slate-500 text-sm mb-2">You rated us <span className="font-bold text-emerald-600">{labels[rating]}</span> ({rating}/5 stars).</p>
              <p className="text-slate-400 text-sm">Your feedback means a lot to us.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="text-center">
                <p className="text-base font-semibold text-slate-700 mb-6">How would you rate your experience?</p>
                <div className="flex justify-center gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hover || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 fill-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {(hover || rating) > 0 && (
                  <p className="text-sm font-semibold text-emerald-600">{labels[hover || rating]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Additional feedback <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you liked or what we can improve..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0 || loading}
                className="w-full py-3 px-6 rounded-full text-sm font-semibold bg-emerald-900 hover:bg-emerald-800 text-white shadow transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" />
                {loading ? 'Submitting...' : 'Submit Rating'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rate;