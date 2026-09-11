function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function recommendedAction(text, obs) {
  const cleanText = text.replace(/\?\s*$/, '')
  const base = `Take corrective action to bring "${escapeHtml(cleanText)}" into full compliance and re-verify at the next audit.`
  return obs ? `${base}<br><span class="finding-note">Auditor's finding: ${escapeHtml(obs)}</span>` : base
}

export function buildReportHtml({ docNo, orgTitle, meta, checklist, items, scores, passingBenchmark }) {
  const failedRows = []
  let sl = 0
  checklist.forEach((section) => {
    section.items.forEach((item) => {
      const state = items[item.id]
      if (state?.status !== 'F') return
      sl++
      failedRows.push(`
        <tr>
          <td class="center">${sl}</td>
          <td>${escapeHtml(section.title)}</td>
          <td>${escapeHtml(item.text)}</td>
          <td>${recommendedAction(item.text, state.obs)}</td>
          <td class="center">${state.proof ? `<img class="evidence" src="${state.proof}" alt="Evidence for item ${item.id}">` : '<span class="muted">No photo attached</span>'}</td>
          <td></td>
          <td></td>
        </tr>
      `)
    })
  })

  const verdictLabel = scores.verdict === 'pass' ? 'PASSED' : scores.verdict === 'fail' ? 'FAILED' : 'IN PROGRESS'
  const verdictClass = scores.verdict === 'pass' ? 'pass' : scores.verdict === 'fail' ? 'fail' : 'pending'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Corrective Action Report - ${escapeHtml(docNo)}</title>
<style>
  @page { size: A4 portrait; margin: 10mm 12mm; }
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body { margin: 0; color: #0f172a; font-size: 10.5px; line-height: 1.35; }
  h1 { font-size: 17px; margin: 0 0 2px; }
  h2 { font-size: 12.5px; margin: 14px 0 6px; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 2px solid #0f172a; padding-bottom: 3px; break-after: avoid; break-inside: avoid; }
  .subtitle { color: #475569; font-size: 10.5px; margin: 0 0 10px; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px 16px; font-size: 10.5px; margin-bottom: 10px; break-inside: avoid; }
  .meta-grid div span.label { color: #64748b; font-weight: 600; margin-right: 4px; }
  .summary { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0 12px; break-inside: avoid; }
  .stat { border: 1px solid #cbd5e1; border-radius: 8px; padding: 5px 10px; text-align: center; min-width: 72px; }
  .stat .n { font-size: 15px; font-weight: 800; display: block; }
  .stat .l { font-size: 8.5px; text-transform: uppercase; color: #64748b; font-weight: 700; }
  .verdict { display: inline-block; padding: 3px 13px; border-radius: 999px; font-weight: 800; font-size: 11px; text-transform: uppercase; }
  .verdict.pass { background: #059669; color: #fff; }
  .verdict.fail { background: #e11d48; color: #fff; }
  .verdict.pending { background: #fbbf24; color: #78350f; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  th, td { border: 1px solid #cbd5e1; padding: 5px 6px; text-align: left; vertical-align: top; font-size: 10px; }
  th { background: #0f172a; color: #fff; text-transform: uppercase; font-size: 9px; letter-spacing: 0.03em; }
  td.center { text-align: center; }
  .finding-note { color: #475569; font-style: italic; }
  .muted { color: #94a3b8; font-size: 9px; }
  .evidence { max-width: 80px; max-height: 80px; border-radius: 4px; border: 1px solid #cbd5e1; display: block; margin: 0 auto; }
  .all-clear { border: 1px solid #a7f3d0; background: #ecfdf5; color: #065f46; padding: 10px 14px; border-radius: 8px; font-weight: 600; }
  .footnote { margin-top: 16px; font-size: 9px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 6px; break-inside: avoid; }
  .footnote strong { color: #334155; }
</style>
</head>
<body>
  <h1>${escapeHtml(orgTitle)}</h1>
  <p class="subtitle">Corrective Action &amp; Compliance Report &bull; Doc No: <strong>${escapeHtml(docNo)}</strong></p>

  <div class="meta-grid">
    <div><span class="label">Outlet:</span>${escapeHtml(meta.outlet) || '—'}</div>
    <div><span class="label">Location:</span>${escapeHtml(meta.location) || '—'}</div>
    <div><span class="label">Audit Date:</span>${escapeHtml(meta.date) || '—'} ${escapeHtml(meta.time) || ''}</div>
    <div><span class="label">Auditor:</span>${escapeHtml(meta.auditor) || '—'}</div>
    <div><span class="label">Outlet Rep:</span>${escapeHtml(meta.rep) || '—'}</div>
    <div><span class="label">Passing Benchmark:</span>${passingBenchmark}%</div>
  </div>

  <div class="summary">
    <div class="stat"><span class="n">${scores.passed}</span><span class="l">Passed</span></div>
    <div class="stat"><span class="n">${scores.failed}</span><span class="l">Failed</span></div>
    <div class="stat"><span class="n">${scores.notRelevant ?? 0}</span><span class="l">Not Relevant</span></div>
    <div class="stat"><span class="n">${scores.pending}</span><span class="l">Pending</span></div>
    <div class="stat"><span class="n">${scores.pct}%</span><span class="l">Score</span></div>
    <div class="stat" style="display:flex; align-items:center; justify-content:center;"><span class="verdict ${verdictClass}">${verdictLabel}</span></div>
  </div>

  <h2>Corrective Action Plan</h2>
  ${
    failedRows.length === 0
      ? '<p class="all-clear">✓ No corrective actions required — every evaluated parameter met the standard on this audit.</p>'
      : `<table>
          <thead>
            <tr>
              <th style="width:4%">Sl.</th>
              <th style="width:16%">Section</th>
              <th style="width:20%">Parameter</th>
              <th style="width:26%">Recommended Corrective Action</th>
              <th style="width:12%">Photo Evidence</th>
              <th style="width:11%">Target Fix Date</th>
              <th style="width:11%">Responsible Person</th>
            </tr>
          </thead>
          <tbody>${failedRows.join('')}</tbody>
        </table>`
  }

  <div class="footnote">
    <strong>Note:</strong> The outlet's official seal/rubber stamp can be affixed to this report by hand after it is printed —
    it is not required to generate or act on this report digitally.<br>
    Confidential Audit Report. Generated ${new Date().toLocaleString()}.
  </div>

  <script>
    window.onload = function () {
      setTimeout(function () { window.print(); }, 300);
    };
  </script>
</body>
</html>`
}

export function openReportWindow(html) {
  const reportWindow = window.open('', '_blank')
  if (!reportWindow) return false
  reportWindow.document.open()
  reportWindow.document.write(html)
  reportWindow.document.close()
  return true
}
