import { useEffect, useMemo, useReducer } from 'react'
import { AUDIT_SECTIONS, cloneSections } from '../data/auditSections.js'

const TEMPLATE_KEY = 'kitchenAudit.checklistTemplate'

function todayISODate() {
  return new Date().toISOString().split('T')[0]
}

function nowTime() {
  return new Date().toTimeString().slice(0, 5)
}

function loadTemplate() {
  try {
    const raw = localStorage.getItem(TEMPLATE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fall through to default
  }
  return cloneSections(AUDIT_SECTIONS)
}

function emptyItemsFor(checklist) {
  const items = {}
  checklist.forEach((section) => {
    section.items.forEach((item) => {
      items[item.id] = { status: null, obs: '', proof: null }
    })
  })
  return items
}

function nextItemId(checklist) {
  let max = 0
  checklist.forEach((section) => section.items.forEach((item) => { if (item.id > max) max = item.id }))
  return max + 1
}

function initialState() {
  const checklist = loadTemplate()
  return {
    docNo: null, // assigned when the audit is saved or a saved document is loaded
    meta: {
      outlet: '',
      date: todayISODate(),
      time: nowTime(),
      location: '',
      auditor: '',
      rep: '',
    },
    checklist,
    items: emptyItemsFor(checklist),
    signatures: { auditor: null, manager: null },
    filter: 'all',
    search: '',
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_META':
      return { ...state, meta: { ...state.meta, [action.field]: action.value } }

    case 'TOGGLE_STATUS': {
      const current = state.items[action.id]
      const nextStatus = current.status === action.status ? null : action.status
      return {
        ...state,
        items: { ...state.items, [action.id]: { ...current, status: nextStatus } },
      }
    }

    case 'SET_OBS':
      return {
        ...state,
        items: { ...state.items, [action.id]: { ...state.items[action.id], obs: action.value } },
      }

    case 'SET_PROOF':
      return {
        ...state,
        items: { ...state.items, [action.id]: { ...state.items[action.id], proof: action.dataUrl } },
      }

    case 'SET_FILTER':
      return { ...state, filter: action.filter }

    case 'SET_SEARCH':
      return { ...state, search: action.search }

    case 'SET_SIGNATURE':
      return { ...state, signatures: { ...state.signatures, [action.who]: action.dataUrl } }

    case 'QUICK_FILL_PASS': {
      const items = { ...state.items }
      Object.keys(items).forEach((id) => {
        if (!items[id].status) items[id] = { ...items[id], status: 'P' }
      })
      return { ...state, items }
    }

    case 'ADD_ITEM': {
      const id = nextItemId(state.checklist)
      const checklist = state.checklist.map((section) =>
        section.id === action.sectionId ? { ...section, items: [...section.items, { id, text: action.text }] } : section
      )
      return {
        ...state,
        checklist,
        items: { ...state.items, [id]: { status: null, obs: '', proof: null } },
      }
    }

    case 'REMOVE_ITEM': {
      const checklist = state.checklist.map((section) =>
        section.id === action.sectionId
          ? { ...section, items: section.items.filter((item) => item.id !== action.itemId) }
          : section
      )
      const items = { ...state.items }
      delete items[action.itemId]
      return { ...state, checklist, items }
    }

    case 'SET_DOC_NO':
      return { ...state, docNo: action.docNo }

    case 'LOAD_SNAPSHOT':
      return {
        ...state,
        docNo: action.docNo,
        meta: action.meta,
        checklist: action.checklist,
        items: action.items,
        signatures: action.signatures,
        filter: 'all',
        search: '',
      }

    case 'RESET':
      return initialState()

    default:
      return state
  }
}

export function useAuditState(passingBenchmark) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify(state.checklist))
    } catch {
      // ignore persistence failures (e.g. private browsing storage limits)
    }
  }, [state.checklist])

  const totalItems = useMemo(
    () => state.checklist.reduce((sum, section) => sum + section.items.length, 0),
    [state.checklist]
  )

  const scores = useMemo(() => {
    let passed = 0
    let failed = 0
    Object.values(state.items).forEach(({ status }) => {
      if (status === 'P') passed++
      else if (status === 'F') failed++
    })
    const pending = totalItems - passed - failed
    const totalEvaluated = passed + failed
    const pct = totalEvaluated > 0 ? Number(((passed / totalItems) * 100).toFixed(1)) : 0
    const evaluatedPct = totalItems > 0 ? Number(((totalEvaluated / totalItems) * 100).toFixed(0)) : 0
    const verdict = pending > 0 ? 'pending' : pct >= passingBenchmark ? 'pass' : 'fail'
    return { passed, failed, pending, pct, evaluatedPct, verdict, total: totalItems }
  }, [state.items, totalItems, passingBenchmark])

  return { state, dispatch, scores }
}
