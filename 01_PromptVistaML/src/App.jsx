import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Models from './pages/Models'
import ModelDetail from './pages/ModelDetail'
import ApiDocs from './pages/ApiDocs'
import Architecture from './pages/Architecture'
import Products from './pages/Products'
import About from './pages/About'
import Careers from './pages/Careers'
import VistaSecureAI from './pages/products/VistaSecureAI'
import PromptHallucinationML from './pages/products/PromptHallucinationML'
import VistaMeHR from './pages/products/VistaMeHR'
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
            <Route path="/products" element={<Products />} />
            <Route path="/products/vista-secure-ai" element={<VistaSecureAI />} />
            <Route path="/products/prompt-hallucination-ml" element={<PromptHallucinationML />} />
            <Route path="/products/vista-me-hr" element={<VistaMeHR />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App