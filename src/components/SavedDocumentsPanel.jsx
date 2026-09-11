import { useMemo, useState } from 'react'
import Modal from './Modal.jsx'

const VERDICT_STYLE = {
  pass: 'bg-emerald-100 text-emerald-700',
  fail: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
}

const VERDICT_LABEL = {
  pass: 'PASS',
  fail: 'FAIL',
  pending: 'PENDING',
}

export default function SavedDocumentsPanel({ open, onClose, documents, onLoad, onDelete, onReport }) {
  const [outletFilter, setOutletFilter] = useState('all')

  const outlets = useMemo(() => {
    const names = new Set(documents.map((d) => d.meta.outlet || 'Untitled outlet'))
    return Array.from(names).sort()
  }, [documents])

  const filtered =
    outletFilter === 'all' ? documents : documents.filter((d) => (d.meta.outlet || 'Untitled outlet') === outletFilter)

  return (
    <Modal open={open} onClose={onClose} title={`Saved Documents (${documents.length})`} wide>
      {documents.length === 0 ? (
        <p className="text-xs text-slate-500 py-6 text-center">
          No documents saved yet. Use "Save" in the toolbar to record a finished audit here.
        </p>
      ) : (
        <>
          {outlets.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap mb-3 pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 shrink-0">Hotel / Outlet:</span>
              <button
                type="button"
                onClick={() => setOutletFilter('all')}
                className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                  outletFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              {outlets.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setOutletFilter(name)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                    outletFilter === name
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {filtered.map((doc) => (
              <div
                key={doc.docNo}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs">{doc.docNo}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${VERDICT_STYLE[doc.scores.verdict]}`}>
                      {VERDICT_LABEL[doc.scores.verdict]} &bull; {doc.scores.pct}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">{doc.meta.outlet || 'Untitled outlet'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Audit date {doc.meta.date || '—'} &bull; Saved {new Date(doc.savedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onReport(doc)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition"
                  >
                    Report
                  </button>
                  <button
                    type="button"
                    onClick={() => onLoad(doc)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete saved document ${doc.docNo}? This cannot be undone.`)) {
                        onDelete(doc.docNo)
                      }
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-rose-50 hover:text-rose-700 text-slate-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  )
}
