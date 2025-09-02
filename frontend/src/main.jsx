import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Login from './pages/Login'
import CommunityList from './pages/CommunityList'
import CommunityDetail from './pages/CommunityDetail'
import CommunityForm from './pages/CommunityForm'
import './styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'community', element: <CommunityList /> },
      { path: 'community/:id', element: <CommunityDetail /> },
      { path: 'community/new', element: <CommunityForm /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


