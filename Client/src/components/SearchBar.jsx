import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import '../styles/StylesC/SearchBar.css'

function SearchBar () {
  const [hideIcon, setHideIcon] = useState(false)
  const [hidePlaceholder, setHidePlaceholder] = useState(false)

  function handleClick () {
    setHideIcon(true)
    setHidePlaceholder(true)
  }

  return (
    <div className='searchBar'>
      <center>
        <form className='searchBarForm'>
          <div>
            {!hideIcon && (
              <FontAwesomeIcon className='searchIcon' icon={faSearch} />
            )}
            <input
              className='searchBarInput'
              onClick={handleClick}
              type='text'
              placeholder={
                !hidePlaceholder
                  ? '        Search the Doctor by Army Number'
                  : ''
              }
            />
          </div>
          <div>
            {' '}
            <button className='searchBarButton'>Search</button>
          </div>
        </form>
      </center>
    </div>
  )
}

export default SearchBar
