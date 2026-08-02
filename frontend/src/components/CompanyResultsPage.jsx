import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import {
  Truck,
  Plane,
  BedDouble,
  Zap,
  Droplet,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
} from "lucide-react";


const COLOR = {
  ink: "#1B4332",
  forest: "#2D6A4F",
  midGreen: "#40916C",
  jade: "#74C69D",
  mint: "#95D5B2",
  sage: "#D8F3DC",
  white: "#FFFFFF",
  paper: "#FAFBFA",
  slate: "#64748B",
  slateLight: "#94A3B8",
  line: "#E4E9E6",
  amber: "#B4780F",
};

const FONT_DISPLAY = "'Inter', -apple-system, sans-serif";
const FONT_MONO = "'IBM Plex Mono', 'SF Mono', monospace";

const CATEGORY_META = {
  Freight: { icon: Truck, color: COLOR.ink },
  Travel: { icon: Plane, color: COLOR.forest },
  "Hotel Stays": { icon: BedDouble, color: COLOR.midGreen },
  Electricity: { icon: Zap, color: COLOR.jade },
  Fuel: { icon: Droplet, color: COLOR.mint },
};

function buildRows(company) {
  return [
    { label: "Freight", value: Number(company.freight_footprint) || 0 },
    { label: "Travel", value: Number(company.travel_footprint) || 0 },
    { label: "Hotel Stays", value: Number(company.hotel_footprint) || 0 },
    { label: "Electricity", value: Number(company.electricity_footprint) || 0 },
    { label: "Fuel", value: Number(company.fuel_footprint) || 0 },
  ];
}

