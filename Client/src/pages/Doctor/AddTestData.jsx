import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import '../../styles/StylesP/AddTestData.css';
import { usePatientStore } from '../../stores/patientStore';

export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Calculate the fraction of the current year that has elapsed
  const fractionOfYear = (monthDiff * 30 + dayDiff) / 365;

  // Calculate age as a float value
  age += fractionOfYear;

  return age;
};

export const getTestType = (age) => {
  if (
    (age > 25 && age <= 26) ||
    (age > 30 && age <= 31) ||
    (age > 37 && age <= 38) ||
    (age > 42 && age <= 43) ||
    (age > 47 && age <= 48) ||
    (age > 49 && age <= 50) ||
    (age > 51 && age <= 53) ||
    (age > 54 && age <= 57) ||
    (age > 58 && age <= 59)
  ) {
    return 'AME2';
  } else if (
    (age > 35 && age <= 36) ||
    (age > 40 && age <= 41) ||
    (age > 45 && age <= 46) ||
    (age > 50 && age <= 51) ||
    (age > 53 && age <= 54) ||
    (age > 57 && age <= 58)
  ) {
    return 'PME';
  } else {
    return 'AME1';
  }
};

function AddTestData() {
  const [date, setDate] = useState(dayjs());
  // const [dob, setDOB] = useState(dayjs());
  const [selectedSection, setSelectedSection] = useState('Choose the Test');

  const { patient } = usePatientStore();

  useEffect(() => {
    if (!patient) {
      return <div>No patient selected</div>;
    }
    const DOB = patient.dob;
    // setDOB(DOB);
    console.log('dob', DOB);
    const age = calculateAge(DOB);
    console.log('age', age);
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
  }, [patient]);

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {selectedSection === 'AME - Annual Medical Exam' && (
          <div id="ameform" className="selectedTest">
            <form className="pi">
              <h1>Annual Medical Exam</h1>
              <div
                className="piFormGroup w-4/5"
                style={{ marginBottom: '1vh', textAlign: 'right' }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Date" value={date} onChange={(newDate) => setDate(newDate)} />
                </LocalizationProvider>
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Blood Hb</label>
                <textarea className="piInput" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">TLC</label>
                <textarea className="piInput" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">DLC</label>
                <textarea className="piTextarea" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">UrineRe</label>
                <textarea className="piTextarea" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">UrineSpGravity</label>
                <textarea className="piTextarea" />
              </div>
              <div className="flex flex-row justify-center gap-1 md:w-1/5 w-2/5">
                <Button
                  className="editForm md:text-lg text-base md:w-4/5 w-full"
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  className="saveForm md:text-lg text-base md:w-4/5 w-full"
                  variant="outlined"
                  href="/doctor/create-test-data"
                >
                  Back
                </Button>
              </div>
            </form>
          </div>
        )}

        {selectedSection === 'AME1 - Annual Medical Exam 1' && (
          <div className="selectedTest" id="ameform">
            <form className="pi">
              <h1>Annual Medical Exam 1</h1>
              <div className="piFormGroup" style={{ marginBottom: '1vh', textAlign: 'right' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Date" value={date} onChange={(newDate) => setDate(newDate)} />
                </LocalizationProvider>
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Blood Hb</label>
                <textarea className="piInput" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">TLC</label>
                <textarea className="piInput" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">DLC</label>
                <textarea className="piTextarea" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">UrineRe</label>
                <textarea className="piTextarea" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">UrineSpGravity</label>
                <textarea className="piTextarea" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">BloodSugarFasting</label>
                <textarea className="piTextarea" />
              </div>
              <div className="flex flex-row justify-center gap-1 md:w-1/5 w-2/5">
                <Button
                  className="editForm md:text-lg text-base md:w-4/5 w-full"
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  className="saveForm md:text-lg text-base md:w-4/5 w-full"
                  variant="outlined"
                  href="/doctor/create-test-data"
                >
                  Back
                </Button>
              </div>
            </form>
          </div>
        )}

        {selectedSection === 'PME - Perodic medical Exam' && (
          <div className="selectedTest" id="ameform">
            <form className="pi">
              <h1>Periodic Medical Exam</h1>
              <div className="piFormGroup" style={{ marginBottom: '1vh', textAlign: 'right' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Date" value={date} disabled />
                </LocalizationProvider>
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Blood Hb</label>
                <textarea className="piInput" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">TLC</label>
                <textarea className="piInput" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">DLC</label>
                <textarea className="piTextarea" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">UrineRe</label>
                <textarea className="piTextarea" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">UrineSpGravity</label>
                <textarea className="piTextarea" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">BloodSugarFasting</label>
                <textarea className="piTextarea" />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">BloodSugarPostPrandial</label>
                <textarea className="piTextarea" />
              </div>
              <div className="flex flex-row justify-center gap-1 md:w-1/5 w-2/5">
                <Button
                  className="editForm md:text-lg text-base md:w-4/5 w-full"
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  className="saveForm md:text-lg text-base md:w-4/5 w-full"
                  variant="outlined"
                  href="/doctor/create-test-data"
                >
                  Back
                </Button>
              </div>
            </form>
          </div>
        )}
      </Box>
    </div>
  );
}

export default AddTestData;
