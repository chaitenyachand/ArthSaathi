import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api, PortfolioRebalanceResponse } from '../lib/api';

const PortfolioXRay: React.FC = () => {
  const [loadingFile, setLoadingFile] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [transactionsCount, setTransactionsCount] = useState<number | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [loadingClaude, setLoadingClaude] = useState(false);
  const [aiRebalancePlan, setAiRebalancePlan] = useState<PortfolioRebalanceResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Math Metrics state holding mock metrics or real metrics retrieved post-parsing
  const [metrics, setMetrics] = useState({
    xirr: 15.2,
    expense_drag: 1.15,
    overlap_summary: '73% overlap across 3 large-cap funds detected.'
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFileName(file.name);
      setLoadingFile(true);
      setParseError(null);
      setTransactionsCount(null);
      setAiRebalancePlan(null); // Reset AI plan if new file

      try {
        const response = await api.parseCamsStatement(file);
        setTransactionsCount(response.total_transactions);
      } catch (err: any) {
        setParseError(err.message || 'Failed to parse CAMS statement.');
      } finally {
        setLoadingFile(false);
      }
    } else {
      setParseError('Please strict upload a valid CAMS PDF statement.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const triggerClaudeAdvisory = async () => {
    setLoadingClaude(true);
    setAiError(null);

    try {
      const response = await api.generateRebalancePlan({
        xirr: metrics.xirr,
        overlap_data: { summary: metrics.overlap_summary },
        expense_drag: metrics.expense_drag
      });
      setAiRebalancePlan(response);
    } catch (err: any) {
      setAiError(err.message || 'Failed to communicate with Claude AI Engine.');
    } finally {
      setLoadingClaude(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 font-sans text-slate-200">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 tracking-tight">
          Portfolio X-Ray
        </h1>
        <p className="mt-5 text-slate-400 text-lg max-w-2xl mx-auto">
          Upload your CAMS Mutual Fund statement to detect hidden overlaps, evaluate mathematical XIRR constraints, and secure a SEBI-grade AI rebalancing plan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Dropzone & Metrics Panel */}
        <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative flex flex-col">
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none"></div>

          <h3 className="text-xl font-bold text-orange-300 mb-4 z-10 relative">System Extraction</h3>
          
          {/* React Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 mb-6 text-center cursor-pointer transition-all duration-300 z-10 relative ${
              isDragActive
                ? 'border-pink-500 bg-pink-500/10'
                : 'border-white/20 hover:border-pink-400 hover:bg-slate-800/50'
            }`}
          >
            <input {...getInputProps()} />
            <svg className="mx-auto h-12 w-12 text-pink-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            {loadingFile ? (
              <p className="text-pink-400 font-bold animate-pulse">Running X-Ray Engine...</p>
            ) : isDragActive ? (
              <p className="text-pink-300 font-bold">Release to process statement...</p>
            ) : uploadedFileName ? (
              <p className="text-orange-400 font-bold">{uploadedFileName}</p>
            ) : (
              <p className="text-slate-400 text-sm">Drag & drop your CAMS PDF statement here, or click to upload</p>
            )}
          </div>

          {parseError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl z-10 relative">
              <p className="text-red-400 font-medium text-sm text-center">{parseError}</p>
            </div>
          )}

          {transactionsCount !== null && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between z-10 relative">
              <span className="text-emerald-400 font-bold">Transactions Extracted:</span>
              <span className="text-2xl font-black text-white">{transactionsCount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex-grow"></div>
          
          {/* Post-Upload Extracted Metrics */}
          <div className="bg-black/30 border border-white/5 rounded-2xl p-5 z-10 relative">
             <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider mb-4">Under-the-hood Metrics</h4>
             
             <div className="flex justify-between items-center mb-3">
               <span className="text-sm font-medium text-slate-400">Projected Portfolio XIRR</span>
               <span className="font-bold text-emerald-400">{metrics.xirr}%</span>
             </div>
             
             <div className="flex justify-between items-center mb-3">
               <span className="text-sm font-medium text-slate-400">Expense Ratio Drag</span>
               <span className="font-bold text-red-400">{metrics.expense_drag}%</span>
             </div>
             
             <div className="mt-4 pt-4 border-t border-white/5">
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detected Collision</span>
                <p className="text-sm text-orange-200">{metrics.overlap_summary}</p>
             </div>
          </div>
        </div>

        {/* Right Output: Claude AI Advisory */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/30 border border-indigo-500/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex-grow flex flex-col items-center justify-center relative overflow-hidden">
             
            {!aiRebalancePlan && !loadingClaude ? (
              <div className="text-center z-10">
                <svg className="w-16 h-16 text-indigo-400/50 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <h3 className="text-2xl font-extrabold text-indigo-300 mb-3">Claude AI Rebalancing Brain</h3>
                <p className="text-slate-400 max-w-sm mx-auto mb-8">
                  Merge the calculated metrics into our Anthropic engine to generate a SEBI-level, plain-English structural pivot plan.
                </p>
                <button
                  onClick={triggerClaudeAdvisory}
                  disabled={loadingFile}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 border border-indigo-400 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-1"
                >
                  Generate Financial Action Plan
                </button>
              </div>
            ) : loadingClaude ? (
               <div className="text-center z-10 flex flex-col items-center">
                 <svg className="animate-spin h-12 w-12 text-indigo-400 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <h3 className="text-xl font-bold text-indigo-300 animate-pulse">Claude is crunching the metrics...</h3>
               </div>
            ) : aiRebalancePlan ? (
               <div className="w-full text-left z-10 animate-fade-in-up">
                 <div className="flex items-center space-x-3 mb-6 border-b border-indigo-500/20 pb-4">
                   <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
                   <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
                     Strategic Rebalancing Protocol
                   </h3>
                 </div>
                 
                 <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed font-medium">
                   {/* Split the plain text into paragraphs for cleaner rendering */}
                   {aiRebalancePlan.rebalancing_plan_text.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4">{paragraph}</p>
                   ))}
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                    <button onClick={() => setAiRebalancePlan(null)} className="text-sm text-indigo-400 hover:text-white transition-colors">
                      Restart Analysis Session
                    </button>
                 </div>
               </div>
            ) : null}

            {aiError && (
              <div className="absolute bottom-6 w-full px-8">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                  <p className="text-red-400 font-bold text-sm tracking-wide">{aiError}</p>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioXRay;