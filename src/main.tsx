import '@fontsource/cabin/400.css'
import '@fontsource/cabin/700.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import './styles/tokens.css'
import './styles/fonts.css'
import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
