import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import HomePage from './Components/Home/HomePage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './Components/Auth/Auth'
import Dashboard from './Components/Dashboard/Dashboard'
import MeetingRoom from './Components/Meeting/meetingRoom'

function App() {
  return (
            <>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/meeting/:meetingId' element={<MeetingRoom/>}/>
              </Routes>
            </BrowserRouter>

              
            </>
            
  )
}

export default App
