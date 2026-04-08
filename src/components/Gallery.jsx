import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate } from '../utils/imageUtils'
import ImageViewer from './ImageViewer'
import EventModal from './EventModal'

const TAG_EMOJIS = {
  '第一次': '🌟', '里程碑': '🏆', '日常': '🌈', '节日': '🎉',
  '旅行': '✈️', '美食': '🍰', '玩耍': '🎪', '成长': '🌱',
}

function GalleryItem({ src, event, onView }) {
  return (
    <div
      className="masonry-item group relative overflow-hidden cursor-pointer"
      style={{ borderRadius: '16px', boxShadow: '0 4px 16px rgba(251,113,133,0.1)' }}
      onClick={onView}
    >
      <img
        src={src}
        alt={event.title}
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }}>
        <p className="text-white font-black text-sm leading-tight drop-shadow">{event.title}</p>
        <p className="text-white/70 text-xs mt-0.5 font-semibold">{formatDate(event.date)}</p>
      </div>
    </div>
  )
}

export default function Gallery() {
  const { state } = useApp()
  const [viewer, setViewer] = useState(null)
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState('all')

  const allImages = useMemo(() => {
    const imgs = []
    const sorted = [...state.events].sort((a, b) => new Date(b.date) - new Date(a.date))
    sorted.forEach(event => {
      event.images?.forEach((src, i) => imgs.push({ src, event, imgIndex: i }))
    })
    return imgs
  }, [state.events])

  const allTags = useMemo(() => {
    const tags = new Set()
    state.events.forEach(e => e.tags?.forEach(t => tags.add(t)))
    return Array.from(tags)
  }, [state.events])

  const filtered = useMemo(() => {
    if (filter === 'all') return allImages
    return allImages.filter(({ event }) => event.tags?.includes(filter))
  }, [allImages, filter])

  const viewerImages = filtered.map(i => i.src)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
              filter === 'all'
                ? 'text-white shadow-sm'
                : 'bg-white text-gray-500 border border-pink-100 hover:border-pink-300'
            }`}
            style={filter === 'all' ? {
              background: 'linear-gradient(135deg,#f43f5e,#ec4899)',
              boxShadow: '0 4px 12px rgba(244,63,94,0.3)',
            } : {}}
          >
            📷 全部 ({allImages.length})
          </button>
          {allTags.map(tag => {
            const count = allImages.filter(i => i.event.tags?.includes(tag)).length
            const emoji = TAG_EMOJIS[tag] || '🏷️'
            return (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-4 py-1.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  filter === tag
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-pink-100 hover:border-pink-300'
                }`}
                style={filter === tag ? {
                  background: 'linear-gradient(135deg,#f43f5e,#ec4899)',
                  boxShadow: '0 4px 12px rgba(244,63,94,0.3)',
                } : {}}
              >
                {emoji} {tag} ({count})
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setModal('add')}
          className="cute-btn-primary flex items-center gap-1.5"
        >
          <Plus size={15} />
          添加记录
        </button>
      </div>

      {/* Empty state */}
      {allImages.length === 0 && (
        <div className="text-center py-24">
          <div className="text-6xl mb-4 animate-float inline-block">📷</div>
          <p className="text-gray-400 text-lg font-black mt-2">还没有照片</p>
          <p className="text-gray-300 text-sm mt-1 font-semibold">添加记录并上传照片，查看宝宝的成长相册 🌸</p>
        </div>
      )}

      {filtered.length === 0 && allImages.length > 0 && (
        <div className="text-center py-16 text-gray-400 font-semibold">该标签下暂无照片</div>
      )}

      {/* Masonry grid */}
      <div className="masonry-grid">
        {filtered.map(({ src, event, imgIndex }, idx) => (
          <GalleryItem
            key={`${event.id}-${imgIndex}`}
            src={src}
            event={event}
            imgIndex={imgIndex}
            onView={() => setViewer({ images: viewerImages, index: idx })}
          />
        ))}
      </div>

      {viewer && (
        <ImageViewer images={viewer.images} initialIndex={viewer.index} onClose={() => setViewer(null)} />
      )}
      {modal === 'add' && <EventModal onClose={() => setModal(null)} />}
    </div>
  )
}
