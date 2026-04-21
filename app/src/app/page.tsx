'use client'

import { useState } from "react";
import { generateHoroscope } from "./actions";

export default function ZodiacLab() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleForm(formData: FormData) {
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await generateHoroscope(formData);
    
    if (res.success) {
      setResult(res.horoscope);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-mono text-emerald-400 tracking-[0.2em] uppercase">Zodiac_Protocol</h1>
          <div className="h-1 w-24 bg-emerald-900 mx-auto mt-2 rounded-full overflow-hidden">
            {loading && <div className="h-full bg-emerald-400 animate-progress" style={{width: '50%'}} />}
          </div>
        </header>
        
        <form action={handleForm} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Subject Name</label>
            <input name="name" required className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Age</label>
              <input name="age" type="number" required className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg outline-none" />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Sign</label>
              <select name="zodiac" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg outline-none h-[50px]">
                {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] py-4 rounded-xl font-black tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {loading ? "SEQUENCING..." : "INITIATE ANALYSIS"}
          </button>
        </form>

        <div className="mt-8 min-h-[100px]">
          {result && (
            <div className="p-4 bg-emerald-950/20 border-l-2 border-emerald-500 rounded text-sm leading-relaxed text-slate-300 animate-in fade-in duration-700">
              <span className="text-emerald-500 font-bold block mb-1 text-[10px] uppercase">Analysis Complete:</span>
              "{result}"
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-950/20 border-l-2 border-red-500 rounded text-sm text-red-300">
              <span className="font-bold block mb-1 text-[10px] uppercase">System Warning:</span>
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}