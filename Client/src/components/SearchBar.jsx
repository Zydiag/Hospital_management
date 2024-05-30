import React from 'react';
import { Button, TextField } from '@mui/material';

function SearchBar({ onChange, value, placeholder, handleSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();  // Call the handleSearch function passed as a prop
  };

  return (
    <div className="flex px-10">
      <form className="flex items-center w-full gap-4 px-20 bg-inherit" onSubmit={handleSubmit}>
        <TextField
          id="outlined-basic"
          fullWidth
          label={placeholder || 'Search'}
          variant="outlined"
          value={value}
          onChange={onChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="h-full border-2"
          style={{
            padding: '8px 32px',
            backgroundColor: '#8b6119',
            color: '#ffffff',
          }}
        >
          Search
        </Button>
      </form>
    </div>
  );
}

export default SearchBar;
