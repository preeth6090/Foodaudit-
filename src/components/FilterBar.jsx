const FILTERS = [
  { key: 'all', label: 'All', activeClass: 'bg-slate-900 text-white' },
  { key: 'pending', label: 'Pending', activeClass: 'bg-slate-900 text-white' },
  { key: 'pass', label: 'Passed', activeClass: 'bg-slate-900 text-white' },
  { key: 'fail', label: 'Failed', activeClass: 'bg-slate-900 text-white' },
  { key: 'nr', label: 'N/R', activeClass: 'bg-slate-900 text-white' },
]

const INACTIVE_CLASS = {
  all: 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300',
  pending: 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300',
  pass: 'bg-white text-emerald-700 hover:bg-emerald-50 border border-slate-300',
  fail: 'bg-white text-rose-700 hover:bg-rose-50 border border-slate-300',
  nr: 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-300',
}

export default function FilterBar({ filter, search, total, editMode, onFilterChange, onSearchChange, onToggleEditMode }) {
  return (
    <div className="no-print mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-600">Quick Filter:</span>
        {FILTERS.map(({ key, label, activeClass }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
              filter === key ? activeClass : INACTIVE_CLASS[key]
            }`}
          >
            {key === 'all' ? `${label} (${total})` : label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search parameters..."
            className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="button"
          onClick={onToggleEditMode}
          title="Add or remove checklist questions"
          className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-lg border transition ${
            editMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-200'
          }`}
        >
          {editMode ? 'Done Editing' : 'Edit Questions'}
        </button>
      </div>
    </div>
  )
}
