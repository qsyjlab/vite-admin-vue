import { Navigate } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <Navigate to="/home" replace /> }
    ]
  }
]

export default routes
