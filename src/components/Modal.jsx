export default function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${
          wide ? 'max-w-2xl' : 'max-w-md'
        } max-h-[85vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h2 className="font-bold text-slate-900 text-sm">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition rounded-lg p-1"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
