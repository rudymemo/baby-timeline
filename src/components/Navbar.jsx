import { Camera, Clock, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar({ onOpenSettings }) {
  const { state, dispatch } = useApp()

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-pink-100"
      style={{ boxShadow: '0 2px 16px rgba(251,113,133,0.08)' }}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍼</span>
          <span className="hidden sm:block font-black text-lg"
            style={{ background: 'linear-gradient(90deg, #f43f5e, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            宝宝成长记
          </span>
        </div>

        {/* Tab navigation */}
        <nav className="flex rounded-2xl p-1 gap-0.5" style={{ background: 'linear-gradient(135deg, #ffe4e6, #f5f3ff)' }}>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'timeline' })}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              state.view === 'timeline'
                ? 'bg-white text-rose-500 shadow-md scale-100'
                : 'text-gray-400 hover:text-rose-400 hover:bg-white/50'
            }`}
          >
            <Clock size={14} />
            时间线
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'gallery' })}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              state.view === 'gallery'
                ? 'bg-white text-rose-500 shadow-md'
                : 'text-gray-400 hover:text-rose-400 hover:bg-white/50'
            }`}
          >
            <Camera size={14} />
            相册
          </button>
        </nav>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-2xl text-gray-400 hover:text-rose-400 transition-colors hover:bg-rose-50"
          title="设置"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  )
}
