import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Projects from './pages/Projects'
import Settings from './pages/Settings'

/**
 * Main app shell
 */
function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <main className="flex-1 p-6 md:p-8">
            {/* mock example: no define routes*/}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
