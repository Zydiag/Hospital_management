import React from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import '../../styles/StylesP/Ame.css'

function AME1 () {
  const ame1Heading = ['AME1', 'Data'];

  const ame1Rows = [
    { ame1Info: 'BLOOD HB', data: 'MPQ134' },
    {
      ame1Info: 'TLC',
      data: 'In this example, each row object contains two key-value pairs. The CustomTable component maps through these objects, ensuring the first value goes to the first column and the second value goes to the second column. This setup maintains flexibility while ensuring a consistent two-column structure.',
    },
    { ame1Info: 'DLC', data: 'Null' },
    { ame1Info: 'URINE', data: 'M89' },
    { ame1Info: 'URINESPGRAVITY', data: 'M89' },
    { ame1Info: 'BLOODSUGARFASTING', data: 'M89' },
    { ame1Info: 'BLOODSUGARPP', data: 'M89' },
    { ame1Info: 'RESTINGECG', data: 'M89' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='ameInfo'>
      <Navbar />
      <h1>AME1</h1>
      <div className='ameTable'>
        <CustomTable headings={ame1Heading} rows={ame1Rows} />
      </div>
      <center>
        <Button className='print' variant='outlined' onClick={handlePrint}>
          Print
        </Button>
      </center>
    </div>
  );
}

export default AME1;
