import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Haupt-Einstiegspunkt der React-Anwendung
// Rendert die App-Komponente in das DOM-Element mit der ID 'root'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 