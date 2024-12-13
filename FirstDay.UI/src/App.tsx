import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import './index.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
      </Router>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App