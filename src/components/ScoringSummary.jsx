const VERDICT_TAG = {
  pending: (pct) => ({
    className: 'mt-1 font-black text-sm uppercase px-4 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200',
    label: `[ ] IN PROGRESS (${pct}%)`,
  }),
  pass: () => ({
    className: 'mt-1 font-black text-sm uppercase px-4 py-0.5 rounded-full bg-emerald-600 text-white',
    label: '✓ AUDIT PASSED',
  }),
  fail: () => ({
    className: 'mt-1 font-black text-sm uppercase px-4 py-0.5 rounded-full bg-rose-600 text-white',
    label: '✗ AUDIT FAILED (ACTION REQ.)',
  }),
}

export default function ScoringSummary({ scores }) {
  const tag = VERDICT_TAG[scores.verdict](scores.pct)

  return (
    <section className="mt-6 border-2 border-slate-300 rounded-xl overflow-hidden print:rounded-none print:border-slate-700 print:mt-4">
      <div className="bg-slate-100 px-4 py-2 font-bold text-xs uppercase tracking-wider border-b border-slate-300 flex justify-between items-center print:bg-slate-200">
        <span>Official Audit Scoring Summary</span>
        <span className="text-[11px] font-normal text-slate-500 lowercase print:hidden">Auto-calculated based on evaluation</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-200 text-xs">
        <div className="p-3 text-center bg-white">
          <span className="text-slate-500 font-semibold block text-[11px]">Total Passed</span>
          <span className="text-base font-black text-emerald-600">{scores.passed}</span>
        </div>
        <div className="p-3 text-center bg-white">
          <span className="text-slate-500 font-semibold block text-[11px]">Total Failed</span>
          <span className="text-base font-black text-rose-600">{scores.failed}</span>
        </div>
        <div className="p-3 text-center bg-white">
          <span className="text-slate-500 font-semibold block text-[11px]">Pending Items</span>
          <span className="text-base font-bold text-amber-500">{scores.pending}</span>
        </div>
        <div className="p-3 text-center bg-white">
          <span className="text-slate-500 font-semibold block text-[11px]">Percentage Score</span>
          <span className="text-base font-black text-sky-700">{scores.pct}%</span>
        </div>
        <div className="p-3 text-center bg-white col-span-2 flex flex-col justify-center items-center">
          <span className="text-slate-500 font-semibold block text-[11px]">Audit Verdict</span>
          <div className={tag.className}>{tag.label}</div>
        </div>
      </div>
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 italic">
        * Note: If the final score is below <strong>80%</strong>, immediate corrective action review with the Store Area / Business Manager is mandatory within 24 hours.
      </div>
    </section>
  )
}
