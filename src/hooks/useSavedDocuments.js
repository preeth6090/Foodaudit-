import { useEffect, useState } from 'react'

const STORAGE_KEY = 'kitchenAudit.savedDocuments'

function loadDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useSavedDocuments() {
  const [documents, setDocuments] = useState(loadDocuments)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents))
    } catch {
      // ignore persistence failures (e.g. private browsing storage limits)
    }
  }, [documents])

  function saveDocument(doc) {
    setDocuments((prev) => [doc, ...prev])
  }

  function deleteDocument(docNo) {
    setDocuments((prev) => prev.filter((d) => d.docNo !== docNo))
  }

  return { documents, saveDocument, deleteDocument }
}
