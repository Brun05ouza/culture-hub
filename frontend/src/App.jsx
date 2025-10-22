import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import CriarEventos from './pages/CriarEventos'
import MeusEventos from './pages/MeusEventos'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<><Header /><Home /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/criar-eventos" element={<><Header /><CriarEventos /></>} />
          <Route path="/meus-eventos" element={<><Header /><MeusEventos /></>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App