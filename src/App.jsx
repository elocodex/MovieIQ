import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import MovieDetails from './Components/MovieDetails'
import HomePage from './Components/HomePage'
import Footer from './Components/Footer'

const App = () => {
  return (
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
        <Footer />
      </div>
  )
}

export default App
