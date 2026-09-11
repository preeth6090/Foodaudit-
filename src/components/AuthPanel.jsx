import { useState } from 'react'
import Modal from './Modal.jsx'

export default function AuthPanel({ open, onClose, auth }) {
  const [email, setEmail] = useState('')

  if (!auth.enabled) {
    return (
      <Modal open={open} onClose={onClose} title="Auditor Sign-In">
        <p className="text-xs text-slate-600 leading-relaxed">
          Sign-in isn't configured yet. Add your Firebase project's credentials to a <code className="bg-slate-100 px-1 rounded">.env</code>{' '}
          file (see <code className="bg-slate-100 px-1 rounded">.env.example</code>) to let auditors sign in with their email and sync
          saved audits across devices. Until then, saved documents stay on this device only.
        </p>
      </Modal>
    )
  }

  if (auth.user) {
    return (
      <Modal open={open} onClose={onClose} title="Auditor Sign-In">
        <div className="text-sm">
          <p className="text-xs text-slate-500 mb-1">Signed in as</p>
          <p className="font-bold text-slate-900 mb-4">{auth.user.email}</p>
          <p className="text-[11px] text-slate-500 mb-4">
            Documents you save now sync to your account and stay available on any device you sign in on.
          </p>
          <button
            type="button"
            onClick={() => {
              auth.logout()
              onClose()
            }}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="Auditor Sign-In">
      {auth.linkSent ? (
        <p className="text-xs text-slate-600 leading-relaxed">
          Check <strong>{email}</strong> for a sign-in link. Open it on this device to finish signing in — saved documents will then
          sync to your account automatically.
        </p>
      ) : (
        <div className="space-y-3 text-sm">
          <p className="text-xs text-slate-500">
            Sign in with your email to save audits to your account and access them from any device. No password needed.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
          {auth.error && <p className="text-[11px] text-rose-600">{auth.error}</p>}
          <button
            type="button"
            onClick={() => email && auth.sendLoginLink(email)}
            disabled={!email}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-lg transition"
          >
            Send Sign-In Link
          </button>
        </div>
      )}
    </Modal>
  )
}
