const VERDICT_BADGE = {
  pending: (pending) => ({
    className: 'ml-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30',
    label: `${pending} Pending`,
  }),
  pass: () => ({
    className: 'ml-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white shadow',
    label: 'PASS (>= 80%)',
  }),
  fail: () => ({
    className: 'ml-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow',
    label: 'FAIL (< 80%)',
  }),
}

export default function Header({ scores, onPassAll, onDemoFill, onPrint, onReset }) {
  const badge = VERDICT_BADGE[scores.verdict](scores.pending)

  return (
    <header className="no-print sticky top-0 z-40 bg-slate-900 text-white shadow-lg backdrop-blur-md bg-opacity-95 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white shadow">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide">Kitchen Audit Inspector</h1>
            <p className="text-xs text-slate-400">Doc No: ASPL/IM5P34/F-08 &bull; Passing Benchmark: 80%</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Items</span>
            <span className="text-sm font-extrabold text-white">{scores.total}</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-700" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Passed</span>
            <span className="text-sm font-extrabold text-emerald-400">{scores.passed}</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-700" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-rose-400 block">Failed</span>
            <span className="text-sm font-extrabold text-rose-400">{scores.failed}</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-700" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">Unchecked</span>
            <span className="text-sm font-extrabold text-amber-300">{scores.pending}</span>
          </div>
          <div className="h-7 w-[1px] bg-slate-700" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Score</span>
            <span className="text-base font-black text-white">{scores.pct}%</span>
          </div>
          <div className={badge.className}>{badge.label}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPassAll}
            title="Mark all unchecked items as Pass"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="hidden sm:inline">Pass All</span>
          </button>
          <button
            type="button"
            onClick={onDemoFill}
            title="Populate standard inspection data"
            className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="hidden md:inline">Demo Fill</span>
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print / PDF</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold px-2.5 py-2 rounded-lg transition-all"
            title="Clear all selections"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full bg-slate-800 h-1.5">
        <div
          className="bg-gradient-to-r from-sky-500 to-emerald-500 h-1.5 transition-all duration-300"
          style={{ width: `${scores.evaluatedPct}%` }}
        />
      </div>
    </header>
  )
}
