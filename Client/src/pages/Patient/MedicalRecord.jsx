import React, { useEffect, useState } from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';
import Navbar from '../../components/Navbar';
import { rows } from '../../constants';
import useAuth from '../../stores/authStore';
import { usePatientStore } from '../../stores/patientStore';
import { getPersonalInfoApi } from '../../api/doctor.api';

function MedicalRecord() {
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
        const formattedHealthRecord = {
          ...healthRecordResponse.data,
          createdAt: new Date(healthRecordResponse?.data?.createdAt).toISOString().split('T')[0], // Format to YYYY-MM-DD
          doctorName: healthRecordResponse?.data?.doctor?.user?.fullname, // Extract the doctor's full name
        };

        const formattedTreatmentRecordResponse = {
          'Present Complaints': treatmentRecordResponse?.data?.info?.medicationName,
          'Experiments and Tests': treatmentRecordResponse?.data?.info?.note,
          Diagnosis: treatmentRecordResponse?.data?.info?.diagnosis,
          'Known Allergies': treatmentRecordResponse?.data?.info?.knownAllergies,
          'Treatment Advice': treatmentRecordResponse?.data?.info?.miscellaneous,
          // createdAt: new Date(treatmentRecordResponse?.data?.createdAt).toISOString().split('T')[0], // Format to YYYY-MM-DD
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
}

export default MedicalRecord;
