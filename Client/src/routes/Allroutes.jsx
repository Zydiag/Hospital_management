import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import AdminSearchPage from '../pages/Admin/AdminSearchPage';
import DoctorSearchPage from '../pages/Doctor/DoctorSearchPage';
import PatientMedicalHistory from '../pages/Doctor/PatientMedicalHistory';
import PatientTestRecord from '../pages/Doctor/PatientTestRecord';
import HistoryData from '../pages/Doctor/HistoryData';
import AddMedicalData from '../pages/Doctor/AddMedicalData';
import AddTestData from '../pages/Doctor/AddTestData';
import PatientMainPage from '../pages/Patient/PatientMainPage';
import MedicalRecord from '../pages/Patient/MedicalRecord';
import AMERecord from '../pages/Patient/AMERecord';
import AME1Record from '../pages/Patient/AME1Record';
import PMERecord from '../pages/Patient/PMERecord';
import Profile from '../pages/Profile';
import PatientTestRecordsPage from '../pages/Patient/PatientTestRecordsPage';
import AME from '../pages/PatientOrDoc/AME';
import AME1 from '../pages/PatientOrDoc/AME1';
import PME from '../pages/PatientOrDoc/PME';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<SignUp />}></Route>
      <Route path="/login" element={<Login />} />
      <Route path="/my-account" element={<Profile />}></Route>
      <Route path="/admin/admin-panel" element={<AdminSearchPage />} />

      {/*search patient by army no*/}
      <Route path="/doctor/doctor-panel" element={<DoctorSearchPage />}></Route>

      {/*//search patient medical record by date*/}
      <Route path="/doctor/patient-record" element={<PatientMedicalHistory />}></Route>

      {/*database of medical record*/}
      <Route path="/doctor/medical-record" element={<HistoryData />}></Route>

      <Route path="/doctor/test-record" element={<PatientTestRecord />}></Route>
      <Route path="/doctor/create-medical-data" element={<AddMedicalData />}></Route>
      <Route path="/doctor/create-test-data" element={<AddTestData />}></Route>

      <Route path="/patient/profile" element={<PatientMainPage />}></Route>

      <Route path="/patient/test" element={<PatientTestRecordsPage />}></Route>
      <Route path="/patient/medical-record" element={<MedicalRecord />}></Route>

      <Route path="/common/ame" element={<AME />}></Route>
      <Route path="/common/ame1" element={<AME1 />}></Route>
      <Route path="/common/pme" element={<PME />}></Route>
    </>
  )
);
