# 📅 Anleitung: Feiertage und Schulferien pflegen

## 🎯 Übersicht
Diese Anleitung erklärt, wie du einfach neue Feiertage und Schulferien in den Kalender einpflegen kannst.

## 📁 Datei
Die Feiertage und Schulferien werden in der Datei `src/utils/holidays.ts` verwaltet.

## 🔧 Feiertage hinzufügen

### 1. Feste Feiertage (immer am gleichen Datum)
```typescript
{ date: '2029-01-01', name: 'Neujahr', type: 'holiday' },
{ date: '2029-01-06', name: 'Heilige Drei Könige', type: 'holiday' },
{ date: '2029-05-01', name: 'Tag der Arbeit', type: 'holiday' },
{ date: '2029-08-15', name: 'Mariä Himmelfahrt', type: 'holiday' },
{ date: '2029-10-03', name: 'Tag der Deutschen Einheit', type: 'holiday' },
{ date: '2029-10-31', name: 'Reformationstag', type: 'holiday' },
{ date: '2029-11-01', name: 'Allerheiligen', type: 'holiday' },
{ date: '2029-12-24', name: 'Heiligabend', type: 'holiday' },
{ date: '2029-12-25', name: '1. Weihnachtstag', type: 'holiday' },
{ date: '2029-12-26', name: '2. Weihnachtstag', type: 'holiday' },
{ date: '2029-12-31', name: 'Silvester', type: 'holiday' },
```

### 2. Bewegliche Feiertage (Ostern, Pfingsten, etc.)
Diese müssen jedes Jahr neu berechnet werden. Hier sind die Daten für 2029:

```typescript
// 2029 - Bewegliche Feiertage
{ date: '2029-04-13', name: 'Karfreitag', type: 'holiday' },
{ date: '2029-04-15', name: 'Ostersonntag', type: 'holiday' },
{ date: '2029-04-16', name: 'Ostermontag', type: 'holiday' },
{ date: '2029-05-24', name: 'Christi Himmelfahrt', type: 'holiday' },
{ date: '2029-06-03', name: 'Pfingstsonntag', type: 'holiday' },
{ date: '2029-06-04', name: 'Pfingstmontag', type: 'holiday' },
{ date: '2029-06-14', name: 'Fronleichnam', type: 'holiday' },
```

### 3. Weitere wichtige Tage (keine gesetzlichen Feiertage)
Diese sind wichtige Termine im Jahreslauf und werden in **gelb** angezeigt:

```typescript
// 2029 - Weitere wichtige Tage
{ date: '2029-02-21', name: 'Aschermittwoch', type: 'additional_day' },
{ date: '2029-02-19', name: 'Faschingsdienstag', type: 'additional_day' },
{ date: '2029-05-13', name: 'Muttertag', type: 'additional_day' },
{ date: '2029-06-17', name: 'Vatertag', type: 'additional_day' },
{ date: '2029-09-09', name: 'Tag des offenen Denkmals', type: 'additional_day' },
{ date: '2029-10-07', name: 'Erntedankfest', type: 'additional_day' },
{ date: '2029-11-18', name: 'Volkstrauertag', type: 'additional_day' },
{ date: '2029-11-25', name: 'Totensonntag', type: 'additional_day' },
{ date: '2029-12-06', name: 'Nikolaus', type: 'additional_day' },
```

## 🏫 Schulferien hinzufügen

### Format für Schulferien
```typescript
// 2029 - Winterferien (16. Februar - 24. Februar)
{ date: '2029-02-16', name: 'Winterferien', type: 'school_holiday' },
{ date: '2029-02-17', name: 'Winterferien', type: 'school_holiday' },
// ... für jeden Tag der Ferien

// 2029 - Osterferien (29. März - 13. April)
{ date: '2029-03-29', name: 'Osterferien', type: 'school_holiday' },
{ date: '2029-03-30', name: 'Osterferien', type: 'school_holiday' },
// ... für jeden Tag der Ferien
```

## 🛠️ Praktische Schritte

### 1. Neue Feiertage hinzufügen
1. Öffne `src/utils/holidays.ts`
2. Finde das Array `BAVARIAN_HOLIDAYS`
3. Füge neue Feiertage am Ende hinzu (vor dem schließenden `]`)

### 2. Weitere wichtige Tage hinzufügen
1. Öffne `src/utils/holidays.ts`
2. Finde das Array `ADDITIONAL_DAYS`
3. Füge neue Tage am Ende hinzu (vor dem schließenden `]`)

### 3. Neue Schulferien hinzufügen
1. Öffne `src/utils/holidays.ts`
2. Finde das Array `BAVARIAN_SCHOOL_HOLIDAYS`
3. Füge neue Ferien am Ende hinzu (vor dem schließenden `]`)

### 3. Datumsformat
- Verwende immer das Format: `'YYYY-MM-DD'`
- Beispiel: `'2029-01-01'` für 1. Januar 2029

## 📅 Ferienplan Bayern 2029 (ungefähre Daten)

### Winterferien: 16. Februar - 24. Februar 2029
### Osterferien: 29. März - 13. April 2029
### Pfingstferien: 19. Mai - 1. Juni 2029
### Sommerferien: 29. Juli - 7. September 2029
### Herbstferien: 27. Oktober - 4. November 2029
### Weihnachtsferien: 22. Dezember - 6. Januar 2030

## 🔍 Hilfreiche Tools

### 1. Online-Kalender für bewegliche Feiertage
- [Kalender-365.de](https://www.kalender-365.de/feiertage/2029.html)
- [Feiertage.info](https://www.feiertage.info/2029/)

### 2. Bayerische Schulferien
- [Bayerisches Staatsministerium für Unterricht und Kultus](https://www.km.bayern.de/ferien)

### 3. Datums-Generator für Ferien
```javascript
// JavaScript-Code um Feriendaten zu generieren
function generateHolidayDates(startDate, endDate, name) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dates.push(`{ date: '${dateStr}', name: '${name}', type: 'school_holiday' },`);
  }
  
  return dates.join('\n');
}

// Beispiel: Winterferien 2029
console.log(generateHolidayDates('2029-02-16', '2029-02-24', 'Winterferien'));
```

## ⚠️ Wichtige Hinweise

1. **Datum-Format**: Immer `YYYY-MM-DD` verwenden
2. **Typ**: 
   - `'holiday'` für Feiertage
   - `'school_holiday'` für Schulferien
3. **Namen**: Kurze, verständliche Namen verwenden
4. **Sortierung**: Chronologisch sortieren
5. **Backup**: Vor Änderungen immer ein Backup machen

## 🚀 Nach Änderungen

Nach dem Hinzufügen neuer Feiertage/Ferien:
1. Speichere die Datei
2. Die Änderungen werden automatisch im Kalender angezeigt
3. Teste die Anzeige im Browser

## 📞 Support

Bei Fragen oder Problemen:
- Prüfe das Datumsformat
- Stelle sicher, dass alle Klammern korrekt geschlossen sind
- Teste die Anwendung nach den Änderungen 