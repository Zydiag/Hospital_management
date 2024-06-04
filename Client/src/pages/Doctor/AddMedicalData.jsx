import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import { Button, TextField } from '@mui/material';
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
import {
  useCreatePatientProfile,
  useUpdateFamilyHistory,
  useUpdateHealthRecord,
  useUpdatePatientProfile,
  useUpdateTreatmentRecord,
} from '../../api/doctor.api';
import { usePatientStore } from '../../stores/patientStore';
import useAuth from '../../stores/authStore';
import { toast } from 'react-toastify';
import { calculateAge } from '../../utils/getAge.js';
import { useNavigate } from 'react-router-dom';

import { styled } from '@mui/system';

const drawerWidth = 350;

function AddMedicalData() {
  const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#a8adb7', // default border color
        borderWidth: 2,
      },
      '&:hover fieldset': {
        borderColor: '#a8adb7', // border color on hover
        borderWidth: 2,
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black', // border color when focused
        borderWidth: 2,
      },
    },
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    navigate('/login');
  }
  const { patient, setPatient } = usePatientStore();

  console.log('patient', dayjs(patient?.dob).format('DD-MM-YYYY'));
  const [formData, setFormData] = useState({
    BMI: '',
    height: '',
    weight: '',
    date: dayjs(),
    patientName: '',
    armyNumber: '',
    ageService: null,
    unitServiceArms: '',
    chest: '',
    waist: '',
    bloodPressure: '',
    bloodGroup: '',
    disabilities: '',
    medications: '',
    diagnosis: '',
    description: '',
    allergies: '',
    miscellaneous: '',
    hypertension: '',
    diabetes: '',
    unnaturalDeath: '',
    significantHistory: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        armyNumber: patient?.armyNo || '',
        patientName: patient?.name || '',
        ageService: patient?.dob || '',
        unitServiceArms: patient?.unit || '',
      }));
    }
  }, [patient]);

  const [selectedSection, setSelectedSection] = useState('PERSONAL INFO');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const { mutate: createPatientProfile } = useCreatePatientProfile();
  const { mutate: updatePatientProfile } = useUpdatePatientProfile();
  const { mutate: updateHealthRecord } = useUpdateHealthRecord();
  const { mutate: updateTreatmentRecord } = useUpdateTreatmentRecord();
  const { mutate: updateFamilyHistory } = useUpdateFamilyHistory();
  const validatePersonalInfo = (data) => {
    const requiredFields = ['patientName', 'armyNumber', 'ageService', 'unitServiceArms'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return false;
      }
    }
    return true;
  };

  const validateHealthRecord = (data) => {
    const requiredFields = [
      'height',
      'weight',
      'chest',
      'BMI',
      'waist',
      'bloodPressure',
      'bloodGroup',
      'disabilities',
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return false;
      }
    }
    return true;
  };

  const validatePersonalMedicalHistory = (data) => {
    const requiredFields = [
      'diagnosis',
      'description',
      'medications',
      'allergies',
      'miscellaneous',
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return false;
      }
    }
    return true;
  };

  const validateFamilyHistory = (data) => {
    const requiredFields = ['hypertension', 'diabetes', 'unnaturalDeath', 'significantHistory'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    switch (selectedSection) {
      case 'PERSONAL INFO':
        if (!validatePersonalInfo(formData)) {
          toast('Please fill all fields in Personal Info', { type: 'error' });
          return;
        }
        console.log('formData update personal', formData);
        updatePatientProfile({
          armyNo: patient?.armyNo || formData.armyNumber,
          patientName: formData.patientName,
          dob: formData.ageService,
          unitServiceArms: formData.unitServiceArms,
        });
        break;
      case 'HEALTH RECORD':
        if (!validateHealthRecord(formData)) {
          toast('Please fill all fields in Health Record', { type: 'error' });
          return;
        }
        updateHealthRecord({
          heightCm: parseInt(formData.height, 10),
          weightKg: parseFloat(formData.weight),
          chest: parseInt(formData.chest, 10),
          BMI: parseFloat(formData.BMI),
          waist: parseInt(formData.waist, 10),
          bloodPressure: formData.bloodPressure,
          disabilities: formData.disabilities,
          bloodGroup: formData.bloodGroup,
          date: formData.date.toISOString(), // Assuming date is a Dayjs object
          armyNo: patient?.armyNo,
        });
        break;
      case 'PERSONAL MEDICAL HISTORY':
        if (!validatePersonalMedicalHistory(formData)) {
          toast('Please fill all fields in Personal Medical History', { type: 'error' });
          return;
        }
        updateTreatmentRecord({
          diagnosis: formData.diagnosis,
          note: formData.description,
          medicationName: formData.medications,
          date: formData.date,
          knownAllergies: formData.allergies,
          miscellaneous: formData.miscellaneous,
          armyNo: patient?.armyNo,
        });
        break;
      case 'FAMILY HISTORY':
        if (!validateFamilyHistory(formData)) {
          toast('Please fill all fields in Family History', { type: 'error' });
          return;
        }
        updateFamilyHistory({
          hypertension: formData.hypertension,
          diabetesMellitus: formData.diabetes,
          anyUnnaturalDeath: formData.unnaturalDeath,
          otherSignificantHistory: formData.significantHistory,
          date: formData.date,
          armyNo: patient?.armyNo,
        });
        break;
      default:
        console.log('Unknown section');
    }
  };

  const BMIcal = () => {
    const heightInMeters = formData.height / 100; // Convert height to meters
    const bmi = formData.weight / (heightInMeters * heightInMeters); // Calculate BMI
    setFormData({
      ...formData,
      BMI: bmi.toFixed(2), // Set BMI state with 2 decimal places
    });
  };

  const sections = ['PERSONAL INFO', 'HEALTH RECORD', 'PERSONAL MEDICAL HISTORY', 'FAMILY HISTORY'];

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
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
          variant="permanent"
          anchor="left"
        >
          <Divider />
          <List
            sx={{
              '& .MuiButtonBase-root': {
                marginBottom: '5px',
              },
            }}
          >
            {sections.map((text) => (
              <ListItem
                key={text}
                disablePadding
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: '1.1rem',
                    fontFamily: 'Manrope',
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
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          {selectedSection === 'PERSONAL INFO' && (
            <div id="personal-info" className="personelInfo">
              <form onSubmit={handleSubmit} className="pi">
                <h1>PERSONAL INFO</h1>
                <div className="piFormGroup" style={{ marginBottom: '1vh', textAlign: 'right' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Date" value={formData.date} onChange={handleDateChange} />
                  </LocalizationProvider>
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Name of the Patient</label>
                  <input
                    className="piInput"
                    placeholder="Name.."
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">ARMY NUMBER</label>
                  <input
                    className="piInput"
                    placeholder="Army Number.."
                    name="armyNumber"
                    value={formData.armyNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  {/*<label className="piLabel">Age/Service</label>*/}
                  <CustomTextField
                    label="Date of Birth"
                    type="date"
                    name="ageService"
                    value={patient?.dob ? new Date(patient?.dob).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    className="piInput"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    margin="normal"
                    inputProps={{ max: new Date().toISOString().split('T')[0] }}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Units/Service/Arms</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Units.."
                    name="unitServiceArms"
                    value={formData.unitServiceArms}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="saveForm"
                    variant="outlined"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          )}

          {selectedSection === 'HEALTH RECORD' && (
            <section id="health-record" className="healthRecord">
              <form onSubmit={handleSubmit} className="pi">
                <h1>HEALTH RECORD</h1>
                <div className="piFormGroup">
                  <label className="piLabel">Height</label>
                  <div className="piInputContainer">
                    <input
                      className="piInput"
                      placeholder="Height.."
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                    />
                    <span className="piUnit">cm</span>
                  </div>
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Weight</label>
                  <div className="piInputContainer">
                    <input
                      className="piInput"
                      placeholder="Weight.."
                      type="number"
                      step="0.01"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                    <span className="piUnit">kg</span>
                  </div>
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">BMI</label>
                  <div className="piInputContainer">
                    <input className="bmiInput" value={formData.BMI} readOnly />
                    <Button variant="contained" className="calc" onClick={BMIcal}>
                      Calculate
                    </Button>
                  </div>
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Chest</label>
                  <input
                    className="piInput"
                    placeholder="Chest.."
                    type="number"
                    name="chest"
                    value={formData.chest}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Waist</label>
                  <input
                    className="piInput"
                    placeholder="Waist.."
                    type="number"
                    name="waist"
                    value={formData.waist}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Blood Pressure</label>
                  <input
                    className="piInput"
                    placeholder="Blood Pressure.."
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Blood Group</label>
                  <input
                    className="piInput"
                    placeholder="Blood Group.."
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Disabilities</label>
                  <input
                    className="piInput"
                    placeholder="Disabilities.."
                    name="disabilities"
                    value={formData.disabilities}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="saveForm"
                    variant="outlined"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </section>
          )}

          {selectedSection === 'PERSONAL MEDICAL HISTORY' && (
            <section id="medical-history" className="medicalHistory">
              <form onSubmit={handleSubmit} className="pi">
                <h1>PERSONAL MEDICAL HISTORY</h1>
                <div className="piFormGroup">
                  <label className="piLabel">Present medications</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Present medications.."
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Diagnosis</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Diagnosis.."
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Description</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Description.."
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Known Allergies</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Known Allergies.."
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Miscellaneous</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Miscellaneous.."
                    name="miscellaneous"
                    value={formData.miscellaneous}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="saveForm"
                    variant="outlined"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </section>
          )}

          {selectedSection === 'FAMILY HISTORY' && (
            <section id="Family-history" className="familyHistory">
              <form onSubmit={handleSubmit} className="pi">
                <h1>FAMILY HISTORY</h1>
                <div className="piFormGroup">
                  <label className="piLabel">Hypertension</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Hypertension cases.."
                    name="hypertension"
                    value={formData.hypertension}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Diabetes Mellitus</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Diabetes Mellitus.."
                    name="diabetes"
                    value={formData.diabetes}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel">Any Unnatural Death</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Description.."
                    name="unnaturalDeath"
                    value={formData.unnaturalDeath}
                    onChange={handleChange}
                  />
                </div>
                <div className="piFormGroup">
                  <label className="piLabel"> Any Other Significant History</label>
                  <textarea
                    className="piTextarea"
                    placeholder="Any Other Significant History.."
                    name="significantHistory"
                    value={formData.significantHistory}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="saveForm"
                    variant="outlined"
                  >
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
