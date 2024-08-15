import { Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import Room from "./components/Room";
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </>
  )
}

export default App
