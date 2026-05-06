import Link from "next/link";

export default function IdentityLab() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-12 text-center">
        {/* Badge */}
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-violet-400 border border-violet-800/60 px-4 py-1.5 rounded-full bg-violet-950/40">
          Experimental Suite
        </span>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight font-mono">
            <span className="text-slate-100">Identity</span>
            <span className="text-violet-400">Lab</span>
          </h1>
          <p className="text-slate-500 text-sm tracking-widest uppercase font-mono">
            v0.1 — Select a module
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link
            href="/zodiac"
            className="flex-1 group bg-slate-900 hover:bg-violet-950/60 border border-slate-800 hover:border-violet-700/60 px-6 py-5 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-violet-900/20 active:scale-[0.97]"
          >
            <div className="text-xs text-slate-500 group-hover:text-violet-400 uppercase tracking-[0.2em] font-bold mb-1 transition-colors font-mono">
              Module 01
            </div>
            <div className="text-slate-100 font-bold text-lg tracking-wide">
              Zodiac
            </div>
          </Link>

          <Link
            href="/partner-test"
            className="flex-1 group bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700/60 px-6 py-5 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-emerald-900/20 active:scale-[0.97]"
          >
            <div className="text-xs text-slate-500 group-hover:text-emerald-400 uppercase tracking-[0.2em] font-bold mb-1 transition-colors font-mono">
              Module 02
            </div>
            <div className="text-slate-100 font-bold text-lg tracking-wide">
              Partner Test
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}