# Kitchen Audit Checklist

React + Vite app for running kitchen quality/safety audits, saving completed audits,
and generating a corrective-action report for the outlet owner.

## Run locally

```
npm install
npm run dev
```

Works fully offline out of the box — saved documents, checklist templates, and
settings live in the browser's localStorage. No configuration required.

## Optional: auditor sign-in & cross-device sync (Firebase)

By default, saved audits stay on the one device/browser that saved them. To let
auditors sign in with their email and access their saved audits from any device:

1. Go to the [Firebase console](https://console.firebase.google.com) and create a
   new project (the free Spark plan is enough).
2. **Authentication** → Sign-in method → enable **Email link (passwordless sign-in)**.
3. **Firestore Database** → create a database (production mode is fine).
4. In Firestore's **Rules** tab, paste the contents of [`firestore.rules`](./firestore.rules)
   from this repo and publish — this restricts each auditor to their own saved
   documents.
5. Project settings → General → "Your apps" → add a Web app → copy the config values.
6. Copy `.env.example` to `.env` and fill in the six `VITE_FIREBASE_*` values from
   that config.
7. Restart `npm run dev`. The account icon in the header will now offer email
   sign-in; saved documents for a signed-in auditor sync to Firestore instead of
   localStorage.

If `.env` is left unset, the app just keeps working in local-only mode — the sign-in
button explains that it isn't configured yet.

## Build

```
npm run build
```
