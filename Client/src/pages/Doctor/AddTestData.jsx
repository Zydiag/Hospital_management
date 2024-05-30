import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import { Button } from '@mui/material';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import '../../styles/StylesP/AddTestData.css';

const drawerWidth = 350;

export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  const fractionOfYear = (monthDiff * 30 + dayDiff) / 365;
  age += fractionOfYear;

  return age;
};

export const getTestType = (age) => {
  if ((age > 25 && age <= 26) || (age > 30 && age <= 31) || (age > 37 && age <= 38) ||
      (age > 42 && age <= 43) || (age > 47 && age <= 48) || (age > 49 && age <= 50) ||
      (age > 51 && age <= 53) || (age > 54 && age <= 57) || (age > 58 && age <= 59)) {
    return 'AME2';
  } else if ((age > 35 && age <= 36) || (age > 40 && age <= 41) || (age > 45 && age <= 46) ||
             (age > 50 && age <= 51) || (age > 53 && age <= 54) || (age > 57 && age <= 58)) {
    return 'PME';
  } else {
    return 'AME1';
  }
};

function AddTestData() {
  const [date, setDate] = useState(dayjs());
  const [dob , setDOB] = useState(dayjs());
  const [selectedSection, setSelectedSection] = useState('Choose the Test');

  const sections = [
    'Choose the Test',
    'AME - Annual Medical Exam',
    'AME1 - Annual Medical Exam 1',
    'PME - Perodic medical Exam'
    
  ];

  const handleDateChange = (newDate) => {
    setDOB(newDate);
    const age = calculateAge(newDate);
    const testType = getTestType(age);
    let section;
    switch (testType) {
      case 'AME2':
        section = 'AME1 - Annual Medical Exam 1';
        break;
      case 'AME1':
        section = 'AME - Annual Medical Exam';
        break;
      case 'PME':
        section = 'PME - Perodic medical Exam';
        break;
      default:
        section = 'Choose the Test';
        break;
    }
    setSelectedSection(section);
  };

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position='fixed'
          sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        ></AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
            '& .MuiList-root': {
              marginTop: '12vh',
            },
          }}
          variant='permanent'
          anchor='left'
        >
          <Divider />
          <List
            sx={{
              '& .MuiButtonBase-root': {
                marginBottom: '5px',
              },
            }}
          >
            {sections.map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '1.1rem',
                    fontFamily: 'Manrope',
                    textAlign: 'center',
                  },
                }}
              >
                <ListItemButton onClick={() => setSelectedSection(text)}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          {selectedSection === 'Choose the Test' && (
            <div className='selectedTest'>
              <p>Choose the required test based on Date of Birth.</p>
              <div className='dob' style={{ marginBottom: '1vh', textAlign: 'right' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Date of Birth'
                    value={dob}
                   
                  />
                </LocalizationProvider>
                <Button className="dobButton" variant='contained' onClick={handleDateChange}>Add Test</Button>
              </div>
            </div>
          )}
          {selectedSection === 'AME - Annual Medical Exam' && (
            <div id='ameform' className='ameform'>
              <form className='pi'>
                <h1>Annual Medical Exam</h1>
                <div className='piFormGroup' style={{ marginBottom: '1vh', textAlign: 'right' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label='Date' value={date} onChange={(newDate) => setDate(newDate)} />
                  </LocalizationProvider>
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>Blood Hb</label>
                  <textarea className='piInput' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>TLC</label>
                  <textarea className='piInput' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>DLC</label>
                  <textarea className='piTextarea' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>UrineRe</label>
                  <textarea className='piTextarea' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>UrineSpGravity</label>
                  <textarea className='piTextarea' />
                </div>
                <div>
                  <Button className='editForm' variant='contained'>
                    Edit
                  </Button>
                  <Button className='saveForm' variant='outlined'>
                    Save
                  </Button>
                </div>
              </form>
            </div>
          )}

          {selectedSection === 'AME1 - Annual Medical Exam 1' && (
            <section id='ame1' className='ame1'>
              <form className='pi'>
                <h1>Annual Medical Exam 1</h1>
                <div className='piFormGroup' style={{ marginBottom: '1vh', textAlign: 'right' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label='Date' value={date} onChange={(newDate) => setDate(newDate)} />
                  </LocalizationProvider>
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>Blood Hb</label>
                  <textarea className='piInput' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>TLC</label>
                  <textarea className='piInput' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>DLC</label>
                  <textarea className='piTextarea' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>UrineRe</label>
                  <textarea className='piTextarea' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>UrineSpGravity</label>
                  <textarea className='piTextarea' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>BloodSugarFasting</label>
                  <textarea className='piTextarea' />
                </div>
                <div>
                  <Button className='editForm' variant='contained'>
                    Edit
                  </Button>
                  <Button className='saveForm' variant='outlined'>
                    Save
                  </Button>
                </div>
              </form>
            </section>
          )}

          {selectedSection === 'PME - Perodic medical Exam' && (
            <section id='pme' className='pme'>
              <form className='pi'>
                <h1>Periodic Medical Exam</h1>
                <div className='piFormGroup' style={{ marginBottom: '1vh', textAlign: 'right' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label='Date' value={date} onChange={(newDate) => setDate(newDate)} />
                  </LocalizationProvider>
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>Blood Hb</label>
                  <textarea className='piInput' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>TLC</label>
                  <textarea className='piInput' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>DLC</label>
                  <textarea className='piTextarea' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>UrineRe</label>
                  <textarea className='piTextarea' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>UrineSpGravity</label>
                  <textarea className='piTextarea' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>BloodSugarFasting</label>
                  <textarea className='piTextarea' />
                </div>
                <div className='piFormGroup'>
                  <label className='piLabel'>BloodSugarPostPrandial</label>
                  <textarea className='piTextarea' />
                </div>
                <div>
                  <Button className='editForm' variant='contained'>
                    Edit
                  </Button>
                  <Button className='saveForm' variant='outlined'>
                    Save
                  </Button>
                </div>
              </form>
            </section>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default AddTestData;