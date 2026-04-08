import { useState, useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
import SettingsModal from './components/SettingsModal'

function AppContent() {
  const { state } = useApp()
  const [settings, setSettings] = useState(false)
  const [babyName, setBabyName] = useState('')

  useEffect(() => {
    setBabyName(localStorage.getItem('baby-name') || '')
  }, [settings]) // refresh after settings close

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar onOpenSettings={() => setSettings(true)} />

      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl shrink-0">
            👶
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {babyName ? `${babyName}的成长记录` : '宝宝成长记'}
            </h1>
            <p className="text-white/80 text-sm mt-0.5">
              {state.events.length > 0
                ? `共记录了 ${state.events.length} 个美好时刻 · ${state.events.reduce((s, e) => s + (e.images?.length || 0), 0)} 张照片`
                : '记录每一个珍贵的成长瞬间'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main>
        {state.view === 'timeline' ? <Timeline /> : <Gallery />}
      </main>

      {/* Settings modal */}
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
