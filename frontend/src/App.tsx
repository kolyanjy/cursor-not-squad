import { HealthStatus } from './components/HealthStatus'
import './App.css'

function App() {
  return (
    <main className="app">
      <header>
        <h1>Cursor Meetup</h1>
        <p>React frontend + Python FastAPI backend</p>
      </header>
      <HealthStatus />
    </main>
  )
}

export default App
