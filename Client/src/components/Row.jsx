import React from 'react'
import '../styles/StylesC/Row.css'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

function Row ({button1,button2, doctorName, armyNumber}) {
  return (
    <div className='row'>
      <p className='doctor'>{doctorName}</p>
      <p>{armyNumber}</p>
      <div className='rowButton'>
        <Stack spacing={2} direction='row'>
          <Button href='/doctor-profile'
            className='button1'
            variant='contained'
          >
            {button1}
          </Button>
          <Button
          className='button2' 
          variant='outlined'>
            {button2}
          </Button>
        </Stack>
      </div>
    </div>
  )
}

export default Row
