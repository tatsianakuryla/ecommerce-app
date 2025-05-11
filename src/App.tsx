import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '~router/App-routes.tsx'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
