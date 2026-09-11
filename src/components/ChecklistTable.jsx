import { Fragment, useRef, useState } from 'react'
import { readAndCompressImage } from '../utils/image.js'

const STATUS_STYLE = {
  P: { active: 'bg-emerald-600 text-white border-emerald-600 shadow-sm', hover: 'hover:bg-emerald-50 hover:text-emerald-700' },
  F: { active: 'bg-rose-600 text-white border-rose-600 shadow-sm', hover: 'hover:bg-rose-50 hover:text-rose-700' },
  NR: { active: 'bg-slate-500 text-white border-slate-500 shadow-sm', hover: 'hover:bg-slate-100 hover:text-slate-700' },
}

function statusBtnClass(active, variant) {
  const base = 'status-btn px-2 py-1 rounded text-[11px] font-bold border transition'
  const style = STATUS_STYLE[variant]
  return active ? `${base} ${style.active}` : `${base} bg-white text-slate-700 border-slate-300 ${style.hover}`
}

function ProofCell({ itemId, proof, onSetProof, onClearProof }) {
  const fileInputRef = useRef(null)
  const [busy, setBusy] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const dataUrl = await readAndCompressImage(file)
      onSetProof(itemId, dataUrl)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      <div className="no-print flex flex-col items-center gap-1">
        {proof ? (
          <div className="relative group">
            <img src={proof} alt="Evidence" className="w-10 h-10 object-cover rounded border border-slate-300" />
            <button
              type="button"
              onClick={() => onClearProof(itemId)}
              title="Remove photo"
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] leading-4 text-center shadow"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            title="Attach photo proof"
            className="w-8 h-8 rounded border border-dashed border-slate-300 text-slate-400 hover:text-sky-600 hover:border-sky-400 flex items-center justify-center transition"
          >
            {busy ? (
              <span className="text-[9px]">…</span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="print-only text-center">
        {proof ? <img src={proof} alt="Evidence" style={{ maxWidth: 46, maxHeight: 34, display: 'inline-block' }} /> : ''}
      </div>
    </>
  )
}

function ItemRow({ item, sectionId, state, visible, editMode, onToggleStatus, onObsChange, onSetProof, onClearProof, onRemoveItem }) {
  return (
    <tr
      className={`item-row hover:bg-slate-50 transition border-b border-slate-200 ${
        state.status === 'F' ? 'bg-rose-50/60' : state.status === 'NR' ? 'bg-slate-100/70' : ''
      }`}
      style={{ display: visible ? undefined : 'none' }}
    >
      <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">{item.id}</td>
      <td className="py-2.5 px-4 font-medium text-slate-800 leading-snug border-r border-slate-200">
        <div className="flex items-start justify-between gap-2">
          <span className="param-text">{item.text}</span>
          {editMode && (
            <button
              type="button"
              onClick={() => onRemoveItem(sectionId, item.id)}
              title="Remove this question"
              className="no-print shrink-0 text-[10px] font-bold text-rose-600 hover:text-rose-800 border border-rose-200 hover:bg-rose-50 rounded px-1.5 py-0.5"
            >
              Remove
            </button>
          )}
        </div>
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
      <td className="py-1 px-2 border-r border-slate-200 align-middle">
        <ProofCell itemId={item.id} proof={state.proof} onSetProof={onSetProof} onClearProof={onClearProof} />
      </td>
      <td className="py-1 px-2 text-center align-middle">
        <div className="flex items-center justify-center gap-1 no-print">
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
          <button
            type="button"
            onClick={() => onToggleStatus(item.id, 'NR')}
            title="Not Relevant — excluded from the score"
            className={statusBtnClass(state.status === 'NR', 'NR')}
          >
            NR
          </button>
        </div>

        <div className="print-only text-center font-bold text-[10px]">
          {['P', 'F', 'NR'].map((code) => (
            <span key={code} style={{ display: 'inline-block', marginRight: code !== 'NR' ? 5 : 0 }}>
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
                {state.status === code ? '✓' : ''}
              </span>{' '}
              {code}
            </span>
          ))}
        </div>
      </td>
    </tr>
  )
}

function AddItemRow({ sectionId, onAddItem }) {
  const [text, setText] = useState('')

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    onAddItem(sectionId, trimmed)
    setText('')
  }

  return (
    <tr className="no-print bg-sky-50/50">
      <td className="py-2 px-3 border-r border-slate-200"></td>
      <td colSpan={4} className="py-2 px-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
            placeholder="Add a new question to this section..."
            className="flex-1 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={submit}
            className="text-xs font-bold px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white transition shrink-0"
          >
            + Add Question
          </button>
        </div>
      </td>
    </tr>
  )
}

function isRowVisible(item, state, filter, search) {
  let matchesStatus = true
  if (filter === 'pass') matchesStatus = state.status === 'P'
  else if (filter === 'fail') matchesStatus = state.status === 'F'
  else if (filter === 'nr') matchesStatus = state.status === 'NR'
  else if (filter === 'pending') matchesStatus = state.status === null

  const matchesSearch = item.text.toLowerCase().includes(search) || state.obs.toLowerCase().includes(search)

  return matchesStatus && matchesSearch
}

export default function ChecklistTable({
  checklist,
  items,
  filter,
  search,
  editMode,
  onToggleStatus,
  onObsChange,
  onSetProof,
  onClearProof,
  onAddItem,
  onRemoveItem,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-300 print:border-none">
      <table className="checklist-table w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white print:bg-slate-200 print:text-black font-bold uppercase tracking-wider">
            <th className="py-2.5 px-3 w-[5%] text-center border-r border-slate-700 print:border-slate-400">Sl.</th>
            <th className="py-2.5 px-4 w-[38%] border-r border-slate-700 print:border-slate-400">
              Audit Parameter / Standard Requirement
            </th>
            <th className="py-2.5 px-3 w-[20%] border-r border-slate-700 print:border-slate-400">
              Observations / Findings
            </th>
            <th className="py-2.5 px-2 w-[12%] text-center border-r border-slate-700 print:border-slate-400">Proof</th>
            <th className="py-2.5 px-2 w-[25%] text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {checklist.map((section) => (
            <Fragment key={section.id}>
              <tr
                className={`section-row bg-slate-100 print:bg-slate-200 border-t-2 border-slate-300 ${
                  section.pageBreakBefore ? 'print:break-before-page' : ''
                }`}
              >
                <td colSpan={5} className="py-2 px-3 font-bold text-slate-800 uppercase tracking-wide text-xs">
                  {section.title}
                </td>
              </tr>
              {section.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  sectionId={section.id}
                  state={items[item.id]}
                  visible={isRowVisible(item, items[item.id], filter, search)}
                  editMode={editMode}
                  onToggleStatus={onToggleStatus}
                  onObsChange={onObsChange}
                  onSetProof={onSetProof}
                  onClearProof={onClearProof}
                  onRemoveItem={onRemoveItem}
                />
              ))}
              {editMode && <AddItemRow sectionId={section.id} onAddItem={onAddItem} />}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
