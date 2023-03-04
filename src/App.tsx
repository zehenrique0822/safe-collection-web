import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, ListAll, MapPoints, Parameters, Points } from '@/pages'

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
      </BrowserRouter>
  )
}

export default App
