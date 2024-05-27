import React ,{useState, useEffect, useRef} from 'react';
import Navbar from '../../components/Navbar';
import RowPatient from '../../components/RowPatient';
import Button from '@mui/material/Button';
import '../../styles/StylesP/PatientMedicalHistory.css';
import man from '../../assets/Person with a cold-pana.svg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';


function PatientMedicalHistory () {
  const patientDataByDate = [
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-05-12' },
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-06-14' },
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice', date: '2023-07-16' },
    { armyNumber: 'ARMY002', patientName: 'Dr. Bob', date: '2023-07-21' },
    { armyNumber: 'ARMY002', patientName: 'Dr. Bob', date: '2023-08-22' },
    { armyNumber: 'ARMY002', patientName: 'Dr. Bob', date: '2023-09-23' },
    { armyNumber: 'ARMY003', patientName: 'Dr. Charlie', date: '2022-11-15' },
    { armyNumber: 'ARMY003', patientName: 'Dr. Charlie', date: '2022-12-16' },
    { armyNumber: 'ARMY003', patientName: 'Dr. Charlie', date: '2023-01-17' },
    { armyNumber: 'ARMY004', patientName: 'Dr. Diana', date: '2023-02-28' },
    { armyNumber: 'ARMY004', patientName: 'Dr. Diana', date: '2023-03-29' },
    { armyNumber: 'ARMY004', patientName: 'Dr. Diana', date: '2023-04-30' },
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan', date: '2023-01-30' },
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan', date: '2023-02-28' },
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan', date: '2023-03-30' },
  ];

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedRowDate, setSelectedRowDate] = useState(null);
    const patientSearchRef = useRef(null);
  


  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.format('YYYY-MM-DD');
    const foundData = patientDataByDate.find(patient => patient.date === formattedDate);
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
      <div className='patientInfo'>
        <div className='historyIntro'>
        <div>
        <h1>Patients Medical History</h1>
          <p>Create new patient data enteries and view AME/PME status of the patient.</p>
          <div className='dataButton'>
            <Button className="add" variant='contained'>Add patient Data</Button>
            <Button className="test" variant='outlined'>View Record Test</Button>
          </div>
        </div>
          
          <img src={man} alt='man'></img>
        </div>
        <div className='patientCalendar'>
         <h1>Choose the date</h1>
         <p>Choose the date to get history.</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar value={selectedDate} onChange={handleDateChange} 
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
          <RowPatient
            key={selectedRowDate.armyNumber}
            armyNumber={selectedRowDate.armyNumber}
            date={selectedRowDate.date}
            patientName={selectedRowDate.patientName}
            button1='View Patient History'
            // href='/patient-history'
          />
        </div>
      ) : (
        selectedDate && <p className='errorDate'>Not found data on the selected date.</p>
      )}
    </div>
  );
}

export default PatientMedicalHistory;
