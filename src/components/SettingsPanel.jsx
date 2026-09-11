import Modal from './Modal.jsx'

export default function SettingsPanel({ open, onClose, settings, onUpdate, nextDocNo }) {
  return (
    <Modal open={open} onClose={onClose} title="Audit Settings">
      <div className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Inspector / Organization Title</label>
          <input
            type="text"
            value={settings.orgTitle}
            onChange={(e) => onUpdate({ orgTitle: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Document Number Series (prefix)</label>
          <input
            type="text"
            value={settings.docSeriesPrefix}
            onChange={(e) => onUpdate({ docSeriesPrefix: e.target.value })}
            placeholder="e.g., ASPL/IM5P34/F-"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Next Document Number</label>
          <input
            type="number"
            min="1"
            value={settings.docNextNumber}
            onChange={(e) => onUpdate({ docNextNumber: Math.max(1, Number(e.target.value) || 1) })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Auto-generated for the next saved document: <strong className="text-slate-700">{nextDocNo}</strong>. It advances
            automatically each time a document is saved.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Passing Benchmark (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings.passingBenchmark}
            onChange={(e) => onUpdate({ passingBenchmark: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Audits scoring at or above this percentage are marked PASS once every item is evaluated.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition"
        >
          Done
        </button>
      </div>
    </Modal>
  )
}
