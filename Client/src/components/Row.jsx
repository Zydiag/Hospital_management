import React from 'react';
import '../styles/StylesC/Row.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function Row ({ button1, button2, button3, doctorName, armyNumber, handleClick, status ,disabled , href}) {

  
  return (
    <div className="row">
      <p className="doctor text-lg text-center font-medium" style={{marginLeft: '3vw'}}>{doctorName}</p>
      <p className="armyNumber text-lg text-center font-medium" style={{fontFamily:'Manrope'}}>{armyNumber}</p>
      <div className="rowButton">
        <Stack spacing={2} direction='row'>
          <Button
            onClick={() => handleClick(doctorName, armyNumber)}
            className="button1 text-lg"
            variant='contained'
          >
            {button1}
          </Button>
          <Button className="button2 text-lg" variant='outlined' disabled={disabled} href={href}>
            {button2}
          </Button>
          {status === 'Requested' && (
            <Button className="button3 text-lg" variant='outlined'>
              {button3}
            </Button>
          )}
        </Stack>
      </div>
    </div>
  );
}

export default Row;
