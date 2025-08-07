import React, { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import { de } from 'date-fns/locale'
import { Event } from '../types'
import { getHolidaysForDate } from '../utils/holidays'
import './PrintModal.css'

interface PrintModalProps {
  isOpen: boolean
  onClose: () => void
  events: Event[]
  rooms: { id: string; name: string }[]
}

const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, events, rooms }) => {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()))
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()))
  const printMode = 'table' as const

  if (!isOpen) return null

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const monthEvents = events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      
      // Prüfe ob Event sich mit dem gewählten Zeitraum überschneidet
      const overlaps = (eventStart <= endDate && eventEnd >= startDate)
      
      return overlaps
    })

    const roomName = 'Alle Räume'

    const printContent = generateTablePrintContent(startDate, endDate, monthEvents, roomName)
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const generateTablePrintContent = (start: Date, end: Date, monthEvents: Event[], roomName: string) => {
    const days = eachDayOfInterval({ start, end })
    const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    
    // Trenne ganztägige und zeitgebundene Events
    const fullDayEvents = monthEvents.filter(event => 
      event.startTime === '00:00' && event.endTime === '23:59'
    )
    const timeBoundEvents = monthEvents.filter(event => 
      !(event.startTime === '00:00' && event.endTime === '23:59')
    )
    
    // Erstelle durchgehende Balken für ganztägige Events (pro Raum)
    const continuousBarsByRoom = new Map<string, Map<string, { event: Event, start: string, end: string }>>()
    
    fullDayEvents.forEach(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      
      if (!continuousBarsByRoom.has(event.roomId)) {
        continuousBarsByRoom.set(event.roomId, new Map())
      }
      const roomBars = continuousBarsByRoom.get(event.roomId)!
      
      // Prüfe ob es andere Events im gleichen Raum gibt, die den Balken unterbrechen
      let currentStart = new Date(eventStart)
      let currentEnd = new Date(eventStart)
      
      for (let d = new Date(eventStart); d <= eventEnd; d.setDate(d.getDate() + 1)) {
        const dayKey = format(d, 'yyyy-MM-dd')
        const dayEvents = timeBoundEvents.filter(e => {
          const eStart = new Date(e.startDate)
          const eEnd = new Date(e.endDate)
          return e.roomId === event.roomId && eStart <= d && eEnd >= d
        })
        
        // Wenn es zeitgebundene Events im gleichen Raum an diesem Tag gibt, beende den aktuellen Balken
        if (dayEvents.length > 0) {
          if (currentStart <= currentEnd) {
            const barKey = `${event.id}_${format(currentStart, 'yyyy-MM-dd')}`
            roomBars.set(barKey, {
              event,
              start: format(currentStart, 'yyyy-MM-dd'),
              end: format(currentEnd, 'yyyy-MM-dd')
            })
          }
          currentStart = new Date(d)
          currentStart.setDate(currentStart.getDate() + 1)
        }
        
        currentEnd = d
      }
      
      // Füge den letzten Balken hinzu
      if (currentStart <= currentEnd) {
        const barKey = `${event.id}_${format(currentStart, 'yyyy-MM-dd')}`
        roomBars.set(barKey, {
          event,
          start: format(currentStart, 'yyyy-MM-dd'),
          end: format(currentEnd, 'yyyy-MM-dd')
        })
      }
    })
    
    // Gruppiere Events nach Räumen
    const eventsByRoom = new Map<string, Event[]>()
    timeBoundEvents.forEach(event => {
      if (!eventsByRoom.has(event.roomId)) {
        eventsByRoom.set(event.roomId, [])
      }
      eventsByRoom.get(event.roomId)!.push(event)
    })

    // Erstelle eine Map für Events pro Tag und Raum
    const eventsByDayAndRoom = new Map<string, Map<string, Event[]>>()
    timeBoundEvents.forEach(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      
      // Füge Event zu allen Tagen hinzu, an denen es stattfindet
      for (let d = new Date(eventStart); d <= eventEnd; d.setDate(d.getDate() + 1)) {
        const dayKey = format(d, 'yyyy-MM-dd')
        if (!eventsByDayAndRoom.has(dayKey)) {
          eventsByDayAndRoom.set(dayKey, new Map())
        }
        const roomMap = eventsByDayAndRoom.get(dayKey)!
        if (!roomMap.has(event.roomId)) {
          roomMap.set(event.roomId, [])
        }
        roomMap.get(event.roomId)!.push(event)
      }
    })

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Kalender - ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: de })}</title>
          <style>
            @media print {
              @page {
                size: A4 landscape;
                margin: 0.8cm;
              }
            }
            
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 15px;
              font-size: 11px;
              line-height: 1.2;
              background-color: #f8f9fa !important;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 20px;
            }
            
            .print-header h1 {
              font-size: 20px;
              color: #333;
              margin: 0 0 8px 0;
            }
            
            .print-header .room-info {
              font-size: 12px;
              color: #666;
            }
            
            .calendar-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            
            .calendar-table th {
              background-color: #f8f9fa !important;
              border: 1px solid #ccc;
              padding: 4px 2px;
              text-align: center;
              font-weight: bold;
              font-size: 8px;
              vertical-align: top;
            }
            
            .calendar-table td {
              border: 1px solid #eee;
              padding: 2px;
              vertical-align: top;
              min-height: 60px;
              background-color: #f8f9fa !important;
            }
            
            .calendar-table .date-column {
              width: 6%;
              text-align: center;
            }
            
            .calendar-table .day-column {
              width: 5%;
              text-align: center;
            }
            
            .calendar-table .room-column {
              width: 12%;
            }
            
            .calendar-table .weekend {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr:nth-child(even) {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr:nth-child(odd) {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table .saturday {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table .sunday {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr.saturday {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr.sunday {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr.weekend {
              background-color: #f8f9fa !important;
            }
            
            /* Explizite Regeln für alle möglichen Weekend-Kombinationen */
            .calendar-table tr.weekend td {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr.saturday td {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr.sunday td {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr.weekend.saturday td {
              background-color: #f8f9fa !important;
            }
            
            .calendar-table tr.weekend.sunday td {
              background-color: #f8f9fa !important;
            }
            
            .day-number {
              font-weight: bold;
              font-size: 10px;
              margin-bottom: 1px;
            }
            
            .day-name {
              font-size: 8px;
              color: #666;
              margin-bottom: 1px;
              hyphens: auto;
              word-break: break-word;
            }
            
            .holiday-badge {
              display: inline-block;
              background-color: #ffeb3b;
              color: #333;
              padding: 1px 2px;
              border-radius: 1px;
              font-size: 6px;
              margin: 1px;
              font-weight: bold;
              text-transform: uppercase;
              hyphens: auto;
              word-break: break-word;
            }
            
            .event-item {
              background-color: transparent;
              border-left: 2px solid #4caf50;
              padding: 1px 3px;
              margin: 1px 0;
              font-size: 9px;
              border-radius: 2px;
              word-wrap: break-word;
            }
            
            .continuous-bar-table {
              background-color: transparent;
              border-left: 5px solid #4caf50;
              padding: 4px 6px;
              margin: 2px 0;
              font-size: 11px;
              border-radius: 3px;
              word-wrap: break-word;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              font-weight: bold;
            }
            
            .event-title {
              font-weight: bold;
              color: #000000;
              font-size: 11px;
              hyphens: auto;
              word-break: break-word;
            }
            
            .event-time {
              color: #666;
              font-size: 8px;
            }
            
            .no-events {
              color: #999;
              font-style: italic;
              font-size: 9px;
              text-align: center;
              margin-top: 10px;
            }
            
            @media print {
              .no-print {
                display: none;
              }
              
              /* KONSISTENTE LÖSUNG: Alle Hintergründe auf einheitliches Grau setzen */
              * {
                background-color: #f8f9fa !important;
              }
              
              /* Spezifische Regeln für Tabellen */
              table, tr, td, th, tbody, thead {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table, .calendar-table *, .calendar-table tr, .calendar-table td, .calendar-table th {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr:nth-child(even) {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr:nth-child(odd) {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table .weekend {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table .saturday {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table .sunday {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr.saturday {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr.sunday {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr.weekend {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table td {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table th {
                background-color: #f8f9fa !important;
              }
              
              /* Explizite Regeln für alle möglichen Weekend-Kombinationen */
              .calendar-table tr.weekend td {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr.saturday td {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr.sunday td {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr.weekend.saturday td {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table tr.weekend.sunday td {
                background-color: #f8f9fa !important;
              }
              
              /* Zusätzliche Regeln für Seitenumbrüche */
              .calendar-table {
                page-break-inside: auto;
                break-inside: auto;
              }
              
              .calendar-table tbody {
                background-color: #f8f9fa !important;
              }
              
              .calendar-table thead {
                background-color: #f8f9fa !important;
              }
              
              /* Verhindere Hintergründe bei Seitenumbrüchen */
              .calendar-table tr {
                page-break-inside: avoid;
                break-inside: avoid;
                background-color: #f8f9fa !important;
              }
              
              .calendar-table td,
              .calendar-table th {
                page-break-inside: avoid;
                break-inside: avoid;
                background-color: #f8f9fa !important;
              }
              
              /* Aktuelle Zeile im Druck ausblenden */
              .calendar-table tr.today {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Kulturforum Kalender</h1>
            <div class="room-info">${roomName} - ${format(start, 'MMMM yyyy', { locale: de })}</div>
          </div>
          
          <table class="calendar-table" style="background-color: #f8f9fa !important;">
            <thead style="background-color: #f8f9fa !important;">
              <tr style="background-color: #f8f9fa !important;">
                <th class="date-column" style="background-color: #f8f9fa !important;">Datum</th>
                <th class="day-column" style="background-color: #f8f9fa !important;">Tag</th>
                ${rooms.map(room => `<th class="room-column" style="background-color: #f8f9fa !important;">${room.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody style="background-color: #f8f9fa !important;">
              ${days.map(day => {
                const dayKey = format(day, 'yyyy-MM-dd')
                const dayEvents = eventsByDayAndRoom.get(dayKey) || new Map()
                const isWeekend = day.getDay() === 0 || day.getDay() === 6
                const isSunday = day.getDay() === 0
                const isToday = isSameDay(day, new Date())
                const holidays = getHolidaysForDate(day)
                
                const isSaturday = day.getDay() === 6
                return `
                  <tr class="${isWeekend ? 'weekend' : ''} ${isSaturday ? 'saturday' : ''} ${isSunday ? 'sunday' : ''} ${isToday ? 'today' : ''}" style="background-color: #f8f9fa !important;">
                    <td class="date-column" style="background-color: #f8f9fa !important;">
                      <div class="day-number">${format(day, 'dd.MM.yyyy')}</div>
                    </td>
                    <td class="day-column" style="background-color: #f8f9fa !important;">
                      <div class="day-name" ${isSunday ? 'style="color: #d32f2f; font-weight: bold;"' : ''}>${weekdays[day.getDay() === 0 ? 6 : day.getDay() - 1]}</div>
                      ${holidays.length > 0 ? 
                        holidays.map((holiday, index) => `
                          <span class="holiday-badge" data-type="${holiday.type}">
                            ${holiday.name.length > 8 ? holiday.name.substring(0, 8) + '...' : holiday.name}
                          </span>
                        `).join('') : ''
                      }
                    </td>
                    ${rooms.map(room => {
                      const roomEvents = dayEvents.get(room.id) || []
                      
                      // Finde durchgehende Balken für diesen Raum und Tag
                      const roomBars = continuousBarsByRoom.get(room.id) || new Map()
                      const dayBars = Array.from(roomBars.values()).filter(bar => {
                        const barStart = new Date(bar.start)
                        const barEnd = new Date(bar.end)
                        const currentDay = new Date(dayKey)
                        return currentDay >= barStart && currentDay <= barEnd
                      })
                      
                      // Zeige Balken an allen Tagen des Events
                      const allBars = dayBars
                      
                      return `
                        <td class="room-column" style="background-color: #f8f9fa !important;">
                          ${allBars.map(bar => `
                            <div class="continuous-bar-table" style="border-left-color: ${bar.event.color}; background-color: transparent;">
                              <div class="event-title">${bar.event.title}</div>
                            </div>
                          `).join('')}
                          
                          ${roomEvents.length > 0 ? 
                            roomEvents.map((event: Event) => `
                              <div class="event-item" style="border-left-color: ${event.color}">
                                <div class="event-title">${event.title}</div>
                                <div class="event-time">${event.startTime === '00:00' && event.endTime === '23:59' ? '' : `${event.startTime}${event.endTime !== '23:59' ? ` - ${event.endTime}` : ''}`}</div>
                              </div>
                            `).join('') : 
                            (dayBars.length === 0 ? '' : '')
                          }
                        </td>
                      `
                    }).join('')}
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `
  }

  return (
    <div className="print-modal-overlay">
      <div className="print-modal-content">
        <div className="print-modal-header">
          <h2>Drucken</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="print-modal-body">
          <div className="form-group">
            <label>Von:</label>
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          
          <div className="form-group">
            <label>Bis:</label>
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          
          <div className="print-preview">
            <h3>Vorschau:</h3>
            <p>
              <strong>Druckmodus:</strong> Tabellen-Ansicht (Räume getrennt)
            </p>
            <p>
              <strong>Zeitraum:</strong> {format(startDate, 'dd.MM.yyyy', { locale: de })} - {format(endDate, 'dd.MM.yyyy', { locale: de })}
            </p>
          </div>
        </div>
        
        <div className="print-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            Drucken
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrintModal 