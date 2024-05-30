import React from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';
import '../../styles/StylesP/Ame.css'

function PMERecord () {
  const PMEHeading = ['PME', 'Data'];

  const PMERows = [
    { PMEInfo: 'BLOOD HB', data: '13.5 g/dL' },
    {
      PMEInfo: 'TLC',
      data: '6,000 cells/cu mm'
    },
    { PMEInfo: 'DLC', data: 'Neutrophils: 60%, Lymphocytes: 30%, Monocytes: 5%, Eosinophils: 3%, Basophils: 2%' },
    { PMEInfo: 'URINE', data: 'Normal' },
    { PMEInfo: 'URINE SP. GRAVITY', data: '1.020' },
    { PMEInfo: 'BLOOD SUGAR FASTING', data: '90 mg/dL' },
    { PMEInfo: 'BLOOD SUGAR PP', data: '120 mg/dL' },
    { PMEInfo: 'RESTING ECG', data: 'Normal sinus rhythm' },
    { PMEInfo: 'URIC ACID', data: '5.5 mg/dL' },
    { PMEInfo: 'UREA', data: '30 mg/dL' },
    { PMEInfo: 'CREATININE', data: '1.0 mg/dL' },
    { PMEInfo: 'CHOLESTEROL', data: '180 mg/dL' },
    { PMEInfo: 'LIPID PROFILE', data: 'Total Cholesterol: 180 mg/dL, HDL: 50 mg/dL, LDL: 100 mg/dL, Triglycerides: 150 mg/dL' },
    { PMEInfo: 'X-RAY CHEST PA', data: 'Normal' },
  ];
  

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='ameInfo'>
  
      <h1>PME</h1>
      <div className='ameTable'>
        <CustomTable headings={PMEHeading} rows={PMERows} />
      </div>
      <center>
        <Button className='print' variant='outlined' onClick={handlePrint}>
          Print
        </Button>
      </center>
    </div>
  );
}

export default PMERecord;
