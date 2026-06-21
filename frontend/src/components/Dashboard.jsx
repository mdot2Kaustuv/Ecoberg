import React, { useState } from 'react';
import WorldMap from './WorldMap';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('map');

  const tabs = [
    { id: 'map', label: '🗺️ Emissions Map', },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-xl">🌿</span>
            <span className="font-bold text-slate-800 font-display tracking-tight text-lg">
              EcoBerg <span className="text-slate-400 font-normal text-sm">Dashboard</span>
            </span>
          </div>


          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Climate <span className="text-emerald-600">Intelligence</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time greenhouse gas emissions data — updated from Worldometers
          </p>
        </div>

        {activeTab === 'map' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <WorldMap />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;