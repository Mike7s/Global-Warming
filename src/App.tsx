import { useNavigate } from 'react-router-dom'
import './App.css'
import NavBar from './components/navBar'

function App() {

  const navigate = useNavigate();

  return (
    <>
      <NavBar></NavBar>
      <div
        className="h-screen bg-cover bg-center bg-fixed flex flex-col items-center justify-center pt-16 "
        style={{ backgroundImage: "url('/terra.jpeg')" }} 
      >
      <div className='flex flex-col items-center text-black'>
        <h1 className='text-4xl font-bold mb-4'>Welcome to Global Warming</h1>
        <h2 className='text-3xl mb-4'>Climate Change in Numbers</h2>
        <p className='text-2xl fo'>Understanding our planet’s future through data.</p>
        <button className='mt-4 text-white transition-transform transform hover:scale-110' onClick={() => navigate("/temperature")}>Start view data</button>
      </div>
      
     </div>
    </>
  )
}

export default App
