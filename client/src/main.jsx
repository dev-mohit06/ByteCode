import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './common/routes.jsx'
import { UserProvider } from './common/context';
import { ThemeProvider } from './common/theme-context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <UserProvider>
      <RouterProvider router={routes}>
        <App />
      </RouterProvider>
    </UserProvider>
  </ThemeProvider>
)