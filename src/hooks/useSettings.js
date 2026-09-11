import { useEffect, useState } from 'react'

const STORAGE_KEY = 'kitchenAudit.settings'

const DEFAULT_SETTINGS = {
  orgTitle: 'Kitchen Audit Inspector',
  docSeriesPrefix: 'ASPL/IM5P34/F-',
  docNextNumber: 8,
  passingBenchmark: 80,
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

function formatDocNo(prefix, number) {
  return `${prefix}${String(number).padStart(2, '0')}`
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // ignore persistence failures (e.g. private browsing storage limits)
    }
  }, [settings])

  function updateSettings(patch) {
    setSettings((prev) => ({ ...prev, ...patch }))
  }

  // Preview of the doc number the next saved document will receive.
  const nextDocNo = formatDocNo(settings.docSeriesPrefix, settings.docNextNumber)

  // Assigns the next doc number in the series and advances the counter.
  function consumeDocNo() {
    const docNo = formatDocNo(settings.docSeriesPrefix, settings.docNextNumber)
    setSettings((prev) => ({ ...prev, docNextNumber: prev.docNextNumber + 1 }))
    return docNo
  }

  return { settings, updateSettings, nextDocNo, consumeDocNo }
}
