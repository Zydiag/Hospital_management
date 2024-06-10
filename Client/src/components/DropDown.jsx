import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import '../styles/StylesC/Dropdown.css'

const DropDown = ({
  obj,
  defaultValue,
  label,
  helperText,
  onChange,
  value
}) => {


  return (
    <div className='dropDown'>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { width: '25ch' }
        }}
        noValidate
        autoComplete='off'
      >
        <TextField
          className="dropdownField text-lg"
          id='outlined-select-currency-native'
          select
          value={value}
          onChange={onChange}
          label={label}
          defaultValue={defaultValue}
          SelectProps={{
            native: true
          }}
          helperText={helperText}
        >
          {obj.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Box>
    </div>
  )
}

export default DropDown
