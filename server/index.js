/**
 * Express-Server für den Kulturforum Kalender
 * REST-API mit SQLite-Datenbank
 */

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Server-Konfiguration
const PORT = process.env.PORT || 5001
const DB_PATH = path.join(__dirname, 'calendar.db')

// Express-App erstellen
const app = express()

// Middleware
app.use(helmet()) // Sicherheits-Header
app.use(cors()) // CORS für Frontend-Zugriff
app.use(express.json()) // JSON-Parser

// Statische Dateien im Produktionsmodus servieren
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  
  // Alle nicht-API Routen zur index.html weiterleiten (für React Router)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next()
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// SQLite-Datenbank initialisieren
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Fehler beim Verbinden zur Datenbank:', err.message)
  } else {
    console.log('Verbunden zur SQLite-Datenbank')
    initializeDatabase()
  }
})

/**
 * Initialisiert die Datenbank-Tabellen
 */
function initializeDatabase() {
  // Events-Tabelle erstellen
  const createEventsTable = `
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      roomId TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      color TEXT NOT NULL,
      repeatType TEXT NOT NULL DEFAULT 'none',
      repeatUntil TEXT,
      repeatGroupId TEXT,
      repeatWeekday INTEGER,
      repeatWeekOfMonth INTEGER,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `

  // Räume-Tabelle erstellen
  const createRoomsTable = `
    CREATE TABLE IF NOT EXISTS rooms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `

  db.serialize(() => {
    // Events-Tabelle erstellen
    db.run(createEventsTable, (err) => {
      if (err) {
        console.error('Fehler beim Erstellen der Events-Tabelle:', err.message)
      } else {
        console.log('Events-Tabelle erstellt oder bereits vorhanden')
        // Migration für neue Spalten
        migrateEventsTable()
      }
    })

    // Räume-Tabelle erstellen
    db.run(createRoomsTable, (err) => {
      if (err) {
        console.error('Fehler beim Erstellen der Rooms-Tabelle:', err.message)
      } else {
        console.log('Rooms-Tabelle erstellt oder bereits vorhanden')
        insertDefaultRooms()
      }
    })
  })
}

/**
 * Migration für Events-Tabelle (fügt neue Spalten hinzu)
 */
