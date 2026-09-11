const VERDICT_BADGE = {
  pending: (pending) => ({
    className: 'ml-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30',
    label: `${pending} Pending`,
  }),
  pass: () => ({
    className: 'ml-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white shadow',
    label: 'PASS',
  }),
  fail: () => ({
    className: 'ml-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow',
    label: 'FAIL',
  }),
}

export default function Header({
  title,
  docNo,
  isDraftDoc,
  passingBenchmark,
  scores,
  savedCount,
  authUser,
  onPassAll,
  onSave,
  onGenerateReport,
  onPrint,
  onReset,
  onOpenSettings,
  onOpenSavedDocs,
  onOpenAuth,
}) {
  const badge = VERDICT_BADGE[scores.verdict](scores.pending)

  return (
    <header className="no-print sticky top-0 z-40 bg-slate-900 text-white shadow-lg backdrop-blur-md bg-opacity-95 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center font-bold text-white shadow shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide">{title}</h1>
            <p className="text-xs text-slate-400">
              Doc No: {docNo}
              {isDraftDoc && <span className="text-slate-500"> (unsaved)</span>} &bull; Passing Benchmark: {passingBenchmark}%
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            title="Audit settings: title, doc number series, passing benchmark"
            className="ml-1 text-slate-400 hover:text-white transition rounded-lg p-1.5 hover:bg-slate-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onOpenAuth}
            title={authUser ? `Signed in as ${authUser.email}` : 'Auditor sign-in'}
            className="ml-0.5 flex items-center gap-1.5 text-slate-400 hover:text-white transition rounded-lg px-1.5 py-1.5 hover:bg-slate-800"
          >
            {authUser ? (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                {authUser.email[0].toUpperCase()}
              </span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </button>
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
            <span className="text-[10px] uppercase font-bold text-slate-400 block">N/R</span>
            <span className="text-sm font-extrabold text-slate-300">{scores.notRelevant}</span>
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

        <div className="flex items-center gap-2 flex-wrap">
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
            onClick={onSave}
            title="Save this audit as a document"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-6 0V3h6v4m-6 0h6" />
            </svg>
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            type="button"
            onClick={onGenerateReport}
            disabled={isDraftDoc}
            title={isDraftDoc ? 'Save this audit first to generate a report' : 'Generate corrective action report'}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all shadow flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden md:inline">Report</span>
          </button>
          <button
            type="button"
            onClick={onOpenSavedDocs}
            title="Browse saved documents"
            className="relative bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="hidden md:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 bg-sky-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="hidden lg:inline">Print / PDF</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold px-2.5 py-2 rounded-lg transition-all"
            title="Clear all selections and start a new audit"
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
