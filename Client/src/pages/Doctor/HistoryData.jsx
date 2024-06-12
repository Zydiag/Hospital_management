import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import { rows } from '../../constants';
import useAuth from '../../stores/authStore';
import { usePatientStore } from '../../stores/patientStore';
import { getPersonalInfoApi } from '../../api/doctor.api';

const HistoryData = () => {
  const [personnelInfo, setPersonnelInfo] = useState({});
  const [healthRecord, setHealthRecord] = useState({});
  const [treatmentRecord, setTreatmentRecord] = useState({});
  const [familyHistory, setFamilyHistory] = useState({});

  const { makeAuthRequest } = useAuth();
  const { patient, medicalDate } = usePatientStore();
  const [isLoading, setIsLoading] = useState(false);

  const API = `${import.meta.env.VITE_SERVER}/api/user`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const armyNo = patient?.armyNo; // Replace with the actual army number
        const personalInfoResponse = await getPersonalInfoApi(makeAuthRequest, armyNo);
        const healthRecordResponse = await makeAuthRequest('POST', `${API}/health-record`, {
          armyNo,
          date: medicalDate, // Utilize medicalDate
        });
        const treatmentRecordResponse = await makeAuthRequest('POST', `${API}/treatment-record`, {
          armyNo,
          date: medicalDate, // Utilize medicalDate
        });
        const familyHistoryResponse = await makeAuthRequest('POST', `${API}/family-history`, {
          armyNo,
        });

        const dobDate = new Date(personalInfoResponse.dob);

        // Format the date as DD-MM-YYYY
        const day = dobDate.getDate().toString().padStart(2, '0');
        const month = (dobDate.getMonth() + 1).toString().padStart(2, '0');
        const year = dobDate.getFullYear();

        const formattedDOB = `${day}-${month}-${year}`;

        const updatedPersonalInfoResponse = {
          ...personalInfoResponse,
          dob: formattedDOB,
        };

        const formattedTreatmentRecordResponse = {
          'Present Complaints': treatmentRecordResponse?.data?.info?.medicationName,
          'Experiments and Tests': treatmentRecordResponse?.data?.info?.note,
          Diagnosis: treatmentRecordResponse?.data?.info?.diagnosis,
          'Known Allergies': treatmentRecordResponse?.data?.info?.knownAllergies,
          'Treatment Advice': treatmentRecordResponse?.data?.info?.miscellaneous,
          // createdAt: new Date(treatmentRecordResponse?.data?.createdAt).toISOString().split('T')[0], // Format to YYYY-MM-DD
        };
        const formattedHealthRecord = {
          ...healthRecordResponse.data,
          createdAt: new Date(healthRecordResponse?.data?.createdAt).toISOString().split('T')[0], // Format to YYYY-MM-DD
          doctorName: healthRecordResponse?.data?.doctor?.user?.fullname, // Extract the doctor's full name
        };

        const formattedFamilyHistory = {
          ...familyHistoryResponse.data,
          createdAt: new Date(familyHistoryResponse?.data?.createdAt).toISOString().split('T')[0], // Format to YYYY-MM-DD
        };
        const { doctor, ...healthRecordWithoutDoctor } = formattedHealthRecord;

        setPersonnelInfo(updatedPersonalInfoResponse);
        setHealthRecord(healthRecordWithoutDoctor);
        setTreatmentRecord(formattedTreatmentRecordResponse);
        setFamilyHistory(formattedFamilyHistory);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [medicalDate]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {isLoading ? (
        <div className="h-screen flex justify-center items-center"> loading....</div>
      ) : (
        <div className="historyData h-screen">
          <Navbar />
          <h1 className="md:text-3xl text-2xl">Patient Profile</h1>
          <div className="PersonelInfoTable">
            <CustomTable
              headings={['Personnel Info', 'Data']}
              rows={Object.entries(personnelInfo)}
            />
          </div>
          <div className="healthRecordTable">
            <CustomTable headings={['Health Record', 'Data']} rows={Object.entries(healthRecord)} />
          </div>
          <div className="healthRecordTable">
            <CustomTable
              headings={['Treatment Record', 'Data']}
              rows={Object.entries(treatmentRecord)}
            />
          </div>
          <div className="healthRecordTable">
            <CustomTable
              headings={['Family History', 'Data']}
              rows={Object.entries(familyHistory)}
            />
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
      )}
    </>
  );
};