function migrateEventsTable() {
  const migrations = [
    'ALTER TABLE events ADD COLUMN repeatGroupId TEXT',
    'ALTER TABLE events ADD COLUMN repeatWeekday INTEGER',
    'ALTER TABLE events ADD COLUMN repeatWeekOfMonth INTEGER',
    'ALTER TABLE events ADD COLUMN repeatInterval INTEGER'
  ]

  migrations.forEach((migration, index) => {
    db.run(migration, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Fehler bei Migration ${index + 1}:`, err.message)
      }
    })
  })
}

/**
 * Fügt Standard-Räume in die Datenbank ein
 */
function insertDefaultRooms() {
  const defaultRooms = [
    { id: 'r3-ausstellung', name: 'R3 Ausstellung' },
    { id: 'r3-veranstaltung', name: 'R3 Veranstaltung' },
    { id: 'kabinett', name: 'Kabinett' },
    { id: 'speckdrumm', name: 'Speckdrumm' },
    { id: 'extern1', name: 'Extern 1' },
    { id: 'extern2', name: 'Extern 2' }
  ]

  const insertRoom = `INSERT OR IGNORE INTO rooms (id, name, createdAt) VALUES (?, ?, ?)`
  
  defaultRooms.forEach(room => {
    db.run(insertRoom, [room.id, room.name, new Date().toISOString()], (err) => {
      if (err) {
        console.error(`Fehler beim Einfügen von Raum ${room.name}:`, err.message)
      }
    })
  })
}

/**
 * Generiert eine eindeutige ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Prüft ob ein wiederholendes Event an einem bestimmten Tag stattfindet
 */
function isRecurringEventOnDay(event, day) {
  const dayKey = day.toISOString().split('T')[0]
  
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
      // Wenn kein repeatInterval gesetzt ist, verwende 1 (täglich)
      const interval = event.repeatInterval || 1
      
      // Berechne die Anzahl der Tage seit dem Start
      const daysSinceStart = Math.floor((checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Prüfe ob der Tag im Intervall liegt und zwischen Start und Ende
      return checkDate >= startDate && checkDate <= new Date(event.repeatUntil || event.endDate) && daysSinceStart % interval === 0
      
    case 'weekly':
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
 * Validiert Event-Daten
 */
function validateEvent(eventData) {
  const errors = []

  if (!eventData.title || eventData.title.trim() === '') {
    errors.push('Titel ist erforderlich')
  }

  if (!eventData.roomId) {
    errors.push('Raum ist erforderlich')
  }

  if (!eventData.startDate) {
    errors.push('Startdatum ist erforderlich')
  }

  if (!eventData.endDate) {
    errors.push('Enddatum ist erforderlich')
  }

  if (!eventData.startTime) {
    errors.push('Startzeit ist erforderlich')
  }

  if (!eventData.endTime) {
    errors.push('Endzeit ist erforderlich')
  }

  if (eventData.startDate > eventData.endDate) {
    errors.push('Enddatum darf nicht vor Startdatum liegen')
  }

  if (eventData.startDate === eventData.endDate && eventData.startTime >= eventData.endTime) {
    errors.push('Endzeit muss nach Startzeit liegen')
  }

  return errors
}

// API-Routen

/**
 * GET /api/events - Alle Events abrufen
 */
app.get('/api/events', (req, res) => {
  const { startDate, endDate, roomId } = req.query
  
  console.log('API /events - Query params:', { startDate, endDate, roomId })
  
  let query = 'SELECT * FROM events'
  const params = []

  // Filter anwenden
  if (startDate || endDate || roomId) {
    query += ' WHERE'
    const conditions = []

    if (startDate && endDate) {
      // Für Kollisionsprüfung: Lade alle Events im Raum und filtere nach Kollisionen
      // Hole startTime und endTime aus den Query-Parametern
      const startTime = req.query.startTime || '00:00'
      const endTime = req.query.endTime || '23:59'
      
      console.log('API /events - Kollisionsprüfung: Zeitbasierte Logik für', startDate, startTime, 'bis', endDate, endTime)
      
      // Lade alle Events im Raum (Kollisionsprüfung wird nach dem Laden durchgeführt)
      if (roomId) {
        conditions.push('roomId = ?')
        params.push(roomId)
      }
      
      // Lade alle Events im Raum für Kollisionsprüfung
      // Die Filterung nach Kollisionen erfolgt nach dem Laden
    } else {
      // Fallback für andere Abfragen
      if (startDate) {
        conditions.push('startDate >= ?')
        params.push(startDate)
      }

      if (endDate) {
        conditions.push('endDate <= ?')
        params.push(endDate)
      }

      if (roomId) {
        conditions.push('roomId = ?')
        params.push(roomId)
      }
    }

    query += ' ' + conditions.join(' AND ')
  }

  query += ' ORDER BY startDate ASC, startTime ASC'
  
  console.log('API /events - Final query:', query)
  console.log('API /events - Params:', params)

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Fehler beim Abrufen der Events:', err.message)
      return res.status(500).json({
        success: false,
        error: 'Datenbankfehler beim Abrufen der Events'
      })
    }

    console.log('API /events - Found rows:', rows.length)
    console.log('API /events - Sample rows:', rows.slice(0, 3))

    // Wenn Kollisionsprüfung erforderlich ist, filtere die Events
    if (startDate && endDate) {
      const startTime = req.query.startTime || '00:00'
      const endTime = req.query.endTime || '23:59'
      
      console.log('API /events - Kollisionsprüfung - Query Params:', {
        startDate,
        endDate,
        startTime,
        endTime,
        allQueryParams: req.query
      })
      
      // Erstelle kombinierte Datum+Zeit Strings für Vergleich
      // Verwende String-Vergleich um Zeitzonen-Probleme zu vermeiden
      const newEventStartStr = `${startDate} ${startTime}`
      const newEventEndStr = `${endDate} ${endTime}`
      
      console.log('API /events - Kollisionsprüfung: Prüfe für', newEventStartStr, 'bis', newEventEndStr)
      
      // Filtere Events die kollidieren
      const collidingEvents = rows.filter(event => {
        const eventStartStr = `${event.startDate} ${event.startTime}`
        const eventEndStr = `${event.endDate} ${event.endTime}`
        
        // Kollision: Event startet vor dem Ende des neuen Events UND endet nach dem Start des neuen Events
        const hasCollision = eventStartStr < newEventEndStr && eventEndStr > newEventStartStr
        
        if (hasCollision) {
          console.log('API /events - Kollision gefunden:', event.title, '(', event.startDate, event.startTime, '-', event.endDate, event.endTime, ')')
        }
        
        return hasCollision
      })
      
      console.log('API /events - Kollisionsprüfung: Gefunden', collidingEvents.length, 'kollidierende Events')
      
      // Zusätzlich: Prüfe wiederholende Events die sich mit dem neuen Event überschneiden könnten
      const repeatingEvents = rows.filter(event => 
        event.repeatType !== 'none' && 
        event.repeatUntil
      )
      
      console.log('API /events - Wiederholende Events gefunden:', repeatingEvents.length)
      repeatingEvents.forEach(event => {
        console.log('API /events - Wiederholendes Event:', event.title, '(', event.repeatType, 'bis', event.repeatUntil, ')')
      })
      
      // Gruppiere wiederholende Events nach repeatGroupId oder erstelle einzelne Gruppe
      const repeatingGroups = new Map()
      repeatingEvents.forEach(event => {
        const groupId = event.repeatGroupId || `single_${event.id}`
        if (!repeatingGroups.has(groupId)) {
          repeatingGroups.set(groupId, [])
        }
        repeatingGroups.get(groupId).push(event)
      })
      
      // Prüfe jede Wiederholungsgruppe auf Kollisionen
      repeatingGroups.forEach((groupEvents, groupId) => {
        if (groupEvents.length === 0) return
        
        const baseEvent = groupEvents[0]
        const repeatUntil = new Date(baseEvent.repeatUntil)
        const newEventDate = new Date(startDate)
        
        // Prüfe ob das neue Event innerhalb der Wiederholungsperiode liegt
        if (newEventDate <= repeatUntil) {
          // Generiere alle Wiederholungen und prüfe auf Kollisionen
          let currentDate = new Date(baseEvent.startDate)
          let count = 0
          const maxRepeats = 100 // Sicherheitslimit
          
          while (currentDate <= repeatUntil && count < maxRepeats) {
            // Prüfe ob das Event an diesem spezifischen Tag stattfindet
            const isEventOnThisDay = isRecurringEventOnDay(baseEvent, currentDate)
            
            if (isEventOnThisDay) {
              const repeatedEventStartStr = `${currentDate.toISOString().split('T')[0]} ${baseEvent.startTime}`
              const repeatedEventEndStr = `${currentDate.toISOString().split('T')[0]} ${baseEvent.endTime}`
              
              // Prüfe ob diese Wiederholung mit dem neuen Event kollidiert
              const hasRepeatingCollision = repeatedEventStartStr < newEventEndStr && repeatedEventEndStr > newEventStartStr
              
              if (hasRepeatingCollision) {
                console.log('API /events - Kollision mit Wiederholung gefunden:', baseEvent.title, '(', currentDate.toISOString().split('T')[0], baseEvent.startTime, '-', currentDate.toISOString().split('T')[0], baseEvent.endTime, ')')
                
                // Füge das Basis-Event zur Kollisionsliste hinzu (falls noch nicht vorhanden)
                if (!collidingEvents.find(e => e.id === baseEvent.id)) {
                  collidingEvents.push(baseEvent)
                }
                break
              }
            }
            
            // Berechne nächste Wiederholung
            switch (baseEvent.repeatType) {
              case 'daily':
                // Verwende repeatInterval oder Standard 1
                const dailyInterval = baseEvent.repeatInterval || 1
                currentDate.setDate(currentDate.getDate() + dailyInterval)
                break
              case 'weekly':
                // Verwende repeatInterval oder Standard 1
                const weeklyInterval = baseEvent.repeatInterval || 1
                currentDate.setDate(currentDate.getDate() + (7 * weeklyInterval))
                break
              case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1)
                break
              case 'yearly':
                currentDate.setFullYear(currentDate.getFullYear() + 1)
                break
            }
            count++
          }
        }
      })
      
      console.log('API /events - Kollisionsprüfung: Gefunden', collidingEvents.length, 'kollidierende Events')
      
      res.json({
        success: true,
        data: collidingEvents
      })
    } else {
      res.json({
        success: true,
        data: rows
      })
    }
  })
})

/**
 * GET /api/events/:id - Einzelnes Event abrufen
 */
app.get('/api/events/:id', (req, res) => {
  const { id } = req.params

  db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Fehler beim Abrufen des Events:', err.message)
      return res.status(500).json({
        success: false,
        error: 'Datenbankfehler beim Abrufen des Events'
      })
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        error: 'Event nicht gefunden'
      })
    }

    res.json({
      success: true,
      data: row
    })
  })
})

/**
 * POST /api/events - Neues Event erstellen
 */
app.post('/api/events', (req, res) => {
  const eventData = req.body

  // Validierung
  const errors = validateEvent(eventData)
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join(', ')
    })
  }

  const now = new Date().toISOString()
  const newEvent = {
    id: generateId(),
    title: eventData.title.trim(),
    description: eventData.description || '',
    roomId: eventData.roomId,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    startTime: eventData.startTime,
    endTime: eventData.endTime,
    color: eventData.color || '#808080', // Grau als neue Standardfarbe
    repeatType: eventData.repeatType || 'none',
    repeatInterval: eventData.repeatInterval || null,
    repeatUntil: eventData.repeatUntil || null,
    repeatGroupId: eventData.repeatGroupId || null,
    repeatWeekday: eventData.repeatWeekday || null,
    repeatWeekOfMonth: eventData.repeatWeekOfMonth || null,
    createdAt: now,
    updatedAt: now
  }

  const query = `
    INSERT INTO events (
      id, title, description, roomId, startDate, endDate, 
      startTime, endTime, color, repeatType, repeatInterval, repeatUntil, 
      repeatGroupId, repeatWeekday, repeatWeekOfMonth,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    newEvent.id, newEvent.title, newEvent.description, newEvent.roomId,
    newEvent.startDate, newEvent.endDate, newEvent.startTime, newEvent.endTime,
    newEvent.color, newEvent.repeatType, newEvent.repeatInterval, newEvent.repeatUntil,
    newEvent.repeatGroupId, newEvent.repeatWeekday, newEvent.repeatWeekOfMonth,
    newEvent.createdAt, newEvent.updatedAt
  ]

  db.run(query, params, function(err) {
    if (err) {
      console.error('Fehler beim Erstellen des Events:', err.message)
      return res.status(500).json({
        success: false,
        error: 'Datenbankfehler beim Erstellen des Events'
      })
    }

    res.status(201).json({
      success: true,
      data: newEvent
    })
  })
})

/**
 * PUT /api/events/:id - Event aktualisieren
 */
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params
  const eventData = req.body

  // Validierung
  const errors = validateEvent(eventData)
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: errors.join(', ')
    })
  }

  // Prüfen ob Event existiert
  db.get('SELECT * FROM events WHERE id = ?', [id], (err, existingEvent) => {
    if (err) {
      console.error('Fehler beim Prüfen des Events:', err.message)
      return res.status(500).json({
        success: false,
        error: 'Datenbankfehler beim Prüfen des Events'
      })
    }

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: 'Event nicht gefunden'
      })
    }

    const updatedEvent = {
      ...existingEvent,
      title: eventData.title.trim(),
      description: eventData.description || '',
      roomId: eventData.roomId,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      color: eventData.color || existingEvent.color,
      repeatType: eventData.repeatType || existingEvent.repeatType,
      repeatInterval: eventData.repeatInterval || existingEvent.repeatInterval,
      repeatUntil: eventData.repeatUntil || null,
      repeatGroupId: eventData.repeatGroupId || existingEvent.repeatGroupId,
      repeatWeekday: eventData.repeatWeekday || existingEvent.repeatWeekday,
      repeatWeekOfMonth: eventData.repeatWeekOfMonth || existingEvent.repeatWeekOfMonth,
      updatedAt: new Date().toISOString()
    }

    const query = `
      UPDATE events SET 
        title = ?, description = ?, roomId = ?, startDate = ?, endDate = ?,
        startTime = ?, endTime = ?, color = ?, repeatType = ?, repeatInterval = ?, repeatUntil = ?,
        repeatGroupId = ?, repeatWeekday = ?, repeatWeekOfMonth = ?,
        updatedAt = ?
      WHERE id = ?
    `

    const params = [
      updatedEvent.title, updatedEvent.description, updatedEvent.roomId,
      updatedEvent.startDate, updatedEvent.endDate, updatedEvent.startTime,
      updatedEvent.endTime, updatedEvent.color, updatedEvent.repeatType,
      updatedEvent.repeatInterval, updatedEvent.repeatUntil, updatedEvent.repeatGroupId, updatedEvent.repeatWeekday,
      updatedEvent.repeatWeekOfMonth, updatedEvent.updatedAt, id
    ]

    db.run(query, params, function(err) {
      if (err) {
        console.error('Fehler beim Aktualisieren des Events:', err.message)
        return res.status(500).json({
          success: false,
          error: 'Datenbankfehler beim Aktualisieren des Events'
        })
      }

      res.json({
        success: true,
        data: updatedEvent
      })
    })
  })
})

