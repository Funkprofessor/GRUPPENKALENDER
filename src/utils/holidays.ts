/**
 * Utility-Funktionen für bayerische Feiertage und Schulferien
 * Enthält die wichtigsten Feiertage und Schulferien für Bayern
 */

import { Holiday } from '../types'

// Bayerische Feiertage 2025-2027
const BAVARIAN_HOLIDAYS: Holiday[] = [
  // 2025
  { date: '2025-01-01', name: 'Neujahr', type: 'holiday' },
  { date: '2025-01-06', name: 'Heilige Drei Könige', type: 'holiday' },
  { date: '2025-04-18', name: 'Karfreitag', type: 'holiday' },
  { date: '2025-04-20', name: 'Ostersonntag', type: 'holiday' },
  { date: '2025-04-21', name: 'Ostermontag', type: 'holiday' },
  { date: '2025-05-01', name: 'Tag der Arbeit', type: 'holiday' },
  { date: '2025-05-29', name: 'Christi Himmelfahrt', type: 'holiday' },
  { date: '2025-06-08', name: 'Pfingstsonntag', type: 'holiday' },
  { date: '2025-06-09', name: 'Pfingstmontag', type: 'holiday' },
  { date: '2025-06-19', name: 'Fronleichnam', type: 'holiday' },
  { date: '2025-08-15', name: 'Mariä Himmelfahrt', type: 'holiday' },
  { date: '2025-10-03', name: 'Tag der Deutschen Einheit', type: 'holiday' },
  { date: '2025-10-31', name: 'Reformationstag', type: 'holiday' },
  { date: '2025-11-01', name: 'Allerheiligen', type: 'holiday' },
  { date: '2025-12-24', name: 'Heiligabend', type: 'holiday' },
  { date: '2025-12-25', name: '1. Weihnachtstag', type: 'holiday' },
  { date: '2025-12-26', name: '2. Weihnachtstag', type: 'holiday' },
  { date: '2025-12-31', name: 'Silvester', type: 'holiday' },
  
  // 2026
  { date: '2026-01-01', name: 'Neujahr', type: 'holiday' },
  { date: '2026-01-06', name: 'Heilige Drei Könige', type: 'holiday' },
  { date: '2026-04-03', name: 'Karfreitag', type: 'holiday' },
  { date: '2026-04-05', name: 'Ostersonntag', type: 'holiday' },
  { date: '2026-04-06', name: 'Ostermontag', type: 'holiday' },
  { date: '2026-05-01', name: 'Tag der Arbeit', type: 'holiday' },
  { date: '2026-05-14', name: 'Christi Himmelfahrt', type: 'holiday' },
  { date: '2026-05-24', name: 'Pfingstsonntag', type: 'holiday' },
  { date: '2026-05-25', name: 'Pfingstmontag', type: 'holiday' },
  { date: '2026-06-04', name: 'Fronleichnam', type: 'holiday' },
  { date: '2026-08-15', name: 'Mariä Himmelfahrt', type: 'holiday' },
  { date: '2026-10-03', name: 'Tag der Deutschen Einheit', type: 'holiday' },
  { date: '2026-10-31', name: 'Reformationstag', type: 'holiday' },
  { date: '2026-11-01', name: 'Allerheiligen', type: 'holiday' },
  { date: '2026-12-24', name: 'Heiligabend', type: 'holiday' },
  { date: '2026-12-25', name: '1. Weihnachtstag', type: 'holiday' },
  { date: '2026-12-26', name: '2. Weihnachtstag', type: 'holiday' },
  { date: '2026-12-31', name: 'Silvester', type: 'holiday' },
  
  // 2027
  { date: '2027-01-01', name: 'Neujahr', type: 'holiday' },
  { date: '2027-01-06', name: 'Heilige Drei Könige', type: 'holiday' },
  { date: '2027-03-26', name: 'Karfreitag', type: 'holiday' },
  { date: '2027-03-28', name: 'Ostersonntag', type: 'holiday' },
  { date: '2027-03-29', name: 'Ostermontag', type: 'holiday' },
  { date: '2027-05-01', name: 'Tag der Arbeit', type: 'holiday' },
  { date: '2027-05-06', name: 'Christi Himmelfahrt', type: 'holiday' },
  { date: '2027-05-16', name: 'Pfingstsonntag', type: 'holiday' },
  { date: '2027-05-17', name: 'Pfingstmontag', type: 'holiday' },
  { date: '2027-05-27', name: 'Fronleichnam', type: 'holiday' },
  { date: '2027-08-15', name: 'Mariä Himmelfahrt', type: 'holiday' },
  { date: '2027-10-03', name: 'Tag der Deutschen Einheit', type: 'holiday' },
  { date: '2027-10-31', name: 'Reformationstag', type: 'holiday' },
  { date: '2027-11-01', name: 'Allerheiligen', type: 'holiday' },
  { date: '2027-12-24', name: 'Heiligabend', type: 'holiday' },
  { date: '2027-12-25', name: '1. Weihnachtstag', type: 'holiday' },
  { date: '2027-12-26', name: '2. Weihnachtstag', type: 'holiday' },
  { date: '2027-12-31', name: 'Silvester', type: 'holiday' },
]

