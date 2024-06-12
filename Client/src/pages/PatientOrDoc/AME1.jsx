import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import '../../styles/StylesP/Ame.css';
import { usePatientStore } from '../../stores/patientStore';
import useAuth from '../../stores/authStore';

function AME1() {
  const { patient, testDate } = usePatientStore();

  const [ame1Data, setAME1Data] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const API = `${import.meta.env.VITE_SERVER}/api/user`;
  const { makeAuthRequest } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const armyNo = patient?.armyNo; // Replace with the actual army number
        const ame1Response = await makeAuthRequest('POST', `${API}/ame1testreports`, {
          armyNo,
          date: testDate, // Utilize medicalDate
        });
        setAME1Data(ame1Response?.data);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
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
    <div className="ameInfo">
      <h1 className="md:text-3xl text-2xl">AME1</h1>
      <div className="ameTable">
        <CustomTable headings={ame1Heading} rows={Object.entries(ame1Data)} />
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

export default AME1;
