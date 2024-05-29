import React from 'react';
import { Button, TextField } from '@mui/material';

function SearchBar({ onChange, value, placeholder }) {
  const record = ['person1', 'person2', 'person3', 'person4', 'person5', 'person6', 'person7'];
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
  };

  return (
    <div className="flex px-10">
      <form className="flex items-center w-full gap-4 px-20" onSubmit={(e) => handleSubmit(e)}>
        <TextField
          id="outlined-basic"
          fullWidth
          label={placeholder || 'Search'}
          variant="outlined"
          className=""
          value={value}
          onChange={onChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="h-full border-2"
          style={{
            padding: '8px 32px', // Adjust the padding here
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
