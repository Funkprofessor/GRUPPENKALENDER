import React, { useState } from 'react'
import { Event, Room } from '../types'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import './RecentEvents.css'

interface RecentEventsProps {
  events: Event[]
  rooms: Room[]
  onEventClick: (event: Event) => void
  onAddEvent: () => void
}

const RecentEvents: React.FC<RecentEventsProps> = ({ 
  events, 
  rooms, 
  onEventClick, 
  onAddEvent 
}) => {
  const [showAll, setShowAll] = useState(false)
  const INITIAL_COUNT = 12

  // Gruppiere Events nach Wiederholungsgruppen und sortiere nach updatedAt (neueste zuerst)
  const groupedEvents = events.reduce((groups, event) => {
    if (event.repeatType !== 'none' && event.repeatGroupId) {
      // Für wiederholende Events: Gruppiere nach repeatGroupId
      if (!groups[event.repeatGroupId]) {
        groups[event.repeatGroupId] = {
          type: 'repeat',
          events: [],
          latestUpdate: new Date(event.updatedAt || event.createdAt)
        }
      }
      groups[event.repeatGroupId].events.push(event)
      const eventDate = new Date(event.updatedAt || event.createdAt)
      if (eventDate > groups[event.repeatGroupId].latestUpdate) {
        groups[event.repeatGroupId].latestUpdate = eventDate
      }
    } else {
      // Für einzelne Events: Verwende ID als Key
      groups[event.id] = {
        type: 'single',
        events: [event],
        latestUpdate: new Date(event.updatedAt || event.createdAt)
      }
    }
    return groups
  }, {} as Record<string, { type: 'repeat' | 'single', events: Event[], latestUpdate: Date }>)

  // Sortiere nach latestUpdate (neueste zuerst) und nehme nur die letzten 50
  const sortedGroups = Object.values(groupedEvents)
    .sort((a, b) => b.latestUpdate.getTime() - a.latestUpdate.getTime())
    .slice(0, 50)

  // Nehme den ersten Event jeder Gruppe als Repräsentant
  const allRecentEvents = sortedGroups.map(group => group.events[0])
  
  // Zeige nur die ersten 10 Events, es sei denn showAll ist true
  const recentEvents = showAll ? allRecentEvents : allRecentEvents.slice(0, INITIAL_COUNT)

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    return room?.name || roomId
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: de })
    } catch {
      return dateString
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString || timeString === '00:00') return ''
    return timeString
  }

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = formatDate(dateString)
    const time = formatTime(timeString)
    return time ? `${date} ${time}` : date
  }

  const getEventColor = (color: string) => {
    return color || '#808080'
  }

  const isAllDay = (event: Event) => {
    return event.startTime === '00:00' && event.endTime === '23:59'
  }

  const getRepeatText = (event: Event) => {
    if (event.repeatType === 'none') return ''
    
    let text = ''
    switch (event.repeatType) {
      case 'daily':
        text = event.repeatInterval && event.repeatInterval > 1 
          ? `alle ${event.repeatInterval} Tage` 
          : 'täglich'
        break
      case 'weekly':
        text = event.repeatInterval && event.repeatInterval > 1 
          ? `alle ${event.repeatInterval} Wochen` 
          : 'wöchentlich'
        break
      case 'monthly':
        text = 'monatlich'
        break
      case 'monthly_weekday':
        text = 'monatlich (Wochentag)'
        break
      case 'yearly':
        text = 'jährlich'
        break
    }
    
    if (event.repeatUntil) {
      text += ` bis ${formatDate(event.repeatUntil)}`
    }
    
    return text
  }

  const getLastModifiedText = (event: Event) => {
    // Für wiederholende Events: Finde die neueste Bearbeitung in der Gruppe
    let latestUpdate: Date
    if (event.repeatType !== 'none' && event.repeatGroupId) {
      const groupEvents = events.filter(e => e.repeatGroupId === event.repeatGroupId)
      latestUpdate = new Date(Math.max(...groupEvents.map(e => new Date(e.updatedAt || e.createdAt).getTime())))
    } else {
      latestUpdate = new Date(event.updatedAt || event.createdAt)
    }
    
    // Formatiere die Zeit als "HH:MM Uhr"
    return format(latestUpdate, 'HH:mm \'Uhr\'', { locale: de })
  }

  return (
    <div className="recent-events">
      <div className="recent-events-header">
        <h2>Zuletzt bearbeitete Termine</h2>
        <button className="add-event-btn" onClick={onAddEvent}>
          + Neuer Termin
        </button>
      </div>

      {recentEvents.length === 0 ? (
        <div className="no-events">
          <p>Keine Termine vorhanden</p>
        </div>
      ) : (
        <div className="events-list">
          {recentEvents.map((event) => (
            <div 
              key={event.id} 
              className="event-card"
              onClick={() => onEventClick(event)}
            >
              <div className="event-header">
                <div 
                  className="event-color-indicator"
                  style={{ backgroundColor: getEventColor(event.color) }}
                />
                <div className="event-title">{event.title}</div>
                <div className="event-room">{getRoomName(event.roomId)}</div>
              </div>
              
              <div className="event-details">
                <div className="event-datetime">
                  {isAllDay(event) ? (
                    <span className="all-day">Ganztägig</span>
                  ) : (
                    <span>
                      {formatDateTime(event.startDate, event.startTime)}
                      {event.endDate !== event.startDate && (
                        <span> - {formatDateTime(event.endDate, event.endTime)}</span>
                      )}
                    </span>
                  )}
                </div>
                
                {event.repeatType !== 'none' && (
                  <div className="event-repeat">
                    🔄 {getRepeatText(event)}
                  </div>
                )}
                
                {event.description && (
                  <div className="event-description">
                    ℹ️ {event.description}
                  </div>
                )}
              </div>
              
              <div className="event-footer">
                <div className="last-modified">
                  Zuletzt bearbeitet: {getLastModifiedText(event)}
                </div>
                <div className="event-actions">
                  <span className="click-hint">Klicken zum Bearbeiten</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* "Weitere anzeigen" Button */}
          {!showAll && allRecentEvents.length > INITIAL_COUNT && (
            <div className="show-more-container">
              <button 
                className="show-more-btn"
                onClick={() => setShowAll(true)}
              >
                Weitere {allRecentEvents.length - INITIAL_COUNT} Termine anzeigen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RecentEvents 