// Bayerische Schulferien 2025-2027 (ungefähre Daten)
const BAVARIAN_SCHOOL_HOLIDAYS: Holiday[] = [
  // Winterferien 2025 (15. Februar - 23. Februar)
  { date: '2025-02-15', name: 'Winterferien', type: 'school_holiday' },
  { date: '2025-02-16', name: 'Winterferien', type: 'school_holiday' },
  { date: '2025-02-17', name: 'Winterferien', type: 'school_holiday' },
  { date: '2025-02-18', name: 'Winterferien', type: 'school_holiday' },
  { date: '2025-02-19', name: 'Winterferien', type: 'school_holiday' },
  { date: '2025-02-20', name: 'Winterferien', type: 'school_holiday' },
  { date: '2025-02-21', name: 'Winterferien', type: 'school_holiday' },
  { date: '2025-02-22', name: 'Winterferien', type: 'school_holiday' },
  { date: '2025-02-23', name: 'Winterferien', type: 'school_holiday' },
  
  // Osterferien 2025 (12. April - 26. April)
  { date: '2025-04-12', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-13', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-14', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-15', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-16', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-17', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-18', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-19', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-20', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-21', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-22', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-23', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-24', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-25', name: 'Osterferien', type: 'school_holiday' },
  { date: '2025-04-26', name: 'Osterferien', type: 'school_holiday' },
  
  // Pfingstferien 2025 (7. Juni - 15. Juni)
  { date: '2025-06-07', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2025-06-08', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2025-06-09', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2025-06-10', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2025-06-11', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2025-06-12', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2025-06-13', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2025-06-14', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2025-06-15', name: 'Pfingstferien', type: 'school_holiday' },
  
  // Sommerferien 2025 (28. Juli - 13. September)
  { date: '2025-07-28', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-07-29', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-07-30', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-07-31', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-01', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-02', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-03', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-04', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-05', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-06', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-07', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-08', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-09', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-10', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-11', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-12', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-13', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-14', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-15', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-16', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-17', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-18', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-19', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-20', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-21', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-22', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-23', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-24', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-25', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-26', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-27', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-28', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-29', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-30', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-08-31', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-01', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-02', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-03', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-04', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-05', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-06', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-07', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-08', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-09', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-10', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-11', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-12', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2025-09-13', name: 'Sommerferien', type: 'school_holiday' },
  
  // Herbstferien 2025 (25. Oktober - 2. November)
  { date: '2025-10-25', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2025-10-26', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2025-10-27', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2025-10-28', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2025-10-29', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2025-10-30', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2025-10-31', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2025-11-01', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2025-11-02', name: 'Herbstferien', type: 'school_holiday' },
  
  // Weihnachtsferien 2025 (20. Dezember - 5. Januar 2026)
  { date: '2025-12-20', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-21', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-22', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-23', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-24', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-25', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-26', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-27', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-28', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-29', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-30', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2025-12-31', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-01-01', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-01-02', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-01-03', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-01-04', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-01-05', name: 'Weihnachtsferien', type: 'school_holiday' },
  
  // 2026 - Winterferien (14. Februar - 22. Februar)
  { date: '2026-02-14', name: 'Winterferien', type: 'school_holiday' },
  { date: '2026-02-15', name: 'Winterferien', type: 'school_holiday' },
  { date: '2026-02-16', name: 'Winterferien', type: 'school_holiday' },
  { date: '2026-02-17', name: 'Winterferien', type: 'school_holiday' },
  { date: '2026-02-18', name: 'Winterferien', type: 'school_holiday' },
  { date: '2026-02-19', name: 'Winterferien', type: 'school_holiday' },
  { date: '2026-02-20', name: 'Winterferien', type: 'school_holiday' },
  { date: '2026-02-21', name: 'Winterferien', type: 'school_holiday' },
  { date: '2026-02-22', name: 'Winterferien', type: 'school_holiday' },
  
  // 2026 - Osterferien (26. März - 12. April)
  { date: '2026-03-26', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-03-27', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-03-28', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-03-29', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-03-30', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-03-31', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-01', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-02', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-03', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-04', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-05', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-06', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-07', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-08', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-09', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-10', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-11', name: 'Osterferien', type: 'school_holiday' },
  { date: '2026-04-12', name: 'Osterferien', type: 'school_holiday' },
  
  // 2026 - Pfingstferien (23. Mai - 31. Mai)
  { date: '2026-05-23', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2026-05-24', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2026-05-25', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2026-05-26', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2026-05-27', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2026-05-28', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2026-05-29', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2026-05-30', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2026-05-31', name: 'Pfingstferien', type: 'school_holiday' },
  
  // 2026 - Sommerferien
  { date: '2026-07-27', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-07-28', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-07-29', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-07-30', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-07-31', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-01', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-02', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-03', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-04', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-05', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-06', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-07', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-08', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-09', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-10', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-11', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-12', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-13', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-14', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-15', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-16', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-17', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-18', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-19', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-20', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-21', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-22', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-23', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-24', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-25', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-26', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-27', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-28', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-29', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-30', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-08-31', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-01', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-02', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-03', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-04', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-05', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-06', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-07', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-08', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-09', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-10', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-11', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-12', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-13', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-14', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-15', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-16', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-17', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-18', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-19', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-20', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-21', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-22', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-23', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-24', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-25', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-26', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-27', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-28', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-29', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2026-09-30', name: 'Sommerferien', type: 'school_holiday' },
  
  // 2026 - Herbstferien (24. Oktober - 1. November)
  { date: '2026-10-24', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2026-10-25', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2026-10-26', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2026-10-27', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2026-10-28', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2026-10-29', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2026-10-30', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2026-10-31', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2026-11-01', name: 'Herbstferien', type: 'school_holiday' },
  
  // 2026 - Weihnachtsferien (19. Dezember - 6. Januar 2027)
  { date: '2026-12-19', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-20', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-21', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-22', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-23', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-24', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-25', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-26', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-27', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-28', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-29', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-30', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2026-12-31', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-01-01', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-01-02', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-01-03', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-01-04', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-01-05', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-01-06', name: 'Weihnachtsferien', type: 'school_holiday' },
  
  // 2027 - Winterferien (13. Februar - 21. Februar)
  { date: '2027-02-13', name: 'Winterferien', type: 'school_holiday' },
  { date: '2027-02-14', name: 'Winterferien', type: 'school_holiday' },
  { date: '2027-02-15', name: 'Winterferien', type: 'school_holiday' },
  { date: '2027-02-16', name: 'Winterferien', type: 'school_holiday' },
  { date: '2027-02-17', name: 'Winterferien', type: 'school_holiday' },
  { date: '2027-02-18', name: 'Winterferien', type: 'school_holiday' },
  { date: '2027-02-19', name: 'Winterferien', type: 'school_holiday' },
  { date: '2027-02-20', name: 'Winterferien', type: 'school_holiday' },
  { date: '2027-02-21', name: 'Winterferien', type: 'school_holiday' },
  
  // 2027 - Osterferien (25. März - 9. April)
  { date: '2027-03-25', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-03-26', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-03-27', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-03-28', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-03-29', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-03-30', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-03-31', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-04-01', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-04-02', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-04-03', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-04-04', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-04-05', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-04-06', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-04-07', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-04-08', name: 'Osterferien', type: 'school_holiday' },
  { date: '2027-04-09', name: 'Osterferien', type: 'school_holiday' },
  
  // 2027 - Pfingstferien (15. Mai - 23. Mai)
  { date: '2027-05-15', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2027-05-16', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2027-05-17', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2027-05-18', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2027-05-19', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2027-05-20', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2027-05-21', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2027-05-22', name: 'Pfingstferien', type: 'school_holiday' },
  { date: '2027-05-23', name: 'Pfingstferien', type: 'school_holiday' },
  
  // 2027 - Sommerferien
  { date: '2027-07-26', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-07-27', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-07-28', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-07-29', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-07-30', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-07-31', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-01', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-02', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-03', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-04', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-05', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-06', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-07', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-08', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-09', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-10', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-11', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-12', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-13', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-14', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-15', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-16', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-17', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-18', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-19', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-20', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-21', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-22', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-23', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-24', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-25', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-26', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-27', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-28', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-29', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-30', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-08-31', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-01', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-02', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-03', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-04', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-05', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-06', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-07', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-08', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-09', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-10', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-11', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-12', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-13', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-14', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-15', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-16', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-17', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-18', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-19', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-20', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-21', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-22', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-23', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-24', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-25', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-26', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-27', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-28', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-29', name: 'Sommerferien', type: 'school_holiday' },
  { date: '2027-09-30', name: 'Sommerferien', type: 'school_holiday' },
  
  // 2027 - Herbstferien (23. Oktober - 31. Oktober)
  { date: '2027-10-23', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2027-10-24', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2027-10-25', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2027-10-26', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2027-10-27', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2027-10-28', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2027-10-29', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2027-10-30', name: 'Herbstferien', type: 'school_holiday' },
  { date: '2027-10-31', name: 'Herbstferien', type: 'school_holiday' },
  
  // 2027 - Weihnachtsferien (18. Dezember - 7. Januar 2028)
  { date: '2027-12-18', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-19', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-20', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-21', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-22', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-23', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-24', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-25', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-26', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-27', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-28', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-29', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-30', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2027-12-31', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2028-01-01', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2028-01-02', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2028-01-03', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2028-01-04', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2028-01-05', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2028-01-06', name: 'Weihnachtsferien', type: 'school_holiday' },
  { date: '2028-01-07', name: 'Weihnachtsferien', type: 'school_holiday' },
]

/**
 * Kombiniert alle Feiertage und Schulferien
 */
const ALL_HOLIDAYS = [...BAVARIAN_HOLIDAYS, ...BAVARIAN_SCHOOL_HOLIDAYS]

/**
 * Formatiert ein Datum zu ISO-String (YYYY-MM-DD)
 */
function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Gibt alle Feiertage und Schulferien für ein bestimmtes Datum zurück
 * @param date - Das zu prüfende Datum
 * @returns Array mit allen Feiertagen/Schulferien für das Datum
 */
export function getHolidaysForDate(date: Date): Holiday[] {
  const dateString = formatDateToISO(date)
  return ALL_HOLIDAYS.filter(holiday => holiday.date === dateString)
}

/**
 * Prüft, ob ein Datum ein Feiertag ist
 * @param date - Das zu prüfende Datum
 * @returns true wenn es ein Feiertag ist
 */
export function isHoliday(date: Date): boolean {
  const holidays = getHolidaysForDate(date)
  return holidays.some(holiday => holiday.type === 'holiday')
}

/**
 * Prüft, ob ein Datum in den Schulferien liegt
 * @param date - Das zu prüfende Datum
 * @returns true wenn es in den Schulferien liegt
 */
export function isSchoolHoliday(date: Date): boolean {
  const holidays = getHolidaysForDate(date)
  return holidays.some(holiday => holiday.type === 'school_holiday')
}

/**
 * Gibt alle Feiertage für einen bestimmten Monat zurück
 * @param year - Jahr
 * @param month - Monat (0-11)
 * @returns Array mit allen Feiertagen im Monat
 */
export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  const monthString = month.toString().padStart(2, '0')
  return ALL_HOLIDAYS.filter(holiday => 
    holiday.date.startsWith(`${year}-${monthString}`)
  )
}

/**
 * Gibt alle Feiertage für einen bestimmten Zeitraum zurück
 * @param startDate - Startdatum
 * @param endDate - Enddatum
 * @returns Array mit allen Feiertagen im Zeitraum
 */
export function getHolidaysForDateRange(startDate: Date, endDate: Date): Holiday[] {
  const startString = formatDateToISO(startDate)
  const endString = formatDateToISO(endDate)
  
  return ALL_HOLIDAYS.filter(holiday => 
    holiday.date >= startString && holiday.date <= endString
  )
} 