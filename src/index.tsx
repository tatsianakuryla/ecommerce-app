import ReactDOM from 'react-dom/client'
import App from './App'
import React from 'react'

const rootElement = document.getElementById('root')

if (rootElement instanceof HTMLElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
