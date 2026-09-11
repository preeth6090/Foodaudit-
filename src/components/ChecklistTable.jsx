import { Fragment } from 'react'
import { AUDIT_SECTIONS } from '../data/auditSections.js'

function statusBtnClass(active, variant) {
  const base = 'status-btn px-2.5 py-1 rounded text-[11px] font-bold border transition'
  if (active) {
    return variant === 'P'
      ? `${base} bg-emerald-600 text-white border-emerald-600 shadow-sm`
      : `${base} bg-rose-600 text-white border-rose-600 shadow-sm`
  }
  return variant === 'P'
    ? `${base} bg-white text-slate-700 border-slate-300 hover:bg-emerald-50 hover:text-emerald-700`
    : `${base} bg-white text-slate-700 border-slate-300 hover:bg-rose-50 hover:text-rose-700`
}

function ItemRow({ item, state, visible, onToggleStatus, onObsChange }) {
  return (
    <tr
      className={`item-row hover:bg-slate-50 transition border-b border-slate-200 ${state.status === 'F' ? 'bg-rose-50/60' : ''}`}
      style={{ display: visible ? undefined : 'none' }}
    >
      <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">{item.id}</td>
      <td className="py-2.5 px-4 font-medium text-slate-800 leading-snug border-r border-slate-200">
        <span className="param-text">{item.text}</span>
      </td>
      <td className="py-1 px-2 border-r border-slate-200">
        <input
          type="text"
          value={state.obs}
          onChange={(e) => onObsChange(item.id, e.target.value)}
          placeholder="Observation / action notes..."
          className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:ring-1 focus:ring-sky-500 focus:outline-none print:border-none print:bg-transparent print:p-0"
        />
      </td>
      <td className="py-1 px-2 text-center align-middle">
        <div className="flex items-center justify-center gap-1.5 no-print">
          <button
            type="button"
            onClick={() => onToggleStatus(item.id, 'P')}
            title="Pass"
            className={statusBtnClass(state.status === 'P', 'P')}
          >
            P
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(item.id, 'F')}
            title="Fail"
            className={statusBtnClass(state.status === 'F', 'F')}
          >
            F
          </button>
        </div>

        <div className="print-only text-center font-bold text-[10px]">
          <span style={{ display: 'inline-block', marginRight: 6 }}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                border: '1px solid #333',
                verticalAlign: 'middle',
                lineHeight: '9px',
                textAlign: 'center',
              }}
            >
              {state.status === 'P' ? '✓' : ''}
            </span>{' '}
            P
          </span>
          <span style={{ display: 'inline-block' }}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                border: '1px solid #333',
                verticalAlign: 'middle',
                lineHeight: '9px',
                textAlign: 'center',
              }}
            >
              {state.status === 'F' ? '✗' : ''}
            </span>{' '}
            F
          </span>
        </div>
      </td>
    </tr>
  )
}

function isRowVisible(item, state, filter, search) {
  let matchesStatus = true
  if (filter === 'pass') matchesStatus = state.status === 'P'
  else if (filter === 'fail') matchesStatus = state.status === 'F'
  else if (filter === 'pending') matchesStatus = state.status === null

  const matchesSearch =
    item.text.toLowerCase().includes(search) || state.obs.toLowerCase().includes(search)

  return matchesStatus && matchesSearch
}

export default function ChecklistTable({ items, filter, search, onToggleStatus, onObsChange }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-300 print:border-none">
      <table className="checklist-table w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white print:bg-slate-200 print:text-black font-bold uppercase tracking-wider">
            <th className="py-2.5 px-3 w-[6%] text-center border-r border-slate-700 print:border-slate-400">Sl.</th>
            <th className="py-2.5 px-4 w-[54%] border-r border-slate-700 print:border-slate-400">
              Audit Parameter / Standard Requirement
            </th>
            <th className="py-2.5 px-3 w-[26%] border-r border-slate-700 print:border-slate-400">
              Observations / Findings
            </th>
            <th className="py-2.5 px-2 w-[14%] text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {AUDIT_SECTIONS.map((section) => (
            <Fragment key={section.id}>
              <tr
                className={`section-row bg-slate-100 print:bg-slate-200 border-t-2 border-slate-300 ${
                  section.pageBreakBefore ? 'print:break-before-page' : ''
                }`}
              >
                <td colSpan={4} className="py-2 px-3 font-bold text-slate-800 uppercase tracking-wide text-xs">
                  {section.title}
                </td>
              </tr>
              {section.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  state={items[item.id]}
                  visible={isRowVisible(item, items[item.id], filter, search)}
                  onToggleStatus={onToggleStatus}
                  onObsChange={onObsChange}
                />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
