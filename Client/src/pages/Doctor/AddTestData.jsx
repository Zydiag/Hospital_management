import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
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
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


import '../../styles/StylesP/AddTestData.css';

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
  }),
);

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
          '& .MuiToolbar-regular':{
            backgroundColor: '#e99a01'
          }
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
            <ListItem key={text} disablePadding sx={{ display: 'block'}}>
              <ListItemButton
                onClick={() => setSelectedSection(text)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  textAlign:"center"
                }}
              >
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

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
                <Button className="dobButton md:text-lg text-base lg:w-1/6 w-3/12" variant='contained' onClick={handleDateChange}>Add Test</Button>
              </div>
            </div>
          )}

          {selectedSection === 'AME - Annual Medical Exam' && (
            <div id='ameform' className='selectedTest'>
              <form className='pi'>
                <h1>Annual Medical Exam</h1>
                <div className="piFormGroup w-4/5" style={{ marginBottom: '1vh', textAlign: 'right' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label='Date' value={date} onChange={(newDate) => setDate(newDate)} />
                  </LocalizationProvider>
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>Blood Hb</label>
                  <textarea className='piInput' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>TLC</label>
                  <textarea className='piInput' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>DLC</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>UrineRe</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>UrineSpGravity</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="flex flex-row justify-center gap-1 md:w-1/5 w-2/5">
                <Button className="editForm md:text-lg text-base md:w-4/5 w-full" variant='contained'>
                    Save
                  </Button>
                  <Button className="saveForm md:text-lg text-base md:w-4/5 w-full" variant='outlined' href='/doctor/create-test-data'>
                    Back
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
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>Blood Hb</label>
                  <textarea className='piInput' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>TLC</label>
                  <textarea className='piInput' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>DLC</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>UrineRe</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>UrineSpGravity</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>BloodSugarFasting</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="flex flex-row justify-center gap-1 md:w-1/5 w-2/5">
                <Button className="editForm md:text-lg text-base md:w-4/5 w-full" variant='contained'>
                    Save
                  </Button>
                  <Button className="saveForm md:text-lg text-base md:w-4/5 w-full" variant='outlined' href='/doctor/create-test-data'>
                    Back
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
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>Blood Hb</label>
                  <textarea className='piInput' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>TLC</label>
                  <textarea className='piInput' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>DLC</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>UrineRe</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>UrineSpGravity</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>BloodSugarFasting</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="piFormGroup md:w-4/5 w-11/12">
                  <label className='piLabel'>BloodSugarPostPrandial</label>
                  <textarea className='piTextarea' />
                </div>
                <div className="flex flex-row justify-center gap-1 md:w-1/5 w-2/5">
                <Button className="editForm md:text-lg text-base md:w-4/5 w-full" variant='contained'>
                    Save
                  </Button>
                  <Button className="saveForm md:text-lg text-base md:w-4/5 w-full" variant='outlined' href='/doctor/create-test-data'>
                    Back
                  </Button>
                </div>
              </form>
            </section>
          )}

    </Box>
    </div>
  );
}

export default AddTestData;


{/* <Box sx={{ display: 'flex' }}>
<CssBaseline />
<AppBar
  position='fixed'
  sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
></AppBar>
<Toolbar>
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

<Box
  component='main'
  sx={{
    flexGrow: 1,
    bgcolor: 'background.default',
    p: 3,
  }}
>
  
</Box>
</Box> */}



