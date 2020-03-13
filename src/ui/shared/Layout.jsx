import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="layout-grid">
      <div className="back-header"></div>
      {children}
    </div>
  )
}

export default Layout
