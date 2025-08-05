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
    'ALTER TABLE events ADD COLUMN repeatWeekOfMonth INTEGER'
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
      // Für Kollisionsprüfung: Finde Events die sich mit dem Zeitraum überschneiden
      // Ein Event überschneidet sich wenn:
      // - Es startet vor dem Ende des Zeitraums UND endet nach dem Start des Zeitraums
      const collisionCondition = '(startDate <= ? AND endDate >= ?)'
      params.push(endDate, startDate)
      console.log('API /events - Kollisionsprüfung: Korrigierte Logik für', startDate, 'bis', endDate)
      
      if (roomId) {
        // Raum-Bedingung mit Kollisionsbedingung kombinieren
        conditions.push(`(${collisionCondition}) AND roomId = ?`)
        params.push(roomId)
      } else {
        conditions.push(collisionCondition)
      }
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

    res.json({
      success: true,
      data: rows
    })
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
    color: eventData.color || '#FF6B6B',
    repeatType: eventData.repeatType || 'none',
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
      startTime, endTime, color, repeatType, repeatUntil, 
      repeatGroupId, repeatWeekday, repeatWeekOfMonth,
      createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    newEvent.id, newEvent.title, newEvent.description, newEvent.roomId,
    newEvent.startDate, newEvent.endDate, newEvent.startTime, newEvent.endTime,
    newEvent.color, newEvent.repeatType, newEvent.repeatUntil,
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
      repeatUntil: eventData.repeatUntil || null,
      repeatGroupId: eventData.repeatGroupId || existingEvent.repeatGroupId,
      repeatWeekday: eventData.repeatWeekday || existingEvent.repeatWeekday,
      repeatWeekOfMonth: eventData.repeatWeekOfMonth || existingEvent.repeatWeekOfMonth,
      updatedAt: new Date().toISOString()
    }

    const query = `
      UPDATE events SET 
        title = ?, description = ?, roomId = ?, startDate = ?, endDate = ?,
        startTime = ?, endTime = ?, color = ?, repeatType = ?, repeatUntil = ?,
        repeatGroupId = ?, repeatWeekday = ?, repeatWeekOfMonth = ?,
        updatedAt = ?
      WHERE id = ?
    `

    const params = [
      updatedEvent.title, updatedEvent.description, updatedEvent.roomId,
      updatedEvent.startDate, updatedEvent.endDate, updatedEvent.startTime,
      updatedEvent.endTime, updatedEvent.color, updatedEvent.repeatType,
      updatedEvent.repeatUntil, updatedEvent.repeatGroupId, updatedEvent.repeatWeekday,
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