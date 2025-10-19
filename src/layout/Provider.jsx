import React, { Children } from 'react'
import AppProvider from '../context/AppContext'
import AuthProvider from '../context/AuthProvider'


const Provider = ({children}) => {
  return (
    <AppProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AppProvider>
  )
}

export default Provider