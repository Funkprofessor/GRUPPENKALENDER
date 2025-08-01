import React, { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { Event, EventColor, RepeatType, EventModalProps, CreateEventData, RepeatAction, Weekday, WeekOfMonth } from '../types'
import './EventModal.css'

/**
 * Modal-Komponente für die Bearbeitung von Events
 * Unterstützt Erstellen, Bearbeiten und Löschen von Terminen
 */
const EventModal: React.FC<EventModalProps> = ({ 
  event, 
  rooms, 
  onSave, 
  onSaveMultiple, 
  onDelete, 
  onClose,
  preselectedDate,
  preselectedRoomId
}) => {
  // Formular-Zustand
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    roomId: rooms[0]?.id || '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '20:00', // Standardzeit
    endTime: '21:00',
    color: '#FF6B6B',
    repeatType: 'none',
    repeatUntil: undefined
  })

  // Zusätzliche Zustände für erweiterte Funktionen
  const [isAllDay, setIsAllDay] = useState(false)
  const [repeatInterval, setRepeatInterval] = useState(1)
  const [startHour, setStartHour] = useState('20')
  const [startMinute, setStartMinute] = useState('00')
  const [endHour, setEndHour] = useState('21')
  const [endMinute, setEndMinute] = useState('00')
  const [repeatWeekday, setRepeatWeekday] = useState<Weekday>(1) // Montag als Standard
  const [repeatWeekOfMonth, setRepeatWeekOfMonth] = useState<WeekOfMonth>(1) // 1. Woche als Standard
  
  // Zustand für Wiederholungsabfrage
  const [showRepeatDialog, setShowRepeatDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<'delete' | 'save' | null>(null)

  // Verfügbare Farben
  const availableColors: EventColor[] = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FFB347', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471',
    '#82E0AA', '#F1948A', '#85C1E9', '#FAD7A0'
  ]

  // Verfügbare Wiederholungstypen
  const repeatTypes: { value: RepeatType; label: string }[] = [
    { value: 'none', label: 'Keine Wiederholung' },
    { value: 'daily', label: 'Täglich' },
    { value: 'weekly', label: 'Wöchentlich' },
    { value: 'monthly', label: 'Monatlich' },
    { value: 'monthly_weekday', label: 'Jeden X. Wochentag im Monat' },
    { value: 'yearly', label: 'Jährlich' }
  ]

  // Zeit-Optionen für separate Auswahl
  const hourOptions = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  }, [])

  const minuteOptions = useMemo(() => {
    return ['00', '15', '30', '45']
  }, [])

  // Wiederholungsintervalle
  const repeatIntervals = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => i + 1)
  }, [])

  // Wochentage für monatliche Wiederholungen
  const weekdays: { value: Weekday; label: string }[] = [
    { value: 1, label: 'Montag' },
    { value: 2, label: 'Dienstag' },
    { value: 3, label: 'Mittwoch' },
    { value: 4, label: 'Donnerstag' },
    { value: 5, label: 'Freitag' },
    { value: 6, label: 'Samstag' },
    { value: 7, label: 'Sonntag' }
  ]

  // Wochen im Monat
  const weeksOfMonth: { value: WeekOfMonth; label: string }[] = [
    { value: 1, label: '1. Woche' },
    { value: 2, label: '2. Woche' },
    { value: 3, label: '3. Woche' },
    { value: 4, label: '4. Woche' },
    { value: 5, label: '5. Woche' }
  ]

  // Initialisiere Formular mit Event-Daten wenn vorhanden
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        roomId: event.roomId,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        color: event.color,
        repeatType: event.repeatType,
        repeatUntil: event.repeatUntil
      })
      
      // Initialisiere separate Zeit-Inputs aus den Event-Daten
      const [startHour, startMinute] = event.startTime.split(':')
      const [endHour, endMinute] = event.endTime.split(':')
      setStartHour(startHour)
      setStartMinute(startMinute)
      setEndHour(endHour)
      setEndMinute(endMinute)
      setIsAllDay(event.startTime === '00:00' && event.endTime === '23:59')
      
      // Initialisiere Wochentag-Felder wenn vorhanden
      if (event.repeatWeekday) {
        setRepeatWeekday(event.repeatWeekday)
      }
      if (event.repeatWeekOfMonth) {
        setRepeatWeekOfMonth(event.repeatWeekOfMonth)
      }
    } else {
      // Neues Event mit vorausgewählten Werten oder Standardwerten
      setFormData({
        title: '',
        description: '',
        roomId: preselectedRoomId || rooms[0]?.id || '',
        startDate: preselectedDate || format(new Date(), 'yyyy-MM-dd'),
        endDate: preselectedDate || format(new Date(), 'yyyy-MM-dd'),
        startTime: '20:00', // Standardzeit
        endTime: '21:00',
        color: '#FF6B6B',
        repeatType: 'none',
        repeatUntil: undefined
      })
      
      // Initialisiere separate Zeit-Inputs mit Standardwerten
      setStartHour('20')
      setStartMinute('00')
      setEndHour('21')
      setEndMinute('00')
      setIsAllDay(false)
      
      // Automatisch Wochentag und Woche bestimmen basierend auf dem Startdatum
      const startDate = new Date(preselectedDate || format(new Date(), 'yyyy-MM-dd'))
      const dayOfWeek = startDate.getDay() // 0 = Sonntag, 1 = Montag, etc.
      const weekOfMonth = Math.ceil(startDate.getDate() / 7) // 1-5
      
      // Konvertiere zu unseren Werten (Montag = 1, Sonntag = 7)
      const weekday = dayOfWeek === 0 ? 7 : dayOfWeek
      const weekOfMonthClamped = Math.min(Math.max(weekOfMonth, 1), 5) as WeekOfMonth
      
      setRepeatWeekday(weekday as Weekday)
      setRepeatWeekOfMonth(weekOfMonthClamped)
    }
  }, [event, preselectedDate, preselectedRoomId, rooms])

  /**
   * Behandelt Änderungen in Formularfeldern
   */
  const handleInputChange = (field: keyof CreateEventData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Behandelt Änderungen bei Datumsfeldern
   */
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Wenn Enddatum vor Startdatum liegt, setze es auf Startdatum
      if (field === 'startDate' && newData.endDate < value) {
        newData.endDate = value
      }
      
      return newData
    })
  }

  /**
   * Behandelt Änderungen bei Zeitfeldern
   */
  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Wenn Endzeit vor Startzeit liegt und es ist der gleiche Tag
      if (field === 'startTime' && 
          newData.startDate === newData.endDate && 
          newData.endTime < value) {
        // Setze Endzeit auf Startzeit + 1 Stunde
        const [hours, minutes] = value.split(':').map(Number)
        const endHours = (hours + 1) % 24
        newData.endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      }
      
      return newData
    })
  }

  /**
   * Validiert das Formular
   */
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      alert('Bitte geben Sie einen Titel ein.')
      return false
    }
    
    if (!formData.roomId) {
      alert('Bitte wählen Sie einen Raum aus.')
      return false
    }
    
    if (formData.startDate > formData.endDate) {
      alert('Das Enddatum darf nicht vor dem Startdatum liegen.')
      return false
    }
    
    if (formData.startDate === formData.endDate && formData.startTime >= formData.endTime) {
      alert('Die Endzeit muss nach der Startzeit liegen.')
      return false
    }
    
    return true
  }

  /**
   * Generiert eine eindeutige ID für Wiederholungsgruppen
   */
  const generateRepeatGroupId = (): string => {
    return `repeat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generiert wiederholte Events basierend auf dem Wiederholungstyp
   */
  const generateRepeatedEvents = (baseEvent: CreateEventData): CreateEventData[] => {
    if (baseEvent.repeatType === 'none' || !baseEvent.repeatUntil) {
      return [baseEvent]
    }

    const events: CreateEventData[] = []
    const startDate = new Date(baseEvent.startDate)
    const endDate = new Date(baseEvent.endDate)
    const repeatUntil = new Date(baseEvent.repeatUntil)
    
    let currentStartDate = new Date(startDate)
    let currentEndDate = new Date(endDate)
    
    // Generiere eine eindeutige ID für diese Wiederholungsgruppe
    const repeatGroupId = generateRepeatGroupId()
    
    // Begrenze auf maximal 100 Wiederholungen um Performance-Probleme zu vermeiden
    let count = 0
    const maxRepeats = 100
    
    while (currentStartDate <= repeatUntil && count < maxRepeats) {
      events.push({
        ...baseEvent,
        startDate: currentStartDate.toISOString().split('T')[0],
        endDate: currentEndDate.toISOString().split('T')[0],
        repeatGroupId: repeatGroupId, // Alle Events der Gruppe bekommen die gleiche ID
        repeatWeekday: baseEvent.repeatWeekday,
        repeatWeekOfMonth: baseEvent.repeatWeekOfMonth
      })
      
      // Berechne nächste Wiederholung basierend auf Intervall
      switch (baseEvent.repeatType) {
        case 'daily':
          currentStartDate.setDate(currentStartDate.getDate() + repeatInterval)
          currentEndDate.setDate(currentEndDate.getDate() + repeatInterval)
          break
        case 'weekly':
          currentStartDate.setDate(currentStartDate.getDate() + (7 * repeatInterval))
          currentEndDate.setDate(currentEndDate.getDate() + (7 * repeatInterval))
          break
        case 'monthly':
          currentStartDate.setMonth(currentStartDate.getMonth() + repeatInterval)
          currentEndDate.setMonth(currentEndDate.getMonth() + repeatInterval)
          break
        case 'monthly_weekday':
          // Berechne den nächsten X. Wochentag im nächsten Monat
          const nextMonth = new Date(currentStartDate)
          nextMonth.setMonth(nextMonth.getMonth() + repeatInterval)
          nextMonth.setDate(1) // Erster Tag des Monats
          
          // Finde den ersten Wochentag des gewünschten Typs im Monat
          while (nextMonth.getDay() !== (repeatWeekday === 7 ? 0 : repeatWeekday)) {
            nextMonth.setDate(nextMonth.getDate() + 1)
          }
          
          // Gehe zur gewünschten Woche (1. Woche = 0-6 Tage, 2. Woche = 7-13 Tage, etc.)
          const weekOffset = (repeatWeekOfMonth - 1) * 7
          nextMonth.setDate(nextMonth.getDate() + weekOffset)
          
          currentStartDate = new Date(nextMonth)
          currentEndDate = new Date(nextMonth)
          currentEndDate.setDate(currentEndDate.getDate() + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
          break
        case 'yearly':
          currentStartDate.setFullYear(currentStartDate.getFullYear() + repeatInterval)
          currentEndDate.setFullYear(currentEndDate.getFullYear() + repeatInterval)
          break
      }
      count++
    }
    
    return events
  }

  /**
   * Aktualisiert die Zeitwerte im Formular
   */
  const updateTimeValues = () => {
    if (!isAllDay) {
      const newStartTime = `${startHour.padStart(2, '0')}:${startMinute.padStart(2, '0')}`
      const newEndTime = `${endHour.padStart(2, '0')}:${endMinute.padStart(2, '0')}`
      console.log('updateTimeValues: Setting times to', { newStartTime, newEndTime })
      setFormData(prev => ({
        ...prev,
        startTime: newStartTime,
        endTime: newEndTime
      }))
    } else {
      // Ganztägig: Setze Zeiten auf 00:00 - 23:59
      console.log('updateTimeValues: Setting all-day times')
      setFormData(prev => ({
        ...prev,
        startTime: '00:00',
        endTime: '23:59'
      }))
    }
  }

  /**
   * Behandelt das Speichern des Events
   */
  const handleSave = () => {
    // Erstelle aktualisierte Formulardaten mit korrekten Zeitwerten
    let updatedFormData = { ...formData }
    
    if (!isAllDay) {
      const newStartTime = `${startHour.padStart(2, '0')}:${startMinute.padStart(2, '0')}`
      const newEndTime = `${endHour.padStart(2, '0')}:${endMinute.padStart(2, '0')}`
      updatedFormData.startTime = newStartTime
      updatedFormData.endTime = newEndTime
      console.log('handleSave: Setting times to', { newStartTime, newEndTime })
    } else {
      updatedFormData.startTime = '00:00'
      updatedFormData.endTime = '23:59'
      console.log('handleSave: Setting all-day times')
    }

    // Füge Wochentag-Felder hinzu wenn nötig
    if (formData.repeatType === 'monthly_weekday') {
      updatedFormData.repeatWeekday = repeatWeekday
      updatedFormData.repeatWeekOfMonth = repeatWeekOfMonth
    }
    
    // Debug-Ausgabe für die zu speichernden Daten
    console.log('handleSave: Updated form data:', updatedFormData)
    console.log('handleSave: Current time inputs:', { startHour, startMinute, endHour, endMinute, isAllDay })
    
    // Validiere mit den aktualisierten Daten
    if (!validateForm()) return
    
    if (event) {
      // Update bestehendes Event
      // Wenn es ein wiederholendes Event ist, zeige Abfrage
      if (isRepeatingEvent(event)) {
        setPendingAction('save')
        setShowRepeatDialog(true)
        return // Wichtig: Nicht weiter ausführen, da Dialog gezeigt wird
      } else {
        // Normales Update für einzelne Events
        const eventData = { ...event, ...updatedFormData }
        onSave(eventData)
      }
    } else {
      // Neues Event - prüfe auf Wiederholungen
      const repeatedEvents = generateRepeatedEvents(updatedFormData)
      
      if (repeatedEvents.length === 1) {
        // Keine Wiederholung oder nur ein Event
        onSave(updatedFormData)
      } else {
        // Mehrere Events durch Wiederholung - zeige Abfrage
        setPendingAction('save')
        setShowRepeatDialog(true)
        return // Wichtig: Nicht weiter ausführen, da Dialog gezeigt wird
      }
    }
  }

  /**
   * Prüft ob das Event Teil einer Wiederholung ist
   */
  const isRepeatingEvent = (event: Event): boolean => {
    // Prüfe ob es ein wiederholendes Event ist (mit oder ohne repeatGroupId)
    return event.repeatType !== 'none' && event.repeatUntil !== undefined
  }

  /**
   * Behandelt das Löschen des Events
   */
  const handleDelete = () => {
    if (!event) return
    
    // Wenn es ein wiederholendes Event ist, zeige Abfrage
    if (isRepeatingEvent(event)) {
      setPendingAction('delete')
      setShowRepeatDialog(true)
      return // Wichtig: Nicht weiter ausführen, da Dialog gezeigt wird
    } else {
      // Normale Löschbestätigung für einzelne Events
      if (window.confirm('Möchten Sie diesen Termin wirklich löschen?')) {
        onDelete?.()
      }
    }
  }

  /**
   * Behandelt die Wiederholungsabfrage für Löschen
   */
  const handleRepeatDelete = (action: RepeatAction) => {
    setShowRepeatDialog(false)
    setPendingAction(null)
    if (onDelete) {
      onDelete(action)
    }
  }

  /**
   * Behandelt die Wiederholungsabfrage für Speichern
   */
  const handleRepeatSave = (action: RepeatAction) => {
    setShowRepeatDialog(false)
    setPendingAction(null)
    
    // Erstelle aktualisierte Formulardaten mit korrekten Zeitwerten
    let updatedFormData = { ...formData }
    
    if (!isAllDay) {
      const newStartTime = `${startHour.padStart(2, '0')}:${startMinute.padStart(2, '0')}`
      const newEndTime = `${endHour.padStart(2, '0')}:${endMinute.padStart(2, '0')}`
      updatedFormData.startTime = newStartTime
      updatedFormData.endTime = newEndTime
    } else {
      updatedFormData.startTime = '00:00'
      updatedFormData.endTime = '23:59'
    }

    // Füge Wochentag-Felder hinzu wenn nötig
    if (formData.repeatType === 'monthly_weekday') {
      updatedFormData.repeatWeekday = repeatWeekday
      updatedFormData.repeatWeekOfMonth = repeatWeekOfMonth
    }
    
    if (!validateForm()) return
    
    if (action === 'single') {
      // Nur diesen Termin speichern
      if (event) {
        // Bei bestehenden Events: aktualisiere das bestehende Event
        const updatedEvent = {
          ...event,
          ...updatedFormData
        }
        onSave(updatedEvent)
      } else {
        // Bei neuen Events: speichere nur das erste Event ohne Wiederholung
        const singleEvent = {
          ...updatedFormData,
          repeatType: 'none' as const,
          repeatUntil: undefined,
          repeatGroupId: undefined
        }
        onSave(singleEvent)
      }
    } else {
      // Alle Termine der Reihe speichern
      if (event) {
        // Bei bestehenden Events: erstelle neue Wiederholungen mit repeatGroupId
        const repeatedEvents = generateRepeatedEvents(updatedFormData)
        if (repeatedEvents.length > 1 && onSaveMultiple) {
          onSaveMultiple(repeatedEvents)
        } else {
          onSave(updatedFormData)
        }
      } else {
        // Bei neuen Events: erstelle alle Wiederholungen
        const repeatedEvents = generateRepeatedEvents(updatedFormData)
        if (repeatedEvents.length > 1 && onSaveMultiple) {
          onSaveMultiple(repeatedEvents)
        } else {
          onSave(updatedFormData)
        }
      }
    }
  }

  /**
   * Behandelt Tastatureingaben (ESC zum Schließen)
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{event ? 'Termin bearbeiten' : 'Neuer Termin'}</h2>
          <button className="close-btn" onClick={onClose} title="Schließen">
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Titel */}
          <div className="form-group">
            <label htmlFor="title">Titel *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="Titel des Termins"
              required
            />
          </div>

          {/* Beschreibung */}
          <div className="form-group">
            <label htmlFor="description">Beschreibung</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Optionale Beschreibung"
              rows={3}
            />
          </div>

          {/* Raum */}
          <div className="form-group">
            <label htmlFor="room">Raum *</label>
            <select
              id="room"
              value={formData.roomId}
              onChange={e => handleInputChange('roomId', e.target.value)}
              required
            >
              <option value="">Raum auswählen</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Datum und Zeit */}
          {/* Ganztägig Checkbox */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={e => setIsAllDay(e.target.checked)}
              />
              Ganztägig
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Startdatum *</label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={e => handleDateChange('startDate', e.target.value)}
                required
              />
            </div>
            
            {!isAllDay && (
              <div className="form-group">
                <label>Startzeit *</label>
                <div className="time-input-group">
                  <select
                    value={startHour}
                    onChange={e => setStartHour(e.target.value)}
                    className="time-hour"
                  >
                    {hourOptions.map(hour => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <span className="time-separator">:</span>
                  <select
                    value={startMinute}
                    onChange={e => setStartMinute(e.target.value)}
                    className="time-minute"
                  >
                    {minuteOptions.map(minute => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endDate">Enddatum *</label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={e => handleDateChange('endDate', e.target.value)}
                min={formData.startDate}
                required
              />
            </div>
            
            {!isAllDay && (
              <div className="form-group">
                <label>Endzeit *</label>
                <div className="time-input-group">
                  <select
                    value={endHour}
                    onChange={e => setEndHour(e.target.value)}
                    className="time-hour"
                  >
                    {hourOptions.map(hour => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <span className="time-separator">:</span>
                  <select
                    value={endMinute}
                    onChange={e => setEndMinute(e.target.value)}
                    className="time-minute"
                  >
                    {minuteOptions.map(minute => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Farbe */}
          <div className="form-group">
            <label>Farbe</label>
            <div className="color-picker">
              {availableColors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleInputChange('color', color)}
                  title={`Farbe: ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Wiederholung */}
          <div className="form-group">
            <label htmlFor="repeatType">Wiederholung</label>
            <select
              id="repeatType"
              value={formData.repeatType}
              onChange={e => handleInputChange('repeatType', e.target.value as RepeatType)}
            >
              {repeatTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Wiederholungsintervall */}
          {formData.repeatType !== 'none' && (
            <div className="form-group">
              <label htmlFor="repeatInterval">Alle</label>
              <div className="repeat-interval-group">
                <select
                  id="repeatInterval"
                  value={repeatInterval}
                  onChange={e => setRepeatInterval(Number(e.target.value))}
                >
                  {repeatIntervals.map(interval => (
                    <option key={interval} value={interval}>
                      {interval}
                    </option>
                  ))}
                </select>
                <span className="repeat-interval-text">
                  {formData.repeatType === 'daily' && 'Tag(e)'}
                  {formData.repeatType === 'weekly' && 'Woche(n)'}
                  {formData.repeatType === 'monthly' && 'Monat(e)'}
                  {formData.repeatType === 'monthly_weekday' && 'Monat(e)'}
                  {formData.repeatType === 'yearly' && 'Jahr(e)'}
                </span>
              </div>
            </div>
          )}

          {/* Wochentag-Optionen für monatliche Wiederholungen */}
          {formData.repeatType === 'monthly_weekday' && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="repeatWeekOfMonth">Woche</label>
                <select
                  id="repeatWeekOfMonth"
                  value={repeatWeekOfMonth}
                  onChange={e => setRepeatWeekOfMonth(Number(e.target.value) as WeekOfMonth)}
                >
                  {weeksOfMonth.map(week => (
                    <option key={week.value} value={week.value}>
                      {week.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="repeatWeekday">Wochentag</label>
                <select
                  id="repeatWeekday"
                  value={repeatWeekday}
                  onChange={e => setRepeatWeekday(Number(e.target.value) as Weekday)}
                >
                  {weekdays.map(day => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Wiederholung bis */}
          {formData.repeatType !== 'none' && (
            <div className="form-group">
              <label htmlFor="repeatUntil">Wiederholen bis</label>
              <input
                id="repeatUntil"
                type="date"
                value={formData.repeatUntil || ''}
                onChange={e => handleInputChange('repeatUntil', e.target.value)}
                min={formData.startDate}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="footer-left">
            {event && onDelete && (
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                type="button"
              >
                Löschen
              </button>
            )}
          </div>
          
          <div className="footer-right">
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              type="button"
            >
              Abbrechen
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              type="button"
            >
              {event ? 'Aktualisieren' : 'Erstellen'}
            </button>
          </div>
        </div>
      </div>

      {/* Wiederholungsabfrage Dialog */}
      {showRepeatDialog && (
        <div className="modal-overlay" style={{ zIndex: 1001 }}>
          <div className="modal-content repeat-dialog" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {pendingAction === 'delete' ? 'Termin löschen' : 'Termin bearbeiten'}
              </h3>
            </div>
            
            <div className="modal-body">
              <p>
                {pendingAction === 'delete' 
                  ? 'Dieser Termin ist Teil einer Wiederholung. Was möchten Sie löschen?'
                  : 'Dieser Termin ist Teil einer Wiederholung. Was möchten Sie bearbeiten?'
                }
              </p>
              
              <div className="repeat-options">
                <button 
                  className="btn btn-secondary repeat-option"
                  onClick={() => pendingAction === 'delete' 
                    ? handleRepeatDelete('single') 
                    : handleRepeatSave('single')
                  }
                >
                  <strong>Nur diesen Termin</strong>
                  <span>Nur den aktuellen Termin {pendingAction === 'delete' ? 'löschen' : 'bearbeiten'}</span>
                </button>
                
                <button 
                  className="btn btn-primary repeat-option"
                  onClick={() => pendingAction === 'delete' 
                    ? handleRepeatDelete('all') 
                    : handleRepeatSave('all')
                  }
                >
                  <strong>Alle Termine der Reihe</strong>
                  <span>Alle Termine dieser Wiederholung {pendingAction === 'delete' ? 'löschen' : 'bearbeiten'}</span>
                </button>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setShowRepeatDialog(false)
                  setPendingAction(null)
                }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventModal 