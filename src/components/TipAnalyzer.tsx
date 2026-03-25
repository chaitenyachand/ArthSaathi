import React, { useState } from 'react';
import { api, TipAnalysisResponse } from '../lib/api';

const TipAnalyzer: React.FC = () => {
  const [tipText, setTipText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TipAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!tipText.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.analyzeTip({ raw_tip: tipText });
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Failed to connect to the AI brain. Please check your network or FASTAPI server.");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (grade: string) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
      case 'B': return 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]';
      case 'C': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
      case 'D': return 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]';
      case 'F': return 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 relative font-sans">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
      
      {/* Advanced Glassmorphic Container */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative corner light */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
          WhatsApp Tip Analyzer
        </h2>
        <p className="text-slate-400 mb-8 font-medium">
          Paste that unsolicited WhatsApp or Telegram forward to check it against SEBI-style forensic parameters. Let our AI uncover the truth.
        </p>

        <div className="mb-6 relative group">
          <textarea
            className="w-full h-44 bg-black/40 border border-white/10 rounded-2xl p-5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition duration-300 resize-none z-10 relative shadow-inner"
            placeholder="e.g. 'GUARANTEED 200% returns in Suzlon in 1 month! Buy now before operators lock the circuit upper limits...'"
            value={tipText}
            onChange={(e) => setTipText(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !tipText.trim()}
          className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 ${
            loading || !tipText.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-1 border border-indigo-500/50'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Forensic Analysis Running...</span>
            </>
          ) : (
            <span>Analyze Logic</span>
          )}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-red-400 font-medium text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 bg-black/40 border border-white/10 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
            <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-slate-200">Analysis Verdict</h3>
              <div className={`px-5 py-1.5 rounded-full border text-lg font-black tracking-widest ${getBadgeColor(result.grade)}`}>
                GRADE: {result.grade}
              </div>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-6 font-medium text-[15px]">
              {result.analysis}
            </p>

            {result.red_flags && result.red_flags.length > 0 && (
              <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/30">
                <h4 className="text-sm uppercase tracking-wider text-red-400 font-bold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  Detected Red Flags
                </h4>
                <ul className="space-y-2.5">
                  {result.red_flags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-3 bg-red-500/10 p-3 rounded-lg border border-red-500/20 transition hover:bg-red-500/15">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                      <span className="text-red-200/90 font-medium text-sm">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {(!result.red_flags || result.red_flags.length === 0) && result.grade !== 'F' && (
               <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
                  <p className="text-emerald-400 font-medium text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    No immediate red flags detected. Still, exercise caution!
                  </p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TipAnalyzer;
