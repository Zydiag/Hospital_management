import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import RowPatient from '../../components/RowPatient';
import Button from '@mui/material/Button';
import '../../styles/StylesP/PatientMedicalHistory.css';
import man from '../../assets/Person with a cold-pana.svg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import styled from 'styled-components';

function PatientTestRecord () {
  const testRecord = [
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2024-05-12', test: 'AME' },
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2024-05-12', test: 'AME1' },
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2024-05-12', test: 'PME' },
    { armyNumber: 'ARMY002', patientName: 'Dr. Bob', date: '2023-07-21', test: 'AME' },
    { armyNumber: 'ARMY002', patientName: 'Dr. Bob', date: '2023-07-21', test: 'AME1' },
    { armyNumber: 'ARMY002', patientName: 'Dr. Bob', date: '2023-07-21', test: 'PME' },
    { armyNumber: 'ARMY003', patientName: 'Dr. Charlie', date: '2022-11-15', test: 'AME' },
    { armyNumber: 'ARMY003', patientName: 'Dr. Charlie', date: '2022-11-15', test: 'AME1' },
    { armyNumber: 'ARMY003', patientName: 'Dr. Charlie', date: '2022-11-15', test: 'PME' },
    { armyNumber: 'ARMY004', patientName: 'Dr. Diana', date: '2023-02-28', test: 'AME' },
    { armyNumber: 'ARMY004', patientName: 'Dr. Diana', date: '2023-02-28', test: 'AME1' },
    { armyNumber: 'ARMY004', patientName: 'Dr. Diana', date: '2023-02-28', test: 'PME' },
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan', date: '2023-01-30', test: 'AME' },
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan', date: '2023-01-30', test: 'AME1' },
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan', date: '2023-01-30', test: 'PME' },
  ];

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRowDate, setSelectedRowDate] = useState(null);
  const patientSearchRef = useRef(null);

  const handleDateChange = date => {
    setSelectedDate(date);
    const formattedDate = date.format('YYYY-MM-DD');
    const foundData = testRecord.find(patient => patient.date === formattedDate);
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

  const routes = [
    {
      buttonName: 'AME',
      href: '/ame-data',
    },
    {
      buttonName: 'PME',
      href: '/pme-data',
    },
    {
      buttonName: 'AME1',
      href: '/ame1-data',
    },
  ];

  const getHref = test => {
    if (test === 'AME') {
      return '/ame-data';
    } else if (test === 'PME') {
      return '/pme-data';
    } else if (test === 'AME1') {
      return '/ame1-data';
    }
    // Return default value or handle other tests
    return '#';
  };

  return (
    <div>
      <Navbar />
      <div className='patientInfo'>
        <div className='historyIntro'>
          <div>
            <h1>Patients Medical History</h1>
            <p>Create new patient data enteries and view AME/PME status of the patient.</p>
            <div className='dataButton'>
              <Button className='add' variant='contained' href='/create-test-data'>
                Add Record Test
              </Button>
            </div>
          </div>

          <img src={man} alt='man'></img>
        </div>
        <div className='patientCalendar'>
          <h1>Choose the date</h1>
          <p>Choose the date to get test record.</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
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
      </div>
      {selectedRowDate ? (
        <div className='searchRow' id='patientSearch' ref={patientSearchRef}>
          <p className='SearchPara'>Search Result by Date</p>
          {testRecord.map(
            (row, index) =>
              row.date === selectedDate.format('YYYY-MM-DD') && (
                <RowPatient
                  key={index}
                  armyNumber={row.armyNumber}
                  date={row.date}
                  patientName={row.patientName}
                  test={row.test}
                  button1='View Test Record'
                  href={getHref(row.test)}
                />
              )
          )}
        </div>
      ) : (
        selectedDate && <p className='errorDate'>Not found any data on the selected date.</p>
      )}
    </div>
  );
}

export default PatientTestRecord;
