import { useCallback, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import AuditMeta from './components/AuditMeta.jsx'
import FilterBar from './components/FilterBar.jsx'
import ChecklistTable from './components/ChecklistTable.jsx'
import ScoringSummary from './components/ScoringSummary.jsx'
import SignaturePad from './components/SignaturePad.jsx'
import Toast from './components/Toast.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import SavedDocumentsPanel from './components/SavedDocumentsPanel.jsx'
import AuthPanel from './components/AuthPanel.jsx'
import { useAuditState } from './hooks/useAuditState.js'
import { useSettings } from './hooks/useSettings.js'
import { useSavedDocuments } from './hooks/useSavedDocuments.js'
import { useAuth } from './hooks/useAuth.js'
import { buildReportHtml, openReportWindow } from './utils/report.js'

export default function App() {
  const { settings, updateSettings, nextDocNo, consumeDocNo } = useSettings()
  const { state, dispatch, scores } = useAuditState(settings.passingBenchmark)
  const auth = useAuth()
  const { documents, saveDocument, deleteDocument } = useSavedDocuments(auth.user)

  const [toast, setToast] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [savedDocsOpen, setSavedDocsOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const toastTimerRef = useRef(null)

  const showToast = useCallback((message, icon) => {
    setToast({ message, icon })
    clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const displayDocNo = state.docNo ?? nextDocNo
  const isDraftDoc = !state.docNo

  function handlePassAll() {
    dispatch({ type: 'QUICK_FILL_PASS' })
    showToast('All pending items marked as PASSED', '✅')
  }

  function handleReset() {
    dispatch({ type: 'RESET' })
    showToast('Started a new audit', '🔄')
  }

  function handlePrint() {
    showToast('Opening print dialog. Select "Save as PDF" for document export', '🖨️')
    setTimeout(() => window.print(), 350)
  }

  async function handleSaveDocument() {
    const docNo = consumeDocNo()
    dispatch({ type: 'SET_DOC_NO', docNo })
    try {
      await saveDocument({
        docNo,
        savedAt: new Date().toISOString(),
        meta: state.meta,
        checklist: state.checklist,
        items: state.items,
        signatures: state.signatures,
        scores,
      })
      showToast(`Saved as ${docNo}`, '💾')
    } catch (err) {
      showToast(`Could not save document: ${err.message}`, '⚠️')
    }
  }

  function handleLoadDocument(doc) {
    dispatch({
      type: 'LOAD_SNAPSHOT',
      docNo: doc.docNo,
      meta: doc.meta,
      checklist: doc.checklist,
      items: doc.items,
      signatures: doc.signatures,
    })
    setSavedDocsOpen(false)
    showToast(`Loaded ${doc.docNo}`, '📂')
  }

  async function handleDeleteDocument(docNo) {
    try {
      await deleteDocument(docNo)
      showToast('Document deleted', '🗑️')
    } catch (err) {
      showToast(`Could not delete document: ${err.message}`, '⚠️')
    }
  }

  function handleGenerateReport(doc) {
    const html = buildReportHtml(
      doc
        ? {
            docNo: doc.docNo,
            orgTitle: settings.orgTitle,
            meta: doc.meta,
            checklist: doc.checklist,
            items: doc.items,
            scores: doc.scores,
            passingBenchmark: settings.passingBenchmark,
          }
        : {
            docNo: state.docNo,
            orgTitle: settings.orgTitle,
            meta: state.meta,
            checklist: state.checklist,
            items: state.items,
            scores,
            passingBenchmark: settings.passingBenchmark,
          }
    )
    const opened = openReportWindow(html)
    if (!opened) showToast('Please allow pop-ups to generate the report', '⚠️')
  }

  return (
    <>
      <Header
        title={settings.orgTitle}
        docNo={displayDocNo}
        isDraftDoc={isDraftDoc}
        passingBenchmark={settings.passingBenchmark}
        scores={scores}
        savedCount={documents.length}
        authUser={auth.user}
        onPassAll={handlePassAll}
        onSave={handleSaveDocument}
        onGenerateReport={() => handleGenerateReport(null)}
        onPrint={handlePrint}
        onReset={handleReset}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSavedDocs={() => setSavedDocsOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
      />

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
                  Doc No: <strong className="text-slate-900">{displayDocNo}</strong>
                </div>
                <div>
                  Passing Benchmark: <strong className="text-slate-900">{settings.passingBenchmark}%</strong>
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
            editMode={editMode}
            onFilterChange={(filter) => dispatch({ type: 'SET_FILTER', filter })}
            onSearchChange={(search) => dispatch({ type: 'SET_SEARCH', search: search.toLowerCase().trim() })}
            onToggleEditMode={() => setEditMode((v) => !v)}
          />

          <ChecklistTable
            checklist={state.checklist}
            items={state.items}
            filter={state.filter}
            search={state.search}
            editMode={editMode}
            onToggleStatus={(id, status) => dispatch({ type: 'TOGGLE_STATUS', id, status })}
            onObsChange={(id, value) => dispatch({ type: 'SET_OBS', id, value })}
            onSetProof={(id, dataUrl) => dispatch({ type: 'SET_PROOF', id, dataUrl })}
            onClearProof={(id) => dispatch({ type: 'SET_PROOF', id, dataUrl: null })}
            onAddItem={(sectionId, text) => dispatch({ type: 'ADD_ITEM', sectionId, text })}
            onRemoveItem={(sectionId, itemId) => dispatch({ type: 'REMOVE_ITEM', sectionId, itemId })}
          />

          <ScoringSummary scores={scores} passingBenchmark={settings.passingBenchmark} />

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
                <p className="text-[10px] text-slate-500">Seal may be affixed physically after printing</p>
              </div>
            </div>
          </section>

          <div className="mt-6 text-[9px] text-slate-400 text-center print:text-slate-600">Confidential Audit Report</div>
        </div>
      </main>

      <Toast toast={toast} />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
        nextDocNo={nextDocNo}
      />

      <SavedDocumentsPanel
        open={savedDocsOpen}
        onClose={() => setSavedDocsOpen(false)}
        documents={documents}
        onLoad={handleLoadDocument}
        onDelete={handleDeleteDocument}
        onReport={handleGenerateReport}
      />

      <AuthPanel open={authOpen} onClose={() => setAuthOpen(false)} auth={auth} />
    </>
  )
}
