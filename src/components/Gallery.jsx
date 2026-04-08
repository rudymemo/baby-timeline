import { useState, useMemo } from 'react'
import { Plus, Image } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate } from '../utils/imageUtils'
import ImageViewer from './ImageViewer'
import EventModal from './EventModal'

function GalleryItem({ src, event, imgIndex, onView }) {
  return (
    <div className="masonry-item group relative overflow-hidden rounded-xl cursor-pointer" onClick={onView}>
      <img
        src={src}
        alt={event.title}
        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
        <p className="text-white font-semibold text-sm leading-tight">{event.title}</p>
        <p className="text-white/70 text-xs mt-0.5">{formatDate(event.date)}</p>
      </div>
    </div>
  )
}

export default function Gallery() {
  const { state } = useApp()
  const [viewer, setViewer] = useState(null) // { images, index }
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | tag name

  // Collect all images with event info
  const allImages = useMemo(() => {
    const imgs = []
    const sorted = [...state.events].sort((a, b) => new Date(b.date) - new Date(a.date))
    sorted.forEach(event => {
      if (event.images?.length) {
        event.images.forEach((src, i) => {
          imgs.push({ src, event, imgIndex: i })
        })
      }
    })
    return imgs
  }, [state.events])

  // Collect all tags
  const allTags = useMemo(() => {
    const tags = new Set()
    state.events.forEach(e => e.tags?.forEach(t => tags.add(t)))
    return Array.from(tags)
  }, [state.events])

  // Filter by tag
  const filtered = useMemo(() => {
    if (filter === 'all') return allImages
    return allImages.filter(({ event }) => event.tags?.includes(filter))
  }, [allImages, filter])

  // All images for viewer navigation
  const viewerImages = filtered.map(i => i.src)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-rose-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
            }`}
          >
            全部 ({allImages.length})
          </button>
          {allTags.map(tag => {
            const count = allImages.filter(i => i.event.tags?.includes(tag)).length
            return (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === tag
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
                }`}
              >
                {tag} ({count})
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white rounded-full text-sm font-medium hover:bg-rose-600 transition-colors shadow-sm"
        >
          <Plus size={15} />
          添加记录
        </button>
      </div>

      {/* Empty state */}
      {allImages.length === 0 && (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-gray-400 text-lg font-medium">还没有照片</p>
          <p className="text-gray-300 text-sm mt-1">添加记录并上传照片，在这里查看宝宝的成长相册</p>
        </div>
      )}

      {/* Masonry grid */}
      {filtered.length === 0 && allImages.length > 0 && (
        <div className="text-center py-16 text-gray-400">
          该标签下暂无照片
        </div>
      )}

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

      {/* Viewer */}
      {viewer && (
        <ImageViewer
          images={viewer.images}
          initialIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}

      {/* Modal */}
      {modal === 'add' && <EventModal onClose={() => setModal(null)} />}
    </div>
  )
}
