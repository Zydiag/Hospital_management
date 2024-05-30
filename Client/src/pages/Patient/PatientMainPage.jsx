import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import man from '../../assets/Person with a cold-pana.svg';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RowPatient from '../../components/RowPatient';
import { Button } from '@mui/material';

function PatientMainPage () {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedRowDate, setSelectedRowDate] = useState(null);
  const patientSearchRef = useRef(null);

  const medicalRecord = [
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan', date: '2023-05-30' },
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan', date: '2024-01-30' },
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan', date: '2023-08-30' },
  ];

  const handleDateChange = date => {
    setSelectedDate(date);
    const formattedDate = date.format('YYYY-MM-DD');
    const foundData = medicalRecord.find(patient => patient.date === formattedDate);
    setSelectedRowDate(foundData || null);
  };

  useEffect(() => {
    if (selectedRowDate && patientSearchRef.current) {
      patientSearchRef.current.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        patientSearchRef.current.classList.add('show');
      }, 200);
    }
  }, [selectedRowDate]);

  return (
    <div>
      <Navbar />
      <div
        className='historyIntro h-full flex md:flex-row w-full justify-center bg-neutral-200 flex-col md:pt-0 pt-20'
        style={{
          marginTop: '10vh',
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
            Patients Medical Records
          </h1>
          <p
            className='text-lg font-medium md:ml-12 md:text-left text-center w-3/4 mx-auto'
            style={{
              paddingTop: '3vh',
              paddingBottom: '10vh',
              fontFamily: 'Manrope',
            }}
          >
            Patient can view their previous and current medical records and test records.
          </p>
          <div className='dataButton md:w-full md:ml-12 h-12 w-3/4 mx-auto md:text-left text-center'>
            <Button
              className='add lg:h-11 lg:w-4/12 lg:text-lg text-6xl w-fit h-3/4'
              variant='contained'
              href='/patient/test'
            >
              View Test Record
            </Button>
            
          </div>
        </div>

        <img src={man} alt='man' className='w-2/5 mx-auto md:ml-0 md:mr-0 md:mb-0 mb-12'></img>
      </div>

      <div className='patientCalendar'>
        <p className='md:text-left md:pt-10 pt-44 text-center pb-7  md:text-2xl text-xl text-zinc-500'>
          Select the specific date for the medical record.
        </p>
        <div className="md:w-7/12 w-2/5 md:mx-0 mx-auto">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Choose the date'
              value={selectedDate}
              onChange={handleDateChange}
              
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

        {selectedRowDate ? (
          <div className='searchRow' id='patientSearch' ref={patientSearchRef}>
            <p
              className='text-left text-2xl font-semibold w-full para'
              style={{
                color: 'Black',
                fontFamily: 'Manrope',
                paddingTop: '6vh',
                paddingBottom: '6vh',
              
              }}
            >
              Search Result by Date
            </p>
            <RowPatient
              key={selectedRowDate.armyNumber}
              armyNumber={selectedRowDate.armyNumber}
              date={selectedRowDate.date}
              patientName={selectedRowDate.patientName}
              button1='View Patient History'
              href='/patient/medical-record'
            />
          </div>
        ) : (
          selectedDate && (
            <p className='errorDate md:text-lg text-base md:w-full w-3/4 md:mx-0 mx-auto md:text-left text-center'>Not found data on the selected date.</p>
          )
        )}
      </div>
      </div>
  );
}

export default PatientMainPage;
