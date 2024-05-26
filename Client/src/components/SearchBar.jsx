import React, { useState } from 'react';
import '../styles/StylesC/SearchBar.css';

function SearchBar ({ handleSearch, onChange, value, placeholder ,href }) {
  const [hidePlaceholder, setHidePlaceholder] = useState(false);

  function handleClick () {
    setHideIcon(true);
    setHidePlaceholder(true);
  }

  return (
    <div className='searchBar'>
      <div>
        <form className='searchBarForm' onSubmit={e => e.preventDefault()}>
          <input
            typeof='text'
            className='searchBarInput'
            onClick={handleClick}
            value={value}
            type='text'
            onChange={onChange}
            placeholder={!hidePlaceholder ? placeholder : ''}
          />
        </form>
      </div>
      <div>
        <button
          className='searchBarButton'
          onClick={e => {
            e.preventDefault();
            handleSearch();
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
