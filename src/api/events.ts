/**
 * API-Funktionen für die Event-Verwaltung
 * Kommuniziert mit dem Backend-Server über REST-API
 */

import { Event, CreateEventData, UpdateEventData, EventsResponse, EventResponse } from '../types'

// Basis-URL für die API
const API_BASE_URL = '/api'

/**
 * Generische Funktion für API-Aufrufe mit Fehlerbehandlung
 */
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Unbekannter API-Fehler')
    }

    return data.data
  } catch (error) {
    console.error('API-Fehler:', error)
    throw error
  }
}

/**
 * Lädt alle Events von der API
 * @returns Promise mit Array aller Events
 */
export async function fetchEvents(): Promise<Event[]> {
  return apiCall<Event[]>('/events')
}

/**
 * Lädt ein spezifisches Event anhand der ID
 * @param id - Event-ID
 * @returns Promise mit dem Event
 */
export async function fetchEvent(id: string): Promise<Event> {
  return apiCall<Event>(`/events/${id}`)
}

/**
 * Erstellt ein neues Event
 * @param eventData - Event-Daten ohne ID
 * @returns Promise mit dem erstellten Event
 */
export async function createEvent(eventData: CreateEventData): Promise<Event> {
  return apiCall<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  })
}

/**
 * Aktualisiert ein bestehendes Event
 * @param id - Event-ID
 * @param eventData - Zu aktualisierende Event-Daten
 * @returns Promise mit dem aktualisierten Event
 */
export async function updateEvent(id: string, eventData: UpdateEventData): Promise<Event> {
  return apiCall<Event>(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  })
}

/**
 * Löscht ein Event
 * @param id - Event-ID
 * @returns Promise mit Bestätigung
 */
export async function deleteEvent(id: string): Promise<void> {
  return apiCall<void>(`/events/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Lädt Events für einen bestimmten Zeitraum
 * @param startDate - Startdatum (ISO 8601)
 * @param endDate - Enddatum (ISO 8601)
 * @returns Promise mit Array der Events im Zeitraum
 */
export async function fetchEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
  return apiCall<Event[]>(`/events?startDate=${startDate}&endDate=${endDate}`)
}

/**
 * Lädt Events für einen bestimmten Raum
 * @param roomId - Raum-ID
 * @returns Promise mit Array der Events für den Raum
 */
export async function fetchEventsByRoom(roomId: string): Promise<Event[]> {
  return apiCall<Event[]>(`/events?roomId=${roomId}`)
}

/**
 * Lädt Events für einen bestimmten Raum und Zeitraum
 * @param roomId - Raum-ID
 * @param startDate - Startdatum (ISO 8601)
 * @param endDate - Enddatum (ISO 8601)
 * @returns Promise mit Array der Events
 */
export async function fetchEventsByRoomAndDateRange(
  roomId: string, 
  startDate: string, 
  endDate: string
): Promise<Event[]> {
  return apiCall<Event[]>(`/events?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`)
} 