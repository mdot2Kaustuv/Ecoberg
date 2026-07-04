import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'How is my carbon footprint calculated?',
    a: 'We use your answers about diet, transport, energy usage, and shopping habits to estimate your annual CO₂ emissions in tonnes. Each category has emission factors based on real-world data.',
  },
  {
    q: 'Do I need an account to take the quiz?',
    a: 'No — anyone can take the quiz. However, you need to be logged in for your results to be saved and visible in your Carbon History.',
  },
  {
    q: 'How do I improve my sustainability score?',
    a: 'Follow the Action Plan recommendations shown after your quiz. Small changes like reducing meat consumption, using public transport, and setting your AC to 24°C can significantly lower your footprint.',
  },
  {
    q: 'How often should I retake the quiz?',
    a: 'We recommend retaking it every 3-6 months, or whenever your lifestyle changes significantly — like moving house, changing jobs, or switching your diet.',
  },
  {
    q: 'How do I change my password?',
    a: 'Go to Settings (the gear icon in the header) and click "Change Password". You\'ll need to enter your current password and then your new one.',
  },
  {
    q: 'What does the sustainability score mean?',
    a: 'The score ranges from 5 to 100. Higher is better — it reflects how low your carbon footprint is relative to a global average of 6 tonnes CO₂/year. A score above 75 is excellent.',
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-emerald-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-emerald-50/50 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-slate-500 leading-relaxed border-t border-emerald-50">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
};

const Help = () => {
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
              <HelpCircle className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Help & Support</h1>
          </div>
          <p className="text-sm text-slate-500 ml-12">Frequently asked questions and documentation.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 text-center">
          <p className="text-sm text-slate-500 mb-3">Still need help? Reach out to us directly.</p>
          <Link
            to="/contact"
            className="inline-block px-6 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold rounded-full transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;