import { useEffect, useRef, useState } from 'react';

const REGIONS = [
  { name: 'North America', lat: 40.7, lon: -74.0, x: 160, y: 145 },
  { name: 'Amazon', lat: -3.5, lon: -60.0, x: 245, y: 215 },
  { name: 'Europe', lat: 48.8, lon: 2.3, x: 490, y: 120 },
  { name: 'West Africa', lat: 5.3, lon: -4.0, x: 455, y: 205 },
  { name: 'East Africa', lat: -1.3, lon: 36.8, x: 545, y: 210 },
  { name: 'Middle East', lat: 25.2, lon: 55.3, x: 590, y: 150 },
  { name: 'South Asia', lat: 20.6, lon: 79.0, x: 650, y: 170 },
  { name: 'East Asia', lat: 35.7, lon: 139.7, x: 725, y: 135 },
  { name: 'SE Asia', lat: 1.4, lon: 103.8, x: 720, y: 205 },
  { name: 'Oceania', lat: -25.3, lon: 133.8, x: 730, y: 265 },
];

const GREEN_MAX = 415;
const YELLOW_MAX = 422;

function getZone(ppm) {
  if (ppm === null) return 'loading';
  if (ppm < GREEN_MAX) return 'green';
  if (ppm < YELLOW_MAX) return 'yellow';
  return 'red';
}

function getZoneColors(zone) {
  switch (zone) {
    case 'green':  return { fill: '#22c55e', glow: '#bbf7d0', label: 'Healthy' };
    case 'yellow': return { fill: '#f59e0b', glow: '#fde68a', label: 'Elevated' };
    case 'red':    return { fill: '#ef4444', glow: '#fecaca', label: 'Critical' };
    default:       return { fill: '#94a3b8', glow: '#e2e8f0', label: '…' };
  }
}