/**
 * DELETE /api/events/:id - Event löschen
 */
app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params

  db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Fehler beim Löschen des Events:', err.message)
      return res.status(500).json({
        success: false,
        error: 'Datenbankfehler beim Löschen des Events'
      })
    }

    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event nicht gefunden'
      })
    }

    res.json({
      success: true,
      message: 'Event erfolgreich gelöscht'
    })
  })
})

/**
 * GET /api/rooms - Alle Räume abrufen
 */
app.get('/api/rooms', (req, res) => {
  db.all('SELECT * FROM rooms ORDER BY name ASC', (err, rows) => {
    if (err) {
      console.error('Fehler beim Abrufen der Räume:', err.message)
      return res.status(500).json({
        success: false,
        error: 'Datenbankfehler beim Abrufen der Räume'
      })
    }

    res.json({
      success: true,
      data: rows
    })
  })
})

// Health-Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Kulturforum Kalender API läuft',
    timestamp: new Date().toISOString()
  })
})

// 404-Handler nur für API-Routen
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API-Endpoint nicht gefunden'
  })
})

// Im Produktionsmodus: Alle anderen Routen zur index.html weiterleiten
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
  })
}

// Error-Handler
app.use((err, req, res, next) => {
  console.error('Server-Fehler:', err)
  res.status(500).json({
    success: false,
    error: 'Interner Server-Fehler'
  })
})

// Server starten
app.listen(PORT, () => {
  console.log(`Kulturforum Kalender Server läuft auf Port ${PORT}`)
  console.log(`API verfügbar unter: http://localhost:${PORT}/api`)
})

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\nServer wird beendet...')
  db.close((err) => {
    if (err) {
      console.error('Fehler beim Schließen der Datenbank:', err.message)
    } else {
      console.log('Datenbankverbindung geschlossen')
    }
    process.exit(0)
  })
}) 