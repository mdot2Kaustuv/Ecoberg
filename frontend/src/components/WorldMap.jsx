import React, { useEffect, useState } from 'react';
import { ComposedChart } from 'recharts'; 
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('total'); 

  useEffect(() => {
    fetch('http://127.0.0.1:8000/news/scraper/') 
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading emissions data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600 font-sans">Loading emissions data and maps...</div>;
  }

  const maxValue = Math.max(...data.map(d => d[viewMode] || 1));


  const colorScale = scaleLinear()
    .domain([0, maxValue])
    .range(["#e3f4e1", "#236e3e"]);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans bg-white text-[#333333]">
      <h2 className="text-2xl font-bold border-b-2 border-[#00a65a] pb-2 mb-4 text-[#222222]">
        Greenhouse Gas Emissions by Country
      </h2>

      {/* --- MAP SECTION --- */}
      <div className="bg-white p-4 border border-gray-200 rounded shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
          <span className="inline-block">🗺️</span>
          <span>Show Map</span>
        </div>

        {/* Toggle Controls matching Worldometers UI */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('total')}
            className={`px-4 py-1.5 text-sm font-semibold rounded border transition-all duration-150 ${
              viewMode === 'total'
                ? 'bg-[#f4fce3] border-[#a0db75] text-[#2b540f] shadow-sm'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Total Emissions
          </button>
          <button
            onClick={() => setViewMode('per_capita')}
            className={`px-4 py-1.5 text-sm font-semibold rounded border transition-all duration-150 ${
              viewMode === 'per_capita'
                ? 'bg-[#f4fce3] border-[#a0db75] text-[#2b540f] shadow-sm'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Per Capita
          </button>
        </div>

        {/* The World Map */}
        <div className="bg-white max-h-[400px] overflow-hidden flex flex-col items-center justify-center">
          <ComposableMap projectionConfig={{ scale: 140, center: [0, 20] }} width={800} height={400} className="w-full h-auto">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // Match map country ISO code with our scraped code data (USA, CHN, etc.)
                  const countryData = data.find(d => d.code === geo.properties.ISO_A3);
                  const value = countryData ? countryData[viewMode] : 0;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={value ? colorScale(value) : "#f0f0f0"} // Default soft grey for no data
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#ffffcc", outline: "none", cursor: "pointer" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          {/* Color Scale Legend Slider */}
          <div className="w-full max-w-md flex items-center justify-between text-xs font-mono text-gray-600 mt-2 px-4">
            <span>0</span>
            <div className="flex-1 mx-3 h-3 rounded bg-gradient-to-r from-[#e3f4e1] to-[#236e3e] border border-gray-300"></div>
            <span>{viewMode === 'total' ? maxValue.toLocaleString() : maxValue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="bg-[#f2f2f2] border-b-2 border-gray-300 text-[#555555] font-bold">
              <th className="p-3 text-center w-16">#</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-right">Fossil CO2 Emissions<br/><span className="text-xs font-normal text-gray-500">(tons)</span></th>
              <th className="p-3 text-right">1-Year<br/><span className="text-xs font-normal text-gray-500">Change</span></th>
              <th className="p-3 text-right">CO2 emissions<br/><span className="text-xs font-normal text-gray-500">per capita</span></th>
              <th className="p-3 text-right">World<br/><span className="text-xs font-normal text-gray-500">Share</span></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr 
                key={row.rank} 
                className="border-b border-gray-200 hover:bg-[#ffffcc] transition-colors odd:bg-gray-50 even:bg-white text-sm"
              >
                <td className="p-3 text-center text-gray-500 font-medium">{row.rank}</td>
                <td className="p-3 font-semibold text-[#006699] hover:underline cursor-pointer">
                  {row.country} {row.code && <span className="text-xs font-normal text-gray-400">({row.code})</span>}
                </td>
                <td className="p-3 text-right font-mono font-medium">
                  {row.total.toLocaleString()}
                </td>
                <td className={`p-3 text-right font-medium ${row.change.startsWith('-') ? 'text-green-600' : row.change === '0%' ? 'text-gray-500' : 'text-red-600'}`}>
                  {row.change}
                </td>
                <td className="p-3 text-right font-mono">
                  {row.per_capita.toFixed(2)}
                </td>
                <td className="p-3 text-right text-gray-600">
                  {row.share}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorldMap;