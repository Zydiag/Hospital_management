import React from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import '../../styles/StylesP/Ame.css'

function AME () {
  const ameHeading = ['AME', 'Data'];

  const ameRows = [
    { ameInfo: 'BLOOD HB', data: 'MPQ134' },
    {
      ameInfo: 'TLC',
      data: 'In this example, each row object contains two key-value pairs. The CustomTable component maps through these objects, ensuring the first value goes to the first column and the second value goes to the second column. This setup maintains flexibility while ensuring a consistent two-column structure.',
    },
    { ameInfo: 'DLC', data: 'Null' },
    { ameInfo: 'URINE', data: 'M89' },
    { ameInfo: 'URINESPGRAVITY', data: 'M89' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='ameInfo'>
      <Navbar />
      <h1>AME</h1>
      <div className='ameTable'>
        <CustomTable headings={ameHeading} rows={ameRows} />
      </div>
      <center>
        <Button className='print' variant='outlined' onClick={handlePrint}>
          Print
        </Button>
      </center>
    </div>
  );
}

export default AME;
