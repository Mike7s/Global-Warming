import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Temperature from './pages/temperature.tsx'
import Co2 from './pages/co2.tsx'
import Methane from './pages/methane.tsx'
import Nitrous from './pages/nitrous.tsx'
import Arctic from './pages/arctic.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  
  },
  {
    path: "temperature",
    element: <Temperature />,  
  },
  {
    path: "co2",
    element: <Co2/>,  
  },
  {
    path: "methane",
    element: <Methane/>,  
  },
  {
    path: "nitrous",
    element: <Nitrous/>,  
  },
  {
    path: "artic",
    element: <Arctic/>,  
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router}/>
  </StrictMode>,
)