async function fetchCO2(lat, lon) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=carbon_dioxide&forecast_days=1`;
  const res = await fetch(url);
  const data = await res.json();
  const values = data?.hourly?.carbon_dioxide?.filter(v => v !== null);
  if (!values || values.length === 0) return null;
  return Math.round(values[values.length - 1] * 10) / 10;
}

const useInView = (threshold = 0.1) => {
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

export default function GlobalCarbonTracker() {
  const [regionData, setRegionData] = useState(
    REGIONS.map(r => ({ ...r, ppm: null, error: false }))
  );
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [sectionRef, inView] = useInView(0.15);

  useEffect(() => {
    if (!inView || loaded) return;
    setLoaded(true);

    REGIONS.forEach((region, i) => {
      setTimeout(() => {
        fetchCO2(region.lat, region.lon)
          .then(ppm => {
            setRegionData(prev =>
              prev.map((r, j) => j === i ? { ...r, ppm } : r)
            );
          })
          .catch(() => {
            setRegionData(prev =>
              prev.map((r, j) => j === i ? { ...r, error: true } : r)
            );
          });
      }, i * 120);
    });
  }, [inView, loaded]);

  const validReadings = regionData.filter(r => r.ppm !== null);
  const avgPpm = validReadings.length > 0
    ? Math.round((validReadings.reduce((s, r) => s + r.ppm, 0) / validReadings.length) * 10) / 10
    : null;
  const globalZone = avgPpm !== null ? getZone(avgPpm) : 'loading';
  const globalColors = getZoneColors(globalZone);

  const greenCount  = regionData.filter(r => getZone(r.ppm) === 'green').length;
  const yellowCount = regionData.filter(r => getZone(r.ppm) === 'yellow').length;
  const redCount    = regionData.filter(r => getZone(r.ppm) === 'red').length;

  const hovered = hoveredIdx !== null ? regionData[hoveredIdx] : null;

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-slate-950 overflow-hidden relative"
    >
      {/* subtle radial bg glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${globalColors.fill} 0%, transparent 70%)` }} />
      </div>

      <div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-emerald-400 font-semibold text-sm uppercase tracking-widest">Live atmospheric data</span>
          <h2 className="text-4xl font-extrabold text-white mt-2">
            Earth's carbon footprint,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
              right now
            </span>
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Live CO₂ concentration (ppm) sampled across 10 major world regions via atmospheric sensors.
            Updated hourly from Open-Meteo.
          </p>
        </div>

        {/* Global average pill */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-3 bg-slate-800/80 border border-slate-700 rounded-full px-6 py-3 backdrop-blur-sm">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ background: globalColors.fill, boxShadow: `0 0 8px ${globalColors.fill}` }}
            />
            <span className="text-slate-400 text-sm">Global average</span>
            <span className="text-white font-extrabold text-xl">
              {avgPpm !== null ? `${avgPpm} ppm` : '—'}
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: globalColors.glow + '33', color: globalColors.fill }}
            >
              {globalColors.label}
            </span>
          </div>
        </div>

        {/* World map SVG */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 mb-8">
          <svg
            viewBox="0 0 900 360"
            className="w-full"
            style={{ maxHeight: 360 }}
          >
            {/* Simple stylised continent outlines */}
            <defs>
              <filter id="blur-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Ocean bg */}
            <rect width="900" height="360" fill="#0f172a" />

            {/* Grid lines */}
            {[60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840].map(x => (
              <line key={x} x1={x} y1="0" x2={x} y2="360" stroke="#1e293b" strokeWidth="0.5" />
            ))}
            {[72, 144, 216, 288].map(y => (
              <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#1e293b" strokeWidth="0.5" />
            ))}

            {/* Stylised continent shapes */}
            {/* North America */}
            <path d="M80,60 L220,55 L240,100 L230,160 L190,180 L150,200 L110,195 L80,160 L60,120 Z"
              fill="#1e3a2f" stroke="#2d5a45" strokeWidth="0.8" />
            {/* South America */}
            <path d="M175,210 L260,205 L280,230 L270,300 L230,330 L185,310 L165,270 L160,230 Z"
              fill="#1e3a2f" stroke="#2d5a45" strokeWidth="0.8" />
            {/* Europe */}
            <path d="M420,60 L530,55 L545,90 L520,130 L470,135 L440,120 L415,95 Z"
              fill="#1e3a2f" stroke="#2d5a45" strokeWidth="0.8" />
            {/* Africa */}
            <path d="M430,145 L540,140 L560,170 L560,270 L520,310 L470,315 L430,290 L410,240 L415,180 Z"
              fill="#1e3a2f" stroke="#2d5a45" strokeWidth="0.8" />
            {/* Middle East / West Asia */}
            <path d="M545,100 L640,95 L660,130 L635,165 L580,170 L550,150 Z"
              fill="#1e3a2f" stroke="#2d5a45" strokeWidth="0.8" />
            {/* Asia */}
            <path d="M640,55 L820,50 L840,100 L820,180 L770,220 L700,230 L650,200 L620,160 L630,110 Z"
              fill="#1e3a2f" stroke="#2d5a45" strokeWidth="0.8" />
            {/* SE Asia islands */}
            <ellipse cx="730" cy="220" rx="30" ry="18" fill="#1e3a2f" stroke="#2d5a45" strokeWidth="0.8" />
            {/* Oceania */}
            <path d="M680,255 L780,250 L800,270 L795,295 L750,305 L695,295 Z"
              fill="#1e3a2f" stroke="#2d5a45" strokeWidth="0.8" />

            {/* Region dots */}
            {regionData.map((region, i) => {
              const zone = getZone(region.ppm);
              const colors = getZoneColors(zone);
              const isHovered = hoveredIdx === i;
              const r = isHovered ? 14 : 10;

              return (
                <g
                  key={region.name}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* glow ring */}
                  <circle
                    cx={region.x} cy={region.y} r={r + 6}
                    fill={colors.fill}
                    opacity={isHovered ? 0.25 : 0.12}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* main dot */}
                  <circle
                    cx={region.x} cy={region.y} r={r}
                    fill={region.ppm !== null ? colors.fill : '#334155'}
                    style={{
                      transition: 'all 0.4s ease',
                      filter: isHovered ? `drop-shadow(0 0 6px ${colors.fill})` : 'none',
                    }}
                  />
                  {/* loading spinner ring */}
                  {region.ppm === null && !region.error && (
                    <circle
                      cx={region.x} cy={region.y} r={r}
                      fill="none" stroke="#64748b" strokeWidth="1.5"
                      strokeDasharray="20 10"
                      style={{ animation: 'spin 1.5s linear infinite', transformOrigin: `${region.x}px ${region.y}px` }}
                    />
                  )}
                </g>
              );
            })}

            {/* Tooltip */}
            {hovered && hovered.ppm !== null && (() => {
              const zone = getZone(hovered.ppm);
              const colors = getZoneColors(zone);
              const tx = Math.min(Math.max(hovered.x - 55, 4), 790);
              const ty = hovered.y > 200 ? hovered.y - 68 : hovered.y + 20;
              return (
                <g>
                  <rect x={tx} y={ty} width="110" height="50" rx="8"
                    fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
                  <text x={tx + 55} y={ty + 16} textAnchor="middle"
                    fill="#94a3b8" fontSize="10" fontFamily="Inter, sans-serif">{hovered.name}</text>
                  <text x={tx + 55} y={ty + 32} textAnchor="middle"
                    fill={colors.fill} fontSize="14" fontWeight="700"
                    fontFamily="Inter, sans-serif">{hovered.ppm} ppm</text>
                  <text x={tx + 55} y={ty + 46} textAnchor="middle"
                    fill={colors.fill} fontSize="10"
                    fontFamily="Inter, sans-serif">{colors.label}</text>
                </g>
              );
            })()}
          </svg>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Healthy regions', count: greenCount, color: '#22c55e', bg: '#052e16' },
            { label: 'Elevated regions', count: yellowCount, color: '#f59e0b', bg: '#1c1007' },
            { label: 'Critical regions', count: redCount, color: '#ef4444', bg: '#1c0505' },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className="rounded-xl p-4 text-center border border-slate-800"
              style={{ background: bg }}>
              <div className="text-3xl font-extrabold" style={{ color }}>{count}</div>
              <div className="text-xs text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Region list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {regionData.map((region, i) => {
            const zone = getZone(region.ppm);
            const colors = getZoneColors(zone);
            return (
              <div
                key={region.name}
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3 flex items-center gap-3 cursor-default"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  borderColor: hoveredIdx === i ? colors.fill + '88' : undefined,
                  transition: 'border-color 0.2s ease',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background: region.ppm !== null ? colors.fill : '#475569',
                    boxShadow: region.ppm !== null ? `0 0 6px ${colors.fill}88` : 'none',
                  }}
                />
                <div className="min-w-0">
                  <div className="text-slate-300 text-xs font-medium truncate">{region.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: region.ppm !== null ? colors.fill : '#64748b' }}>
                    {region.ppm !== null ? `${region.ppm} ppm` : 'Loading…'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-400">
          {[
            { color: '#22c55e', label: 'Healthy — below 415 ppm' },
            { color: '#f59e0b', label: 'Elevated — 415–422 ppm' },
            { color: '#ef4444', label: 'Critical — above 422 ppm' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              {label}
            </div>
          ))}
          <span className="text-slate-600">· Source: Open-Meteo Air Quality API</span>
        </div>
      </div>
    </section>
  );
}
