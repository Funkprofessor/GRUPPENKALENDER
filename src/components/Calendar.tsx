import React, { useState, useEffect, useRef } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns'
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
  const todayRowRef = useRef<HTMLTableRowElement>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  /**
   * Generiert alle Tage des aktuellen Monats
   */
  const daysInMonth = React.useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  /**
   * Prüft ob zwei Events zeitlich kollidieren
   */
  const eventsCollide = (event1: Event, event2: Event): boolean => {
    // Wenn Events an verschiedenen Tagen sind, können sie nicht kollidieren
    if (event1.startDate > event2.endDate || event2.startDate > event1.endDate) {
      return false
    }
    
    // Wenn beide Events ganztägig sind, kollidieren sie
    if (isAllDayEvent(event1) && isAllDayEvent(event2)) {
      return true
    }
    
    // Wenn nur eines ganztägig ist, kollidiert es mit dem anderen
    if (isAllDayEvent(event1) || isAllDayEvent(event2)) {
      return true
    }
    
    // Für Events mit spezifischen Zeiten: Prüfe Zeitüberschneidung
    const event1Start = new Date(`${event1.startDate}T${event1.startTime}`)
    const event1End = new Date(`${event1.endDate}T${event1.endTime}`)
    const event2Start = new Date(`${event2.startDate}T${event2.startTime}`)
    const event2End = new Date(`${event2.endDate}T${event2.endTime}`)
    
    return event1Start < event2End && event2Start < event1End
  }

  /**
   * Prüft ob ein wiederkehrendes Event an einem bestimmten Tag stattfindet
   */
  const isRecurringEventOnDay = (event: Event, day: Date): boolean => {
    const dayKey = format(day, 'yyyy-MM-dd')
    
    // Wenn das Event nicht wiederkehrend ist, prüfe nur das Datum
    if (event.repeatType === 'none') {
      return event.startDate <= dayKey && event.endDate >= dayKey
    }
    
    // Prüfe ob der Tag nach dem Enddatum der Wiederholung liegt
    if (event.repeatUntil && dayKey > event.repeatUntil) {
      return false
    }
    
    // Prüfe ob der Tag vor dem Startdatum liegt
    if (dayKey < event.startDate) {
      return false
    }
    
    const startDate = new Date(event.startDate)
    const checkDate = new Date(dayKey)
    
    switch (event.repeatType) {
      case 'daily':
        // Täglich: Jeder Tag zwischen Start und Ende
        // Prüfe ob der spezifische Tag zwischen Start- und Enddatum liegt
        const eventEndDate = event.repeatUntil ? new Date(event.repeatUntil) : new Date(event.endDate)
        
        // Wenn kein repeatInterval gesetzt ist, verwende 1 (täglich)
        const interval = event.repeatInterval || 1
        
        // Berechne die Anzahl der Tage seit dem Start
        const daysSinceStart = Math.floor((checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        
        // Prüfe ob der Tag im Intervall liegt und zwischen Start und Ende
        return checkDate >= startDate && checkDate <= eventEndDate && daysSinceStart % interval === 0
        

        
      case 'weekly':
        // Wöchentlich: Gleicher Wochentag
        // Wenn kein repeatInterval gesetzt ist, verwende 1 (jede Woche)
        const weeklyInterval = event.repeatInterval || 1
        
        // Berechne die Anzahl der Wochen seit dem Start
        const weeksSinceStart = Math.floor((checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
        
        // Prüfe ob der Tag der gleiche Wochentag ist und im Intervall liegt
        return startDate.getDay() === checkDate.getDay() && weeksSinceStart % weeklyInterval === 0
        
      case 'monthly':
        // Monatlich: Gleicher Tag im Monat
        return startDate.getDate() === checkDate.getDate()
        
      case 'monthly_weekday':
        // Monatlich an Wochentag: Gleicher Wochentag in gleicher Woche des Monats
        if (event.repeatWeekday && event.repeatWeekOfMonth) {
          const startWeek = Math.ceil(startDate.getDate() / 7)
          const checkWeek = Math.ceil(checkDate.getDate() / 7)
          return startDate.getDay() === checkDate.getDay() && startWeek === checkWeek
        }
        return false
        
      case 'yearly':
        // Jährlich: Gleicher Tag und Monat
        return startDate.getDate() === checkDate.getDate() && 
               startDate.getMonth() === checkDate.getMonth()
        
      default:
        return false
    }
  }

  /**
   * Prüft ob ein Event an einem bestimmten Tag Kollisionen mit anderen Events hat
   */
  const hasCollisionsOnDay = (event: Event, day: Date): boolean => {
    const dayKey = format(day, 'yyyy-MM-dd')
    
    // Prüfe ob das Event an diesem Tag stattfindet
    if (!isRecurringEventOnDay(event, day)) {
      return false
    }
    
    // Hole alle Events für diesen Tag und Raum
    const dayEvents = eventsByDateAndRoom[dayKey]?.[event.roomId] || []
    
    // Prüfe Kollisionen mit anderen Events am gleichen Tag
    return dayEvents.some(otherEvent => {
      // Ignoriere das gleiche Event
      if (otherEvent.id === event.id) {
        return false
      }
      
      // Ignoriere Events ohne ID (noch nicht gespeichert)
      if (!otherEvent.id) {
        return false
      }
      
      // Wenn beide Events ganztägig sind, kollidieren sie
      if (isAllDayEvent(event) && isAllDayEvent(otherEvent)) {
        return true
      }
      
      // Wenn nur eines ganztägig ist, kollidiert es mit dem anderen
      if (isAllDayEvent(event) || isAllDayEvent(otherEvent)) {
        return true
      }
      
      // Für Events mit spezifischen Zeiten: Prüfe Zeitüberschneidung
      const eventStart = new Date(`${dayKey}T${event.startTime}`)
      const eventEnd = new Date(`${dayKey}T${event.endTime}`)
      const otherStart = new Date(`${dayKey}T${otherEvent.startTime}`)
      const otherEnd = new Date(`${dayKey}T${otherEvent.endTime}`)
      
      return eventStart < otherEnd && otherStart < eventEnd
    })
  }

  /**
   * Gruppiert Events nach Datum und Raum
   */
  const eventsByDateAndRoom = React.useMemo(() => {
    const grouped: Record<string, Record<string, Event[]>> = {}
    
    // Initialisiere alle Tage und Räume
    daysInMonth.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd')
      grouped[dateKey] = {}
      
      rooms.forEach(room => {
        grouped[dateKey][room.id] = []
      })
    })

    // Filtere eindeutige Events (entferne Duplikate basierend auf repeatGroupId)
    const uniqueEvents = events.filter((event, index, self) => {
      // Wenn das Event eine repeatGroupId hat, prüfe auf Duplikate
      if (event.repeatGroupId) {
        return self.findIndex(e => e.repeatGroupId === event.repeatGroupId) === index
      }
      // Ansonsten verwende die normale ID
      return self.findIndex(e => e.id === event.id) === index
    })
    
    // Füge Events nur an den Tagen hinzu, an denen sie tatsächlich stattfinden
    uniqueEvents.forEach(event => {
      daysInMonth.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd')
        
        // Prüfe ob das Event an diesem Tag stattfindet
        if (isRecurringEventOnDay(event, day)) {
          if (grouped[dateKey] && grouped[dateKey][event.roomId]) {
            // Prüfe ob das Event bereits für diesen Tag existiert
            const existingEvent = grouped[dateKey][event.roomId].find(e => e.id === event.id)
            if (!existingEvent) {
              grouped[dateKey][event.roomId].push(event)
            }
          }
        }
      })
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
    // Nach dem Monatswechsel zur aktuellen Zeile scrollen
    setTimeout(() => {
      scrollToToday()
    }, 100)
  }

  /**
   * Scrollt zum aktuellen Tag
   */
  const scrollToToday = () => {
    if (todayRowRef.current && tableContainerRef.current) {
      // Berechne die Position der Zeile relativ zum Container
      const containerRect = tableContainerRef.current.getBoundingClientRect()
      const rowRect = todayRowRef.current.getBoundingClientRect()
      const rowHeight = todayRowRef.current.offsetHeight
      const containerHeight = tableContainerRef.current.clientHeight
      
      // Berechne die optimale Position: Zeile soll vollständig sichtbar sein
      // mit einem Abstand von 60px von oben (für Header und etwas Platz)
      const targetOffset = rowRect.top - containerRect.top - 60
      
      // Scrolle zur Position
      tableContainerRef.current.scrollTop += targetOffset
    }
  }

  /**
   * Scrollt zum Anfang des Monats
   */
  const scrollToMonthStart = () => {
    if (tableContainerRef.current) {
      // Scrolle zum Anfang des Containers
      tableContainerRef.current.scrollTop = 0
    }
  }

  /**
   * Prüft ob ein Tag am Wochenende ist (Samstag = 6, Sonntag = 0)
   */
  const isWeekend = (date: Date) => {
    const dayOfWeek = getDay(date)
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  /**
   * Prüft ob ein Tag Sonntag ist
   */
  const isSunday = (date: Date) => {
    const dayOfWeek = getDay(date)
    return dayOfWeek === 0
  }

  /**
   * Prüft ob ein Tag heute ist
   */
  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  // Scroll zum aktuellen Tag beim ersten Laden oder zum Monatsanfang beim Monatswechsel
  useEffect(() => {
    const timer = setTimeout(() => {
      // Prüfe ob der aktuelle Monat angezeigt wird
      const today = new Date()
      const isCurrentMonth = today.getMonth() === currentMonth.getMonth() && 
                           today.getFullYear() === currentMonth.getFullYear()
      
      if (isCurrentMonth) {
        // Wenn aktueller Monat: Scroll zum heutigen Tag
        scrollToToday()
      } else {
        // Wenn anderer Monat: Scroll zum Anfang
        scrollToMonthStart()
      }
    }, 300) // Längere Verzögerung für vollständiges DOM-Rendering
    return () => clearTimeout(timer)
  }, [currentMonth])

  /**
   * Debug-Funktion: Analysiert Events und zeigt Duplikate an
   */
  const analyzeEvents = React.useCallback(() => {
    console.log('🔍 === EVENT-ANALYSE ===')
    console.log(`Gesamtanzahl Events: ${events.length}`)
    
    // Gruppiere Events nach repeatGroupId
    const groupedByRepeatId: Record<string, Event[]> = {}
    const eventsWithoutRepeatId: Event[] = []
    
    events.forEach(event => {
      if (event.repeatGroupId) {
        if (!groupedByRepeatId[event.repeatGroupId]) {
          groupedByRepeatId[event.repeatGroupId] = []
        }
        groupedByRepeatId[event.repeatGroupId].push(event)
      } else {
        eventsWithoutRepeatId.push(event)
      }
    })
    
    console.log(`Events ohne repeatGroupId: ${eventsWithoutRepeatId.length}`)
    console.log(`Events mit repeatGroupId: ${Object.keys(groupedByRepeatId).length} Gruppen`)
    
    // Zeige Duplikate an
    Object.entries(groupedByRepeatId).forEach(([repeatId, groupEvents]) => {
      if (groupEvents.length > 1) {
        console.log(`⚠️ Duplikate für repeatGroupId "${repeatId}":`)
        groupEvents.forEach(event => {
          console.log(`   - ${event.title} (${event.id}) - ${event.startDate} bis ${event.endDate}`)
        })
      }
    })
    
    // Zeige Events nach repeatType
    const byRepeatType: Record<string, Event[]> = {}
    events.forEach(event => {
      const type = event.repeatType || 'none'
      if (!byRepeatType[type]) {
        byRepeatType[type] = []
      }
      byRepeatType[type].push(event)
    })
    
    console.log('📊 Events nach repeatType:')
    Object.entries(byRepeatType).forEach(([type, typeEvents]) => {
      console.log(`   ${type}: ${typeEvents.length} Events`)
    })
    
    console.log('🔍 === ENDE EVENT-ANALYSE ===')
  }, [events])

  // Führe Analyse beim ersten Laden aus
  React.useEffect(() => {
    if (events.length > 0) {
      analyzeEvents()
    }
  }, [events, analyzeEvents])


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
    // Kollisions-Erkennung aktiviert
    const hasCollision = hasCollisionsOnDay(event, day)
    

    
    // Bestimme CSS-Klassen für die Darstellung
    let eventClass = 'calendar-event'
    if (isAllDay) {
      eventClass += ' all-day-event'
    }
    if (hasCollision) {
      eventClass += ' event-collision'
    }
    
    // Erstelle den Tooltip-Text mit korrekter Zeit
    let tooltipText = event.title
    if (isAllDay) {
      tooltipText += ' (ganztägig)'
    } else {
      tooltipText += ` (${startTime} - ${endTime})`
    }
    if (hasCollision) {
      tooltipText += ' ⚠️ Kollision mit anderem Termin'
    }
    if (event.description && event.description.trim()) {
      tooltipText += `\n\nBemerkung: ${event.description}`
    }
    
    return (
      <div
        key={event.id}
        className={eventClass}
        style={{ backgroundColor: event.color }}
        onClick={() => onEventClick(event)}
        title={tooltipText}
      >
        {!isAllDay && (
          <div className="event-time">
            {startTime} - {endTime}{hasCollision && <span className="collision-indicator"> ⚠️</span>}{!isStart && !isEnd && <span className="event-continuation-indicator">●</span>}
          </div>
        )}
        {isAllDay && (
          <div className="event-time">
            <span className="all-day-icon">📅</span>{hasCollision && <span className="collision-indicator"> ⚠️</span>}{!isStart && !isEnd && <span className="event-continuation-indicator">●</span>}
          </div>
        )}
        <div className="event-title">
          {event.title}{hasCollision && <span className="collision-indicator"> ⚠️</span>}
          {event.description && event.description.trim() && (
            <span 
              className="event-info-icon" 
              title={event.description}
              onClick={(e) => {
                e.stopPropagation() // Verhindert Event-Click
              }}
            >
              ℹ️
            </span>
          )}
        </div>
      </div>
    )
  }

  /**
   * Rendert eine Kalenderzelle für einen Raum
   */
  const renderRoomCell = (day: Date, room: Room) => {
    const dateKey = format(day, 'yyyy-MM-dd')
    const dayEvents = eventsByDateAndRoom[dateKey]?.[room.id] || []
    
    // Sortiere Events chronologisch nach Startzeit
    const sortedEvents = [...dayEvents].sort((a, b) => {
      // Ganztägige Events kommen zuerst
      const aIsAllDay = isAllDayEvent(a)
      const bIsAllDay = isAllDayEvent(b)
      
      if (aIsAllDay && !bIsAllDay) return -1
      if (!aIsAllDay && bIsAllDay) return 1
      
      // Bei gleichem Typ (ganztägig oder nicht) nach Startzeit sortieren
      if (aIsAllDay && bIsAllDay) {
        return a.title.localeCompare(b.title) // Alphabetisch bei ganztägigen Events
      }
      
      // Nach Startzeit sortieren
      return a.startTime.localeCompare(b.startTime)
    })
    
    return (
      <td key={room.id} className="calendar-cell">
        <div className="cell-content">
          {sortedEvents.map(event => renderEvent(event, day))}
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
    const hasHolidays = holidays.some(holiday => holiday.type === 'holiday')
    
    // CSS-Klassen für Styling
    const rowClasses = [
      'calendar-row',
      isWeekend(day) ? 'weekend-row' : '',
      isSunday(day) ? 'sunday-row' : '',
      isToday(day) ? 'today-row' : '',
      hasHolidays ? 'holiday-row' : ''
    ].filter(Boolean).join(' ')
    
    return (
      <tr 
        key={dateKey} 
        className={rowClasses}
        ref={isToday(day) ? todayRowRef : undefined}
      >
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
      <div className="calendar-table-container" ref={tableContainerRef}>
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