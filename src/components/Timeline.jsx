import { useState, useMemo } from 'react'
import { Plus, ImageIcon, Tag, Baby } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, formatAge } from '../utils/imageUtils'
import EventModal from './EventModal'
import ImageViewer from './ImageViewer'

function EventCard({ event, birthDate, onEdit, style }) {
  const [viewer, setViewer] = useState(null)
  const age = formatAge(event.date, birthDate)

  return (
    <div
      className="timeline-item bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden hover:shadow-md transition-shadow"
      style={style}
    >
      {/* Images row */}
      {event.images?.length > 0 && (
        <div
          className={`grid gap-0.5 ${
            event.images.length === 1
              ? 'grid-cols-1'
              : event.images.length === 2
              ? 'grid-cols-2'
              : 'grid-cols-3'
          }`}
        >
          {event.images.slice(0, 3).map((src, i) => (
            <div
              key={i}
              className={`relative overflow-hidden cursor-pointer ${
                event.images.length === 1 ? 'aspect-video' : 'aspect-square'
              }`}
              onClick={() => setViewer(i)}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {i === 2 && event.images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                  +{event.images.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs text-rose-400 font-medium">{formatDate(event.date)}</span>
              {age && (
                <span className="text-xs bg-rose-50 text-rose-400 px-2 py-0.5 rounded-full">
                  {age}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-800 text-base leading-tight">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-3">
                {event.description}
              </p>
            )}
          </div>
          <button
            onClick={() => onEdit(event)}
            className="shrink-0 p-1.5 rounded-full hover:bg-rose-50 text-gray-400 hover:text-rose-400 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {event.tags.map(tag => (
              <span key={tag} className="text-xs bg-lavender-50 text-violet-400 px-2 py-0.5 rounded-full border border-violet-100">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {viewer !== null && event.images?.length > 0 && (
        <ImageViewer
          images={event.images}
          initialIndex={viewer}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  )
}

export default function Timeline() {
  const { state } = useApp()
  const [modal, setModal] = useState(null) // null | 'add' | event object
  const [birthDate] = useState(() => localStorage.getItem('baby-birthdate') || '')

  const sortedEvents = useMemo(() => {
    return [...state.events].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [state.events])

  // Group by year-month
  const grouped = useMemo(() => {
    const groups = {}
    sortedEvents.forEach(event => {
      const [year, month] = event.date.split('-')
      const key = `${year}-${month}`
      if (!groups[key]) groups[key] = { year, month: parseInt(month), events: [] }
      groups[key].events.push(event)
    })
    return Object.values(groups).sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year
      return b.month - a.month
    })
  }, [sortedEvents])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Add button */}
      <button
        onClick={() => setModal('add')}
        className="w-full mb-6 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-rose-200 rounded-2xl text-rose-400 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-all font-medium"
      >
        <Plus size={18} />
        记录新时刻
      </button>

      {/* Empty state */}
      {state.events.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👶</div>
          <p className="text-gray-400 text-lg font-medium">还没有记录</p>
          <p className="text-gray-300 text-sm mt-1">点击上方按钮，开始记录宝宝的成长故事</p>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-8">
        {grouped.map(({ year, month, events }) => (
          <div key={`${year}-${month}`}>
            {/* Month header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {year}年{month}月
              </div>
              <div className="flex-1 h-px bg-rose-100" />
            </div>

            {/* Events */}
            <div className="space-y-3 ml-2 relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-rose-100" style={{ left: '-16px' }} />
              {events.map((event, idx) => (
                <div key={event.id} className="relative">
                  <div className="absolute w-2 h-2 bg-rose-300 rounded-full" style={{ left: '-20px', top: '20px' }} />
                  <EventCard
                    event={event}
                    birthDate={birthDate}
                    onEdit={setModal}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {modal === 'add' && <EventModal onClose={() => setModal(null)} />}
      {modal && modal !== 'add' && (
        <EventModal event={modal} onClose={() => setModal(null)} />
      )}
    </div>
  )
}
