import React from 'react'

const SlickArrow = (props) => {
  const {className, style, onClick, flip} = props
  return (
    <img className={className} style={{...style, width: 40, height: 40}} onClick={onClick}
         src={flip ? "/images/arrow_back.svg": "/images/arrow_next.svg"}/>
  )
}

export default SlickArrow
