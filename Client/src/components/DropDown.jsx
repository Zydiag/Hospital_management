import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import '../styles/StylesC/Dropdown.css';

const DropDown = ({ obj, defaultValue, label, helperText, onChange, value }) => {
  const CustomTextField = styled(TextField)`
    width: 500px;
    & .MuiSelect-root {
      border-color: red; /* Change border color */
    }
    & .MuiSelect-select {
      font-size: 20px; /* Increase text size of options */
    }
  `;

  return (
    <div className="dropDown">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <CustomTextField
          id="outlined-select-currency-native"
          select
          value={value}
          onChange={onChange}
          label={label}
          defaultValue={defaultValue}
          SelectProps={{
            native: true,
          }}
          helperText={helperText}
        >
          {obj.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </CustomTextField>
      </Box>
    </div>
  );
};

export default DropDown;
