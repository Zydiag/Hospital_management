import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import man from '../../assets/Person with a cold-pana.svg';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RowPatient from '../../components/RowPatient';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../stores/authStore';
import { usePatientStore } from '../../stores/patientStore';
import { getUpdateDatesApi } from '../../api/doctor.api';
import dayjs from 'dayjs';

function PatientMainPage() {
  const navigate = useNavigate();

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const patientSearchRef = useRef(null);

  const { makeAuthRequest, user } = useAuth();
  const { patient, setMedicalDate, setPatient } = usePatientStore();

  // if (user?.role === 'PATIENT') {
  //   setPatient(user);
  // }

  const fetchData = useCallback(
    async (start, end) => {
      setLoading(true);
      try {
        const res = await getUpdateDatesApi(makeAuthRequest, patient.armyNo, start, end);

        const updatedPatientData = res.map((date) => ({
          armyNumber: patient.armyNo,
          patientName: patient.fullname,
          date: date,
        }));

        setFilteredData(updatedPatientData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    },
    [makeAuthRequest, patient.armyNo, patient.fullname]
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

  return (
    <>
      <Navbar />

      <div
        className="historyIntro h-full flex md:flex-row w-full justify-center bg-neutral-200 flex-col md:pt-0 pt-20"
        style={{
          marginBottom: '10vh',
          height: '65vh',
        }}
      >
        <div className="flex flex-col md:gap-0 m-0 md:p-0 md:ml-12 pt-12">
          <h1
            className="text-3xl font-semibold md:ml-12 md:text-left w-full text-center m-0 p-0"
            style={{
              paddingTop: '13vh',
              fontFamily: 'Manrope',
            }}
          >
            Patients Medical History
          </h1>
          <p
            className="text-lg font-medium md:ml-12 md:text-left text-center w-3/4 mx-auto"
            style={{
              paddingTop: '3vh',
              paddingBottom: '10vh',
              fontFamily: 'Manrope',
            }}
          >
            Patient can view their previous and current medical records and test records.
          </p>
          <div className="dataButton md:w-full md:ml-12 h-12 w-3/4 mx-auto md:text-left text-center">
            <Button
              onClick={() => navigate('/patient/test')}
              className="add lg:h-11 lg:w-4/12 lg:text-lg text-6xl w-fit h-3/4 "
              variant="outlined"
              // href="/doctor/test-record"
            >
              View Record Test
            </Button>
          </div>
        </div>

        <img src={man} alt="man" className="w-2/5 mx-auto md:ml-0 md:mr-0 md:mb-0 mb-12"></img>
      </div>

      <div className="patientCalendar">
        <p className="md:text-left md:pt-10 pt-44 text-center pb-7  md:text-2xl text-xl text-zinc-500">
          Select the specific date for the patient medical record.
        </p>
        <div className="flex flex-rows justify-start gap-6 md:w-7/12 w-11/12 md:mx-0 mx-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Choose the start date"
              value={selectedStartDate}
              onChange={(date) => setSelectedStartDate(date)}
              sx={{
                '& .MuiTypography-root': {
                  fontSize: '1rem', // Adjust the font size as needed
                },
                '& .Mui-selected': {
                  backgroundColor: '#E99A01 !important',
                  color: '#fff !important', // Optionally change text color
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
                  fontSize: '1rem', // Adjust the font size as needed
                },
                '& .Mui-selected': {
                  backgroundColor: '#E99A01 !important',
                  color: '#fff !important', // Optionally change text color
                },
              }}
            />
          </LocalizationProvider>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-10">
            <div className="loader-spinner">loading....</div>
          </div>
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
                handleClick={() => {
                  setMedicalDate(data.date);
                  navigate('/doctor/medical-record');
                }}
                date={new Date(data.date).toISOString().split('T')[0]}
                patientName={data.patientName}
                button1="View Patient History"
                // href="/doctor/medical-record"
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
    </>
  );
}

export default PatientMainPage;
