import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './common/routes.jsx'
import {UserProvider} from './common/context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
    <RouterProvider router={routes}>
      <App />
    </RouterProvider>
  </UserProvider>
)