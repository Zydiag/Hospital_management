import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import '../styles/StylesC/Navbar.css'

function Navbar () {
  return (
    <div className='navbar'>
      <div className='navItems'>
        <a className='navAnchor'>Home</a>
        <a className='navAnchor'>Contact</a>
      </div>

      <div className='logout'>
        <button className='navbarButton' href='/login'>
          <FontAwesomeIcon className='logoutIcon' icon={faRightFromBracket} /> Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar
