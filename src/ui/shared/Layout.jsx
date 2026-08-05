import React from 'react'
import LanguageSwitcher from './LanguageSwitcher'

const Layout = ({ children }) => {
  return (
    <div className="layoutGrid">
      <LanguageSwitcher />
      {children}
    </div>
  )
}

export default Layout
