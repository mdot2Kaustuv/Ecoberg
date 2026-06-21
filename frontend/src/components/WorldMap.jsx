import React, { useState, useMemo, Suspense, use } from 'react';
import * as d3 from 'd3';

const GEO_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";
const API_URL = "http://127.0.0.1:8000/news/scraper/";


const getClarityColor = (value, max) => {
  if (value === undefined || value === null || value === 0) return "#e2e8f0"; 
  
  const ratio = Math.min(Math.max(value / max, 0), 1);
  const adjustedRatio = Math.pow(ratio, 0.35); 

  const r = Math.round(220 - (220 - 11) * adjustedRatio);
  const g = Math.round(245 - (245 - 75) * adjustedRatio);
  const b = Math.round(210 - (210 - 41) * adjustedRatio);

  return `rgb(${r}, ${g}, ${b})`;
};

const normalizeName = (name) =>
  (name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .toLowerCase()
    .trim()
    .replace(/^the\s+/, '')
    .replace(/[.,']/g, '')
    .replace(/\s+/g, ' ');

const NAME_ALIASES = {
  'united states': 'united states of america',
  'usa': 'united states of america',
  'us': 'united states of america',
  'uk': 'united kingdom',
  'britain': 'united kingdom',
  'great britain': 'united kingdom',
  'czechia': 'czech republic',
  'cote divoire': 'ivory coast',
  'dr congo': 'democratic republic of the congo',
  'congo dr': 'democratic republic of the congo',
  'congo-kinshasa': 'democratic republic of the congo',
  'congo, dem rep': 'democratic republic of the congo',
  'congo-brazzaville': 'republic of the congo',
  'congo republic': 'republic of the congo',
  'burma': 'myanmar',
  'tanzania': 'united republic of tanzania',
  'north macedonia': 'macedonia',
  'eswatini': 'swaziland',
  'timor-leste': 'east timor',
  'uae': 'united arab emirates',
  'serbia': 'republic of serbia',
  'bosnia': 'bosnia and herzegovina',
  'south korea': 'korea',
  'north korea': 'dem. rep. korea',
  'bolivia plurinational state of': 'bolivia',
  'bolivia (plurinational state of)': 'bolivia',
  'venezuela bolivarian republic of': 'venezuela',
  'venezuela (bolivarian republic of)': 'venezuela',
  'falkland islands malvinas': 'falkland islands',
  'falkland islands (malvinas)': 'falkland islands',
};

const resolveGeoName = (countryName) => {
  const norm = normalizeName(countryName);
  return NAME_ALIASES[norm] || norm;
};

const buildFeatureIndex = (geoData) => {
  const byName = new Map();
  const byId = new Map();
  
  (geoData.features || []).forEach((feature) => {
    const name = feature.properties?.name || feature.properties?.NAME;
    if (name) byName.set(normalizeName(name), feature);
    
    if (feature.id && /^[A-Z]{3}$/i.test(feature.id)) {
      byId.set(feature.id.toUpperCase(), feature);
    }
    if (feature.properties?.iso_a3 && /^[A-Z]{3}$/i.test(feature.properties.iso_a3)) {
      byId.set(feature.properties.iso_a3.toUpperCase(), feature);
    }
    if (feature.properties?.ISO_A3 && /^[A-Z]{3}$/i.test(feature.properties.ISO_A3)) {
      byId.set(feature.properties.ISO_A3.toUpperCase(), feature);
    }
  });
  return { byName, byId };
};

const findFeature = (featureIndex, row) => {
  if (typeof row.code === 'string' && row.code.length === 3) {
    const byCode = featureIndex.byId.get(row.code.toUpperCase());
    if (byCode) return byCode;
  }

  const target = resolveGeoName(row.country);
  if (featureIndex.byName.has(target)) return featureIndex.byName.get(target);

  for (const [key, feature] of featureIndex.byName) {
    if (key.includes(target) || target.includes(key)) return feature;
  }
  return null;
};

const formatChange = (value) => {
  if (value === null || value === undefined || value === '') {
    return { text: '0%', isNegative: false, isZero: true };
  }
  const num = typeof value === 'string' ? parseFloat(value.replace('%', '')) : Number(value);
  if (Number.isNaN(num)) return { text: '0%', isNegative: false, isZero: true };

  return {
    text: `${num > 0 ? '+' : ''}${num.toFixed(1)}%`,
    isNegative: num < 0,
    isZero: num === 0,
  };
};

const fetchEmissionsData = () => {
  return fetch(API_URL)
    .then((res) => {
      if (!res.ok) throw new Error("Network response error");
      return res.json();
    })
    .then((incomingData) =>
      incomingData.map((d) => ({
        ...d,
        total: typeof d.total === 'string' ? parseFloat(d.total.replace(/,/g, '')) || 0 : Number(d.total || 0),
        per_capita: typeof d.per_capita === 'string' ? parseFloat(d.per_capita) || 0 : Number(d.per_capita || 0),
        one_year_change: d.one_year_change,
      }))
    );
};

const fetchWorldMapGeo = () => {
  return fetch(GEO_URL).then((res) => res.json());
};

const emissionsPromise = fetchEmissionsData();
const geoPromise = fetchWorldMapGeo();

const MapLoadingFallback = () => (
  <div className="bg-slate-50 h-[450px] flex items-center justify-center text-sm font-medium text-slate-400 py-16 rounded-xl border border-dashed border-slate-300">
    Generating high-clarity map layout…
  </div>
);

const InteractiveMap = ({ data, viewMode, hoveredCountry, setHoveredCountry }) => {
  const geoData = use(geoPromise);
  const featureIndex = useMemo(() => buildFeatureIndex(geoData), [geoData]);

  const dataByFeature = useMemo(() => {
    const map = new Map();
    data.forEach((row) => {
      const feature = findFeature(featureIndex, row);
      if (feature) map.set(feature, row);
    });
    return map;
  }, [data, featureIndex]);

  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d[viewMode] || 0)) : 1;

  const pathGenerator = useMemo(() => {

    const projection = d3.geoNaturalEarth1().fitSize([850, 440], geoData);
    return d3.geoPath(projection);
  }, [geoData]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full relative bg-[#f8fafc] rounded-xl border border-slate-100 overflow-hidden p-2">
        <svg viewBox="0 0 850 450" className="w-full h-auto">
          <g transform="translate(0, 5)">
            {geoData.features.map((feature, index) => {
              const row = dataByFeature.get(feature);
              const value = row ? row[viewMode] || 0 : 0;
              const d = pathGenerator(feature);
              if (!d) return null;

              const featName = feature.properties?.name || feature.properties?.NAME || index;
              const isHovered = hoveredCountry && hoveredCountry.id === featName;

              return (
                <path
                  key={featName}
                  d={d}
                  fill={getClarityColor(value, maxValue)}
                  stroke={isHovered ? "#0f172a" : "#ffffff"}
                  strokeWidth={isHovered ? 1.5 : 0.4}
                  className="transition-all duration-75 ease-out"
                  style={{ cursor: row ? 'pointer' : 'default' }}
                  onMouseEnter={() => {
                    const countryName = row ? row.country : (feature.properties?.name || feature.properties?.NAME || "Unknown Territory");
                    const displayValue = row 
                      ? (viewMode === 'total' ? `${row.total.toLocaleString()} tons` : `${row.per_capita.toFixed(2)} per capita`)
                      : "Data Not Available";

                    setHoveredCountry({ 
                      id: featName,
                      name: countryName, 
                      value: displayValue 
                    });
                  }}
                  onMouseLeave={() => setHoveredCountry(null)}
                />
              );
            })}
          </g>
        </svg>
      </div>


      <div className="w-full max-w-xl flex flex-col gap-1.5 text-xs font-mono text-slate-500 mt-5 px-1">
        <div className="w-full h-3 rounded-full bg-gradient-to-r from-[#dcffd2] via-[#4ade80] to-[#0b401f] border border-slate-200 shadow-inner"></div>
        <div className="flex items-center justify-between font-medium text-[11px] px-0.5">
          <span>0 / No Data (Gray)</span>
          <span>Moderate Emissions</span>
          <span>{viewMode === 'total' ? maxValue.toLocaleString() : maxValue.toFixed(2)} (Peak)</span>
        </div>
      </div>
    </div>
  );
};

const WorldMapContent = () => {
  const data = use(emissionsPromise);
  const [viewMode, setViewMode] = useState('total');
  const [hoveredCountry, setHoveredCountry] = useState(null);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans bg-white text-[#333333]">
      <h2 className="text-2xl font-bold border-b-2 border-emerald-500 pb-2 mb-6 text-slate-800 tracking-tight">
        Greenhouse Gas Emissions Map Analyzer
      </h2>

   
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4 min-h-[40px]">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
            <span>🗺️</span>
            <span>Global Distribution View</span>
          </div>
          {hoveredCountry ? (
            <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm font-mono transition-all duration-100">
              <span className="font-bold text-emerald-400 border-r border-slate-700 pr-2 mr-2">{hoveredCountry.name}</span>
              {hoveredCountry.value}
            </div>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 italic">
              Hover over colored geographical surfaces for tracking indicators
            </div>
          )}
        </div>


        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setViewMode('total')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
              viewMode === 'total'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Total National Footprint
          </button>
          <button
            onClick={() => setViewMode('per_capita')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
              viewMode === 'per_capita'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Per Capita Rate
          </button>
        </div>

        <Suspense fallback={<MapLoadingFallback />}>
          <InteractiveMap
            data={data}
            viewMode={viewMode}
            hoveredCountry={hoveredCountry}
            setHoveredCountry={setHoveredCountry}
          />
        </Suspense>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <th className="p-3 text-center w-16">Rank</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-right">Fossil CO2 Emissions <span className="text-xs font-normal text-slate-400">(tons)</span></th>
              <th className="p-3 text-right">Annual Shift</th>
              <th className="p-3 text-right">Per Capita Value</th>
              <th className="p-3 text-right">Global Ratio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const change = formatChange(row.one_year_change);
              return (
                <tr
                  key={row.rank || row.country}
                  className="border-b border-slate-100 hover:bg-emerald-50/40 transition-colors odd:bg-slate-50/30 even:bg-white"
                >
                  <td className="p-3 text-center text-slate-400 font-medium">{row.rank}</td>
                  <td className="p-3 font-semibold text-sky-700 hover:underline cursor-pointer">
                    {row.country} {row.code && <span className="text-xs font-normal text-slate-400">({row.code})</span>}
                  </td>
                  <td className="p-3 text-right font-mono font-medium text-slate-700">
                    {row.total.toLocaleString()}
                  </td>
                  <td className={`p-3 text-right font-semibold ${change.isNegative ? 'text-emerald-600' : change.isZero ? 'text-slate-400' : 'text-rose-600'}`}>
                    {change.text}
                  </td>
                  <td className="p-3 text-right font-mono text-slate-600">
                    {row.per_capita.toFixed(2)}
                  </td>
                  <td className="p-3 text-right text-slate-500 font-medium">
                    {row.share || '0%'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const WorldMap = () => (
  <Suspense fallback={<div className="p-6 text-sm text-slate-400">Loading emissions infrastructure registry…</div>}>
    <WorldMapContent />
  </Suspense>
);

export default WorldMap;