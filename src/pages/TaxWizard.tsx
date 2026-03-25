import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api, TaxInputRequest, TaxComparisonResponse } from '../lib/api';

const TaxWizard: React.FC = () => {
  const [formData, setFormData] = useState<TaxInputRequest>({
    base_salary: 0,
    hra: 0,
    home_loan: 0,
    parent_health: 0,
    nps: 0,
    basic_80c: 0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaxComparisonResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await api.uploadForm16(file);
        setResult(response);
      } catch (err: any) {
        setError(err.message || 'Failed to analyze Form 16 PDF.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please strict upload a valid PDF Form 16 file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.base_salary <= 0) {
      setError('Base Salary must strictly be greater than zero.');
      return;
    }

    setLoading(true);
    setUploadedFile(null);
    setError(null);
    setResult(null);

    try {
      const response = await api.compareTax(formData);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Failed to compare manual tax data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 font-sans text-slate-200">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 tracking-tight">
          Tax Computation Wizard
        </h1>
        <p className="mt-4 text-slate-400 text-lg">
          Upload Form 16 for auto-extraction, or manually declare 80C allocations to discover your mathematically optimal tax regime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel: Drag Drop & Overrides */}
        <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative">
          {/* Drag & Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 mb-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-white/20 hover:border-indigo-400 hover:bg-slate-800/50'
            }`}
          >
            <input {...getInputProps()} />
            <svg className="mx-auto h-12 w-12 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            {isDragActive ? (
              <p className="text-indigo-300 font-bold">Drop the Form 16 PDF here ...</p>
            ) : uploadedFile ? (
              <p className="text-emerald-400 font-medium">{uploadedFile.name}</p>
            ) : (
              <p className="text-slate-400">Drag & drop Form 16 PDF here, or click to upload</p>
            )}
          </div>

          <div className="flex items-center space-x-2 text-slate-500 mb-6">
            <hr className="flex-1 border-slate-700" />
            <span className="text-xs font-bold uppercase tracking-wider">OR ENTER MANUALLY</span>
            <hr className="flex-1 border-slate-700" />
          </div>

          {/* Manual Override Form */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-indigo-300 mb-1">Gross Salary (₹)</label>
              <input type="number" name="base_salary" value={formData.base_salary} onChange={handleInputChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-indigo-300 mb-1">HRA Exception (₹)</label>
                <input type="number" name="hra" value={formData.hra} onChange={handleInputChange} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-300 mb-1">Home Loan / Sec 24 (₹)</label>
                <input type="number" name="home_loan" value={formData.home_loan} onChange={handleInputChange} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-indigo-300 mb-1">Sec 80C</label>
                <input type="number" name="basic_80c" value={formData.basic_80c} onChange={handleInputChange} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-300 mb-1">Health (80D)</label>
                <input type="number" name="parent_health" value={formData.parent_health} onChange={handleInputChange} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-300 mb-1">NPS (80CCD)</label>
                <input type="number" name="nps" value={formData.nps} onChange={handleInputChange} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || formData.base_salary === 0}
              className={`w-full py-4 mt-6 rounded-xl font-bold tracking-wider transition-all duration-300 ${
                loading || formData.base_salary === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 transform hover:-translate-y-1'
              }`}
            >
              {loading ? 'Evaluating Slabs...' : 'Compute Tax Engine'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 font-medium text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Right Output: Side-by-Side Comparison */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Savings Announcement Card */}
              <div className="bg-emerald-950/30 border border-emerald-500/50 rounded-3xl p-8 text-center shadow-[0_0_40px_rgba(16,185,129,0.15)] transform transition-transform hover:scale-[1.02]">
                <h3 className="text-emerald-400 font-bold uppercase tracking-widest mb-2">Optimal Tax Strategy</h3>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Go with the <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">{result.recommended_regime}</span>
                </h2>
                
                {result.mathematical_tax_savings > 0 ? (
                  <p className="text-slate-300 text-lg">
                    You mathematically save{' '}
                    <span className="text-emerald-400 font-black text-2xl animate-pulse inline-block">
                      ₹{result.mathematical_tax_savings.toLocaleString('en-IN')}
                    </span>{' '}
                    in payable taxes.
                  </p>
                ) : (
                  <p className="text-slate-300 text-lg">
                    Both regimes yield identically mathematically equivalent tax burdens.
                  </p>
                )}
                
                {result.extracted_tds !== undefined && (
                  <p className="mt-4 text-xs text-indigo-300">
                    *TDS Extracted via Parser: ₹{result.extracted_tds.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* OLD Regime Card */}
                <div className={`p-6 rounded-3xl text-center border-2 transition-colors ${
                  result.recommended_regime === "Old Regime" ? "bg-indigo-900/40 border-indigo-500 shadow-lg shadow-indigo-500/20" : "bg-slate-900/40 border-white/5"
                }`}>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Old Tax Regime</h4>
                  <div className="text-4xl font-black text-slate-100 mb-2">
                    ₹{result.old_regime_tax.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-slate-500">Total Liability (incl Cess)</p>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 text-left space-y-2">
                    {Object.entries(result.deductions_used).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs text-slate-400">
                        <span>{key.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-slate-300">₹{(value as number).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NEW Regime Card */}
                <div className={`p-6 rounded-3xl text-center border-2 transition-colors ${
                  result.recommended_regime === "New Regime" ? "bg-indigo-900/40 border-indigo-500 shadow-lg shadow-indigo-500/20" : "bg-slate-900/40 border-white/5"
                }`}>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">New Tax Regime</h4>
                  <div className="text-4xl font-black text-slate-100 mb-2">
                    ₹{result.new_regime_tax.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-slate-500">Total Liability (incl Cess)</p>
                  
                  <div className="mt-6 pt-6 border-t border-white/5 text-left space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Standard Deduction</span>
                      <span className="font-medium text-slate-300">₹75,000</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Exemptions Allowed</span>
                      <span className="font-medium text-red-400 italic">None</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex-grow bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center border-dashed">
              <svg className="w-16 h-16 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <h3 className="text-xl font-bold text-slate-500 mb-2">Awaiting Tax Matrix</h3>
              <p className="text-slate-600 max-w-sm">
                Upload your Form 16 PDF or enter manual parameters. The engine will instantly render a side-by-side Old vs New regime structural evaluation.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default TaxWizard;