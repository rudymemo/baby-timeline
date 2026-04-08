import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'baby-timeline-events'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

const initialState = {
  events: [],
  view: 'timeline', // 'timeline' | 'gallery'
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload }
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, { ...action.payload, id: generateId() }] }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(e => e.id === action.payload.id ? action.payload : e),
      }
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(e => e.id !== action.payload) }
    case 'SET_VIEW':
      return { ...state, view: action.payload }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        dispatch({ type: 'SET_EVENTS', payload: JSON.parse(stored) })
      }
    } catch (e) {
      console.error('Failed to load events:', e)
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events))
    } catch (e) {
      console.error('Failed to save events:', e)
    }
  }, [state.events])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
