import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from 'firebase/auth'
import { auth, firebaseEnabled } from '../firebase.js'

const PENDING_EMAIL_KEY = 'kitchenAudit.pendingSignInEmail'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(firebaseEnabled)
  const [linkSent, setLinkSent] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!firebaseEnabled) return
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
  }, [])

  // Completes sign-in when the user opens the emailed magic link back in the app.
  useEffect(() => {
    if (!firebaseEnabled) return
    if (!isSignInWithEmailLink(auth, window.location.href)) return

    let email = localStorage.getItem(PENDING_EMAIL_KEY)
    if (!email) email = window.prompt('Confirm the email address you used to request the sign-in link:')
    if (!email) return

    signInWithEmailLink(auth, email, window.location.href)
      .then(() => {
        localStorage.removeItem(PENDING_EMAIL_KEY)
        window.history.replaceState({}, document.title, window.location.pathname)
      })
      .catch((err) => setError(err.message))
  }, [])

  async function sendLoginLink(email) {
    if (!firebaseEnabled) return
    setError(null)
    try {
      await sendSignInLinkToEmail(auth, email, {
        url: window.location.origin + window.location.pathname,
        handleCodeInApp: true,
      })
      localStorage.setItem(PENDING_EMAIL_KEY, email)
      setLinkSent(true)
    } catch (err) {
      setError(err.message)
    }
  }

  async function logout() {
    if (!firebaseEnabled) return
    await signOut(auth)
  }

  return { user, authLoading, linkSent, error, sendLoginLink, logout, enabled: firebaseEnabled }
}
