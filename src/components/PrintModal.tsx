import React, { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
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
  const [printMode, setPrintMode] = useState<'calendar' | 'table'>('calendar')

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

    const printContent = printMode === 'calendar' 
      ? generateCalendarPrintContent(startDate, endDate, monthEvents, roomName)
      : generateTablePrintContent(startDate, endDate, monthEvents, roomName)
    
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const generateCalendarPrintContent = (start: Date, end: Date, monthEvents: Event[], roomName: string) => {
    const days = eachDayOfInterval({ start, end })
    const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    
    const eventsByDay = new Map<string, Event[]>()
    monthEvents.forEach(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      
      // Füge Event zu allen Tagen hinzu, an denen es stattfindet
      for (let d = new Date(eventStart); d <= eventEnd; d.setDate(d.getDate() + 1)) {
        const dayKey = format(d, 'yyyy-MM-dd')
        if (!eventsByDay.has(dayKey)) {
          eventsByDay.set(dayKey, [])
        }
        eventsByDay.get(dayKey)!.push(event)
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
                size: A4 portrait;
                margin: 1cm;
              }
            }
            
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 12px;
              line-height: 1.3;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            
            .print-header h1 {
              margin: 0;
              font-size: 24px;
              color: #333;
            }
            
            .print-header .room-info {
              font-size: 14px;
              color: #666;
              margin-top: 5px;
            }
            
            .calendar-grid {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 1px;
              border: 1px solid #ccc;
            }
            
            .calendar-header {
              background-color: #f5f5f5;
              padding: 8px;
              text-align: center;
              font-weight: bold;
              border-bottom: 1px solid #ccc;
              font-size: 11px;
            }
            
            .calendar-day {
              border: 1px solid #eee;
              min-height: 120px;
              padding: 4px;
              position: relative;
            }
            
            .calendar-day.weekend {
              background-color: #f9f9f9;
            }
            
            .calendar-day.today {
              background-color: #e3f2fd;
              border: 2px solid #2196f3;
            }
            
            .day-number {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 4px;
              color: #333;
            }
            
            .event-item {
              background-color: #e8f5e8;
              border-left: 3px solid #4caf50;
              padding: 2px 4px;
              margin: 1px 0;
              font-size: 10px;
              border-radius: 2px;
              word-wrap: break-word;
            }
            
            .event-title {
              font-weight: bold;
              color: #2e7d32;
            }
            
            .event-time {
              color: #666;
              font-size: 9px;
            }
            
            .event-room {
              color: #888;
              font-size: 9px;
              font-style: italic;
            }
            
            .no-events {
              color: #999;
              font-style: italic;
              font-size: 10px;
              text-align: center;
              margin-top: 20px;
            }
            
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Kulturforum Kalender</h1>
            <div class="room-info">${roomName} - ${format(start, 'MMMM yyyy', { locale: de })}</div>
          </div>
          
          <div class="calendar-grid">
            ${weekdays.map(day => `<div class="calendar-header">${day}</div>`).join('')}
            
            ${days.map(day => {
              const dayKey = format(day, 'yyyy-MM-dd')
              const dayEvents = eventsByDay.get(dayKey) || []
              const isWeekend = day.getDay() === 0 || day.getDay() === 6
              const isToday = isSameDay(day, new Date())
              
              return `
                <div class="calendar-day ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}">
                  <div class="day-number">${format(day, 'd')}</div>
                  ${dayEvents.length > 0 ? 
                    dayEvents.map(event => `
                      <div class="event-item" style="border-left-color: ${event.color}">
                        <div class="event-title">${event.title}</div>
                        <div class="event-time">${event.startTime}${event.endTime !== '23:59' ? ` - ${event.endTime}` : ''}</div>
                        <div class="event-room">${rooms.find(r => r.id === event.roomId)?.name || event.roomId}</div>
                      </div>
                    `).join('') : 
                    '<div class="no-events">-</div>'
                  }
                </div>
              `
            }).join('')}
          </div>
        </body>
      </html>
    `
  }

  const generateTablePrintContent = (start: Date, end: Date, monthEvents: Event[], roomName: string) => {
    const days = eachDayOfInterval({ start, end })
    const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
    
    // Gruppiere Events nach Räumen
    const eventsByRoom = new Map<string, Event[]>()
    monthEvents.forEach(event => {
      if (!eventsByRoom.has(event.roomId)) {
        eventsByRoom.set(event.roomId, [])
      }
      eventsByRoom.get(event.roomId)!.push(event)
    })

    // Erstelle eine Map für Events pro Tag und Raum
    const eventsByDayAndRoom = new Map<string, Map<string, Event[]>>()
    monthEvents.forEach(event => {
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
                size: A4 portrait;
                margin: 1cm;
              }
              
              /* Print-spezifische Styles für bessere PDF-Konvertierung */
              .calendar-table .weekend {
                background-color: #f9f9f9 !important;
              }
              
              .calendar-table .sunday .day-number {
                color: #d32f2f !important;
                font-weight: bold !important;
              }
              
              /* Dickere Rahmen für bessere Sichtbarkeit im PDF */
              .calendar-table td {
                border: 1px solid #ccc !important;
              }
              
              .calendar-table th {
                border: 2px solid #999 !important;
              }
            }
            
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 11px;
              line-height: 1.2;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            
            .print-header h1 {
              margin: 0;
              font-size: 20px;
              color: #333;
            }
            
            .print-header .room-info {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            
            .calendar-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            
            .calendar-table th {
              background-color: #f5f5f5;
              border: 1px solid #ccc;
              padding: 6px 3px;
              text-align: center;
              font-weight: bold;
              font-size: 9px;
              vertical-align: top;
            }
            
            .calendar-table td {
              border: 1px solid #eee;
              padding: 3px;
              vertical-align: top;
              min-height: 80px;
            }
            
            .calendar-table .date-column {
              width: 8%;
              text-align: center;
            }
            
            .calendar-table .day-column {
              width: 7%;
              text-align: center;
            }
            
            .calendar-table .room-column {
              width: 14.2%;
            }
            
            .calendar-table .weekend {
              background-color: #f9f9f9;
            }
            

            
            .calendar-table .today {
              background-color: #e3f2fd;
              border: 2px solid #2196f3;
            }
            
            .day-number {
              font-weight: bold;
              font-size: 10px;
              margin-bottom: 2px;
              color: #333;
            }
            
            .day-name {
              font-size: 9px;
              color: #666;
              margin-bottom: 2px;
            }
            
            .holiday-badge {
              font-size: 7px;
              padding: 1px 2px;
              color: white;
              border-radius: 1px;
              white-space: nowrap;
              line-height: 1;
              margin-bottom: 1px;
              display: block;
            }
            
            .holiday-badge[data-type="holiday"] {
              background: #9b59b6;
            }
            
            .holiday-badge[data-type="school_holiday"] {
              background: #2ecc71;
            }
            
            .holiday-badge[data-type="additional_day"] {
              background: #f39c12;
            }
            
            .room-column {
              background-color: #f8f9fa;
              border-left: 2px solid #dee2e6;
              padding: 2px;
              margin-bottom: 2px;
            }
            
            .room-name {
              font-weight: bold;
              font-size: 9px;
              color: #495057;
              margin-bottom: 2px;
              text-transform: uppercase;
            }
            
            .event-item {
              background-color: #e8f5e8;
              border-left: 3px solid #4caf50;
              padding: 2px 4px;
              margin: 1px 0;
              font-size: 9px;
              border-radius: 2px;
              word-wrap: break-word;
            }
            
            .event-title {
              font-weight: bold;
              color: #2e7d32;
              font-size: 9px;
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
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Kulturforum Kalender</h1>
            <div class="room-info">${roomName} - ${format(start, 'MMMM yyyy', { locale: de })}</div>
          </div>
          
          <table class="calendar-table">
            <thead>
              <tr>
                <th class="date-column">Datum</th>
                <th class="day-column">Tag</th>
                ${rooms.map(room => `<th class="room-column">${room.name}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${days.map(day => {
                const dayKey = format(day, 'yyyy-MM-dd')
                const dayEvents = eventsByDayAndRoom.get(dayKey) || new Map()
                const isWeekend = day.getDay() === 0 || day.getDay() === 6
                const isSunday = day.getDay() === 0
                const isToday = isSameDay(day, new Date())
                const holidays = getHolidaysForDate(day)
                
                const isSaturday = day.getDay() === 6
                return `
                  <tr class="${isWeekend ? 'weekend' : ''} ${isSaturday ? 'saturday' : ''} ${isSunday ? 'sunday' : ''} ${isToday ? 'today' : ''}">
                    <td class="date-column">
                      <div class="day-number">${format(day, 'dd.MM.yyyy')}</div>
                    </td>
                    <td class="day-column">
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
                      return `
                        <td class="room-column">
                          ${roomEvents.length > 0 ? 
                            roomEvents.map((event: Event) => `
                              <div class="event-item" style="border-left-color: ${event.color}">
                                <div class="event-title">${event.title}</div>
                                <div class="event-time">${event.startTime === '00:00' && event.endTime === '23:59' ? '' : `${event.startTime}${event.endTime !== '23:59' ? ` - ${event.endTime}` : ''}`}</div>
                              </div>
                            `).join('') : 
                            ''
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
            <label>Druckmodus:</label>
            <div className="print-mode-selector">
              <label className="radio-label">
                <input
                  type="radio"
                  name="printMode"
                  value="calendar"
                  checked={printMode === 'calendar'}
                  onChange={(e) => setPrintMode(e.target.value as 'calendar' | 'table')}
                />
                <span>Kalender-Ansicht (7 Spalten)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="printMode"
                  value="table"
                  checked={printMode === 'table'}
                  onChange={(e) => setPrintMode(e.target.value as 'calendar' | 'table')}
                />
                <span>Tabellen-Ansicht (Räume getrennt)</span>
              </label>
            </div>
          </div>

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
                     <strong>Druckmodus:</strong> {printMode === 'calendar' ? 'Kalender-Ansicht (7 Spalten)' : 'Tabellen-Ansicht (Räume getrennt)'}
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