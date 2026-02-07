import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Models from './pages/Models'
import ModelDetail from './pages/ModelDetail'
import ApiDocs from './pages/ApiDocs'
import Architecture from './pages/Architecture'
import { useTheme } from './hooks/useTheme'

function App() {
  useTheme()

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/models" element={<Models />} />
            <Route path="/models/:modelNumber" element={<ModelDetail />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/architecture" element={<Architecture />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App