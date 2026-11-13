import React from 'react'
import { createRoot } from 'react-dom/client'
import './luxury-clinic.css'
import { LuxuryApp } from './LuxuryApp'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LuxuryApp />
  </React.StrictMode>
)