export default HistoryData;
// const HistoryData = () => {
//   const headingsPersonelInfo = ['Personnel Info', 'Data'];
//
//   const rowsPI = [
//     { personnelInfo: 'ARMY NUMBER', data: 'MPQ134' },
//     {
//       personnelInfo: 'NAME',
//       data: 'In this example, each row object contains two key-value pairs. The CustomTable component maps through these objects, ensuring the first value goes to the first column and the second value goes to the second column. This setup maintains flexibility while ensuring a consistent two-column structure.',
//     },
//     { personnelInfo: 'AGE/SERVICE', data: 'Null' },
//     { personnelInfo: 'UNITS/ARMS/SERVICE', data: 'M89' },
//   ];
//
//   const headingsHealthRecord = ['Health Record', 'Data'];
//   const rowsHR = [
//     { healthRecord: 'Height', data: '180 cm' },
//     { healthRecord: 'Weight', data: '75 kg' },
//     { healthRecord: 'BMI', data: '23.1' },
//     { healthRecord: 'Chest', data: '98 cm' },
//     { healthRecord: 'Waist', data: '85 cm' },
//     { healthRecord: 'Blood Pressure', data: '120/80 mmHg' },
//   ];
//
//   const personelMedHistoryHeading = ['Personel Medical History', 'Data'];
//   const rowsPMH = [
//     { personnelInfo: 'Personnel Medications', data: 'Aspirin, Lisinopril, Metformin' },
//     { personnelInfo: 'Diagnosis', data: 'Hypertension, Type 2 Diabetes' },
//     {
//       personnelInfo: 'Description',
//       data: 'Patient exhibits high blood pressure and elevated blood sugar levels.',
//     },
//     { personnelInfo: 'Known Allergies', data: 'Penicillin, Peanuts' },
//     {
//       personnelInfo: 'Miscellaneous',
//       data: 'Patient follows a low-carb diet and exercises regularly.',
//     },
//   ];
//
//   const familyHistoryHeading = ['Family History', 'Data'];
//   const familyHistoryData = [
//     { familyHistory: 'HyperTension', data: 'Father diagnosed at age 50' },
//     { familyHistory: 'DIABETES MELLITUS', data: 'Mother diagnosed at age 45' },
//     { familyHistory: 'ANY UNNATURAL DEATH', data: 'None' },
//     { familyHistory: 'ANY OTHER SIGNIFICANT HISTORY', data: 'Grandfather had heart disease' },
//   ];
//
//   const handlePrint = () => {
//     window.print();
//   };
//
//   return (
//     <div className='historyData h-screen'>
//       <Navbar />
//       <h1 className='md:text-3xl text-2xl'>Patient Profile</h1>
//       <div className='PersonelInfoTable'>
//         <CustomTable headings={headingsPersonelInfo} rows={rowsPI} />
//       </div>
//       <div className='healthRecordTable'>
//         <CustomTable headings={headingsHealthRecord} rows={rowsHR} />
//       </div>
//       <div className='healthRecordTable'>
//         <CustomTable headings={personelMedHistoryHeading} rows={rowsPMH} />
//       </div>
//       <div className='healthRecordTable'>
//         <CustomTable headings={familyHistoryHeading} rows={familyHistoryData} />
//       </div>
//       <center>
//         <button
//           className="h-9 w-1/4 md:w-1/12 text-lg font-medium text-amber-400 border-2 border-[#efb034] mx-auto mb-5 rounded hover:bg-amber-400 hover:text-white hover:border-[#efb034]"
//           onClick={handlePrint}
//           style={{ fontFamily: 'Manrope', fontOpticalSizing: 'auto' }}
//         >
//           Print
//         </button>
//       </center>
//     </div>
//   );
// };
//
// export default HistoryData;
