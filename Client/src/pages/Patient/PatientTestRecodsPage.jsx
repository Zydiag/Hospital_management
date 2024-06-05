import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import RowPatient from '../../components/RowPatient';
import Button from '@mui/material/Button';
import '../../styles/StylesP/PatientMedicalHistory.css';
import man from '../../assets/Person with a cold-pana.svg';
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

      const [selectedStartDate, setSelectedStartDate] = useState(null);
      const [selectedEndDate, setSelectedEndDate] = useState(null);
      const [filteredData, setFilteredData] = useState([]);
      const patientSearchRef = useRef(null);
    
      useEffect(() => {
        if (selectedStartDate && selectedEndDate) {
          const start = dayjs(selectedStartDate);
          const end = dayjs(selectedEndDate);
          const filtered = patientDataByDate.filter(patient => {
            const date = dayjs(patient.date);
            return date.isAfter(start.subtract(1, 'day')) && date.isBefore(end.add(1, 'day'));
          });
          setFilteredData(filtered);
    
          if (filtered.length > 0 && patientSearchRef.current) {
            patientSearchRef.current.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              patientSearchRef.current.classList.add('show');
            }, 200);
          }
        } else {
          setFilteredData([]);
        }
      }, [selectedStartDate, selectedEndDate]);
    
      const getHref = test => {
        switch (test) {
          case 'AME':
            return '/doctor/ame-data';
          case 'PME':
            return '/doctor/pme-data';
          case 'AME1':
            return '/doctor/ame1-data';
          default:
            return '#';
        }
      };
  return (
    <div>
        <Navbar />
        <div className='historyIntro h-full flex md:flex-row w-full justify-center bg-neutral-200 flex-col md:pt-0 pt-20' style={{ marginBottom: '10vh', height: '65vh' }}>
        <div className='flex flex-col md:gap-0 m-0 md:p-0 md:ml-12 pt-12 my-auto'>
          <h1 className='text-3xl font-semibold md:text-left w-full text-center m-0 p-0' style={{ paddingTop: '13vh', fontFamily: 'Manrope' }}>Patients Test Record</h1>
          <p className='text-lg font-medium md:text-left text-center w-3/4 md:w-full mx-auto md:mx-0' style={{ paddingTop: '3vh', paddingBottom: '10vh', fontFamily: 'Manrope' }}>Select the range of dates to view the specfic test record.</p>

        </div>
        <img src={man} alt='man' className='w-2/5 mx-auto md:ml-0 md:mr-0 md:mb-0 mb-12' />
      </div>
      <div className='patientCalendar'>
        <p className='md:text-left md:pt-10 pt-44 text-center pb-7 md:text-2xl text-xl text-zinc-500'>
          Select the specific date to view test record.
        </p>
        <div className='flex flex-rows justify-start gap-6 md:w-7/12 w-11/12 md:mx-0 mx-auto'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Choose the start date'
              value={selectedStartDate}
              onChange={date => setSelectedStartDate(date)}
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
              onChange={date => setSelectedEndDate(date)}
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
              Search Results by Date
            </p>
            {filteredData.map(data => (
              <RowPatient
                key={data.armyNumber + data.date}
                armyNumber={data.armyNumber}
                date={data.date}
                patientName={data.patientName}
                test={data.test}
                button1='View Patient History'
                href={getHref(data.test)}
              />
            ))}
          </div>
        ) : (
          selectedStartDate &&
          selectedEndDate && (
            <p className='errorDate md:text-lg text-base md:w-full w-3/4 md:mx-0 mx-auto md:text-left text-center'>
              No data found for the selected date range.
            </p>
          )
        )}
      </div>
    </div>
 
  )
}

export default PatientTestRecodsPage