import React, { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import EventsList from './components/EventsList'
import EventModal from './components/EventModal'
import { Event, Room, RepeatAction } from './types'
import { fetchEvents, createEvent, updateEvent, deleteEvent } from './api/events'
import './App.css'

/**
 * Haupt-App-Komponente für den Kulturforum Kalender
 * Verwaltet den globalen Zustand und die Kommunikation mit der API
 */
function App() {
  // Zustand für Events und UI
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [preselectedDate, setPreselectedDate] = useState<string | undefined>(undefined)
  const [preselectedRoomId, setPreselectedRoomId] = useState<string | undefined>(undefined)
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  // Verfügbare Räume für den Kalender
  const rooms: Room[] = [
    { id: 'r3-ausstellung', name: 'R3 Ausstellung' },
    { id: 'r3-veranstaltung', name: 'R3 Veranstaltung' },
    { id: 'kabinett', name: 'Kabinett' },
    { id: 'speckdrumm', name: 'Speckdrumm' },
    { id: 'extern1', name: 'Extern 1' },
    { id: 'extern2', name: 'Extern 2' }
  ]

  // Events beim ersten Laden abrufen
  useEffect(() => {
    loadEvents()
  }, [])

  /**
   * Lädt alle Events von der API
   */
  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedEvents = await fetchEvents()
      setEvents(fetchedEvents)
    } catch (err) {
      setError('Fehler beim Laden der Termine: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Öffnet das Modal zum Bearbeiten eines Events
   */
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  /**
   * Öffnet das Modal zum Erstellen eines neuen Events
   */
  const handleAddEvent = () => {
    setSelectedEvent(null)
    setPreselectedDate(undefined)
    setPreselectedRoomId(undefined)
    setIsModalOpen(true)
  }

  /**
   * Öffnet das Modal zum Erstellen eines neuen Events mit vorausgewählten Werten
   */
  const handleAddEventWithPreselection = (date: string, roomId: string) => {
    setSelectedEvent(null)
    setPreselectedDate(date)
    setPreselectedRoomId(roomId)
    setIsModalOpen(true)
  }

  /**
   * Speichert ein Event (erstellt oder aktualisiert)
   */
  const handleSaveEvent = async (eventData: Omit<Event, 'id'> | Event) => {
    try {
      if ('id' in eventData && eventData.id) {
        // Event aktualisieren
        const updatedEvent = await updateEvent(eventData.id, eventData)
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e))
      } else {
        // Neues Event erstellen
        const newEvent = await createEvent(eventData)
        setEvents(prev => [...prev, newEvent])
      }
      setIsModalOpen(false)
      setSelectedEvent(null)
    } catch (err) {
      setError('Fehler beim Speichern: ' + (err as Error).message)
    }
  }

  /**
   * Aktualisiert alle Events einer Wiederholungsgruppe
   */
  const handleUpdateRepeatGroup = async (eventData: Event) => {
    try {
      if (!eventData.repeatGroupId) {
        // Fallback zu normalem Update
        await handleSaveEvent(eventData)
        return
      }

      // Finde alle Events der Wiederholungsgruppe
      const groupEvents = events.filter(e => e.repeatGroupId === eventData.repeatGroupId)
      
      // Aktualisiere alle Events der Gruppe
      for (const groupEvent of groupEvents) {
        const updatedEventData = {
          ...eventData,
          id: groupEvent.id,
          startDate: groupEvent.startDate, // Behalte das ursprüngliche Datum
          endDate: groupEvent.endDate
        }
        await updateEvent(groupEvent.id, updatedEventData)
      }

      // Aktualisiere den lokalen Zustand
      const updatedEvents = await fetchEvents()
      setEvents(updatedEvents)
      setIsModalOpen(false)
      setSelectedEvent(null)
    } catch (err) {
      setError('Fehler beim Aktualisieren der Wiederholung: ' + (err as Error).message)
    }
  }

  /**
   * Speichert mehrere Events (für Wiederholungen)
   */
  const handleSaveMultipleEvents = async (eventsData: Omit<Event, 'id'>[]) => {
    try {
      console.log('handleSaveMultipleEvents aufgerufen mit:', eventsData.length, 'Events')
      
      // Wenn es sich um eine Aktualisierung eines bestehenden Events handelt
      if (selectedEvent) {
        // Lösche zuerst alle bestehenden Events der Wiederholungsgruppe
        if (selectedEvent.repeatGroupId) {
          const eventsToDelete = events.filter(e => e.repeatGroupId === selectedEvent.repeatGroupId)
          for (const event of eventsToDelete) {
            await deleteEvent(event.id)
          }
          setEvents(prev => prev.filter(e => e.repeatGroupId !== selectedEvent.repeatGroupId))
        } else {
          // Fallback: Lösche Events mit gleichem Titel und Wiederholungstyp
          const eventsToDelete = events.filter(e => 
            e.title === selectedEvent.title && 
            e.repeatType === selectedEvent.repeatType && 
            e.repeatUntil === selectedEvent.repeatUntil
          )
          for (const event of eventsToDelete) {
            await deleteEvent(event.id)
          }
          setEvents(prev => prev.filter(e => 
            !(e.title === selectedEvent.title && 
              e.repeatType === selectedEvent.repeatType && 
              e.repeatUntil === selectedEvent.repeatUntil)
          ))
        }
      }
      
      // Erstelle die neuen Events
      const newEvents: Event[] = []
      for (const eventData of eventsData) {
        console.log('Erstelle Event:', eventData)
        const newEvent = await createEvent(eventData)
        newEvents.push(newEvent)
      }
      console.log('Alle Events erstellt:', newEvents.length)
      setEvents(prev => [...prev, ...newEvents])
      setIsModalOpen(false)
      setSelectedEvent(null)
    } catch (err) {
      console.error('Fehler beim Speichern der Wiederholungen:', err)
      setError('Fehler beim Speichern der Wiederholungen: ' + (err as Error).message)
    }
  }

  /**
   * Löscht ein Event
   */
  const handleDeleteEvent = async (eventId: string, action?: 'single' | 'all') => {
    try {
      if (action === 'all' && selectedEvent) {
        // Alle Events der Wiederholung löschen
        if (selectedEvent.repeatGroupId) {
          // Wenn repeatGroupId vorhanden ist, lösche alle Events der Gruppe
          const eventsToDelete = events.filter(e => e.repeatGroupId === selectedEvent.repeatGroupId)
          for (const event of eventsToDelete) {
            await deleteEvent(event.id)
          }
          setEvents(prev => prev.filter(e => e.repeatGroupId !== selectedEvent.repeatGroupId))
        } else {
          // Wenn keine repeatGroupId vorhanden ist, lösche alle Events mit gleichem Titel und Wiederholungstyp
          const eventsToDelete = events.filter(e => 
            e.title === selectedEvent.title && 
            e.repeatType === selectedEvent.repeatType && 
            e.repeatUntil === selectedEvent.repeatUntil
          )
          for (const event of eventsToDelete) {
            await deleteEvent(event.id)
          }
          setEvents(prev => prev.filter(e => 
            !(e.title === selectedEvent.title && 
              e.repeatType === selectedEvent.repeatType && 
              e.repeatUntil === selectedEvent.repeatUntil)
          ))
        }
      } else {
        // Nur das einzelne Event löschen
        await deleteEvent(eventId)
        setEvents(prev => prev.filter(e => e.id !== eventId))
      }
      setIsModalOpen(false)
      setSelectedEvent(null)
    } catch (err) {
      setError('Fehler beim Löschen: ' + (err as Error).message)
    }
  }

  return (
    <div className="app">
      {/* Header mit Titel, View-Toggle und Add-Button */}
      <header className="app-header">
        <h1>Kulturforum Ansbach - Kalender</h1>
        <div className="header-controls">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
              title="Kalenderansicht"
            >
              📅 Kalender
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Listenansicht"
            >
              📋 Liste
            </button>
          </div>
          <button 
            className="add-event-btn"
            onClick={handleAddEvent}
            title="Neuen Termin hinzufügen"
          >
            + Neuer Termin
          </button>
        </div>
      </header>

      {/* Fehlermeldung anzeigen */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Loading-Indikator */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Lade Termine...</p>
        </div>
      )}

      {/* Hauptkomponente - Kalender oder Liste */}
      <main className="app-main">
        {viewMode === 'calendar' ? (
          <Calendar 
            events={events} 
            rooms={rooms} 
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
            onAddEventWithPreselection={handleAddEventWithPreselection}
          />
        ) : (
          <EventsList 
            events={events} 
            rooms={rooms} 
            onEventClick={handleEventClick}
          />
        )}
      </main>

      {/* Modal für Event-Bearbeitung */}
      {isModalOpen && (
        <EventModal
          event={selectedEvent}
          rooms={rooms}
          onSave={handleSaveEvent}
          onSaveMultiple={handleSaveMultipleEvents}
          onDelete={selectedEvent ? (action: RepeatAction) => handleDeleteEvent(selectedEvent.id, action) : undefined}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedEvent(null)
            setPreselectedDate(undefined)
            setPreselectedRoomId(undefined)
          }}
          preselectedDate={preselectedDate}
          preselectedRoomId={preselectedRoomId}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2025 Kulturforum Ansbach</p>
          <p>Entwickelt von Stefan Kammerer</p>
        </div>
      </footer>
    </div>
  )
}

export default App 