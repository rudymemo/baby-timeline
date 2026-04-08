import { useState, useEffect } from 'react'
import { X, Baby, Trash2, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function SettingsModal({ onClose }) {
  const { state, dispatch } = useApp()
  const [babyName, setBabyName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    setBabyName(localStorage.getItem('baby-name') || '')
    setBirthDate(localStorage.getItem('baby-birthdate') || '')
  }, [])

  function save() {
    localStorage.setItem('baby-name', babyName)
    localStorage.setItem('baby-birthdate', birthDate)
    onClose()
    // Trigger re-render by reloading
    window.location.reload()
  }

  function clearAll() {
    dispatch({ type: 'SET_EVENTS', payload: [] })
    setConfirmClear(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">设置</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">宝宝的名字</label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-rose-300">
              <span className="pl-3 text-lg">👶</span>
              <input
                type="text"
                value={babyName}
                onChange={e => setBabyName(e.target.value)}
                placeholder="给宝宝起个名字吧"
                maxLength={20}
                className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">出生日期</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <p className="text-xs text-gray-400 mt-1">设置出生日期后，时间线将显示宝宝的月龄</p>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-2">数据管理</p>
            <p className="text-xs text-gray-400 mb-3">
              当前共 {state.events.length} 条记录，{state.events.reduce((s, e) => s + (e.images?.length || 0), 0)} 张照片
            </p>
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
              >
                <Trash2 size={15} />
                清除所有数据
              </button>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span className="text-xs text-red-600 flex-1">确定要清除所有记录吗？此操作不可恢复。</span>
                <button onClick={clearAll} className="text-xs font-bold text-red-600 hover:underline shrink-0">确定</button>
                <button onClick={() => setConfirmClear(false)} className="text-xs text-gray-500 hover:underline shrink-0">取消</button>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors">
            取消
          </button>
          <button onClick={save} className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-colors">
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
