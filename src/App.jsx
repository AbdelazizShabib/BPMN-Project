import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import ScrumBoard from './pages/ScrumBoard'
import Achievements from './pages/Achievements'
import Leaderboard from './pages/Leaderboard'
import Analytics from './pages/Analytics'
import BpmnViewer from './pages/BpmnViewer'
import Risks from './pages/Risks'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board" element={<ScrumBoard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/bpmn" element={<BpmnViewer />} />
          <Route path="/risks" element={<Risks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
