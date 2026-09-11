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

// Two layout densities: a tight one when there's no photo evidence to carry (the goal
// is fitting a normal few-failures report onto a single sheet, front and back), and a
// slightly roomier one when photos are attached (aiming for ~4 pages at most).
const COMPACT = {
  pageMargin: '9mm 11mm',
  bodyFont: '9.5px',
  lineHeight: '1.28',
  h1: '15px',
  h2: '11px',
  h2Margin: '10px 0 5px',
  subtitleMargin: '0 0 7px',
  metaGap: '4px 12px',
  metaMargin: '7px',
  summaryMargin: '6px 0 8px',
  summaryGap: '6px',
  statPad: '3px 8px',
  statMinWidth: '62px',
  statN: '12.5px',
  statL: '8px',
  cellPad: '3px 5px',
  cellFont: '9px',
  thFont: '8px',
  footnoteMargin: '10px',
}

const SPACIOUS = {
  pageMargin: '10mm 12mm',
  bodyFont: '10px',
  lineHeight: '1.32',
  h1: '16px',
  h2: '12px',
  h2Margin: '12px 0 6px',
  subtitleMargin: '0 0 9px',
  metaGap: '5px 15px',
  metaMargin: '9px',
  summaryMargin: '7px 0 10px',
  summaryGap: '8px',
  statPad: '4px 9px',
  statMinWidth: '68px',
  statN: '14px',
  statL: '8.5px',
  cellPad: '4px 6px',
  cellFont: '9.5px',
  thFont: '8.5px',
  footnoteMargin: '14px',
}

export function buildReportHtml({ docNo, orgTitle, meta, checklist, items, scores, passingBenchmark }) {
  const failed = []
  checklist.forEach((section) => {
    section.items.forEach((item) => {
      const state = items[item.id]
      if (state?.status === 'F') failed.push({ section, item, state })
    })
  })

  const hasEvidence = failed.some((row) => row.state.proof)
  const d = hasEvidence ? SPACIOUS : COMPACT
  const evidenceSize = hasEvidence ? 64 : 0

  const failedRows = failed.map(
    ({ section, item, state }, i) => `
        <tr>
          <td class="center">${i + 1}</td>
          <td>${escapeHtml(section.title)}</td>
          <td>${escapeHtml(item.text)}</td>
          <td>${recommendedAction(item.text, state.obs)}</td>
          ${
            hasEvidence
              ? `<td class="center">${state.proof ? `<img class="evidence" src="${state.proof}" alt="Evidence for item ${item.id}">` : '<span class="muted">No photo</span>'}</td>`
              : ''
          }
          <td></td>
          <td></td>
        </tr>`
  )

  const verdictLabel = scores.verdict === 'pass' ? 'PASSED' : scores.verdict === 'fail' ? 'FAILED' : 'IN PROGRESS'
  const verdictClass = scores.verdict === 'pass' ? 'pass' : scores.verdict === 'fail' ? 'fail' : 'pending'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Corrective Action Report - ${escapeHtml(docNo)}</title>
<style>
  @page { size: A4 portrait; margin: ${d.pageMargin}; }
  * {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  body { margin: 0; color: #0f172a; font-size: ${d.bodyFont}; line-height: ${d.lineHeight}; }
  h1 { font-size: ${d.h1}; margin: 0 0 2px; }
  h2 { font-size: ${d.h2}; margin: ${d.h2Margin}; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 2px solid #0f172a; padding-bottom: 3px; break-after: avoid; break-inside: avoid; }
  .subtitle { color: #475569; font-size: ${d.bodyFont}; margin: ${d.subtitleMargin}; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: ${d.metaGap}; font-size: ${d.bodyFont}; margin-bottom: ${d.metaMargin}; break-inside: avoid; }
  .meta-grid div span.label { color: #64748b; font-weight: 600; margin-right: 4px; }
  .summary { display: flex; gap: ${d.summaryGap}; flex-wrap: wrap; margin: ${d.summaryMargin}; break-inside: avoid; }
  .stat { border: 1px solid #cbd5e1; border-radius: 8px; padding: ${d.statPad}; text-align: center; min-width: ${d.statMinWidth}; }
  .stat .n { font-size: ${d.statN}; font-weight: 800; display: block; }
  .stat .l { font-size: ${d.statL}; text-transform: uppercase; color: #64748b; font-weight: 700; }
  .verdict { display: inline-block; padding: 3px 13px; border-radius: 999px; font-weight: 800; font-size: 11px; text-transform: uppercase; }
  .verdict.pass { background: #059669; color: #fff; }
  .verdict.fail { background: #e11d48; color: #fff; }
  .verdict.pending { background: #fbbf24; color: #78350f; }
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; page-break-inside: avoid; }
  th, td { border: 1px solid #cbd5e1; padding: ${d.cellPad}; text-align: left; vertical-align: top; font-size: ${d.cellFont}; }
  th { background: #0f172a; color: #fff; text-transform: uppercase; font-size: ${d.thFont}; letter-spacing: 0.03em; }
  td.center { text-align: center; }
  .finding-note { color: #475569; font-style: italic; }
  .muted { color: #94a3b8; font-size: 8.5px; }
  .evidence { max-width: ${evidenceSize}px; max-height: ${evidenceSize}px; border-radius: 4px; border: 1px solid #cbd5e1; display: block; margin: 0 auto; }
  .all-clear { border: 1px solid #a7f3d0; background: #ecfdf5; color: #065f46; padding: 10px 14px; border-radius: 8px; font-weight: 600; }
  .footnote { margin-top: ${d.footnoteMargin}; font-size: 8.5px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 6px; break-inside: avoid; }
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
              <th style="width:${hasEvidence ? 14 : 16}%">Section</th>
              <th style="width:${hasEvidence ? 18 : 21}%">Parameter</th>
              <th style="width:${hasEvidence ? 24 : 30}%">Recommended Corrective Action</th>
              ${hasEvidence ? '<th style="width:12%">Photo Evidence</th>' : ''}
              <th style="width:${hasEvidence ? 14 : 16}%">Target Fix Date</th>
              <th style="width:${hasEvidence ? 14 : 13}%">Responsible Person</th>
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