function formatNumber(n, decimals = 1) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function TrendChip({ value }) {
  if (value === null || value === undefined) return null;
  const isGood = value <= 0;
  const Icon = isGood ? TrendingDown : TrendingUp;
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold"
      style={{
        color: isGood ? COLOR.forest : COLOR.amber,
        backgroundColor: isGood ? COLOR.sage : "#FBF0DE",
        fontFamily: FONT_MONO,
      }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function KpiCard({ eyebrow, value, unit, sub, accent, icon: Icon }) {
  return (
    <div className="relative bg-white rounded-lg border overflow-hidden" style={{ borderColor: COLOR.line }}>
      <div className="h-[3px] w-full" style={{ backgroundColor: accent }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: COLOR.slate }}
          >
            {eyebrow}
          </span>
          {Icon && (
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ backgroundColor: COLOR.sage, color: COLOR.forest }}
            >
              <Icon size={13} />
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span
            className="text-2xl font-semibold leading-none"
            style={{ color: COLOR.ink, fontFamily: FONT_MONO }}
          >
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium" style={{ color: COLOR.slateLight }}>
              {unit}
            </span>
          )}
        </div>
        {sub && (
          <span className="text-[11px]" style={{ color: COLOR.slateLight }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

function BreakdownDonut({ rows, total }) {
  const chartData = rows.map((r) => ({
    name: r.label,
    value: r.value,
    color: CATEGORY_META[r.label]?.color || COLOR.slateLight,
  }));

  return (
    <div className="bg-white rounded-lg border p-5" style={{ borderColor: COLOR.line }}>
      <h3 className="text-sm font-semibold mb-1" style={{ color: COLOR.ink }}>
        Category distribution
      </h3>
      <p className="text-xs mb-4" style={{ color: COLOR.slateLight }}>
        Share of total footprint by category
      </p>

      <div className="relative" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              stroke={COLOR.white}
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${COLOR.line}`,
                fontSize: 12,
                fontFamily: FONT_DISPLAY,
              }}
              formatter={(value, name) => [`${formatNumber(value)} kg CO2e`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-xl font-semibold"
            style={{ color: COLOR.ink, fontFamily: FONT_MONO }}
          >
            {formatNumber(total)}
          </span>
          <span className="text-[10px]" style={{ color: COLOR.slateLight }}>
            kg CO2e total
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-xs truncate" style={{ color: COLOR.slate }}>
              {entry.name}
            </span>
            <span
              className="text-xs font-semibold ml-auto"
              style={{ color: COLOR.ink, fontFamily: FONT_MONO }}
            >
              {total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankedBarChart({ rows }) {
  const sorted = useMemo(() => [...rows].sort((a, b) => a.value - b.value), [rows]);
  const chartData = sorted.map((r) => ({
    name: r.label,
    value: Number(r.value.toFixed(1)),
    color: CATEGORY_META[r.label]?.color || COLOR.slateLight,
  }));

  return (
    <div className="bg-white rounded-lg border p-5" style={{ borderColor: COLOR.line }}>
      <h3 className="text-sm font-semibold mb-1" style={{ color: COLOR.ink }}>
        Ranked breakdown
      </h3>
      <p className="text-xs mb-4" style={{ color: COLOR.slateLight }}>
        Emissions per category (kg CO2e)
      </p>

      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke={COLOR.line} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: COLOR.slateLight, fontFamily: FONT_MONO }}
              axisLine={{ stroke: COLOR.line }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: COLOR.ink, fontFamily: FONT_DISPLAY }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              cursor={{ fill: COLOR.sage, opacity: 0.4 }}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${COLOR.line}`,
                fontSize: 12,
                fontFamily: FONT_DISPLAY,
              }}
              formatter={(value) => [`${formatNumber(value)} kg CO2e`, ""]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ProfileRadar({ rows }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  const chartData = rows.map((r) => ({
    category: r.label,
    value: r.value,
    fullMark: max,
  }));

  return (
    <div className="bg-white rounded-lg border p-5" style={{ borderColor: COLOR.line }}>
      <h3 className="text-sm font-semibold mb-1" style={{ color: COLOR.ink }}>
        Emissions profile
      </h3>
      <p className="text-xs mb-4" style={{ color: COLOR.slateLight }}>
        Relative shape across all tracked categories
      </p>

      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="75%">
            <PolarGrid stroke={COLOR.line} />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: COLOR.slate, fontFamily: FONT_DISPLAY }}
            />
            <Radar
              dataKey="value"
              stroke={COLOR.forest}
              fill={COLOR.mint}
              fillOpacity={0.45}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${COLOR.line}`,
                fontSize: 12,
                fontFamily: FONT_DISPLAY,
              }}
              formatter={(value) => [`${formatNumber(value)} kg CO2e`, ""]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CompanyDetailsCard({ company, onRecalculate }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!company.registration_number) return;
    try {
      await navigator.clipboard.writeText(company.registration_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable; ignore silently.
    }
  }

  return (
    <div className="bg-white rounded-lg border p-5" style={{ borderColor: COLOR.line }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: COLOR.ink }}>
        Company details
      </h3>
      <div className="space-y-3 text-sm mb-5">
        <div>
          <span className="block text-[11px] uppercase tracking-wide" style={{ color: COLOR.slateLight }}>
            Name
          </span>
          <span className="font-medium" style={{ color: COLOR.ink }}>
            {company.company_name || "—"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wide" style={{ color: COLOR.slateLight }}>
            Industry
          </span>
          <span className="font-medium" style={{ color: COLOR.ink }}>
            {company.industry || "—"}
          </span>
        </div>
        <div>
          <span className="block text-[11px] uppercase tracking-wide" style={{ color: COLOR.slateLight }}>
            Registration no.
          </span>
          <div className="flex items-center gap-2">
            <span className="font-medium font-mono text-xs" style={{ color: COLOR.ink }}>
              {company.registration_number || "—"}
            </span>
            {company.registration_number && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-slate-400 hover:text-emerald-800 transition-colors"
                aria-label="Copy registration number"
                style={{ color: copied ? COLOR.forest : COLOR.slateLight }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onRecalculate}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-md text-white transition-colors"
        style={{ backgroundColor: COLOR.ink }}
      >
        <RefreshCw size={14} />
        Recalculate form
      </button>
    </div>
  );
}

export default function CompanyResultsPage({ company, onRecalculate }) {
  const rows = buildRows(company);
  const total = Number(company.total_footprint) || rows.reduce((s, r) => s + r.value, 0);
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const largest = sorted[0];
  const smallest = sorted[sorted.length - 1];
  const tracked = rows.filter((r) => r.value > 0).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLOR.paper, fontFamily: FONT_DISPLAY }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-6 border-b"
          style={{ borderColor: COLOR.line }}
        >
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider rounded px-2 py-1 mb-3"
              style={{ backgroundColor: COLOR.sage, color: COLOR.forest }}
            >
              Calculation complete
            </span>
            <h1 className="text-2xl font-semibold" style={{ color: COLOR.ink }}>
              {company.company_name ? `${company.company_name} — Footprint overview` : "Company footprint overview"}
            </h1>
            <p className="text-sm mt-1" style={{ color: COLOR.slate }}>
              Calculated across freight, travel, hotel stays, electricity, and fuel
            </p>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            eyebrow="Total footprint"
            value={formatNumber(total)}
            unit="kg CO2e"
            accent={COLOR.ink}
          />
          <KpiCard
            eyebrow="Largest source"
            value={largest ? formatNumber(largest.value) : "0.0"}
            unit="kg CO2e"
            sub={largest?.label}
            accent={COLOR.forest}
            icon={largest ? CATEGORY_META[largest.label]?.icon : undefined}
          />
          <KpiCard
            eyebrow="Smallest source"
            value={smallest ? formatNumber(smallest.value) : "0.0"}
            unit="kg CO2e"
            sub={smallest?.label}
            accent={COLOR.jade}
            icon={smallest ? CATEGORY_META[smallest.label]?.icon : undefined}
          />
          <KpiCard
            eyebrow="Categories tracked"
            value={String(tracked)}
            unit="of 5"
            accent={COLOR.mint}
          />
        </div>

        {/* Donut + details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <BreakdownDonut rows={rows} total={total} />
          </div>
          <CompanyDetailsCard company={company} onRecalculate={onRecalculate} />
        </div>

        {/* Bar + radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RankedBarChart rows={rows} />
          <ProfileRadar rows={rows} />
        </div>

        {/* Footer note */}
        <div
          className="text-[11px] rounded-md px-4 py-3"
          style={{ backgroundColor: COLOR.white, border: `1px solid ${COLOR.line}`, color: COLOR.slateLight }}
        >
          Emission factors sourced via the emissions.dev API. Figures reflect the reporting
          period entered in the calculator and are saved to your account.
        </div>
      </div>
    </div>
  );
}