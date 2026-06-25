import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell, Sector,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  ch4:    '#f97316',
  n2o:    '#2dd4bf',
  co2:    '#60a5fa',
  ghg:    '#a78bfa',
  capita: '#f43f5e',
  share:  '#facc15',
};
const PIE_COLORS = [C.ch4, C.n2o, C.co2];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtM = (v) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K`;
  return v;
};

const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="mb-4">
    <h3 className="text-lg font-bold text-[#054335] flex items-center gap-2">
      <span>{icon}</span>{title}
    </h3>
    {subtitle && <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">{subtitle}</p>}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-md p-5 ${className}`}>
    {children}
  </div>
);

// ── Shared Tooltip ────────────────────────────────────────────────────────────
const SharedTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm min-w-[170px]">
      <p className="font-bold text-[#054335] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey || p.name} className="flex justify-between gap-4 text-gray-600">
          <span style={{ color: p.color ?? p.fill }} className="font-medium">{p.name}</span>
          <span>{typeof p.value === 'number' ? fmtM(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5 flex flex-col gap-1">
    <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
    <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
    {sub && <p className="text-xs text-gray-500">{sub}</p>}
  </div>
);

// ── Stacked Area ──────────────────────────────────────────────────────────────
const ChartArea = ({ chartData }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        {[['gCH4', C.ch4], ['gN2O', C.n2o], ['gCO2', C.co2]].map(([id, color]) => (
          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.9} />
            <stop offset="95%" stopColor={color} stopOpacity={0.5} />
          </linearGradient>
        ))}
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
      <YAxis tickFormatter={fmtM} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={46} />
      <Tooltip content={<SharedTooltip />} />
      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="square" iconSize={10} />
      <ReferenceLine x={1997} stroke="#cbd5e1" strokeDasharray="4 3" label={{ value: 'Kyoto', position: 'top', fontSize: 9, fill: '#94a3b8' }} />
      <ReferenceLine x={2015} stroke="#cbd5e1" strokeDasharray="4 3" label={{ value: 'Paris', position: 'top', fontSize: 9, fill: '#94a3b8' }} />
      <ReferenceLine x={2020} stroke="#cbd5e1" strokeDasharray="4 3" label={{ value: 'COVID', position: 'top', fontSize: 9, fill: '#94a3b8' }} />
      <Area type="monotone" dataKey="Methane (CH₄)"        stackId="1" stroke={C.ch4} fill="url(#gCH4)" strokeWidth={1.5} />
      <Area type="monotone" dataKey="Nitrous Oxide (N₂O)"  stackId="1" stroke={C.n2o} fill="url(#gN2O)" strokeWidth={1.5} />
      <Area type="monotone" dataKey="Carbon Dioxide (CO₂)" stackId="1" stroke={C.co2} fill="url(#gCO2)" strokeWidth={1.5} />
    </AreaChart>
  </ResponsiveContainer>
);

