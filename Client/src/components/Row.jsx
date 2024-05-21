import React from 'react'
import '../../public/StylesC/Row.css'

function Row() {
  return (
    <div className='row'>
        <p>Doctor Name</p>
        <p>ARMY NUMBER</p>
        <div>
            <button>View</button>
            <button>Accept</button>
            <button>Decline</button>
        </div>
    </div>
  )
}

export default Row