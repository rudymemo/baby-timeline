import { useState, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
import SettingsModal from './components/SettingsModal'

const FLOATERS = [
  { emoji: '⭐', x: 8,  y: 15, size: 1.4, delay: 0 },
  { emoji: '🌸', x: 20, y: 55, size: 1.1, delay: 0.6 },
  { emoji: '💕', x: 38, y: 20, size: 1.0, delay: 1.2 },
  { emoji: '✨', x: 55, y: 60, size: 1.3, delay: 0.3 },
  { emoji: '🌟', x: 70, y: 18, size: 0.9, delay: 0.9 },
  { emoji: '🎀', x: 82, y: 55, size: 1.2, delay: 1.5 },
  { emoji: '🍭', x: 92, y: 22, size: 0.9, delay: 0.5 },
]

function AppContent() {
  const { state } = useApp()
  const [settings, setSettings] = useState(false)
  const [babyName, setBabyName] = useState('')

  useEffect(() => {
    setBabyName(localStorage.getItem('baby-name') || '')
  }, [settings])

  const photoCount = state.events.reduce((s, e) => s + (e.images?.length || 0), 0)

  return (
    <div className="min-h-screen">
      <Navbar onOpenSettings={() => setSettings(true)} />

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #ff8fab 0%, #ffb3c6 30%, #c8b6e2 65%, #b8e0ff 100%)',
      }}>
        {/* Floating decorations */}
        {FLOATERS.map((f, i) => (
          <span
            key={i}
            className="absolute select-none pointer-events-none animate-float"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              fontSize: `${f.size}rem`,
              animationDelay: `${f.delay}s`,
              opacity: 0.55,
            }}
          >
            {f.emoji}
          </span>
        ))}

        {/* Wave bottom */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,40 1440,10 L1440,40 Z" fill="#fff5f7" />
        </svg>

        <div className="relative max-w-5xl mx-auto px-6 py-10 flex items-center gap-5">
          {/* Avatar */}
          <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl animate-heartbeat"
            style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(255,143,171,0.3)' }}>
            👶
          </div>
          <div>
            <h1 className="text-2xl font-black text-white drop-shadow-sm tracking-wide" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {babyName ? `${babyName}的成长记录` : '宝宝成长记 ✨'}
            </h1>
            <p className="text-white/80 text-sm mt-1 font-semibold">
              {state.events.length > 0
                ? `🎉 记录了 ${state.events.length} 个美好时刻 · 📷 ${photoCount} 张照片`
                : '💝 记录每一个珍贵的成长瞬间'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main>
        {state.view === 'timeline' ? <Timeline /> : <Gallery />}
      </main>

      {settings && <SettingsModal onClose={() => setSettings(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
