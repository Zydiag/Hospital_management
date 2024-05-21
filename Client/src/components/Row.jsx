import React from 'react'
import '../../public/StylesC/Row.css'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

function Row ({button1,button2}) {
  return (
    <div className='row'>
      <p className='doctor'>Doctor Name</p>
      <p>ARMY NUMBER</p>
      <div className='rowButton'>
        <Stack spacing={2} direction='row'>
          <Button
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
