import { useMemo, useReducer } from 'react'
import { AUDIT_SECTIONS, TOTAL_ITEMS, PASS_BENCHMARK } from '../data/auditSections.js'
import { DEMO_META, DEMO_OVERRIDES } from '../data/demoData.js'

function todayISODate() {
  return new Date().toISOString().split('T')[0]
}

function nowTime() {
  return new Date().toTimeString().slice(0, 5)
}

function emptyItems() {
  const items = {}
  AUDIT_SECTIONS.forEach((section) => {
    section.items.forEach((item) => {
      items[item.id] = { status: null, obs: '' }
    })
  })
  return items
}

function initialState() {
  return {
    meta: {
      outlet: '',
      date: todayISODate(),
      time: nowTime(),
      location: '',
      auditor: '',
      rep: '',
    },
    items: emptyItems(),
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

    case 'FILL_DEMO_DATA': {
      const items = {}
      Object.keys(state.items).forEach((id) => {
        const override = DEMO_OVERRIDES[id]
        items[id] = override ? { status: override.status, obs: override.obs } : { status: 'P', obs: '' }
      })
      return { ...state, meta: { ...state.meta, ...DEMO_META }, items }
    }

    case 'RESET':
      return initialState()

    default:
      return state
  }
}

export function useAuditState() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  const scores = useMemo(() => {
    let passed = 0
    let failed = 0
    Object.values(state.items).forEach(({ status }) => {
      if (status === 'P') passed++
      else if (status === 'F') failed++
    })
    const pending = TOTAL_ITEMS - passed - failed
    const totalEvaluated = passed + failed
    const pct = totalEvaluated > 0 ? Number(((passed / TOTAL_ITEMS) * 100).toFixed(1)) : 0
    const evaluatedPct = Number(((totalEvaluated / TOTAL_ITEMS) * 100).toFixed(0))
    const verdict = pending > 0 ? 'pending' : pct >= PASS_BENCHMARK ? 'pass' : 'fail'
    return { passed, failed, pending, pct, evaluatedPct, verdict, total: TOTAL_ITEMS }
  }, [state.items])

  return { state, dispatch, scores }
}
