import React from 'react';
import '../styles/StylesC/RowPatient.css';
import Button from '@mui/material/Button';

function RowPatient({ button1, patientName, armyNumber, handleClick, date, test, href }) {
  return (
    <div className="rowPatient flex flex-row">
      <p className="Patient md:text-base text-sm">{patientName}</p>
      <p className="armyNumber md:text-lg text-base">{armyNumber}</p>
      <p className="entryDate md:text-base text-sm">{date}</p>
      <p className="testEntry md:text-base text-sm">{test}</p>
      <div className="rowPatientButton">
        <Button
          onClick={() => handleClick()}
          className="buttonRowPatient md:w-full w:4/12 md:text-lg text-sm"
          variant="contained"
        >
          {button1}
        </Button>
      </div>
    </div>
  );
}

export default RowPatient;
