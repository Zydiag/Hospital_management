import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import RowPatient from '../../components/RowPatient';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function PatientTestRecodsPage() {

    const testRecord = [
        { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2024-05-12', test: 'AME' },
        { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2024-05-12', test: 'AME1' },
        { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2024-05-12', test: 'PME' },
        { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-08-21', test: 'AME' },
        { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-07-21', test: 'AME1' },
        { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-07-28', test: 'PME' },
        
      ];

    const [selectedDate, setSelectedDate] = useState(null);
   
    const patientSearchRef = useRef(null);
    const [filteredRecords, setFilteredRecords] = useState([]);
  
  
    const handleDateChange = date => {
        setSelectedDate(date);
        const formattedDate = date.format('YYYY-MM-DD');
        const foundRecords = testRecord.filter(patient => patient.date === formattedDate);
        setFilteredRecords(foundRecords);
      };
  

    useEffect(() => {
        if (filteredRecords.length > 0 && patientSearchRef.current) {
          patientSearchRef.current.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            patientSearchRef.current.classList.add('show');
          }, 200);
        }
      }, [filteredRecords]);
    
      const getHref = test => {
        switch(test) {
          case 'AME':
            return '/patient/ame';
          case 'PME':
            return '/patient/pme';
          case 'AME1':
            return '/patient/ame1';
          default:
            return '#';
        }
      };
  return (
    <div>
        <Navbar />
        <div className="patientCalendar md:mt-12 bg-gray-300">
        <p className='pt-20 text-center pb-7 md:text-2xl text-xl text-zinc-900 font-semibold'>Select the specific date for the test record.</p>
        <div className="md:w-7/12 w-2/5 mx-auto text-center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Choose the date'
              value={selectedDate}
              onChange={handleDateChange}
              sx={{
                '& .MuiTypography-root': { fontSize: '1rem' },
                '& .Mui-selected': { backgroundColor: '#E99A01 !important', color: '#fff !important' },
              }}
            />
          </LocalizationProvider>
        </div>
        {filteredRecords.length > 0 ? (
          <div className="searchRow mt-12" id='patientSearch' ref={patientSearchRef}>
            <p className='md:text-left md:pt-10 pt-44 text-center pb-7 md:text-2xl text-xl font-semibold para' style={{ color: 'Black', fontFamily: 'Manrope', paddingTop: '6vh', paddingBottom: '6vh' }}>Search Result by Date</p>
            {filteredRecords.map(record => (
              <RowPatient
                key={record.armyNumber + record.test}
                armyNumber={record.armyNumber}
                date={record.date}
                patientName={record.patientName}
                test={record.test}
                button1='View test record'
                href={getHref(record.test)}
              />
            ))}
          </div>
        ) : (
          selectedDate && (
            <p className='errorDate md:text-lg text-base md:w-full w-3/4 md:mx-0 mx-auto md:text-left text-center'>No data found for the selected date.</p>
          )
        )}
      </div>
    </div>
 
  )
}

export default PatientTestRecodsPage