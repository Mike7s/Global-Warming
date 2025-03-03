import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Temperature from './components/temperature.tsx'

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
    path: "Metano",
    element: <App />,  
  },
  {
    path: "NO2",
    element: <App />,  
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
