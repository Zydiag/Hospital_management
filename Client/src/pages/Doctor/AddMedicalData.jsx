import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
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
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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

const drawerWidth = 300;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

function AddMedicalData() {
  const { patient, setPatient } = usePatientStore();
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
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'DOCTOR') || !user) {
      // console.log('go back you need to login');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // const { patient, setPatient } = usePatientStore();

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
        patientName: patient?.fullname || '',
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
        updatePatientProfile({
          armyNo: patient?.armyNo || formData.armyNumber,
          fullname: patient.fullname,
          dob: formData.ageService,
          unit: formData.unitServiceArms,
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
          allergies: formData.allergies,
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
        throw new Error('Invalid section');
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

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} sx={{ backgroundColor: '#efb034' }}>
          <Toolbar
            sx={{
              '& .MuiToolbar-regular': {
                backgroundColor: '#e99a01',
              },
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {sections.map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={() => setSelectedSection(text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    textAlign: 'center',
                  }}
                >
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
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
                  value={patient.fullname}
                  onChange={handleChange}
                />
              </div>
              <div className="piFormGroup">
                <label className="piLabel">ARMY NUMBER</label>
                <input
                  className="piInput"
                  placeholder="Army Number.."
                  name="armyNumber"
                  value={patient.armyNo}
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
              <div className="w-1/5">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="editForm md:text-lg text-base  w-full"
                  variant="contained"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        )}

        {selectedSection === 'HEALTH RECORD' && (
          <section id="health-record" className="personelInfo">
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
                <div className="piInputContainer flex-intial flex-row justify-start">
                  <input className="piInput lg:w-full w-4/5 " value={formData.BMI} readOnly />
                  <Button
                    variant="contained"
                    className="calc text-sm lg:text-base lg:w-full w-1/5"
                    onClick={BMIcal}
                  >
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
                <label className="piLabel">Allergies</label>
                <input
                  className="piInput"
                  placeholder="Any Allergies.."
                  name="allergies"
                  value={formData.allergies}
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
              <div className="w-1/5">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="editForm md:text-lg text-base  w-10/12"
                  variant="contained"
                >
                  Save
                </Button>
              </div>
            </form>
          </section>
        )}

        {selectedSection === 'PERSONAL MEDICAL HISTORY' && (
          <section id="medical-history" className="personelInfo">
            <form onSubmit={handleSubmit} className="pi">
              <h1>PERSONAL MEDICAL HISTORY</h1>
              <div className="piFormGroup">
                <label className="piLabel">Present Complaints</label>
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
                <label className="piLabel">Experiments and Tests</label>
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
                <label className="piLabel">Treatment Advice</label>
                <textarea
                  className="piTextarea"
                  placeholder="Miscellaneous.."
                  name="miscellaneous"
                  value={formData.miscellaneous}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/5">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="editForm md:text-lg text-base  w-full"
                  variant="contained"
                >
                  Save
                </Button>
              </div>
            </form>
          </section>
        )}

        {selectedSection === 'FAMILY HISTORY' && (
          <section id="Family-history" className="personelInfo">
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
              <div className="w-1/5">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="editForm md:text-lg text-base  w-full"
                  variant="contained"
                >
                  Save
                </Button>
              </div>
            </form>
          </section>
        )}
      </Box>
    </div>
  );
}

export default AddMedicalData;
