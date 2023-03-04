import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, Points } from '@/pages'

function App (): JSX.Element {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/points" element={<Points/>} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
