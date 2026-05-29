import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BarChart2, Building2, Users, ArrowRight, TrendingDown, Globe } from 'lucide-react';

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
  const [heroRef, heroIn] = useInView(0.1);
  const [featRef, featIn] = useInView(0.1);
  const [stepsRef, stepsIn] = useInView(0.1);

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800">
        {/* decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-800/30 rounded-full blur-3xl" />
        </div>

        {/* grid texture */}
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
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80H1440V40C1200 80 960 0 720 40C480 80 240 0 0 40V80Z" fill="white" />
          </svg>
        </div>
      </section>

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
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">From your dinner plate to a factory's smokestack — EcoBerg tracks it all.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
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

      {/* ── HOW IT WORKS ── */}
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

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-emerald-950 to-teal-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to see your footprint?</h2>
          <p className="text-emerald-200/80 text-lg mb-8">Takes less than 2 minutes. No account required to start.</p>
          <Link
            to="/quiz"
            className="group inline-flex items-center gap-2 px-10 py-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-full text-base transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Start the quiz now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  );
}