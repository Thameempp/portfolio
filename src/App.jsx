import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Research from './pages/Research'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research/*" element={<Research />} />
        <Route path="/pp" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
