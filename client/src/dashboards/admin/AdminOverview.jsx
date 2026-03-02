import React from 'react'

const AdminOverview = () => {
  return (
    <div>
      <h2 className="dash-main-title">Dashboard Overview</h2>

      <div className="dash-card-grid">
        <div className="dash-card">
          <h3>Total Users</h3>
          <p>128</p>
        </div>

        <div className="dash-card">
          <h3>Active Incidents</h3>
          <p>7</p>
        </div>

        <div className="dash-card">
          <h3>Services</h3>
          <p>12</p>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
