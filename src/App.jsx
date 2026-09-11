import { useCallback, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import AuditMeta from './components/AuditMeta.jsx'
import FilterBar from './components/FilterBar.jsx'
import ChecklistTable from './components/ChecklistTable.jsx'
import ScoringSummary from './components/ScoringSummary.jsx'
import SignaturePad from './components/SignaturePad.jsx'
import Toast from './components/Toast.jsx'
import { useAuditState } from './hooks/useAuditState.js'

export default function App() {
  const { state, dispatch, scores } = useAuditState()
  const [toast, setToast] = useState(null)
  const toastTimerRef = useRef(null)

  const showToast = useCallback((message, icon) => {
    setToast({ message, icon })
    clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  function handlePassAll() {
    dispatch({ type: 'QUICK_FILL_PASS' })
    showToast('All pending items marked as PASSED', '✅')
  }

  function handleDemoFill() {
    dispatch({ type: 'FILL_DEMO_DATA' })
    showToast('Sample audit inspection loaded with live scoring', '📋')
  }

  function handleReset() {
    dispatch({ type: 'RESET' })
    showToast('Audit parameters and status cleared', '🔄')
  }

  function handlePrint() {
    showToast('Opening print dialog. Select "Save as PDF" for document export', '🖨️')
    setTimeout(() => window.print(), 350)
  }

  return (
    <>
      <Header scores={scores} onPassAll={handlePassAll} onDemoFill={handleDemoFill} onPrint={handlePrint} onReset={handleReset} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print-container">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 sm:p-8 print:p-0 print:border-none print:shadow-none">
          <div className="border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                  Kitchen Quality &amp; Safety Inspection
                </h2>
                <p className="text-xs text-slate-500 font-medium">Standard Food Hygiene &amp; Facility Compliance Audit</p>
              </div>
              <div className="text-left sm:text-right text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200 print:border-none print:p-0">
                <div>
                  Doc No: <strong className="text-slate-900">ASPL/IM5P34/F-08</strong> | Ver: <strong className="text-slate-900">00</strong>
                </div>
                <div>
                  Rev Date: <strong className="text-slate-900">30-APR-2026</strong>
                </div>
              </div>
            </div>
            <div className="mt-4 py-2 px-4 bg-slate-900 text-white text-center rounded-lg print:bg-slate-100 print:text-black print:border-y-2 print:border-black print:rounded-none">
              <h3 className="text-lg font-black tracking-widest uppercase">Kitchen Audit Checklist</h3>
            </div>
          </div>

          <AuditMeta meta={state.meta} onChange={(field, value) => dispatch({ type: 'SET_META', field, value })} />

          <FilterBar
            filter={state.filter}
            search={state.search}
            total={scores.total}
            onFilterChange={(filter) => dispatch({ type: 'SET_FILTER', filter })}
            onSearchChange={(search) => dispatch({ type: 'SET_SEARCH', search: search.toLowerCase().trim() })}
          />

          <ChecklistTable
            items={state.items}
            filter={state.filter}
            search={state.search}
            onToggleStatus={(id, status) => dispatch({ type: 'TOGGLE_STATUS', id, status })}
            onObsChange={(id, value) => dispatch({ type: 'SET_OBS', id, value })}
          />

          <ScoringSummary scores={scores} />

          <section className="mt-8 pt-6 border-t border-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs">
              <SignaturePad
                label="Auditor Signature"
                hint="Sign & Stamp within perimeter"
                dataUrl={state.signatures.auditor}
                onChange={(dataUrl) => dispatch({ type: 'SET_SIGNATURE', who: 'auditor', dataUrl })}
                onClear={() => {
                  dispatch({ type: 'SET_SIGNATURE', who: 'auditor', dataUrl: null })
                  showToast('Auditor signature reset', '✏️')
                }}
              />
              <SignaturePad
                label="Store Manager Signature"
                hint="Acknowledged inspection findings"
                dataUrl={state.signatures.manager}
                onChange={(dataUrl) => dispatch({ type: 'SET_SIGNATURE', who: 'manager', dataUrl })}
                onClear={() => {
                  dispatch({ type: 'SET_SIGNATURE', who: 'manager', dataUrl: null })
                  showToast('Manager signature reset', '✏️')
                }}
              />

              <div className="flex flex-col items-center bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-white print:p-0 print:border-none">
                <div className="w-full flex justify-between items-center mb-1 no-print">
                  <span className="font-bold text-slate-700 text-xs">Store Stamp &amp; Date</span>
                </div>
                <div className="w-full h-[90px] border-2 border-dashed border-slate-300 rounded-lg bg-white flex items-center justify-center text-slate-400 text-xs font-medium no-print">
                  Affix Physical Rubber Stamp Here
                </div>
                <div className="w-full h-[55px] border-b-2 border-dashed border-slate-700 flex items-center justify-center">
                  <span className="text-slate-400 text-[10px] print:text-slate-600">[ Official Seal / Stamp ]</span>
                </div>
                <p className="font-bold text-slate-800 mt-2">Store Stamp / Seal</p>
                <p className="text-[10px] text-slate-500">Official unit verification</p>
              </div>
            </div>
          </section>

          <div className="mt-6 text-[9px] text-slate-400 text-center print:text-slate-600">
            Confidential Quality Audit Report &bull; Form ASPL/IM5P34/F-08 &bull; Page 1 of 2
          </div>
        </div>
      </main>

      <Toast toast={toast} />
    </>
  )
}
