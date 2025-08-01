#!/usr/bin/env node

/**
 * Einziger Einstiegspunkt für den Kulturforum Kalender
 * Startet sowohl Frontend als auch Backend
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starte Kulturforum Kalender...');
console.log('📅 Frontend: http://localhost:3000');
console.log('🔧 Backend:  http://localhost:5001');
console.log('');

// Funktion zum Starten eines Prozesses
function startProcess(command, args, name, color) {
  const process = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  process.on('error', (error) => {
    console.error(`❌ Fehler beim Starten von ${name}:`, error.message);
  });

  process.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ ${name} wurde mit Code ${code} beendet`);
    }
  });

  return process;
}

// Prüfe ob wir im Entwicklungsmodus sind
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  // Entwicklungsmodus: Starte beide Server
  console.log('🔧 Entwicklungsmodus - Starte Frontend und Backend...');
  
  const backend = startProcess('node', ['server/index.js'], 'Backend', '🔧');
  const frontend = startProcess('npm', ['run', 'dev'], 'Frontend', '📅');

  // Graceful Shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Beende Server...');
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Beende Server...');
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
    process.exit(0);
  });

} else {
  // Produktionsmodus: Starte nur Backend (Frontend wird als statische Dateien serviert)
  console.log('🚀 Produktionsmodus - Starte Backend...');
  
  // Baue Frontend zuerst
  console.log('📦 Baue Frontend...');
  const build = startProcess('npm', ['run', 'build'], 'Build', '📦');
  
  build.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Frontend erfolgreich gebaut');
      startProcess('node', ['server/index.js'], 'Backend', '🔧');
    } else {
      console.error('❌ Frontend Build fehlgeschlagen');
      process.exit(1);
    }
  });
} 