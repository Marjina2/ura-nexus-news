
import { createRoot } from 'react-dom/client'
import React from 'react'
// ClerkProvider moved to App.tsx to avoid duplication
import App from './App.tsx'
import './index.css'

// Clerk setup moved to App.tsx to avoid duplication

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
