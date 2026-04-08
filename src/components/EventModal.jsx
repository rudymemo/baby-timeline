import { useState, useEffect, useRef } from 'react'
import { X, Upload, Trash2, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { compressImage } from '../utils/imageUtils'

const TAG_OPTIONS = [
  { label: '第一次', emoji: '🌟' },
  { label: '里程碑', emoji: '🏆' },
  { label: '日常',   emoji: '🌈' },
  { label: '节日',   emoji: '🎉' },
  { label: '旅行',   emoji: '✈️' },
  { label: '美食',   emoji: '🍰' },
  { label: '玩耍',   emoji: '🎪' },
  { label: '成长',   emoji: '🌱' },
]

const INPUT_CLS = 'w-full border-2 border-pink-100 rounded-2xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-rose-300 focus:border-rose-300 bg-pink-50/40 transition-all placeholder:text-gray-300'

export default function EventModal({ event, onClose }) {
  const { dispatch } = useApp()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({ date: '', title: '', description: '', images: [], tags: [] })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (event) {
      setForm({ date: event.date || '', title: event.title || '', description: event.description || '', images: event.images || [], tags: event.tags || [] })
    } else {
      setForm(f => ({ ...f, date: new Date().toISOString().split('T')[0] }))
    }
  }, [event])

  async function handleFiles(files) {
    const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!fileArr.length) return
    setUploading(true)
    setError('')
    try {
      const compressed = await Promise.all(fileArr.map(f => compressImage(f)))
      setForm(f => ({ ...f, images: [...f.images, ...compressed] }))
    } catch {
      setError('图片处理失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  function toggleTag(tag) {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.date) return setError('请选择日期')
    if (!form.title.trim()) return setError('请输入标题')
    event ? dispatch({ type: 'UPDATE_EVENT', payload: { ...event, ...form } })
           : dispatch({ type: 'ADD_EVENT', payload: form })
    onClose()
  }

  function handleDelete() {
    if (confirm('确定要删除这条记录吗？')) {
      dispatch({ type: 'DELETE_EVENT', payload: event.id })
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col"
        style={{ animation: 'slideUp 0.25s ease-out' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">{event ? '✏️' : '✨'}</span>
            <h2 className="text-base font-black text-gray-800">{event ? '编辑记录' : '记录新时刻'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl hover:bg-rose-50 text-gray-400 hover:text-rose-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-500 rounded-2xl text-sm font-semibold">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-wide">📅 日期</label>
            <input type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={INPUT_CLS} />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-wide">✍️ 标题</label>
            <input type="text" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="例如：第一次翻身 🎉"
              maxLength={50}
              className={INPUT_CLS} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-wide">💬 描述</label>
            <textarea value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="记录这个美好时刻…"
              rows={3}
              maxLength={500}
              className={INPUT_CLS + ' resize-none'} />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wide">🏷️ 标签</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(({ label, emoji }) => (
                <button key={label} type="button" onClick={() => toggleTag(label)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold border-2 transition-all duration-200 ${
                    form.tags.includes(label)
                      ? 'text-white border-transparent scale-105'
                      : 'bg-white text-gray-500 border-pink-100 hover:border-pink-300'
                  }`}
                  style={form.tags.includes(label) ? {
                    background: 'linear-gradient(135deg,#f43f5e,#ec4899)',
                    boxShadow: '0 3px 10px rgba(244,63,94,0.3)',
                  } : {}}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wide">
              📷 照片 {form.images.length > 0 && <span className="text-pink-400 normal-case font-bold">({form.images.length} 张)</span>}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                dragOver ? 'border-rose-400 bg-rose-50' : 'border-pink-200 hover:border-rose-300 hover:bg-rose-50/50'
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => handleFiles(e.target.files)} />
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-rose-400 text-sm font-bold">
                  <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                  处理中…
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <Upload size={22} className="text-pink-300" />
                  <span className="text-sm font-bold">点击或拖拽上传照片</span>
                  <span className="text-xs">支持 JPG、PNG、WebP</span>
                </div>
              )}
            </div>

            {form.images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {form.images.map((src, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-pink-50 flex items-center gap-2">
          {event && (
            <button type="button" onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 text-red-400 hover:bg-red-50 rounded-2xl text-sm font-bold transition-colors">
              <Trash2 size={14} /> 删除
            </button>
          )}
          <div className="flex-1" />
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-2xl text-sm font-bold transition-colors">
            取消
          </button>
          <button onClick={handleSubmit}
            className="cute-btn-primary">
            {event ? '💾 保存' : '✨ 添加'}
          </button>
        </div>
      </div>
    </div>
  )
}
