import React from 'react'

const Title = ({ content, center = false }) => (
  <div className="container">
    <div className="page-header">
      <div className="page-title">
        <h1 className={`mb-1 ${center ? 'text-center' : ''}`}>{ content }</h1>
      </div>
    </div>
  </div>
)

export default Title
