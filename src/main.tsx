import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Temperature from './components/temperature.tsx'
import Co2 from './components/co2.tsx'
import Methane from './components/methane.tsx'

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
    path: "Co2",
    element: <Co2/>,  
  },
  {
    path: "methane",
    element: <Methane />,  
  },
  {
    path: "Artic",
    element: <App />,  
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <RouterProvider router={router}/>
  </StrictMode>,
)
