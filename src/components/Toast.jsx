export default function Toast({ toast }) {
  const visible = Boolean(toast)
  return (
    <div
      className={`no-print fixed bottom-5 right-5 z-50 transform transition-all duration-300 pointer-events-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs">
        <span>{toast?.icon ?? 'ℹ️'}</span>
        <span className="font-medium">{toast?.message ?? 'Action completed'}</span>
      </div>
    </div>
  )
}
