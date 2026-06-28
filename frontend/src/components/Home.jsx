import { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BarChart2, Building2, Users, ArrowRight, TrendingDown, Globe, History, Star, HelpCircle, Mail } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import AuthContext from '../utils/AuthContext';

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

const emissionsData = [
  { year: 1900, emissions: 3.0 },
  { year: 1910, emissions: 3.0 },
  { year: 1920, emissions: 3.5 },
  { year: 1930, emissions: 4.0 },
  { year: 1940, emissions: 4.8 },
  { year: 1945, emissions: 4.2 },
  { year: 1950, emissions: 6.0 },
  { year: 1960, emissions: 9.4 },
  { year: 1970, emissions: 14.9 },
  { year: 1980, emissions: 18.1 },
  { year: 1990, emissions: 21.3 },
  { year: 2000, emissions: 23.9 },
  { year: 2010, emissions: 31.5 },
  { year: 2019, emissions: 36.1 },
  { year: 2020, emissions: 34.2 },
  { year: 2023, emissions: 37.4 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-emerald-800/30 bg-[#063725] p-3 shadow-lg backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300/70">
          Year: {payload[0].payload.year}
        </p>
        <p className="mt-1 text-base font-bold text-[#00e699]">
          {payload[0].value} Gt CO₂
        </p>
      </div>
    );
  }
  return null;
};

const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Personal Carbon Quiz',
    desc: 'Answer a few questions about your lifestyle and instantly see your carbon footprint broken down by food, transport, energy and shopping.',
    color: 'emerald',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: 'Company Pollution Data',
    desc: 'Browse verified emissions data from companies. See who pollutes the most, track trends over time, and hold corporations accountable.',
    color: 'teal',
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: 'Compare & Benchmark',
    desc: 'Compare your footprint against city, national, and global averages. Stack companies side by side to see who is leading on sustainability.',
    color: 'green',
  },
  {
    icon: <TrendingDown className="w-6 h-6" />,
    title: 'Actionable Recommendations',
    desc: 'Get personalised tips ranked by impact. Small changes that add up — and a clear path to a greener lifestyle.',
    color: 'emerald',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Live Environment News',
    desc: 'Stay informed with curated news on climate policy, green technology, and corporate sustainability commitments.',
    color: 'green',
  },
];

