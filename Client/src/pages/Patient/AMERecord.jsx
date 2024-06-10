import React from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';

import '../../styles/StylesP/Ame.css';

function AMERecord () {
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
      <h1 className='md:text-3xl text-2xl'>AME</h1>
      <div className='ameTable'>
        <CustomTable headings={ameHeading} rows={ameRows} />
      </div>
      <center>
        <button
          className='h-9 w-1/4 md:w-1/12 text-lg font-medium text-amber-400 border-2 border-[#efb034] mx-auto mb-5 rounded hover:bg-amber-400 hover:text-white hover:border-[#efb034]'
          onClick={handlePrint}
          style={{ fontFamily: 'Manrope', fontOpticalSizing: 'auto' }}
        >
          Print
        </button>
      </center>
    </div>
  );
}

export default AMERecord;
