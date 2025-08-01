# Kulturforum Ansbach - Kalender

Ein gemeinsam pflegebarer Kalender für das Kulturforum Ansbach mit moderner Web-Oberfläche und SQLite-Datenbank.

## Features

- **Listenansicht**: Kalender wird in übersichtlicher Listenform dargestellt
- **Raumverwaltung**: 6 Räume (R3 Ausstellung, R3 Veranstaltung, Kabinett, Speckdrumm, Extern 1, Extern 2)
- **Deutsche Datumsformatierung**: Datum im Format DD.MM.YYYY
- **Feiertage & Schulferien**: Automatische Anzeige bayerischer Feiertage und Schulferien
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Sticky Headers**: Zeilen- und Spaltenbeschriftungen bleiben beim Scrollen sichtbar
- **16 Farben**: Jeder Termin kann eine von 16 vordefinierten Farben erhalten
- **Wiederholungen**: Tägliche, wöchentliche, monatliche und jährliche Wiederholungen
- **Zeitauswahl**: 15-Minuten-Intervalle, Standardzeit 20:00 Uhr
- **Von-bis Funktion**: Termine können über mehrere Tage gehen

## Technologie-Stack

### Frontend
- **React 18** mit TypeScript
- **Vite** als Build-Tool
- **date-fns** für Datums-Operationen
- **CSS3** mit modernen Features (Grid, Flexbox, Sticky Positioning)

### Backend
- **Node.js** mit Express
- **SQLite3** als Datenbank
- **REST-API** für CRUD-Operationen
- **CORS** für Frontend-Integration

## Installation

### Voraussetzungen
- Node.js (Version 16 oder höher)
- npm oder yarn

### 1. Repository klonen
```bash
git clone <repository-url>
cd GRUPPENKALENDER
```

### 2. Abhängigkeiten installieren
```bash
npm install
```

### 3. Anwendung starten

**Einziger Einstiegspunkt (Empfohlen):**
```bash
npm start
```

**Alternative Einstiegspunkte:**
```bash
npm run dev         # Entwicklungsmodus (Frontend + Backend)
npm run frontend    # Nur Frontend-Server (Port 3000)
npm run backend     # Nur Backend-Server (Port 5001)
```

### 4. Anwendung öffnen
Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser.

**Produktionsmodus:**
```bash
NODE_ENV=production npm start
```
Öffnen Sie [http://localhost:5001](http://localhost:5001) in Ihrem Browser.

## Projektstruktur

```
GRUPPENKALENDER/
├── src/
│   ├── components/
│   │   ├── Calendar.tsx          # Hauptkalender-Komponente
│   │   ├── Calendar.css          # Kalender-Styles
│   │   ├── EventModal.tsx        # Modal für Terminbearbeitung
│   │   └── EventModal.css        # Modal-Styles
│   ├── api/
│   │   └── events.ts             # API-Funktionen
│   ├── utils/
│   │   └── holidays.ts           # Feiertage-Utilities
│   ├── types/
│   │   └── index.ts              # TypeScript-Typdefinitionen
│   ├── App.tsx                   # Haupt-App-Komponente
│   ├── App.css                   # App-Styles
│   ├── main.tsx                  # React-Einstiegspunkt
│   └── index.css                 # Globale Styles
├── server/
│   └── index.js                  # Express-Server
├── package.json                  # Abhängigkeiten und Scripts
├── vite.config.ts               # Vite-Konfiguration
├── tsconfig.json                # TypeScript-Konfiguration
└── README.md                    # Diese Datei
```

## API-Endpunkte

### Events
- `GET /api/events` - Alle Events abrufen
- `GET /api/events/:id` - Einzelnes Event abrufen
- `POST /api/events` - Neues Event erstellen
- `PUT /api/events/:id` - Event aktualisieren
- `DELETE /api/events/:id` - Event löschen

### Räume
- `GET /api/rooms` - Alle Räume abrufen

### Health Check
- `GET /api/health` - Server-Status prüfen

## Datenbank-Schema

### Events-Tabelle
```sql
CREATE TABLE events (
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
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)
```

### Rooms-Tabelle
```sql
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  createdAt TEXT NOT NULL
)
```

## Verwendung

### Termin erstellen
1. Klicken Sie auf "Neuer Termin" oder das "+" in einer Kalenderzelle
2. Füllen Sie das Formular aus:
   - **Titel**: Name des Termins
   - **Beschreibung**: Optionale Details
   - **Raum**: Wählen Sie einen der 6 verfügbaren Räume
   - **Datum & Zeit**: Start- und Enddatum/zeit
   - **Farbe**: Wählen Sie eine von 16 Farben
   - **Wiederholung**: Optional für wiederkehrende Termine
3. Klicken Sie auf "Erstellen"

### Termin bearbeiten
1. Klicken Sie auf einen bestehenden Termin
2. Ändern Sie die gewünschten Felder
3. Klicken Sie auf "Aktualisieren"

### Termin löschen
1. Öffnen Sie einen Termin zum Bearbeiten
2. Klicken Sie auf "Löschen"
3. Bestätigen Sie die Löschung

## Feiertage und Schulferien

Das System enthält automatisch die wichtigsten bayerischen Feiertage und Schulferien für 2025:

### Feiertage
- Neujahr, Heilige Drei Könige, Karfreitag, Ostern
- Tag der Arbeit, Christi Himmelfahrt, Pfingsten
- Fronleichnam, Mariä Himmelfahrt, Tag der Deutschen Einheit
- Reformationstag, Allerheiligen, Weihnachten, Silvester

### Schulferien
- Winterferien, Osterferien, Pfingstferien
- Sommerferien, Herbstferien, Weihnachtsferien

## Responsive Design

Die Anwendung ist für verschiedene Bildschirmgrößen optimiert:

- **Desktop**: Vollständige Funktionalität mit allen Spalten sichtbar
- **Tablet**: Angepasste Darstellung mit horizontalem Scroll
- **Mobile**: Optimierte Touch-Bedienung mit gestapelten Elementen

## Entwicklung

### Scripts
```bash
npm run dev          # Frontend-Entwicklungsserver
npm run server       # Backend-Server
npm run build        # Frontend für Produktion bauen
npm run preview      # Produktions-Build testen
```

### Code-Struktur
- **Komponenten**: Modulare React-Komponenten mit TypeScript
- **API-Layer**: Zentrale API-Funktionen für Backend-Kommunikation
- **Utilities**: Hilfsfunktionen für Datums- und Feiertags-Berechnungen
- **Types**: TypeScript-Definitionen für Typsicherheit

## Deployment

### Produktions-Build
```bash
npm run build
```

### Server-Deployment
1. Backend-Server auf einem Node.js-Server deployen
2. Frontend-Build-Dateien auf einem Web-Server bereitstellen
3. API-URL in der Frontend-Konfiguration anpassen

## Lizenz

MIT License - siehe LICENSE-Datei für Details.

## Support

Bei Fragen oder Problemen wenden Sie sich an das Entwicklungsteam des Kulturforums Ansbach. 