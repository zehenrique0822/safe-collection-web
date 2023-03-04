import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, ListAll, MapPoints, Parameters, Points } from '@/pages'
import { Toaster } from 'react-hot-toast'

function App (): JSX.Element {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/points" element={<Points/>} />
            <Route path="/parameters" element={<Parameters/>} />
            <Route path="/list-all" element={<ListAll/>} />
            <Route path="/map-points" element={<MapPoints/>} />
        </Routes>
        <Toaster
          position="top-right"
        />
      </BrowserRouter>
  )
}

export default App
