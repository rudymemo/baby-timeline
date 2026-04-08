import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react'

export default function ImageViewer({ images, initialIndex = 0, onClose }) {
  const [current, setCurrent] = useState(initialIndex)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setCurrent(c => Math.max(0, c - 1))
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(images.length - 1, c + 1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [images.length, onClose])

  function download() {
    const a = document.createElement('a')
    a.href = images[current]
    a.download = `photo-${current + 1}.jpg`
    a.click()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      {/* Download */}
      <button
        onClick={download}
        className="absolute top-4 left-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <Download size={20} />
      </button>

      {/* Image */}
      <div className="flex items-center gap-4 px-16 max-w-screen-lg w-full">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="p-2 text-white/70 hover:text-white disabled:opacity-20 hover:bg-white/10 rounded-full transition-colors shrink-0"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="flex-1 flex items-center justify-center">
          <img
            src={images[current]}
            alt=""
            className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            style={{ transition: 'opacity 0.2s' }}
          />
        </div>

        <button
          onClick={() => setCurrent(c => Math.min(images.length - 1, c + 1))}
          disabled={current === images.length - 1}
          className="p-2 text-white/70 hover:text-white disabled:opacity-20 hover:bg-white/10 rounded-full transition-colors shrink-0"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Counter & dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2">
          <span className="text-white/60 text-sm">{current + 1} / {images.length}</span>
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === current ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
