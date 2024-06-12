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
import { useAddTestReport } from '../../api/doctor.api';
import useAuth from '../../stores/authStore';

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
  const [selectedSection, setSelectedSection] = useState('Choose the Test');
  const [formData, setFormData] = useState({
    armyNo: '',
    bloodHb: '',
    TLC: '',
    DLC: '',
    urineRE: '',
    urineSpGravity: '',
    bloodSugarFasting: '',
    bloodSugarPP: '',
    restingECG: '',
    uricAcid: '',
    urea: '',
    creatinine: '',
    cholesterol: '',
    lipidProfile: '',
    xrayChestPA: '',
  });

  const { patient } = usePatientStore();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || (user && user.role !== 'DOCTOR')) {
    navigate('/login');
  }
  const { mutate } = useAddTestReport();

  useEffect(() => {
    if (!patient) {
      return <div>No patient selected</div>;
    }
    const DOB = patient.dob;
    const age = calculateAge(DOB);
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
        section = 'PME - Periodic medical Exam';
        break;
      default:
        section = 'Choose the Test';
        break;
    }
    setSelectedSection(section);
  }, [patient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestData = {
      ...formData,
      date: date.toISOString(),
      armyNo: patient.armyNo,
    };

    let endpoint;
    switch (selectedSection) {
      case 'AME - Annual Medical Exam':
        endpoint = 'update-AME1';
        break;
      case 'AME1 - Annual Medical Exam 1':
        endpoint = 'update-AME2';
        break;
      case 'PME - Periodic medical Exam':
        endpoint = 'update-PME';
        break;
      default:
        return;
    }

    mutate({ data: requestData, endpoint });
  };

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {selectedSection === 'AME - Annual Medical Exam' && (
          <div id="ameform" className="selectedTest">
            <form className="pi" onSubmit={handleSubmit}>
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
                <textarea
                  className="piInput"
                  name="bloodHb"
                  value={formData.bloodHb}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">TLC</label>
                <textarea
                  className="piInput"
                  name="TLC"
                  value={formData.TLC}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">DLC</label>
                <textarea
                  className="piTextarea"
                  name="DLC"
                  value={formData.DLC}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Urine RE</label>
                <textarea
                  className="piTextarea"
                  name="urineRE"
                  value={formData.urineRE}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Urine Sp Gravity</label>
                <textarea
                  className="piTextarea"
                  name="urineSpGravity"
                  value={formData.urineSpGravity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-row justify-center gap-1 md:w-1/5 w-2/5">
                <Button
                  className="editForm md:text-lg text-base md:w-4/5 w-full"
                  variant="contained"
                  type="submit"
                >
                  {' '}
                  Save{' '}
                </Button>
                <Button
                  className="saveForm md:text-lg text-base md:w-4/5 w-full"
                  variant="outlined"
                  href="/doctor/create-test-data"
                >
                  {' '}
                  Back{' '}
                </Button>
              </div>
            </form>
          </div>
        )}
        {selectedSection === 'AME1 - Annual Medical Exam 1' && (
          <div className="selectedTest" id="ameform">
            <form className="pi" onSubmit={handleSubmit}>
              <h1>Annual Medical Exam 1</h1>
              <div className="piFormGroup" style={{ marginBottom: '1vh', textAlign: 'right' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Date" value={date} onChange={(newDate) => setDate(newDate)} />
                </LocalizationProvider>
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Blood Hb</label>
                <textarea
                  className="piInput"
                  name="bloodHb"
                  value={formData.bloodHb}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">TLC</label>
                <textarea
                  className="piInput"
                  name="TLC"
                  value={formData.TLC}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">DLC</label>
                <textarea
                  className="piTextarea"
                  name="DLC"
                  value={formData.DLC}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Urine RE</label>
                <textarea
                  className="piTextarea"
                  name="urineRE"
                  value={formData.urineRE}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Urine Sp Gravity</label>
                <textarea
                  className="piTextarea"
                  name="urineSpGravity"
                  value={formData.urineSpGravity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Blood Sugar Fasting</label>
                <textarea
                  className="piTextarea"
                  name="bloodSugarFasting"
                  value={formData.bloodSugarFasting}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Blood Sugar Post Prandial</label>
                <textarea
                  className="piTextarea"
                  name="bloodSugarPP"
                  value={formData.bloodSugarPP}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Resting ECG</label>
                <textarea
                  className="piTextarea"
                  name="restingECG"
                  value={formData.restingECG}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-row justify-center gap-1 md:w-1/5 w-2/5">
                <Button
                  className="editForm md:text-lg text-base md:w-4/5 w-full"
                  variant="contained"
                  type="submit"
                >
                  {' '}
                  Save{' '}
                </Button>
                <Button
                  className="saveForm md:text-lg text-base md:w-4/5 w-full"
                  variant="outlined"
                  href="/doctor/create-test-data"
                >
                  {' '}
                  Back{' '}
                </Button>
              </div>
            </form>
          </div>
        )}
        {selectedSection === 'PME - Periodic medical Exam' && (
          <div className="selectedTest" id="ameform">
            <form className="pi" onSubmit={handleSubmit}>
              <h1>Periodic Medical Exam</h1>
              <div className="piFormGroup" style={{ marginBottom: '1vh', textAlign: 'right' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Date" value={date} disabled />
                </LocalizationProvider>
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Blood Hb</label>
                <textarea
                  className="piInput"
                  name="bloodHb"
                  value={formData.bloodHb}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">TLC</label>
                <textarea
                  className="piInput"
                  name="TLC"
                  value={formData.TLC}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">DLC</label>
                <textarea
                  className="piTextarea"
                  name="DLC"
                  value={formData.DLC}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Urine RE</label>
                <textarea
                  className="piTextarea"
                  name="urineRE"
                  value={formData.urineRE}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Urine Sp Gravity</label>
                <textarea
                  className="piTextarea"
                  name="urineSpGravity"
                  value={formData.urineSpGravity}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Blood Sugar Fasting</label>
                <textarea
                  className="piTextarea"
                  name="bloodSugarFasting"
                  value={formData.bloodSugarFasting}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Blood Sugar Post Prandial</label>
                <textarea
                  className="piTextarea"
                  name="bloodSugarPP"
                  value={formData.bloodSugarPP}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Resting ECG</label>
                <textarea
                  className="piTextarea"
                  name="restingECG"
                  value={formData.restingECG}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Uric Acid</label>
                <textarea
                  className="piTextarea"
                  name="uricAcid"
                  value={formData.uricAcid}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Urea</label>
                <textarea
                  className="piTextarea"
                  name="urea"
                  value={formData.urea}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Creatinine</label>
                <textarea
                  className="piTextarea"
                  name="creatinine"
                  value={formData.creatinine}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Cholesterol</label>
                <textarea
                  className="piTextarea"
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">Lipid Profile</label>
                <textarea
                  className="piTextarea"
                  name="lipidProfile"
                  value={formData.lipidProfile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="piFormGroup md:w-4/5 w-11/12">
                <label className="piLabel">X-ray Chest PA</label>
                <textarea
                  className="piTextarea"
                  name="xrayChestPA"
                  value={formData.xrayChestPA}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-row justify-center gap-1 md:w-1/5 w-2/5">
                <Button
                  className="editForm md:text-lg text-base md:w-4/5 w-full"
                  variant="contained"
                  type="submit"
                >
                  {' '}
                  Save{' '}
                </Button>
                <Button
                  className="saveForm md:text-lg text-base md:w-4/5 w-full"
                  variant="outlined"
                  href="/doctor/create-test-data"
                >
                  {' '}
                  Back{' '}
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
