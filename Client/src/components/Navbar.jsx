import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import '../styles/StylesC/Navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-items">
        <a>Home</a>
        <a>Contact</a>
      </div>

      <div className="logout">
        <button>
          <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
