import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import RowPatient from '../../components/RowPatient';
import Button from '@mui/material/Button';
import '../../styles/StylesP/PatientMedicalHistory.css';
import man from '../../assets/Person with a cold-pana.svg';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';



function PatientMedicalHistory () {
  const patientDataByDate = [
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-05-12' },
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-06-14' },
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-07-16' },
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-07-21' },
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-08-22' },
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-09-23' },
  ];

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const patientSearchRef = useRef(null);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const start = dayjs(selectedStartDate);
      const end = dayjs(selectedEndDate);
      const filtered = patientDataByDate.filter((patient) => {
        const date = dayjs(patient.date);
        return date.isAfter(start.subtract(1, 'day')) && date.isBefore(end.add(1, 'day'));
      });
      setFilteredData(filtered);

      if (filtered.length > 0) {
        if (patientSearchRef.current) {
          patientSearchRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setFilteredData([]);
    }
  }, [selectedStartDate, selectedEndDate, patientDataByDate]);
  

  return (
    <>
      <Navbar />

      <div
        className='historyIntro h-full flex md:flex-row w-full justify-center bg-neutral-200 flex-col md:pt-0 pt-20'
        style={{
          marginBottom: '10vh',
          height: '65vh',
        }}
      >
        <div className='flex flex-col md:gap-0 m-0 md:p-0 md:ml-12 pt-12'>
          <h1
            className='text-3xl font-semibold md:ml-12 md:text-left w-full text-center m-0 p-0'
            style={{
              paddingTop: '13vh',
              fontFamily: 'Manrope',
            }}
          >
            Patients Medical History
          </h1>
          <p
            className='text-lg font-medium md:ml-12 md:text-left text-center w-3/4 mx-auto'
            style={{
              paddingTop: '3vh',
              paddingBottom: '10vh',
              fontFamily: 'Manrope',
            }}
          >
            Create new patient data enteries and view AME/PME status of the patient.
          </p>
          <div className='dataButton md:w-full md:ml-12 h-12 w-3/4 mx-auto md:text-left text-center'>
            <Button
              className='add lg:h-11 lg:w-4/12 lg:text-lg text-6xl w-fit h-3/4'
              variant='contained'
              href='/doctor/create-medical-data'
            >
              Add patient Data
            </Button>
            <Button
              className='test lg:h-11 lg:w-4/12 lg:text-lg text-6xl w-fit h-3/4 '
              variant='outlined'
              href='/doctor/test-record'
            >
              View Record Test
            </Button>
          </div>
        </div>

        <img src={man} alt='man' className='w-2/5 mx-auto md:ml-0 md:mr-0 md:mb-0 mb-12'></img>
      </div>

      <div className='patientCalendar'>
        <p className='md:text-left md:pt-10 pt-44 text-center pb-7  md:text-2xl text-xl text-zinc-500'>
          Select the specific date for the patient medical record.
        </p>
        <div className='flex flex-rows justify-start gap-6 md:w-7/12 w-2/5 md:mx-0 mx-auto'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Choose the start date'
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
              label='Choose the end date'
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

        {filteredData.length > 0 ? (
          <div className='searchRow' id='patientSearch'>
            <p
              className='text-left text-2xl font-semibold w-full para'
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
                date={data.date}
                patientName={data.patientName}
                button1='View Patient History'
                href='/history-data'
              />
            ))}
          </div>
        ) : (
          selectedStartDate && selectedEndDate && (
            <p className='errorDate md:text-lg text-base md:w-full w-3/4 md:mx-0 mx-auto md:text-left text-center'>
              No data found for the selected date range.
            </p>
          )
        )}
      </div>
    </>
  );
}

export default PatientMedicalHistory;
