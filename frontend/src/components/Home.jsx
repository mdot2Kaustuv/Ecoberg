import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, BarChart2, Building2, Users, ArrowRight, TrendingDown, Globe,
  Car, Flame, Apple, ShoppingBag, ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

/* ── hooks ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

/* ── chart data ── */
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

/* ── animated counter ── */
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

/* ── data ── */
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
    desc: 'Compare your footprint against city, national, and global averages. Stack companies side by side to see who leads on sustainability.',
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

const categories = [
  {
    title: 'Transport Impact',
    desc: 'Air mileage index, daily gasoline/hybrid commuting cycles, and public high-speed transit factors.',
    icon: <Car className="h-5 w-5 text-emerald-600" />,
    border: 'hover:border-emerald-200',
    bg: 'bg-emerald-50/50',
  },
  {
    title: 'Home Energy',
    desc: 'Dwelling footprints scaled against square metrics, electric grids, and thermal gas insulations.',
    icon: <Flame className="h-5 w-5 text-amber-600" />,
    border: 'hover:border-amber-200',
    bg: 'bg-amber-50/40',
  },
  {
    title: 'Food Habits',
    desc: 'Meat-heavy vs vegan diet offsets, local organic cropping, and weekly organic waste variables.',
    icon: <Apple className="h-5 w-5 text-sky-600" />,
    border: 'hover:border-sky-200',
    bg: 'bg-sky-50/40',
  },
  {
    title: 'Shopping',
    desc: 'Fast-fashion material purchases, active electronic upgrade loops, and recycle-bin sorting.',
    icon: <ShoppingBag className="h-5 w-5 text-purple-600" />,
    border: 'hover:border-purple-200',
    bg: 'bg-purple-50/40',
  },
];

