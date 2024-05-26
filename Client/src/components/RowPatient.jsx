import React from 'react';
import '../styles/StylesC/RowPatient.css';
import Button from '@mui/material/Button';

function RowPatient ({ button1, patientName, armyNumber, handleClick, href}) {

  
  return (
    <div className='rowPatient'>
      <p className='Patient'>{patientName}</p>
      <p className='armyNumber'>{armyNumber}</p>
      <div className='rowPatientButton'>
        
          <Button
            onClick={() => handleClick(doctorName, armyNumber)}
            className='button1'
            variant='contained'
            href={href}
          >
            {button1}
          </Button>
          
        
      </div>
    </div>
  );
}

export default RowPatient;
