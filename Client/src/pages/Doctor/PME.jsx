import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import '../../styles/StylesP/Ame.css';
import { usePatientStore } from '../../stores/patientStore';
import useAuth from '../../stores/authStore';

function PME() {
  const { patient, testDate } = usePatientStore();
  // console.log('armyno', patient.armyNo, 'testDate', testDate);

  const [pmeData, setPMEData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const API = 'http://localhost:3000/api/doctor';
  const { makeAuthRequest } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const armyNo = patient?.armyNo; // Replace with the actual army number
        const pmeResponse = await makeAuthRequest('POST', `${API}/pmetestreports`, {
          armyNo,
          date: testDate, // Utilize medicalDate
        });
        console.log('ame data', pmeResponse.data);
        setPMEData(pmeResponse?.data);

        console.log('ame response', pmeResponse);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const PMEHeading = ['PME', 'Data'];

  const PMERows = [
    { PMEInfo: 'BLOOD HB', data: '13.5 g/dL' },
    {
      PMEInfo: 'TLC',
      data: '6,000 cells/cu mm',
    },
    {
      PMEInfo: 'DLC',
      data: 'Neutrophils: 60%, Lymphocytes: 30%, Monocytes: 5%, Eosinophils: 3%, Basophils: 2%',
    },
    { PMEInfo: 'URINE', data: 'Normal' },
    { PMEInfo: 'URINE SP. GRAVITY', data: '1.020' },
    { PMEInfo: 'BLOOD SUGAR FASTING', data: '90 mg/dL' },
    { PMEInfo: 'BLOOD SUGAR PP', data: '120 mg/dL' },
    { PMEInfo: 'RESTING ECG', data: 'Normal sinus rhythm' },
    { PMEInfo: 'URIC ACID', data: '5.5 mg/dL' },
    { PMEInfo: 'UREA', data: '30 mg/dL' },
    { PMEInfo: 'CREATININE', data: '1.0 mg/dL' },
    { PMEInfo: 'CHOLESTEROL', data: '180 mg/dL' },
    {
      PMEInfo: 'LIPID PROFILE',
      data: 'Total Cholesterol: 180 mg/dL, HDL: 50 mg/dL, LDL: 100 mg/dL, Triglycerides: 150 mg/dL',
    },
    { PMEInfo: 'X-RAY CHEST PA', data: 'Normal' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ameInfo">
      <h1 className="md:text-3xl text-2xl">PME</h1>
      <div className="ameTable">
        <CustomTable headings={PMEHeading} rows={Object.entries(pmeData)} />
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

export default PME;
