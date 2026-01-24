import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './app/providers'
import { AppRoutes } from './app/routes'
import { Toaster } from './components/ui/toaster'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App