#!/usr/bin/env node

/**
 * Entwicklungsskript für den Kulturforum Kalender
 * Startet Backend und Frontend separat für bessere Entwicklungserfahrung
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starte Kulturforum Kalender im Entwicklungsmodus...');
console.log('🔧 Backend:  http://localhost:5001');
console.log('🌐 Frontend: http://localhost:3000');
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

// Starte Backend und Frontend parallel
console.log('🔧 Starte Backend...');
const backend = startProcess('node', ['server/index.js'], 'Backend', '🔧');

console.log('🌐 Starte Frontend...');
const frontend = startProcess('npm', ['run', 'frontend'], 'Frontend', '🌐');

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Beende Server...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Beende Server...');
  backend.kill();
  frontend.kill();
  process.exit(0);
}); 