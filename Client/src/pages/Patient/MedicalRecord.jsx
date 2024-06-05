import React from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import { rows } from '../../constants';



function MedicalRecord() {

  const headingsPersonelInfo = ['Personnel Info', 'Data'];

  const rowsPI = [
    { personnelInfo: 'ARMY NUMBER', data: 'MPQ134' },
    {
      personnelInfo: 'NAME',
      data: 'In this example, each row object contains two key-value pairs. The CustomTable component maps through these objects, ensuring the first value goes to the first column and the second value goes to the second column. This setup maintains flexibility while ensuring a consistent two-column structure.',
    },
    { personnelInfo: 'AGE/SERVICE', data: 'Null' },
    { personnelInfo: 'UNITS/ARMS/SERVICE', data: 'M89' },
  ];

  const headingsHealthRecord = ['Health Record', 'Data'];
  const rowsHR = [
    { healthRecord: 'Height', data: '180 cm' },
    { healthRecord: 'Weight', data: '75 kg' },
    { healthRecord: 'BMI', data: '23.1' },
    { healthRecord: 'Chest', data: '98 cm' },
    { healthRecord: 'Waist', data: '85 cm' },
    { healthRecord: 'Blood Pressure', data: '120/80 mmHg' },
  ];

  const personelMedHistoryHeading = ['Personel Medical History', 'Data'];
  const rowsPMH = [
    { personnelInfo: 'Personnel Medications', data: 'Aspirin, Lisinopril, Metformin' },
    { personnelInfo: 'Diagnosis', data: 'Hypertension, Type 2 Diabetes' },
    {
      personnelInfo: 'Description',
      data: 'Patient exhibits high blood pressure and elevated blood sugar levels.',
    },
    { personnelInfo: 'Known Allergies', data: 'Penicillin, Peanuts' },
    {
      personnelInfo: 'Miscellaneous',
      data: 'Patient follows a low-carb diet and exercises regularly.',
    },
  ];

  const familyHistoryHeading = ['Family History', 'Data'];
  const familyHistoryData = [
    { familyHistory: 'HyperTension', data: 'Father diagnosed at age 50' },
    { familyHistory: 'DIABETES MELLITUS', data: 'Mother diagnosed at age 45' },
    { familyHistory: 'ANY UNNATURAL DEATH', data: 'None' },
    { familyHistory: 'ANY OTHER SIGNIFICANT HISTORY', data: 'Grandfather had heart disease' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='historyData h-screen'>
    <Navbar />
    <h1 className='md:text-3xl text-2xl'>Patient Profile</h1>
    <div className='PersonelInfoTable'>
      <CustomTable headings={headingsPersonelInfo} rows={rowsPI} />
    </div>
    <div className='healthRecordTable'>
      <CustomTable headings={headingsHealthRecord} rows={rowsHR} />
    </div>
    <div className='healthRecordTable'>
      <CustomTable headings={personelMedHistoryHeading} rows={rowsPMH} />
    </div>
    <div className='healthRecordTable'>
      <CustomTable headings={familyHistoryHeading} rows={familyHistoryData} />
    </div>
    <center>
      <button
        className="h-9 w-1/4 md:w-1/12 text-lg font-medium text-amber-400 border-2 border-[#efb034] mx-auto mb-5 rounded hover:bg-amber-400 hover:text-white hover:border-[#efb034]"
        onClick={handlePrint}
        style={{ fontFamily: 'Manrope', fontOpticalSizing: 'auto' }}
      >
        Print
      </button>
    </center>
  </div>
  );
}

export default MedicalRecord;