const steps = [
  { num: '01', title: 'Create your account', desc: 'Sign up in seconds — no credit card needed.' },
  { num: '02', title: 'Take the quiz', desc: 'Answer 14 questions about your daily habits.' },
  { num: '03', title: 'See your footprint', desc: 'Get your score, breakdown and top recommendations instantly.' },
  { num: '04', title: 'Track & improve', desc: 'Retake the quiz over time and watch your score improve.' },
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const [heroRef, heroIn] = useInView(0.1);
  const [featRef, featIn] = useInView(0.1);
  const [stepsRef, stepsIn] = useInView(0.1);

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── HERO — different for logged in vs guest ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-800/30 rounded-full blur-3xl" />
        </div>

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div
          ref={heroRef}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          style={{
            opacity: heroIn ? 1 : 0,
            transform: heroIn ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            <Leaf className="w-3.5 h-3.5" /> Planet-first platform
          </div>

          {user ? (
            // ── LOGGED IN HERO ──
            <>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Welcome back,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                  {user.username || user.email} 🌿
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                Ready to track your progress? Retake the quiz or check your carbon history to see how you've improved.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/quiz"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-full text-base transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  Retake the Quiz
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/carbonhistory"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-full text-base transition-all backdrop-blur-sm"
                >
                  <History className="w-4 h-4" /> View Your History
                </Link>
              </div>
            </>
          ) : (
            // ── GUEST HERO ──
            <>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Know your impact.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                  Change the world.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                EcoBerg helps individuals measure their carbon footprint and empowers companies to reduce emissions, cut costs, and pay less tax — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/quiz"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-full text-base transition-all shadow-lg shadow-emerald-900/40 hover:shadow-emerald-400/30 hover:scale-105 active:scale-95"
                >
                  Calculate my footprint
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-full text-base transition-all backdrop-blur-sm"
                >
                  Create free account
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80H1440V40C1200 80 960 0 720 40C480 80 240 0 0 40V80Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── LOGGED IN QUICK ACTIONS ── */}
      {user && (
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <History className="w-5 h-5" />, label: 'Carbon History', to: '/carbonhistory', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                { icon: <Star className="w-5 h-5" />, label: 'Rate Us', to: '/rate', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support', to: '/help', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { icon: <Mail className="w-5 h-5" />, label: 'Contact Us', to: '/contact', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border border-slate-100 shadow-sm font-semibold text-sm transition-colors ${item.color}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STATS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 14, suffix: '', label: 'Quiz questions' },
            { value: 4, suffix: ' categories', label: 'Tracked per user' },
            { value: 100, suffix: '/100', label: 'Sustainability score' },
            { value: 3, suffix: ' tips', label: 'Top recommendations' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-extrabold text-emerald-700">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-slate-500 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EMISSIONS CHART ── */}
      <div className="w-full rounded-2xl bg-[#032d1e] p-6 shadow-xl border border-emerald-950/40">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Global CO₂ Emissions <span className="text-[#00e699]">Historical Context</span>
          </h2>
          <p className="text-xs text-emerald-100/60 sm:text-sm">
            Understanding macro industrial footprint changes from 1900 to present.
          </p>
        </div>
        <div className="h-[350px] w-full sm:h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={emissionsData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid vertical={false} className="stroke-emerald-900/30" />
              <XAxis
                dataKey="year"
                tickLine={true}
                axisLine={{ stroke: 'currentColor', className: 'text-emerald-900/60' }}
                className="text-xs font-medium fill-emerald-300/50"
                ticks={[1900, 1920, 1940, 1960, 1980, 2000, 2024]}
                dy={10}
              />
              <YAxis
                domain={[0, 40]}
                tickLine={false}
                axisLine={false}
                className="text-xs font-medium fill-emerald-300/50"
                ticks={[0, 10, 20, 30, 40]}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ className: 'stroke-emerald-800/40', strokeWidth: 1.5 }} />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#00e699"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2.5, className: 'stroke-[#032d1e] fill-emerald-300' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-slate-50" ref={featRef}>
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="text-center mb-16"
            style={{
              opacity: featIn ? 1 : 0,
              transform: featIn ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Everything you need</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2">One platform, full picture</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300"
                style={{
                  opacity: featIn ? 1 : 0,
                  transform: featIn ? 'translateY(0)' : 'translateY(32px)',
                  transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`,
                }}
              >
                <div className={`w-11 h-11 rounded-xl bg-${f.color}-100 text-${f.color}-600 flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — only for guests ── */}
      {!user && (
        <section className="py-24 bg-white" ref={stepsRef}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-semibold text-sm uppercase tracking-widest">Simple process</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Get started in 4 steps</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="flex gap-5 items-start"
                  style={{
                    opacity: stepsIn ? 1 : 0,
                    transform: stepsIn ? 'translateX(0)' : 'translateX(-24px)',
                    transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                  }}
                >
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-950 text-emerald-300 flex items-center justify-center font-extrabold text-sm">
                    {s.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{s.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-emerald-950 to-teal-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          {user ? (
            <>
              <h2 className="text-4xl font-extrabold text-white mb-4">Keep improving your score!</h2>
              <p className="text-emerald-200/80 text-lg mb-8">Every small change makes a difference. Retake the quiz and track your progress.</p>
              <Link
                to="/carbonhistory"
                className="group inline-flex items-center gap-2 px-10 py-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-full text-base transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <History className="w-4 h-4" /> View Carbon History
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-extrabold text-white mb-4">Ready to see your footprint?</h2>
              <p className="text-emerald-200/80 text-lg mb-8">Takes less than 2 minutes. No account required to start.</p>
              <Link
                to="/quiz"
                className="group inline-flex items-center gap-2 px-10 py-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-full text-base transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Start the quiz now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </>
          )}
        </div>
      </section>

    </div>
  );
}