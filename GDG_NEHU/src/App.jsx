import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Events from './components/Events';
import Projects from './components/Project';
import Footer from './components/Footer';
import MovingVisuals from './components/MovingVisuals';
import './index.css';  

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <MovingVisuals />
      <Header />
      <main>
        <Hero />
        <Events />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

export default App;