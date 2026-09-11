import { useEffect, useRef } from 'react'

export default function SignaturePad({ label, hint, dataUrl, onChange, onClear }) {
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0f172a'

    function getPos(e) {
      const rect = canvas.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      return { x: clientX - rect.left, y: clientY - rect.top }
    }

    function startDraw(e) {
      isDrawingRef.current = true
      const pos = getPos(e)
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)
      e.preventDefault()
    }

    function draw(e) {
      if (!isDrawingRef.current) return
      const pos = getPos(e)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
      e.preventDefault()
    }

    function stopDraw() {
      if (!isDrawingRef.current) return
      isDrawingRef.current = false
      onChange(canvas.toDataURL())
    }

    canvas.addEventListener('mousedown', startDraw)
    canvas.addEventListener('mousemove', draw)
    window.addEventListener('mouseup', stopDraw)
    canvas.addEventListener('touchstart', startDraw, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', stopDraw)

    return () => {
      canvas.removeEventListener('mousedown', startDraw)
      canvas.removeEventListener('mousemove', draw)
      window.removeEventListener('mouseup', stopDraw)
      canvas.removeEventListener('touchstart', startDraw)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stopDraw)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClear() {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    onClear()
  }

  return (
    <div className="flex flex-col items-center bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-white print:p-0 print:border-none">
      <div className="w-full flex justify-between items-center mb-1 no-print">
        <span className="font-bold text-slate-700 text-xs">{label}</span>
        <button type="button" onClick={handleClear} className="text-[10px] text-rose-600 hover:underline">
          Clear
        </button>
      </div>
      <div className="w-full border-2 border-dashed border-slate-300 rounded-lg bg-white overflow-hidden relative touch-none no-print">
        <canvas ref={canvasRef} width="280" height="90" className="w-full h-[90px] cursor-crosshair" />
      </div>
      <div className="w-full h-[55px] border-b-2 border-dashed border-slate-700 flex items-end justify-center pb-1">
        {dataUrl && <img src={dataUrl} className="max-h-[50px] object-contain signature-img" alt={label} />}
      </div>
      <p className="font-bold text-slate-800 mt-2">{label}</p>
      <p className="text-[10px] text-slate-500">{hint}</p>
    </div>
  )
}
