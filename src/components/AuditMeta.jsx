const FIELDS = [
  { field: 'outlet', label: 'Outlet Name:', type: 'text', placeholder: 'e.g., Downtown Bistro K-04' },
  { field: 'date', label: 'Audit Date:', type: 'date' },
  { field: 'time', label: 'Audit Time:', type: 'time' },
  { field: 'location', label: 'Location:', type: 'text', placeholder: 'e.g., Food Court, Tower 2' },
  { field: 'auditor', label: 'Auditor Name:', type: 'text', placeholder: 'Auditor full name' },
  { field: 'rep', label: 'Outlet Rep:', type: 'text', placeholder: 'Store Manager / Chef' },
]

export default function AuditMeta({ meta, onChange }) {
  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3 print:gap-1 text-xs">
        {FIELDS.map(({ field, label, type, placeholder }) => (
          <div
            key={field}
            className="flex flex-col sm:flex-row items-stretch border border-slate-300 rounded-lg overflow-hidden print:rounded-none"
          >
            <span className="bg-slate-100 px-3 py-2 font-bold text-slate-700 w-full sm:w-32 flex items-center print:w-28 print:bg-slate-200">
              {label}
            </span>
            <input
              type={type}
              value={meta[field]}
              placeholder={placeholder}
              onChange={(e) => onChange(field, e.target.value)}
              className="w-full px-3 py-2 outline-none font-medium text-slate-900 bg-white"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
