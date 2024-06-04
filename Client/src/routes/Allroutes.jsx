import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import AdminSearchPage from "../pages/Admin/AdminSearchPage";
import DoctorSearchPage from "../pages/Doctor/DoctorSearchPage";
import PatientMedicalHistory from "../pages/Doctor/PatientMedicalHistory";
import PatientTestRecord from "../pages/Doctor/PatientTestRecord";
import HistoryData from "../pages/Doctor/HistoryData";
import AME from "../pages/Doctor/AME";
import AME1 from "../pages/Doctor/AME1";
import PME from "../pages/Doctor/PME";
import AddMedicalData from "../pages/Doctor/AddMedicalData";
import AddTestData from "../pages/Doctor/AddTestData";
import PatientMainPage from "../pages/Patient/PatientMainPage";
import PatientTestRecodsPage from "../pages/Patient/PatientTestRecodsPage";
import MedicalRecord from "../pages/Patient/MedicalRecord";
import AMERecord from "../pages/Patient/AMERecord";
import AME1Record from "../pages/Patient/AME1Record";
import PMERecord from "../pages/Patient/PMERecord";
import Profile from "../pages/Profile";


export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<SignUp />}></Route>
      <Route path="/login" element={<Login />} />
      <Route path="/my-account" element={<Profile />}></Route>
      <Route path="/admin/admin-panel" element={<AdminSearchPage />} />
      <Route path="/doctor/doctor-panel" element={<DoctorSearchPage />}></Route>//search patient by army Number
      <Route path="/doctor/patient-record" element={<PatientMedicalHistory />}></Route>//search patient medical record by date
      <Route path="/doctor/medical-record" element={<HistoryData />}></Route>//database of the medical record
      <Route path="/doctor/test-record" element={<PatientTestRecord />}></Route>
      <Route path="/doctor/ame-data" element={<AME />}></Route>
      <Route path="/doctor/ame1-data" element={<AME1 />}></Route>
      <Route path="/doctor/pme-data" element={<PME />}></Route>

      <Route path="/doctor/create-medical-data" element={<AddMedicalData />}></Route>
      <Route path="/doctor/create-test-data" element={<AddTestData />}></Route>

      <Route path="/patient/profile" element={<PatientMainPage />}></Route>
      <Route path="/patient/test" element={<PatientTestRecodsPage />}></Route>
      <Route path="/patient/medical-record" element={<MedicalRecord />}></Route>
      <Route path="/patient/ame" element={<AMERecord />}></Route>
      <Route path="/patient/pme" element={<PMERecord />}></Route>
      <Route path="/patient/ame1" element={<AME1Record />}></Route>
    </>
  )
);