const methodologySteps = [
  {
    num: '1',
    title: 'Baseline Aggregation',
    desc: 'Inputs from your diet structures and dwelling sizes define core sector emission benchmarks annualised using EPA coefficient metrics.',
  },
  {
    num: '2',
    title: 'Variables Scaling & Multipliers',
    desc: 'Answers like EV fuel types, flight counts, organic sorting, and solar offsets scale and multiply the initial sector indexes.',
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
  const [catRef, catIn] = useInView(0.1);
  const [methodRef, methodIn] = useInView(0.1);

  return (
    <div className="bg-white overflow-x-hidden">

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800">

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

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            <div
              ref={heroRef}
              className="lg:col-span-7 space-y-7 text-left"
              style={{
                opacity: heroIn ? 1 : 0,
                transform: heroIn ? 'translateY(0)' : 'translateY(32px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Updated for 2024 Emissions Data
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
                Know your impact.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                  Change the world.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-emerald-100/80 max-w-xl leading-relaxed">
                EcoBerg helps individuals measure their carbon footprint and empowers companies to reduce emissions, cut costs, and pay less tax — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
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

            {/* Right: live assessment preview card (from TSX) */}
            <div
              className="lg:col-span-5 flex justify-center lg:justify-end"
              style={{
                opacity: heroIn ? 1 : 0,
                transform: heroIn ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s',
              }}
            >
              <div className="w-full max-w-[400px] bg-white/5 backdrop-blur-md rounded-[32px] shadow-2xl shadow-emerald-950/40 p-8 border border-white/10 relative">
                {/* floating score badge */}
                <div className="absolute -top-5 -right-5 w-20 h-20 bg-emerald-400 rounded-full flex items-center justify-center border-4 border-emerald-950 shadow-lg">
                  <div className="text-center">
                    <span className="block text-[9px] font-bold text-emerald-900 uppercase tracking-widest leading-none">Score</span>
                    <span className="text-2xl font-black text-emerald-950 mt-0.5 block">82</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-emerald-100 tracking-tight mb-6">Live Assessment Preview</h3>

                {/* doughnut */}
                <div className="flex items-center justify-center py-4 relative">
                  <svg viewBox="0 0 100 100" className="w-36 h-36 transform -rotate-90">
                    <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="transparent" />
                    <circle cx="50" cy="50" r="40" stroke="#00e699" strokeWidth="12" fill="transparent"
                      strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" stroke="#065f46" strokeWidth="12" fill="transparent"
                      strokeDasharray="251.2" strokeDashoffset="188.4" strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">4.2</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-300/60 tracking-wider">Tons CO₂/yr</span>
                  </div>
                </div>

                {/* breakdown bars */}
                <div className="space-y-4 pt-3">
                  {[
                    { label: 'Transportation', amount: '1.8t / yr', pct: '45%', color: 'bg-[#00e699]' },
                    { label: 'Food & Diet', amount: '1.2t / yr', pct: '30%', color: 'bg-emerald-700' },
                    { label: 'Home Energy', amount: '0.8t / yr', pct: '20%', color: 'bg-teal-500' },
                  ].map((row) => (
                    <div key={row.label} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-emerald-200/70">
                          <span className={`w-2 h-2 rounded-full ${row.color}`} />
                          {row.label}
                        </span>
                        <span className="text-white font-bold">{row.amount}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${row.color} rounded-full`} style={{ width: row.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80H1440V40C1200 80 960 0 720 40C480 80 240 0 0 40V80Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══ 2. STATS COUNTERS ══ */}
      <section className="py-16 bg-white border-b border-slate-100">
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

      {/* ══ 3. EMISSIONS CHART ══ */}
      <section className="py-20 bg-[#F8FAF9]">
        <div className="max-w-5xl mx-auto px-6">
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
                  <CartesianGrid vertical={false} stroke="rgba(6,55,37,0.3)" />
                  <XAxis
                    dataKey="year"
                    tickLine={true}
                    axisLine={{ stroke: 'rgba(52,211,153,0.2)' }}
                    tick={{ fill: 'rgba(110,231,183,0.5)', fontSize: 11 }}
                    ticks={[1900, 1920, 1940, 1960, 1980, 2000, 2024]}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 40]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'rgba(110,231,183,0.5)', fontSize: 11 }}
                    ticks={[0, 10, 20, 30, 40]}
                    dx={-5}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(6,55,37,0.4)', strokeWidth: 1.5 }} />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="#00e699"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 2.5, stroke: '#032d1e', fill: '#6ee7b7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. SCIENCE / METHODOLOGY ══ (from TSX) */}
      <section className="py-20 bg-white border-t border-b border-slate-100" ref={methodRef}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: copy */}
            <div
              className="space-y-6"
              style={{
                opacity: methodIn ? 1 : 0,
                transform: methodIn ? 'translateX(0)' : 'translateX(-24px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-md text-[10px] uppercase font-extrabold tracking-widest">
                Scientific framework
              </div>
              <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight leading-tight">
                Empowering daily choices for real environmental impact
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                A <strong>carbon footprint</strong> represents the gross volume of greenhouse gases discharged by human industries and household lifestyles. Measured in metric tons of CO₂e, it translates daily choices — from diet to utility — into planetary parameters.
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">
                EcoBerg breaks down emissions, provides an exact sustainability score, and drafts personalised saving targets backed by intelligent recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700">EPA Validated Baselines</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700">Global Climate Models Aligned</span>
                </div>
              </div>
            </div>

            {/* Right: steps panel */}
            <div
              className="bg-[#F8FAF9] rounded-[32px] border border-slate-100 p-8 sm:p-10 shadow-sm"
              style={{
                opacity: methodIn ? 1 : 0,
                transform: methodIn ? 'translateX(0)' : 'translateX(24px)',
                transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
              }}
            >
              <h3 className="text-sm font-bold text-emerald-950 uppercase mb-6 flex items-center gap-2 border-b border-emerald-100 pb-4 tracking-tight">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                How carbon calculations work
              </h3>
              <div className="space-y-6">
                {methodologySteps.map((s) => (
                  <div key={s.num} className="flex items-start gap-4">
                    <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {s.num}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-800 block">{s.title}</span>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ 5. ASSESSMENT CATEGORIES ══ (from TSX) */}
      <section className="py-20 bg-[#F8FAF9]" ref={catRef}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 tracking-wider bg-emerald-100 py-1.5 px-3.5 rounded-full border border-emerald-200/50">
              Interactive Assessment Categories
            </span>
            <h2 className="text-3xl font-extrabold text-emerald-950 tracking-tight mt-4">
              Explore our core environmental vectors
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              We analyse lifestyle emissions across crucial domestic verticals following strict IPCC index models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-[28px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${item.border} flex flex-col group`}
                style={{
                  opacity: catIn ? 1 : 0,
                  transform: catIn ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.6s ease ${idx * 0.08}s, transform 0.6s ease ${idx * 0.08}s`,
                }}
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shadow-sm mb-4 border border-slate-100`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-800 text-sm tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. FEATURES ══ */}
      <section className="py-24 bg-white" ref={featRef}>
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
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md"
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

      {/* ══ 7. HOW IT WORKS ══ */}
      <section className="py-24 bg-slate-50" ref={stepsRef}>
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

      {/* ══ 8. CTA BANNER ══ */}
      <section className="py-24 bg-emerald-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4 pointer-events-none">
          <Leaf className="h-64 w-64 text-emerald-900 opacity-20" />
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
            Ready to design your personal carbon blueprint?
          </h2>
          <p className="text-emerald-200/80 text-lg mb-8 leading-relaxed">
            Takes less than 2 minutes. No account required to start.
          </p>
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