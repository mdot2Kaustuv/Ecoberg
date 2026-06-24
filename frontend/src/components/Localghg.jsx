import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmissionsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/news/localscraper/');
        const responseData = Array.isArray(response.data) ? response.data : [response.data];
        setData(responseData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 bg-[#00d084] rounded-full animate-bounce"></div>
          <p className="text-gray-500 font-medium">Loading footprint data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
        <p className="text-red-700 font-medium">Failed to load data: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 font-sans">
      {/* Table Card Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Card Header matching Ecoberg styling */}
        <div className="bg-[#054335] px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-wide">
            Emissions Breakdown
          </h2>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[#054335] text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Year</th>
                <th className="py-4 px-6 font-bold">Total GHG</th>
                <th className="py-4 px-6 font-bold">CO₂</th>
                <th className="py-4 px-6 font-bold">CH₄</th>
                <th className="py-4 px-6 font-bold">NO₂</th>
                <th className="py-4 px-6 font-bold">Per Capita</th>
                <th className="py-4 px-6 font-bold">Change</th>
                <th className="py-4 px-6 font-bold">Global Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600 text-sm">
              {data.map((item, index) => (
                <tr 
                  key={item.year || index} 
                  className="hover:bg-[#00d084]/5 transition-colors duration-200 group"
                >
                  <td className="py-4 px-6 font-bold text-[#054335] group-hover:text-[#00d084] transition-colors">
                    {item.year}
                  </td>
                  <td className="py-4 px-6 font-medium">{item.ghg?.toLocaleString()}</td>
                  <td className="py-4 px-6">{item.co2?.toLocaleString()}</td>
                  <td className="py-4 px-6">{item.ch4?.toLocaleString()}</td>
                  <td className="py-4 px-6">{item.n02?.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium">
                      {item.per_capita}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-semibold ${item.change > 0 ? 'text-red-500' : item.change < 0 ? 'text-[#00d084]' : 'text-gray-400'}`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </td>
                  <td className="py-4 px-6">{item.global_share}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmissionsTable;