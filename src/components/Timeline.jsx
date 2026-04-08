import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, formatAge } from '../utils/imageUtils'
import EventModal from './EventModal'
import ImageViewer from './ImageViewer'

// Tag -> color mapping for card accent
const TAG_COLORS = {
  '第一次': 'from-rose-400 to-pink-300',
  '里程碑': 'from-amber-400 to-yellow-300',
  '日常':   'from-green-400 to-emerald-300',
  '节日':   'from-red-400 to-orange-300',
  '旅行':   'from-sky-400 to-blue-300',
  '美食':   'from-orange-400 to-amber-300',
  '玩耍':   'from-purple-400 to-violet-300',
  '成长':   'from-teal-400 to-cyan-300',
}

const TAG_BADGE = {
  '第一次': 'bg-rose-50 text-rose-500 border-rose-200',
  '里程碑': 'bg-amber-50 text-amber-600 border-amber-200',
  '日常':   'bg-green-50 text-green-600 border-green-200',
  '节日':   'bg-orange-50 text-orange-600 border-orange-200',
  '旅行':   'bg-sky-50 text-sky-600 border-sky-200',
  '美食':   'bg-orange-50 text-orange-500 border-orange-200',
  '玩耍':   'bg-purple-50 text-purple-500 border-purple-200',
  '成长':   'bg-teal-50 text-teal-600 border-teal-200',
}

// Heart SVG dot for timeline
function HeartDot({ color = '#f43f5e' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
    </svg>
  )
}

const MONTH_GRADIENTS = [
  'from-rose-400 to-pink-400',
  'from-pink-400 to-fuchsia-400',
  'from-violet-400 to-purple-400',
  'from-blue-400 to-sky-400',
  'from-teal-400 to-emerald-400',
  'from-amber-400 to-orange-400',
]

function EventCard({ event, birthDate, onEdit, style }) {
  const [viewer, setViewer] = useState(null)
  const age = formatAge(event.date, birthDate)
  const firstTag = event.tags?.[0]
  const accentGradient = firstTag && TAG_COLORS[firstTag] ? TAG_COLORS[firstTag] : 'from-rose-300 to-pink-300'

  return (
    <div className="timeline-item cute-card" style={style}>
      {/* Top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${accentGradient}`} />

      {/* Images */}
      {event.images?.length > 0 && (
        <div className={`grid gap-0.5 ${
          event.images.length === 1 ? 'grid-cols-1' :
          event.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}>
          {event.images.slice(0, 3).map((src, i) => (
            <div
              key={i}
              className={`relative overflow-hidden cursor-pointer ${
                event.images.length === 1 ? 'aspect-video' : 'aspect-square'
              }`}
              onClick={() => setViewer(i)}
            >
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              {i === 2 && event.images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-black text-xl">
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
            {/* Date + age */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs text-pink-400 font-bold">📅 {formatDate(event.date)}</span>
              {age && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg,#fce7f3,#ede9fe)', color: '#c026d3' }}>
                  🌱 {age}
                </span>
              )}
            </div>
            <h3 className="font-black text-gray-800 text-base leading-snug">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-3 font-medium">
                {event.description}
              </p>
            )}
          </div>
          <button
            onClick={() => onEdit(event)}
            className="shrink-0 p-2 rounded-2xl hover:bg-rose-50 text-gray-300 hover:text-rose-400 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {event.tags.map(tag => (
              <span key={tag} className={`tag-pill ${TAG_BADGE[tag] || 'bg-pink-50 text-pink-500 border-pink-200'}`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {viewer !== null && (
        <ImageViewer images={event.images} initialIndex={viewer} onClose={() => setViewer(null)} />
      )}
    </div>
  )
}

export default function Timeline() {
  const { state } = useApp()
  const [modal, setModal] = useState(null)
  const [birthDate] = useState(() => localStorage.getItem('baby-birthdate') || '')

  const sortedEvents = useMemo(() =>
    [...state.events].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [state.events]
  )

  const grouped = useMemo(() => {
    const groups = {}
    sortedEvents.forEach(event => {
      const [year, month] = event.date.split('-')
      const key = `${year}-${month}`
      if (!groups[key]) groups[key] = { year, month: parseInt(month), events: [] }
      groups[key].events.push(event)
    })
    return Object.values(groups).sort((a, b) =>
      b.year !== a.year ? b.year - a.year : b.month - a.month
    )
  }, [sortedEvents])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Add button */}
      <button
        onClick={() => setModal('add')}
        className="add-btn-ring w-full mb-7 flex items-center justify-center gap-2 py-3.5 rounded-3xl text-rose-500 font-black text-sm transition-all duration-200 bg-white hover:bg-rose-50"
        style={{ boxShadow: '0 4px 18px rgba(251,113,133,0.15)' }}
      >
        <span className="text-base">✨</span>
        记录新时刻
        <span className="text-base">✨</span>
      </button>

      {/* Empty state */}
      {state.events.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-3 animate-float inline-block">👶</div>
          <p className="text-gray-400 text-lg font-black mt-2">还没有记录</p>
          <p className="text-gray-300 text-sm mt-1 font-semibold">点击上方按钮，开始记录宝宝的成长故事 💕</p>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-10">
        {grouped.map(({ year, month, events }, gi) => {
          const gradient = MONTH_GRADIENTS[gi % MONTH_GRADIENTS.length]
          return (
            <div key={`${year}-${month}`}>
              {/* Month header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`bg-gradient-to-r ${gradient} text-white text-sm font-black px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1`}>
                  🗓 {year}年{month}月
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,#fda4af,transparent)' }} />
              </div>

              {/* Events with timeline line */}
              <div className="relative space-y-3" style={{ paddingLeft: '28px' }}>
                {/* Vertical line */}
                <div className="absolute left-0 top-2 bottom-2 w-px"
                  style={{ background: 'linear-gradient(180deg, #fda4af, #c4b5fd)' }} />

                {events.map((event, idx) => (
                  <div key={event.id} className="relative">
                    {/* Heart dot */}
                    <div className="absolute" style={{ left: '-21px', top: '20px' }}>
                      <HeartDot color={idx % 2 === 0 ? '#f43f5e' : '#a78bfa'} />
                    </div>
                    <EventCard
                      event={event}
                      birthDate={birthDate}
                      onEdit={setModal}
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      {modal === 'add' && <EventModal onClose={() => setModal(null)} />}
      {modal && modal !== 'add' && <EventModal event={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
