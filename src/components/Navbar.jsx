import { Camera, Clock, Settings } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar({ onOpenSettings }) {
  const { state, dispatch } = useApp()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">👶</span>
          <span className="font-bold text-rose-500 text-lg hidden sm:block">宝宝成长记</span>
        </div>

        {/* Tab navigation */}
        <nav className="flex bg-rose-50 rounded-full p-1 gap-1">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'timeline' })}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              state.view === 'timeline'
                ? 'bg-white text-rose-500 shadow-sm'
                : 'text-gray-500 hover:text-rose-400'
            }`}
          >
            <Clock size={15} />
            时间线
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'gallery' })}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              state.view === 'gallery'
                ? 'bg-white text-rose-500 shadow-sm'
                : 'text-gray-500 hover:text-rose-400'
            }`}
          >
            <Camera size={15} />
            相册
          </button>
        </nav>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-gray-400 hover:text-rose-400 hover:bg-rose-50 transition-colors"
          title="设置"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}
