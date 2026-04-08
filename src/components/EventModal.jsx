import { useState, useEffect, useRef } from 'react'
import { X, Upload, Trash2, ImageIcon, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { compressImage } from '../utils/imageUtils'

const TAG_OPTIONS = ['第一次', '里程碑', '日常', '节日', '旅行', '美食', '玩耍', '成长']

export default function EventModal({ event, onClose }) {
  const { dispatch } = useApp()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({
    date: '',
    title: '',
    description: '',
    images: [],
    tags: [],
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (event) {
      setForm({
        date: event.date || '',
        title: event.title || '',
        description: event.description || '',
        images: event.images || [],
        tags: event.tags || [],
      })
    } else {
      // Default to today
      const today = new Date().toISOString().split('T')[0]
      setForm(f => ({ ...f, date: today }))
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
    } catch (e) {
      setError('图片处理失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  function removeImage(idx) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  function toggleTag(tag) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.date) return setError('请选择日期')
    if (!form.title.trim()) return setError('请输入标题')

    if (event) {
      dispatch({ type: 'UPDATE_EVENT', payload: { ...event, ...form } })
    } else {
      dispatch({ type: 'ADD_EVENT', payload: form })
    }
    onClose()
  }

  function handleDelete() {
    if (confirm('确定要删除这条记录吗？')) {
      dispatch({ type: 'DELETE_EVENT', payload: event.id })
      onClose()
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {event ? '编辑记录' : '添加新记录'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="例如：第一次翻身"
              maxLength={50}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="记录这个美好时刻的详情…"
              rows={3}
              maxLength={500}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    form.tags.includes(tag)
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              照片 {form.images.length > 0 && <span className="text-gray-400">({form.images.length}张)</span>}
            </label>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-rose-400 bg-rose-50'
                  : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-rose-400 text-sm">
                  <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                  处理中…
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <Upload size={20} />
                  <span className="text-sm">点击或拖拽上传照片</span>
                  <span className="text-xs">支持 JPG、PNG、WebP</span>
                </div>
              )}
            </div>

            {/* Image previews */}
            {form.images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {form.images.map((src, idx) => (
                  <div key={idx} className="relative group aspect-square">
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
          {event && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
            >
              <Trash2 size={15} />
              删除
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-sm font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            {event ? '保存' : '添加'}
          </button>
        </div>
      </div>
    </div>
  )
}
