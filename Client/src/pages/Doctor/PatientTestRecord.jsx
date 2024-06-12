import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import RowPatient from '../../components/RowPatient';
import Button from '@mui/material/Button';
import '../../styles/StylesP/PatientMedicalHistory.css';
import man from '../../assets/Person with a cold-pana.svg';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  getCombinedDates,
  getUpdateAME1DatesApi,
  getUpdateAMEDatesApi,
  getUpdatePMEDatesApi,
} from '../../api/doctor.api';
import useAuth from '../../stores/authStore';
import { usePatientStore } from '../../stores/patientStore';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Calculate the fraction of the current year that has elapsed
  const fractionOfYear = (monthDiff * 30 + dayDiff) / 365;

  // Calculate age as a float value
  age += fractionOfYear;

  return age;
};

export const getTestType = (age) => {
  if (
    (age >= 25 && age <= 26) ||
    (age >= 30 && age <= 31) ||
    (age >= 37 && age <= 38) ||
    (age >= 42 && age <= 43) ||
    (age >= 47 && age <= 48) ||
    (age >= 49 && age <= 50) ||
    (age > 51 && age <= 53) ||
    (age > 54 && age <= 57) ||
    (age > 58 && age <= 59)
  ) {
    return 'AME1';
  } else if (
    (age >= 35 && age <= 36) ||
    (age >= 40 && age <= 41) ||
    (age >= 45 && age <= 46) ||
    (age > 50 && age <= 51) ||
    (age > 53 && age <= 54) ||
    (age > 57 && age <= 58)
  ) {
    return 'PME';
  } else {
    return 'AME';
  }
};

function PatientTestRecordsPage() {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const patientSearchRef = useRef(null);

  const { makeAuthRequest } = useAuth();
  const { patient, setTestDate } = usePatientStore();
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (start, end) => {
      setLoading(true);
      try {
        const age = calculateAge(patient.dob);
        const testType = getTestType(age);

        const someData = await getCombinedDates(makeAuthRequest, patient.armyNo, start, end);

        const updatedPatientData = someData?.map((obj) => ({
          armyNumber: patient.armyNo,
          patientName: patient.fullname,
          date: new Date(obj.date),
          test: obj.test,
        }));
        // let res;
        // switch (testType) {
        //   case 'AME1':
        //     res = await getUpdateAME1DatesApi(makeAuthRequest, patient.armyNo, start, end);
        //     break;
        //   case 'PME':
        //     res = await getUpdatePMEDatesApi(makeAuthRequest, patient.armyNo, start, end);
        //     break;
        //   case 'AME':
        //     res = await getUpdateAMEDatesApi(makeAuthRequest, patient.armyNo, start, end);
        //     break;
        //   default:
        //     throw new Error('test type not defined', testType);
        //     break;
        // }
        //
        // const updatedPatientData = res?.map((date) => ({
        //   armyNumber: patient.armyNo,
        //   patientName: patient.fullname,
        //   date: new Date(date),
        //   test: testType,
        // }));

        setFilteredData(updatedPatientData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    },
    [makeAuthRequest, patient.armyNo, patient.dob, patient.fullname]
  );

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const start = dayjs(selectedStartDate).startOf('day').utc().format();
      const end = dayjs(selectedEndDate).endOf('day').utc().format();
      fetchData(start, end);
    } else {
      setFilteredData([]);
    }
  }, [selectedStartDate, selectedEndDate, fetchData]);

  useEffect(() => {
    if (filteredData.length > 0 && patientSearchRef.current) {
      patientSearchRef.current.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        patientSearchRef.current.classList.add('show');
      }, 200);
    }
  }, [filteredData]);

  const getHref = (test) => {
    switch (test) {
      case 'AME':
        return '/common/ame';
      case 'PME':
        return '/common/pme';
      case 'AME1':
        return '/common/ame1';
      default:
        return '#';
    }
  };

  return (
    <div>
      <Navbar />
      <div
        className="historyIntro h-full flex md:flex-row w-full justify-center bg-neutral-200 flex-col md:pt-0 pt-20"
        style={{ marginBottom: '10vh', height: '65vh' }}
      >
        <div className="flex flex-col md:gap-0 m-0 md:p-0 md:ml-12 pt-12">
          <h1
            className="text-3xl font-semibold md:ml-12 md:text-left w-full text-center m-0 p-0"
            style={{ paddingTop: '13vh', fontFamily: 'Manrope' }}
          >
            Patients Test Record
          </h1>
          <p
            className="text-lg font-medium md:ml-12 md:text-left text-center w-3/4 mx-auto"
            style={{ paddingTop: '3vh', paddingBottom: '10vh', fontFamily: 'Manrope' }}
          >
            Create new test records based on the test required.
          </p>
          <div className="dataButton md:w-full md:ml-12 h-12 w-3/4 mx-auto md:text-left text-center">
            <Button
              className="add lg:h-11 lg:w-1/2 lg:text-lg text-6xl w-fit h-3/4"
              onClick={() => navigate('/doctor/create-test-data')}
              variant="contained"
              // href="/doctor/create-test-data"
            >
              Add test record
            </Button>
          </div>
        </div>
        <img src={man} alt="man" className="w-2/5 mx-auto md:ml-0 md:mr-0 md:mb-0 mb-12" />
      </div>
      <div className="patientCalendar">
        <p className="md:text-left md:pt-10 pt-44 text-center pb-7 md:text-2xl text-xl text-zinc-500">
          Select the specific date to view test record.
        </p>
        <div className="flex flex-rows justify-start gap-6 md:w-7/12 w-11/12 md:mx-0 mx-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Choose the start date"
              value={selectedStartDate}
              onChange={(date) => setSelectedStartDate(date)}
              sx={{
                '& .MuiTypography-root': {
                  fontSize: '1rem',
                },
                '& .Mui-selected': {
                  backgroundColor: '#E99A01 !important',
                  color: '#fff !important',
                },
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Choose the end date"
              value={selectedEndDate}
              onChange={(date) => setSelectedEndDate(date)}
              sx={{
                '& .MuiTypography-root': {
                  fontSize: '1rem',
                },
                '& .Mui-selected': {
                  backgroundColor: '#E99A01 !important',
                  color: '#fff !important',
                },
              }}
            />
          </LocalizationProvider>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : filteredData.length > 0 ? (
          <div className="searchRow" id="patientSearch" ref={patientSearchRef}>
            <p
              className="text-left text-2xl font-semibold w-full para"
              style={{
                color: 'Black',
                fontFamily: 'Manrope',
                paddingTop: '6vh',
                paddingBottom: '6vh',
              }}
            >
              Search Results by Date
            </p>
            {filteredData.map((data) => (
              <RowPatient
                key={data.armyNumber + data.date}
                armyNumber={data.armyNumber}
                date={new Date(data.date).toISOString().split('T')[0]}
                patientName={data.patientName}
                test={data.test}
                button1="View Patient History"
                handleClick={() => {
                  setTestDate(data.date);
                  navigate(getHref(data.test));
                }}
              />
            ))}
          </div>
        ) : (
          selectedStartDate &&
          selectedEndDate && (
            <p className="errorDate md:text-lg text-base md:w-full w-3/4 md:mx-0 mx-auto md:text-left text-center">
              No data found for the selected date range.
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default PatientTestRecordsPage;
