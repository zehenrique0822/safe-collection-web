import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Collections, Home, MapPoints, Parameters, Points } from '@/pages'
import { Toaster } from 'react-hot-toast'

function App (): JSX.Element {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/points" element={<Points/>} />
            <Route path="/parameters" element={<Parameters/>} />
            <Route path="/collections" element={<Collections/>} />
            <Route path="/map-points" element={<MapPoints/>} />
        </Routes>
        <Toaster
          position="top-center"
        />
      </BrowserRouter>
  )
}

export default App
