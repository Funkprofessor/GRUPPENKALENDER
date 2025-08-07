/**
 * TypeScript-Typdefinitionen für den Kulturforum Kalender
 */

// Verfügbare Farben für Events (20 Farben)
export type EventColor = 
  | '#FF6B6B' // Rot
  | '#4ECDC4' // Türkis
  | '#45B7D1' // Blau
  | '#96CEB4' // Grün
  | '#FFEAA7' // Gelb
  | '#DDA0DD' // Lila
  | '#FFB347' // Orange
  | '#98D8C8' // Mint
  | '#F7DC6F' // Gold
  | '#BB8FCE' // Lavendel
  | '#85C1E9' // Himmelblau
  | '#F8C471' // Pfirsich
  | '#82E0AA' // Mintgrün
  | '#F1948A' // Rosa
  | '#FAD7A0' // Beige
  | '#FFFFFF' // Weiß
  | '#E0E0E0' // Hellgrau (neue Standardfarbe)
  | '#808080' // Grau
  | '#404040' // Dunkelgrau
  | '#000000' // Schwarz

// Wiederholungstypen für Events
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'monthly_weekday'

// Wochentag für monatliche Wiederholungen
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7 // Montag = 1, Sonntag = 7
export type WeekOfMonth = 1 | 2 | 3 | 4 | 5 // 1. Woche, 2. Woche, etc.

// Raum-Definition
export interface Room {
  id: string
  name: string
}

// Event-Definition
export interface Event {
  id: string
  title: string
  description?: string
  roomId: string
  startDate: string // ISO 8601 Format
  endDate: string // ISO 8601 Format
  startTime: string // HH:mm Format
  endTime: string // HH:mm Format
  color: EventColor
  repeatType: RepeatType
  repeatInterval?: number // Intervall für Wiederholungen (1 = jeden Tag, 2 = alle 2 Tage, etc.)
  repeatUntil?: string // ISO 8601 Format für Enddatum der Wiederholung
  repeatGroupId?: string // ID für die Wiederholungsgruppe
  repeatWeekday?: Weekday // Wochentag für monatliche Wiederholungen (1-7, Montag=1)
  repeatWeekOfMonth?: WeekOfMonth // Woche im Monat für monatliche Wiederholungen (1-5)
  createdAt: string
  updatedAt: string
}

// Event ohne ID für das Erstellen neuer Events
export type CreateEventData = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>

// Event-Update-Daten
export type UpdateEventData = Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>

// Kalender-Tag-Definition
export interface CalendarDay {
  date: Date
  dayOfWeek: string
  isHoliday: boolean
  holidayName?: string
  isSchoolHoliday: boolean
  schoolHolidayName?: string
  events: Event[]
}

// API-Response-Typen
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface EventsResponse extends ApiResponse<Event[]> {}
export interface EventResponse extends ApiResponse<Event> {}

// Feiertage und Schulferien (Bayern)
export interface Holiday {
  date: string
  name: string
  type: 'holiday' | 'school_holiday' | 'additional_day'
}

// Kalender-Navigation
export interface CalendarNavigation {
  currentMonth: Date
  canGoBack: boolean
  canGoForward: boolean
}

// Wiederholungs-Abfrage-Typen
export type RepeatAction = 'single' | 'all'

// Event-Modal-Props
export interface EventModalProps {
  event: Event | null
  rooms: Room[]
  onSave: (eventData: CreateEventData | Event) => void
  onSaveMultiple?: (eventsData: CreateEventData[]) => void
  onDelete?: (action?: RepeatAction) => void
  onCopy?: (originalEvent: Event) => void
  onClose: () => void
  // Vorausgewählte Werte für neue Events
  preselectedDate?: string
  preselectedRoomId?: string
}

// Calendar-Props
export interface CalendarProps {
  events: Event[]
  rooms: Room[]
  onEventClick: (event: Event) => void
  onAddEvent: () => void
  onAddEventWithPreselection?: (date: string, roomId: string) => void
}

// EventsList-Props
export interface EventsListProps {
  events: Event[]
  rooms: Room[]
  onEventClick: (event: Event) => void
} 