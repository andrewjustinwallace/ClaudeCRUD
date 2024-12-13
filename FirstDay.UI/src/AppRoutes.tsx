import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import TaskDetails from './pages/TaskDetails'
import CompanyProgress from './pages/CompanyProgress'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks/:taskId" element={<TaskDetails />} />
        <Route path="progress" element={<CompanyProgress />} />
      </Route>
    </Routes>
  )
}