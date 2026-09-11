import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc as fsDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

const STORAGE_KEY = 'kitchenAudit.savedDocuments'

function loadLocalDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalDocuments(documents) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents))
  } catch {
    // ignore persistence failures (e.g. private browsing storage limits)
  }
}

// When signed in, saved documents live in Firestore under the auditor's own uid
// and sync across devices; signed out, they fall back to this browser's
// localStorage so the app keeps working fully offline.
export function useSavedDocuments(user) {
  const [documents, setDocuments] = useState(user ? [] : loadLocalDocuments())

  useEffect(() => {
    if (!user) {
      setDocuments(loadLocalDocuments())
      return
    }
    const q = query(collection(db, 'users', user.uid, 'documents'), orderBy('savedAt', 'desc'))
    return onSnapshot(q, (snap) => setDocuments(snap.docs.map((d) => d.data())))
  }, [user])

  useEffect(() => {
    if (user) return
    saveLocalDocuments(documents)
  }, [documents, user])

  async function saveDocument(docData) {
    if (user) {
      await setDoc(fsDoc(db, 'users', user.uid, 'documents', docData.docNo), docData)
    } else {
      setDocuments((prev) => [docData, ...prev])
    }
  }

  async function deleteDocument(docNo) {
    if (user) {
      await deleteDoc(fsDoc(db, 'users', user.uid, 'documents', docNo))
    } else {
      setDocuments((prev) => prev.filter((d) => d.docNo !== docNo))
    }
  }

  return { documents, saveDocument, deleteDocument }
}
