import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, TrendingDown, TrendingUp, Minus, BarChart2, LineChart as LineIcon, Activity } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart as RechartsAreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import useAxios from '../utils/Axios';

const scoreColor = (score) => {
  if (score >= 70) return 'text-emerald-600';
  if (score >= 40) return 'text-yellow-500';
  return 'text-red-500';
};

const scoreBg = (score) => {
  if (score >= 70) return 'bg-emerald-50 border-emerald-200';
  if (score >= 40) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
};

const TrendIcon = ({ current, previous }) => {
  if (!previous) return <Minus className="w-4 h-4 text-slate-400" />;
  if (current < previous) return <TrendingDown className="w-4 h-4 text-emerald-500" />;
  return <TrendingUp className="w-4 h-4 text-red-400" />;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-emerald-100 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="text-xs">
            {p.name}: <span className="font-semibold">{p.value} t</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CHART_TYPES = [
  { id: 'bar', label: 'Bar', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'line', label: 'Line', icon: <LineIcon className="w-4 h-4" /> },
  { id: 'area', label: 'Area', icon: <Activity className="w-4 h-4" /> },
];

const COLORS = {
  Total: '#059669',
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Energy: '#8b5cf6',
  Shopping: '#ec4899',
};

const ChartRenderer = ({ type, data }) => {
  const commonProps = {
    data,
    margin: { top: 4, right: 16, left: 0, bottom: 0 },
  };

  const axes = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
    </>
  );

  if (type === 'bar') {
    return (
      <BarChart {...commonProps}>
        {axes}
        <Bar dataKey="Total" fill={COLORS.Total} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Food" fill={COLORS.Food} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Transport" fill={COLORS.Transport} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Energy" fill={COLORS.Energy} radius={[4, 4, 0, 0]} />
        <Bar dataKey="Shopping" fill={COLORS.Shopping} radius={[4, 4, 0, 0]} />
      </BarChart>
    );
  }

  if (type === 'line') {
    return (
      <LineChart {...commonProps}>
        {axes}
        <Line type="monotone" dataKey="Total" stroke={COLORS.Total} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="Food" stroke={COLORS.Food} strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="Transport" stroke={COLORS.Transport} strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="Energy" stroke={COLORS.Energy} strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="Shopping" stroke={COLORS.Shopping} strokeWidth={1.5} dot={false} />
      </LineChart>
    );
  }

  if (type === 'area') {
    return (
      <RechartsAreaChart {...commonProps}>
        {axes}
        <Area type="monotone" dataKey="Total" stroke={COLORS.Total} fill={COLORS.Total} fillOpacity={0.15} strokeWidth={2.5} />
        <Area type="monotone" dataKey="Food" stroke={COLORS.Food} fill={COLORS.Food} fillOpacity={0.1} strokeWidth={1.5} />
        <Area type="monotone" dataKey="Transport" stroke={COLORS.Transport} fill={COLORS.Transport} fillOpacity={0.1} strokeWidth={1.5} />
        <Area type="monotone" dataKey="Energy" stroke={COLORS.Energy} fill={COLORS.Energy} fillOpacity={0.1} strokeWidth={1.5} />
        <Area type="monotone" dataKey="Shopping" stroke={COLORS.Shopping} fill={COLORS.Shopping} fillOpacity={0.1} strokeWidth={1.5} />
      </RechartsAreaChart>
    );
  }

  return null;
};

const CarbonHistory = () => {
  const axiosInstance = useAxios();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get('/api/history/');
        setHistory(res.data);
      } catch {
        setError('Failed to load your history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const chartData = [...history].reverse().map((r) => ({
    date: r.date,
    Total: r.total_footprint,
    Food: r.breakdown.food,
    Transport: r.breakdown.transportation,
    Energy: r.breakdown.energy,
    Shopping: r.breakdown.shopping,
  }));

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-gradient-to-b from-white to-emerald-50/30 px-4 py-12 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">

        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Carbon Footprint</h1>
          </div>
          <p className="text-sm text-slate-500 ml-12">Track how your footprint has changed over time.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">Loading your history...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 text-sm">{error}</div>
        ) : history.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm mb-4">You haven't taken the quiz yet.</p>
            <Link
              to="/quiz"
              className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full transition"
            >
              Take the Quiz
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-md p-6 mb-8">
              {/* Chart header with toggle */}
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-bold text-slate-800">Footprint Over Time</h2>
                {/* Chart type switcher */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                  {CHART_TYPES.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setChartType(ct.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        chartType === ct.id
                          ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {ct.icon}
                      <span className="hidden sm:inline">{ct.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-5">tonnes CO₂e per year</p>
              <ResponsiveContainer width="100%" height={260}>
                <ChartRenderer type={chartType} data={chartData} />
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-800">All Attempts</h2>
              {history.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="shrink-0 w-28">
                    <p className="text-xs text-slate-400">Attempt {history.length - idx}</p>
                    <p className="text-sm font-semibold text-slate-700">{item.date}</p>
                  </div>

                  <div className={`shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl border ${scoreBg(item.sustainability_score)}`}>
                    <span className={`text-xl font-extrabold ${scoreColor(item.sustainability_score)}`}>
                      {item.sustainability_score}
                    </span>
                    <span className="text-xs text-slate-400">score</span>
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Food', value: item.breakdown.food, color: 'bg-amber-400' },
                      { label: 'Transport', value: item.breakdown.transportation, color: 'bg-blue-400' },
                      { label: 'Energy', value: item.breakdown.energy, color: 'bg-purple-400' },
                      { label: 'Shopping', value: item.breakdown.shopping, color: 'bg-pink-400' },
                    ].map((b) => (
                      <div key={b.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500">{b.label}</span>
                          <span className="font-semibold text-slate-700">{b.value}t</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${b.color} rounded-full`}
                            style={{ width: `${Math.min(100, (b.value / 6) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <TrendIcon
                        current={item.total_footprint}
                        previous={history[idx + 1]?.total_footprint}
                      />
                      <span className="text-lg font-extrabold text-slate-800">{item.total_footprint}t</span>
                    </div>
                    <p className="text-xs text-slate-400">total CO₂e</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/quiz"
                className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full transition"
              >
                Retake the Quiz
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarbonHistory;