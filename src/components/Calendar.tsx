import React, { useState, useMemo } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getWeek, startOfWeek, endOfWeek } from 'date-fns'
import { de } from 'date-fns/locale'
import { Event, Room, CalendarProps } from '../types'
import { getHolidaysForDate } from '../utils/holidays'
import './Calendar.css'

/**
 * Hauptkalender-Komponente
 * Zeigt den Kalender in Listenform mit sticky Headers an
 */
const Calendar: React.FC<CalendarProps> = ({ events, rooms, onEventClick, onAddEvent, onAddEventWithPreselection }) => {
  // Aktueller Monat für die Anzeige
  const [currentMonth, setCurrentMonth] = useState(new Date()) // Startet mit dem aktuellen Monat

  /**
   * Generiert alle Tage des aktuellen Monats
   */
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  /**
   * Gruppiert Events nach Datum und Raum
   */
  const eventsByDateAndRoom = useMemo(() => {
    const grouped: Record<string, Record<string, Event[]>> = {}
    
    daysInMonth.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd')
      grouped[dateKey] = {}
      
      rooms.forEach(room => {
        grouped[dateKey][room.id] = []
      })
    })

    events.forEach(event => {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      
      // Für jeden Tag zwischen Start- und Enddatum das Event hinzufügen
      let currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        const dateKey = format(currentDate, 'yyyy-MM-dd')
        
        if (grouped[dateKey] && grouped[dateKey][event.roomId]) {
          // Prüfe ob das Event bereits für diesen Tag existiert
          const existingEvent = grouped[dateKey][event.roomId].find(e => e.id === event.id)
          if (!existingEvent) {
            grouped[dateKey][event.roomId].push(event)
          }
        }
        
        // Nächster Tag
        currentDate.setDate(currentDate.getDate() + 1)
      }
    })

    return grouped
  }, [events, rooms, daysInMonth])

  /**
   * Navigiert zum vorherigen Monat
   */
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  /**
   * Navigiert zum nächsten Monat
   */
  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  /**
   * Navigiert zum aktuellen Monat
   */
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date())
  }

  /**
   * Formatiert die Zeit für die Anzeige
   */
  const formatTime = (time: string) => {
    // Stelle sicher, dass die Zeit im korrekten Format ist
    if (!time || time.length !== 5) {
      return time
    }
    
    // Validiere das Format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(time)) {
      return time
    }
    
    return time
  }

  /**
   * Prüft ob ein Event ganztägig ist
   */
  const isAllDayEvent = (event: Event) => {
    return event.startTime === '00:00' && event.endTime === '23:59'
  }

  /**
   * Prüft ob ein Event an diesem Tag beginnt
   */
  const isEventStartDay = (event: Event, day: Date) => {
    return format(new Date(event.startDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
  }

  /**
   * Prüft ob ein Event an diesem Tag endet
   */
  const isEventEndDay = (event: Event, day: Date) => {
    return format(new Date(event.endDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
  }

  /**
   * Rendert ein Event in der Zelle
   */
  const renderEvent = (event: Event, day: Date) => {
    const startTime = formatTime(event.startTime)
    const endTime = formatTime(event.endTime)
    const isAllDay = isAllDayEvent(event)
    const isStart = isEventStartDay(event, day)
    const isEnd = isEventEndDay(event, day)
    

    
    // Bestimme CSS-Klassen für die Darstellung
    let eventClass = 'calendar-event'
    if (isAllDay) {
      eventClass += ' all-day-event'
    }
    if (!isStart) {
      eventClass += ' event-continuation'
    }
    if (!isEnd) {
      eventClass += ' event-continues'
    }
    
    // Erstelle den Tooltip-Text mit korrekter Zeit
    let tooltipText = event.title
    if (isAllDay) {
      tooltipText += ' (ganztägig)'
    } else {
      tooltipText += ` (${startTime} - ${endTime})`
    }
    
    return (
      <div
        key={event.id}
        className={eventClass}
        style={{ backgroundColor: event.color }}
        onClick={() => onEventClick(event)}
        title={tooltipText}
      >
        {isStart && !isAllDay && <div className="event-time">{startTime}</div>}
        {isStart && <div className="event-title">{event.title}</div>}
        {!isStart && !isEnd && <div className="event-continuation-indicator">●</div>}
      </div>
    )
  }

  /**
   * Rendert eine Kalenderzelle für einen Raum
   */
  const renderRoomCell = (day: Date, room: Room) => {
    const dateKey = format(day, 'yyyy-MM-dd')
    const dayEvents = eventsByDateAndRoom[dateKey]?.[room.id] || []
    
    return (
      <td key={room.id} className="calendar-cell">
        <div className="cell-content">
          {dayEvents.map(event => renderEvent(event, day))}
          <button
            className="add-event-in-cell"
            onClick={() => {
              // Öffne Modal mit vorausgewählten Werten
              if (onAddEventWithPreselection) {
                const dateKey = format(day, 'yyyy-MM-dd')
                onAddEventWithPreselection(dateKey, room.id)
              } else {
                onAddEvent()
              }
            }}
            title={`Termin in ${room.name} hinzufügen`}
          >
            +
          </button>
        </div>
      </td>
    )
  }

  /**
   * Rendert eine Kalenderzeile für einen Tag
   */
  const renderDayRow = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd')
    const dayOfWeek = format(day, 'EEEE', { locale: de })
    const dateFormatted = format(day, 'dd.MM.yyyy')
    const holidays = getHolidaysForDate(day)
    
    return (
      <tr key={dateKey} className="calendar-row">
        {/* Datum */}
        <td className="calendar-date-cell sticky-left">
          <div className="date-info">
            <div className="date-number">{format(day, 'dd')}</div>
            <div className="date-month">{format(day, 'MM')}</div>
          </div>
        </td>
        
        {/* Wochentag */}
        <td className="calendar-day-cell sticky-left">
          <div className="day-info">
            <div className="day-name">{format(day, 'EEE', { locale: de, weekStartsOn: 1 })}</div>
            {holidays.length > 0 && (
              <div className="holiday-info">
                {holidays.map((holiday, index) => (
                  <span 
                    key={index} 
                    className="holiday-badge"
                    data-type={holiday.type}
                  >
                    {holiday.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </td>
        
        {/* Raum-Spalten */}
        {rooms.map(room => renderRoomCell(day, room))}
      </tr>
    )
  }

  return (
    <div className="calendar-container">
      {/* Kalender-Navigation */}
      <div className="calendar-navigation">
        <button 
          className="nav-btn"
          onClick={goToPreviousMonth}
          title="Vorheriger Monat"
        >
          ←
        </button>
        
        <h2 className="current-month">
          {format(currentMonth, 'MMMM yyyy', { locale: de })}
        </h2>
        
        <button 
          className="nav-btn"
          onClick={goToNextMonth}
          title="Nächster Monat"
        >
          →
        </button>
        
        <button 
          className="nav-btn current-btn"
          onClick={goToCurrentMonth}
          title="Aktueller Monat"
        >
          Heute
        </button>
      </div>

      {/* Kalender-Tabelle */}
      <div className="calendar-table-container">
        <table className="calendar-table">
          <thead className="calendar-header sticky-top">
            <tr>
              <th className="header-date sticky-left">Datum</th>
              <th className="header-day sticky-left">Wochentag</th>
              {rooms.map(room => (
                <th key={room.id} className="header-room">
                  {room.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="calendar-body">
            {daysInMonth.map(renderDayRow)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Calendar 