// ── Bar Chart ─────────────────────────────────────────────────────────────────
const ChartBar = ({ rawData }) => {
  const data = [...rawData].sort((a, b) => a.year - b.year).map(d => ({
    year: d.year, 'Total GHG': d.ghg ?? 0,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gGHG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={C.ghg} stopOpacity={0.95} />
            <stop offset="100%" stopColor={C.ghg} stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
        <YAxis tickFormatter={fmtM} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={46} />
        <Tooltip content={<SharedTooltip />} cursor={{ fill: '#f9fafb' }} />
        <Bar dataKey="Total GHG" fill="url(#gGHG)" radius={[5, 5, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ── Line Chart ────────────────────────────────────────────────────────────────
const ChartLine = ({ rawData }) => {
  const data = [...rawData].sort((a, b) => a.year - b.year).map(d => ({
    year:           d.year,
    'Per Capita':   parseFloat(d.per_capita)  || 0,
    'Global Share': parseFloat(d.global_share) || 0,
  }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
        <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={36} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={36} tickFormatter={v => `${v}%`} />
        <Tooltip content={<SharedTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" iconSize={10} />
        <ReferenceLine yAxisId="left" x={2020} stroke="#cbd5e1" strokeDasharray="4 3" label={{ value: 'COVID', position: 'top', fontSize: 9, fill: '#94a3b8' }} />
        <Line yAxisId="left"  type="monotone" dataKey="Per Capita"   stroke={C.capita} strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 5 }} />
        <Line yAxisId="right" type="monotone" dataKey="Global Share" stroke={C.share}  strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 5 }} strokeDasharray="6 3" />
      </LineChart>
    </ResponsiveContainer>
  );
};

// ── Pie Chart ─────────────────────────────────────────────────────────────────
const renderActiveShape = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value }) => (
  <g>
    <text x={cx} y={cy - 14} textAnchor="middle" fill="#054335" style={{ fontSize: 13, fontWeight: 700 }}>{payload.name}</text>
    <text x={cx} y={cy + 8}  textAnchor="middle" fill="#374151" style={{ fontSize: 12 }}>{fmtM(value)}</text>
    <text x={cx} y={cy + 26} textAnchor="middle" fill="#9ca3af" style={{ fontSize: 11 }}>{(percent * 100).toFixed(1)}%</text>
    <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    <Sector cx={cx} cy={cy} innerRadius={innerRadius - 5} outerRadius={innerRadius - 2} startAngle={startAngle} endAngle={endAngle} fill={fill} />
  </g>
);

const ChartPie = ({ rawData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const latest = [...rawData].sort((a, b) => b.year - a.year)[0];
  if (!latest) return null;
  const pieData = [
    { name: 'Methane (CH₄)',        value: latest.ch4 ?? 0 },
    { name: 'Nitrous Oxide (N₂O)',  value: latest.n02 ?? 0 },
    { name: 'Carbon Dioxide (CO₂)', value: latest.co2 ?? 0 },
  ].filter(d => d.value > 0);
  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={pieData}
            cx="50%" cy="50%"
            innerRadius={75} outerRadius={115}
            dataKey="value"
            onMouseEnter={(_, i) => setActiveIndex(i)}
          >
            {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="flex flex-row sm:flex-col gap-2 shrink-0">
        {pieData.map((entry, i) => (
          <button
            key={entry.name}
            onClick={() => setActiveIndex(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all text-xs ${
              activeIndex === i ? 'border-gray-300 shadow bg-gray-50' : 'border-gray-100 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="w-2.5 h-8 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
            <div>
              <p className="text-gray-500 leading-tight">{entry.name}</p>
              <p className="font-bold text-[#054335]">{fmtM(entry.value)}</p>
              <p className="text-gray-400">{((entry.value / total) * 100).toFixed(1)}%</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Table ─────────────────────────────────────────────────────────────────────
const TableView = ({ rawData }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse min-w-max">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200 text-[#054335] text-xs uppercase tracking-wider">
          {['Year','Total GHG','CO₂','CH₄','NO₂','Per Capita','Change','Global Share'].map(h => (
            <th key={h} className="py-3 px-5 font-bold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 text-gray-600 text-sm">
        {[...rawData].sort((a, b) => b.year - a.year).map((item, idx) => (
          <tr key={item.year || idx} className="hover:bg-[#00d084]/5 transition-colors group">
            <td className="py-3 px-5 font-bold text-[#054335] group-hover:text-[#00d084] transition-colors">{item.year}</td>
            <td className="py-3 px-5 font-medium">{item.ghg?.toLocaleString()}</td>
            <td className="py-3 px-5">{item.co2?.toLocaleString()}</td>
            <td className="py-3 px-5">{item.ch4?.toLocaleString()}</td>
            <td className="py-3 px-5">{item.n02?.toLocaleString()}</td>
            <td className="py-3 px-5">
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">{item.per_capita}</span>
            </td>
            <td className="py-3 px-5">
              <span className={`font-semibold ${item.change > 0 ? 'text-red-500' : item.change < 0 ? 'text-[#00d084]' : 'text-gray-400'}`}>
                {item.change > 0 ? '+' : ''}{item.change}%
              </span>
            </td>
            <td className="py-3 px-5">{item.global_share}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Main Dashboard ────────────────────────────────────────────────────────────
const EmissionsDashboard = () => {
  const [rawData,   setRawData]   = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/news/localscraper/');
        const raw = Array.isArray(response.data) ? response.data : [response.data];
        setRawData(raw);
        setChartData(
          raw
            .map(item => ({
              year:                    item.year,
              'Methane (CH₄)':        item.ch4 ?? 0,
              'Nitrous Oxide (N₂O)':  item.n02 ?? 0,
              'Carbon Dioxide (CO₂)': item.co2 ?? 0,
            }))
            .sort((a, b) => a.year - b.year)
        );
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center p-16">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-8 w-8 bg-[#00d084] rounded-full animate-bounce" />
        <p className="text-gray-500 font-medium">Loading emissions data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
      <p className="text-red-700 font-medium">Failed to load data: {error}</p>
    </div>
  );

  // Derive summary stats from the latest year
  const latest = [...rawData].sort((a, b) => b.year - a.year)[0] ?? {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans space-y-6">

      <div className="bg-[#054335] rounded-2xl px-8 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
           Nepal  Emissions 
          </h1>
          <p className="text-[#00d084] text-sm mt-1 opacity-90">
            CO₂eq tons of GHG emissions by gas, per capita, and global share
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-xs uppercase tracking-wider">Latest year</p>
          <p className="text-3xl font-extrabold text-[#00d084]">{latest.year}</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total GHG (latest)" value={fmtM(latest.ghg ?? 0)} sub="tons CO₂eq"       color="#a78bfa" />
        <StatCard label="Year-over-Year"      value={`${latest.change > 0 ? '+' : ''}${latest.change ?? 0}%`} sub={latest.change > 0 ? 'increase' : 'decrease'} color={latest.change > 0 ? '#f43f5e' : '#00d084'} />
        <StatCard label="Global Share"        value={`${latest.global_share ?? 0}%`} sub="of world emissions" color="#facc15" />
        <StatCard label="Per Capita"          value={latest.per_capita ?? '—'}        sub="tons per person"   color="#f97316" />
      </div>

      {/* ── Row 1: Stacked Area (full width) ── */}
      <Card>
        <SectionTitle icon="📈" title="Emissions by Gas Over Time" subtitle="Stacked CO₂eq tons — Methane · Nitrous Oxide · Carbon Dioxide" />
        <ChartArea chartData={chartData} />
      </Card>

      {/* ── Row 2: Bar + Line side by side ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <SectionTitle icon="📊" title="Total GHG by Year" subtitle="CO₂eq tons per year" />
          <ChartBar rawData={rawData} />
        </Card>
        <Card>
          <SectionTitle icon="📉" title="Per Capita & Global Share" subtitle="Tons/person (left axis) · % of world (right axis)" />
          <ChartLine rawData={rawData} />
        </Card>
      </div>

      {/* ── Row 3: Pie (half width) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <SectionTitle icon="🥧" title="Gas Breakdown — Latest Year" subtitle={`Hover slices to explore · ${latest.year}`} />
          <ChartPie rawData={rawData} />
        </Card>
        {/* Mini insight card */}
        <Card className="flex flex-col justify-center gap-5">
          <SectionTitle icon="💡" title="Key Insights" />
          <div className="space-y-4 text-sm text-gray-600">
            {[
              { color: C.ch4, label: 'Methane (CH₄)', text: 'Dominant gas — primarily from agriculture, livestock, and waste.' },
              { color: C.n2o, label: 'Nitrous Oxide (N₂O)', text: 'Rising with fertiliser use and land-use change.' },
              { color: C.co2, label: 'Carbon Dioxide (CO₂)', text: 'Accelerated after 2015 with fossil fuel consumption growth.' },
              { color: C.capita, label: 'Per Capita', text: 'Still well below global average despite steady increase.' },
            ].map(({ color, label, text }) => (
              <div key={label} className="flex gap-3">
                <div className="mt-1 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                <div>
                  <p className="font-semibold text-[#054335]">{label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 4: Full-width Table ── */}
      <Card className="!p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <SectionTitle icon="📋" title="Emissions Breakdown — All Years" />
        </div>
        <TableView rawData={rawData} />
      </Card>

    </div>
  );
};

export default EmissionsDashboard;