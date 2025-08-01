import React, { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import { Event } from '../types'
import './EventsList.css'

interface EventsListProps {
  events: Event[]
  rooms: { id: string; name: string }[]
  onEventClick: (event: Event) => void
}

const EventsList: React.FC<EventsListProps> = ({ events, rooms, onEventClick }) => {
  // Gruppiere Events nach Datum und sortiere chronologisch
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: Event[] } = {}
    
    // Sortiere Events nach Startdatum und -zeit
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(`${a.startDate}T${a.startTime}`)
      const dateB = new Date(`${b.startDate}T${b.startTime}`)
      return dateA.getTime() - dateB.getTime()
    })
    
    // Gruppiere nach Datum
    sortedEvents.forEach(event => {
      const dateKey = event.startDate
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(event)
    })
    
    return groups
  }, [events])

  // Sortiere die Datumsgruppen chronologisch
  const sortedDates = useMemo(() => {
    return Object.keys(groupedEvents).sort()
  }, [groupedEvents])

  // Funktion um den Header-Text für ein Event zu generieren
  const getEventHeaderText = (event: Event) => {
    const startDate = formatDate(event.startDate)
    const isMultiDay = event.startDate !== event.endDate
    
    if (isMultiDay) {
      const endDate = formatDate(event.endDate)
      return `${event.title} (${startDate} - ${endDate})`
    } else {
      return `${event.title} (${startDate})`
    }
  }

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString)
    return format(date, 'EEEE, dd.MM.yyyy', { locale: de })
  }

  const formatTime = (time: string) => {
    if (!time || time.length !== 5) return time
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(time)) return time
    return time
  }

  const getRoomName = (roomId: string) => {
    return rooms.find(room => room.id === roomId)?.name || 'Unbekannter Raum'
  }

  const isAllDayEvent = (event: Event) => {
    return event.startTime === '00:00' && event.endTime === '23:59'
  }

  const isMultiDayEvent = (event: Event) => {
    return event.startDate !== event.endDate
  }

  return (
    <div className="events-list-container">
      <div className="events-list-header">
        <h2>Alle Termine - Chronologische Übersicht</h2>
        <p>Insgesamt {events.length} Termin{events.length !== 1 ? 'e' : ''}</p>
      </div>
      
      {sortedDates.length === 0 ? (
        <div className="no-events">
          <p>Keine Termine vorhanden</p>
        </div>
      ) : (
        <div className="events-list">
          {sortedDates.map(dateKey => {
            const dateEvents = groupedEvents[dateKey]
            return (
              <div key={dateKey} className="date-group">
                <div className="date-header">
                  <h3>{formatDate(dateKey)}</h3>
                  <span className="event-count">
                    {dateEvents.length} Termin{dateEvents.length !== 1 ? 'e' : ''}
                  </span>
                </div>
                
                <div className="events-for-date">
                  {dateEvents.map(event => {
                    const isMultiDay = event.startDate !== event.endDate
                    
                    // Für mehrtägige Events: Zeige separaten Header mit Titel
                    if (isMultiDay) {
                      return (
                        <div key={event.id} className="multi-day-event-group">
                          <div className="multi-day-event-header">
                            <h4>{getEventHeaderText(event)}</h4>
                            <span className="event-location-badge">{getRoomName(event.roomId)}</span>
                          </div>
                          <div className="multi-day-event-details">
                            <div className="event-time">
                              {isAllDayEvent(event) ? 'Ganztägig' : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                            </div>
                            {event.description && (
                              <div className="event-description">{event.description}</div>
                            )}
                            <div className="event-meta">
                              {event.repeatType !== 'none' && (
                                <span className="repeat-indicator">
                                  {event.repeatType === 'daily' && 'Täglich'}
                                  {event.repeatType === 'weekly' && 'Wöchentlich'}
                                  {event.repeatType === 'monthly' && 'Monatlich'}
                                  {event.repeatType === 'yearly' && 'Jährlich'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    
                    // Für eintägige Events: Normale Anzeige
                    const startTime = formatTime(event.startTime)
                    const endTime = formatTime(event.endTime)
                    const isAllDay = isAllDayEvent(event)
                    
                    let timeDisplay = ''
                    if (isAllDay) {
                      // Eintägiger ganztägiger Termin
                      timeDisplay = 'Ganztägig'
                    } else {
                      // Eintägiger Termin mit Uhrzeiten
                      timeDisplay = `${startTime} - ${endTime}`
                    }
                    
                    return (
                      <div
                        key={event.id}
                        className="event-item"
                        onClick={() => onEventClick(event)}
                        style={{ borderLeftColor: event.color }}
                      >
                        <div className="event-time">{timeDisplay}</div>
                        <div className="event-details">
                          <div className="event-title">{event.title}</div>
                          <div className="event-location">{getRoomName(event.roomId)}</div>
                          {event.description && (
                            <div className="event-description">{event.description}</div>
                          )}
                        </div>
                        <div className="event-meta">
                          {event.repeatType !== 'none' && (
                            <span className="repeat-indicator">
                              {event.repeatType === 'daily' && 'Täglich'}
                              {event.repeatType === 'weekly' && 'Wöchentlich'}
                              {event.repeatType === 'monthly' && 'Monatlich'}
                              {event.repeatType === 'yearly' && 'Jährlich'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EventsList 