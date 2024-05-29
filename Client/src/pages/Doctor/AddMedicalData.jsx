import React, { useState, useEffect } from 'react';
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
import '../../styles/StylesP/AddMedicalData.css';
import dayjs from 'dayjs';

const drawerWidth = 350;

function AddMedicalData () {
  const [BMI, setBMI] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [date, setDate] = useState(dayjs());
  const [selectedSection, setSelectedSection] = useState('PERSONAL INFO');

  const handleChangeHeight = event => {
    const value = event.target.value;
    setHeight(value);
  };

  const handleChangeWeight = event => {
    const value = event.target.value;
    setWeight(value);
  };

  const BMIcal = () => {
    const heightInMeters = height / 100; // Convert height to meters
    const bmi = weight / (heightInMeters * heightInMeters); // Calculate BMI
    setBMI(bmi.toFixed(2)); // Set BMI state with 2 decimal places
  };

  const sections = ['PERSONAL INFO', 'HEALTH RECORD', 'PERSONAL MEDICAL HISTORY', 'FAMILY HISTORY'];

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
            '& .MuiList-root' :{
                marginTop:'12vh'
            }
          }}
          variant='permanent'
          anchor='left'
        >
          <Divider />
          <List sx={{
             '& .MuiButtonBase-root' :{
                marginBottom:'5px',
                
             },

          }}>
            {sections.map((text, index) => (
              <ListItem key={text} disablePadding sx={{
                '& .MuiTypography-root':{
                    fontSize: '1.1rem',
                    fontFamily: 'Manrope'
                }
              }}>
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
        {selectedSection === 'PERSONAL INFO' && (
          <div id='personal-info' className='personelInfo'>
            <form className='pi'>
              <h1>PERSONAL INFO</h1>
              <div className='piFormGroup' style={{ marginBottom: '1vh', textAlign: 'right' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label='Date' value={date} onChange={setDate} />
                </LocalizationProvider>
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>Name of the Doctor</label>
                <input className='piInput' placeholder='Name..' />
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>ARMY NUMBER</label>
                <input className='piInput' placeholder='Army Number..' />
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>Age/Service</label>
                <textarea className='piTextarea' placeholder='Service..' />
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>Units/Service/Arms</label>
                <textarea className='piTextarea' placeholder='Units..' />
              </div>
              <div >
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

        {selectedSection === 'HEALTH RECORD' && (
          <section id='health-record' className='healthRecord'>
            <form className='pi'>
              <h1>HEALTH RECORD</h1>
              <div className='piFormGroup'>
                <label className='piLabel'>Height</label>
                <div className='piInputContainer'>
                  <input
                    className='piInput'
                    placeholder='Height..'
                    value={height}
                    onChange={handleChangeHeight}
                  />
                  <span className='piUnit'>cm</span>
                </div>
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>Weight</label>
                <div className='piInputContainer'>
                  <input
                    className='piInput'
                    placeholder='Weight..'
                    value={weight}
                    onChange={handleChangeWeight}
                  />
                  <span className='piUnit'>kg</span>
                </div>
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>BMI</label>
                <div className='piInputContainer'>
                  <input className='bmiInput' value={BMI} />
                  <span className='bmiUnit'>kg/m</span>
                  <Button variant='contained' className='calc' onClick={BMIcal}>
                    Calculate
                  </Button>
                </div>
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>Chest</label>
                <input className='piInput' />
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>Waist</label>
                <input className='piInput' />
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>Blood Pressure</label>
                <input className='piInput' />
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

        {selectedSection == 'PERSONAL MEDICAL HISTORY' && (
          <section id='medical-history' className='medicalHistory'>
            <form className='pi'>
              <h1>Personel Medical History</h1>
              <div className='piFormGroup'>
                <label className='piLabel'>Present medications</label>

                <textarea
                  className='piTextarea'
                  placeholder='Present medications..'
                  onChange={handleChangeHeight}
                ></textarea>
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>Diagnosis</label>

                <textarea
                  className='piTextarea'
                  placeholder='Diagnosis..'
                  onChange={handleChangeHeight}
                ></textarea>
              </div>

              <div className='piFormGroup'>
                <label className='piLabel'>Description</label>

                <textarea
                  className='piTextarea'
                  placeholder='Description..'
                  onChange={handleChangeHeight}
                ></textarea>
              </div>

              <div className='piFormGroup'>
                <label className='piLabel'>Known Allergies</label>

                <textarea
                  className='piTextarea'
                  placeholder='Known Allergies..'
                  onChange={handleChangeHeight}
                ></textarea>
              </div>

              <div className='piFormGroup'>
                <label className='piLabel'>Miscellaneous</label>

                <textarea
                  className='piTextarea'
                  placeholder='Miscellaneous..'
                  onChange={handleChangeHeight}
                ></textarea>
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

        {selectedSection == 'FAMILY HISTORY' && (
          <section id='Family-history' className='familyHistory'>
            <form className='pi'>
              <h1>Family History</h1>
              <div className='piFormGroup'>
                <label className='piLabel'>Hypertension</label>

                <textarea
                  className='piTextarea'
                  placeholder='Hypertension cases..'
                  onChange={handleChangeHeight}
                ></textarea>
              </div>
              <div className='piFormGroup'>
                <label className='piLabel'>Diabetes Mellitus</label>

                <textarea
                  className='piTextarea'
                  placeholder='Diabetes Mellitus..'
                  onChange={handleChangeHeight}
                ></textarea>
              </div>

              <div className='piFormGroup'>
                <label className='piLabel'>Any Unnatural Death</label>

                <textarea
                  className='piTextarea'
                  placeholder='Description..'
                  onChange={handleChangeHeight}
                ></textarea>
              </div>

              <div className='piFormGroup'>
                <label className='piLabel'> Any Other Significant History</label>

                <textarea
                  className='piTextarea'
                  placeholder='  Any Other Significant History'
                  onChange={handleChangeHeight}
                ></textarea>
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

export default AddMedicalData;
