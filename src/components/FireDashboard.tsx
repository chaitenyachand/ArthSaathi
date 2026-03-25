import React, { useState } from 'react';
import { api, FireSimulationRequest, FireSimulationResponse } from '../lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const FireDashboard: React.FC = () => {
  const [formData, setFormData] = useState<FireSimulationRequest>({
    current_age: 30,
    target_age: 50,
    current_corpus: 500000,
    target_corpus: 50000000,
    expected_cagr: 0.12,
    inflation_rate: 0.06
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FireSimulationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.simulateFirePath(formData);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to simulate FIRE path. Check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  // Custom tooltips for nice formatting
  const compactFormatter = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val.toFixed(0)}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 font-sans text-slate-200">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
          F.I.R.E Simulator
        </h1>
        <p className="mt-4 text-slate-400 text-lg">
          Achieve Financial Independence. Mathematically compute your exact SIP required.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Controls Panel */}
        <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

          <form onSubmit={handleSimulate} className="space-y-4 relative z-10">
            <div>
              <label className="block text-sm font-semibold text-emerald-400 mb-1">Current Age</label>
              <input type="number" name="current_age" value={formData.current_age} onChange={handleInputChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-400 mb-1">Target Retirement Age</label>
              <input type="number" name="target_age" value={formData.target_age} onChange={handleInputChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-400 mb-1">Current Corpus (₹)</label>
              <input type="number" name="current_corpus" value={formData.current_corpus} onChange={handleInputChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-emerald-400 mb-1">Target Corpus (Today's Value ₹)</label>
              <input type="number" name="target_corpus" value={formData.target_corpus} onChange={handleInputChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-emerald-400 mb-1">CAGR (e.g. 0.12)</label>
                <input type="number" step="0.01" name="expected_cagr" value={formData.expected_cagr} onChange={handleInputChange} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-emerald-400 mb-1">Inflation (e.g. 0.06)</label>
                <input type="number" step="0.01" name="inflation_rate" value={formData.inflation_rate} onChange={handleInputChange} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 mt-6 rounded-xl font-bold tracking-wider transition-all duration-300 ${
                loading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transform hover:-translate-y-1'
              }`}
            >
              {loading ? 'Simulating Engine...' : 'Run Simulation'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 font-medium text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Right Charting & Summary Panel */}
        <div className="lg:col-span-8 flex flex-col space-y-8">
          
          {/* Default state placeholders or Chart Render */}
          {result ? (
            <>
              {/* Massive SIP Summary Card */}
              <div className="bg-gradient-to-br from-emerald-900/40 to-cyan-900/20 border border-emerald-500/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl animate-fade-in-up">
                <div>
                  <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-1">Mathematically Required SIP</h3>
                  <p className="text-slate-300 text-sm">To hit your inflation-adjusted future goal of ₹{compactFormatter(result.summary.future_target_corpus)}</p>
                </div>
                <div className="mt-6 md:mt-0 text-right">
                  <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 drop-shadow-md">
                    ₹{result.summary.required_monthly_sip?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-emerald-400 font-medium ml-2 text-xl">/mo</span>
                </div>
              </div>

              {/* Chart Plotting Area */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[400px] shadow-2xl animate-fade-in-up flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={result.roadmap}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                    <XAxis 
                      dataKey="age" 
                      stroke="#ffffff50" 
                      tick={{ fill: '#ffffff50', fontSize: 12 }} 
                      tickFormatter={(val) => `${val} y/o`}
                      minTickGap={30}
                    />
                    <YAxis 
                      stroke="#ffffff50" 
                      tick={{ fill: '#ffffff50', fontSize: 12 }}
                      tickFormatter={compactFormatter}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
                      labelFormatter={(label) => `Age: ${label} years`}
                    />
                    <Legend iconType="circle" />
                    <Line 
                      type="monotone" 
                      dataKey="total_invested" 
                      name="Capital Invested" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projected_corpus" 
                      name="Compound Corpus" 
                      stroke="#10b981" 
                      strokeWidth={4}
                      dot={false}
                      activeDot={{ r: 8, fill: "#10b981", stroke: "#000", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="flex-grow bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center border-dashed">
              <svg className="w-16 h-16 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              <h3 className="text-xl font-bold text-slate-500 mb-2">Awaiting Simulation Profile</h3>
              <p className="text-slate-600 max-w-sm">
                Enter your current metrics on the left and run the compounding simulator to generate an age-by-age graph of your portfolio's trajectory.
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default FireDashboard;
