# Kulturforum Ansbach - Kalender

Ein gemeinsam pflegbarer Kalender für das Kulturforum Ansbach mit React-Frontend und Node.js-Backend.

## 🚀 Features

- **Kalenderansicht:** Monatsübersicht mit allen Räumen
- **Listenansicht:** Chronologische Auflistung aller Termine
- **Event-Management:** Erstellen, Bearbeiten, Löschen von Terminen
- **Wiederholungen:** Täglich, wöchentlich, monatlich, jährlich, monatliche Wochentage
- **Mehrtägige Events:** Von-bis Termine mit automatischer Anzeige
- **16 Event-Farben:** Farbkodierung für verschiedene Event-Typen
- **Feiertage & Schulferien:** Automatische Anzeige für Bayern
- **Responsive Design:** Funktioniert auf Desktop und Mobile
- **SQLite-Datenbank:** Lokale Datenspeicherung

## 📋 Voraussetzungen

- Node.js (Version 18 oder höher)
- npm (wird mit Node.js installiert)

## 🛠️ Installation

### 1. Repository klonen
```bash
git clone https://github.com/Funkprofessor/GRUPPENKALENDER.git
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

## 🚀 Live-Server Deployment

### Für Administratoren

Das Projekt ist **production-ready** und kann direkt auf einen Live-Server deployed werden.

#### Deployment-Anweisungen:

```bash
# 1. Repository auf Server klonen
git clone https://github.com/Funkprofessor/GRUPPENKALENDER.git
cd GRUPPENKALENDER

# 2. Abhängigkeiten installieren
npm install

# 3. Anwendung im Produktionsmodus starten
NODE_ENV=production npm start
```

#### Was passiert beim Start:
1. **Frontend wird gebaut** → `dist/` Verzeichnis erstellt
2. **Backend startet** → Port 5001 (oder `$PORT` Umgebungsvariable)
3. **Frontend + API** → Über einen einzigen Port verfügbar

#### Zugriff:
- **Anwendung:** `http://server-ip:5001/`
- **API:** `http://server-ip:5001/api/`
- **Health-Check:** `http://server-ip:5001/api/health`

#### Umgebungsvariablen (optional):
```bash
export PORT=8080        # Anderer Port (Standard: 5001)
export NODE_ENV=production
```

#### Datenbank:
- **Automatisch erstellt:** `server/calendar.db`
- **Standard-Räume:** Werden automatisch eingefügt
- **Persistent:** Bleibt auch nach Neustart erhalten

#### Monitoring:
```bash
# Prüfen ob Server läuft
curl http://server-ip:5001/api/health

# Logs anzeigen
tail -f logs/app.log  # Falls Logging konfiguriert
```

#### Systemd Service (optional):
```bash
# Service-Datei erstellen
sudo nano /etc/systemd/system/kulturforum-kalender.service

[Unit]
Description=Kulturforum Kalender
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/GRUPPENKALENDER
Environment=NODE_ENV=production
ExecStart=/usr/bin/node start.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target

# Service aktivieren und starten
sudo systemctl enable kulturforum-kalender
sudo systemctl start kulturforum-kalender
```

## 📁 Projektstruktur

```
GRUPPENKALENDER/
├── src/                    # Frontend-Quellcode
│   ├── components/         # React-Komponenten
│   ├── api/               # API-Funktionen
│   ├── types/             # TypeScript-Definitionen
│   ├── utils/             # Hilfsfunktionen
│   └── ...
├── server/                # Backend-Quellcode
│   └── index.js           # Express-Server
├── dist/                  # Gebaute Frontend-Dateien (wird erstellt)
├── start.js               # Einziger Einstiegspunkt
├── package.json           # Projekt-Konfiguration
└── README.md              # Diese Datei
```

## 🔧 Technologie-Stack

- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Node.js, Express, SQLite3
- **Styling:** CSS3 (Grid, Flexbox)
- **Datenbank:** SQLite (lokal)
- **Build-Tool:** Vite
- **Package Manager:** npm

## 📝 API-Endpunkte

- `GET /api/events` - Alle Events abrufen
- `POST /api/events` - Neues Event erstellen
- `PUT /api/events/:id` - Event aktualisieren
- `DELETE /api/events/:id` - Event löschen
- `GET /api/rooms` - Alle Räume abrufen
- `GET /api/health` - Health-Check

## 🎨 Event-Farben

16 vordefinierte Farben für Events:
- Rot, Türkis, Blau, Grün, Gelb, Lila, Orange, Mint
- Gold, Lavendel, Himmelblau, Pfirsich, Mintgrün, Rosa, Hellblau, Beige

## 📅 Feiertage & Schulferien

Automatische Anzeige für Bayern bis 2027:
- **Feiertage:** Hellviolett markiert
- **Schulferien:** Hellgrün markiert
- **Wochenenden:** Automatisch in Ferienzeiten eingeschlossen

## 🔄 Wiederholungen

Unterstützte Wiederholungstypen:
- **Keine Wiederholung**
- **Täglich** (mit Intervall)
- **Wöchentlich** (mit Intervall)
- **Monatlich** (mit Intervall)
- **Jährlich** (mit Intervall)
- **Monatliche Wochentage** (z.B. "Jeden 1. Montag im Monat")

## 🛡️ Sicherheit

- Helmet.js für Sicherheits-Header
- CORS-Konfiguration
- Input-Validierung
- SQL-Injection-Schutz

## 📞 Support

Bei Fragen oder Problemen wenden Sie sich an:
- **Entwickler:** Stefan Kammerer
- **Organisation:** Kulturforum Ansbach

## 📄 Lizenz

MIT License - siehe LICENSE-Datei für Details. 