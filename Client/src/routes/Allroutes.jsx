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

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/admin-panel" element={<AdminSearchPage />} />
      <Route path="/" element={<SignUp />}></Route>
      <Route path="/doctor-panel" element={<DoctorSearchPage />}></Route>
      <Route path="/patient-history" element={<PatientMedicalHistory />}></Route>
      <Route path="/history-data" element={<HistoryData />}></Route>
      <Route path="/test-record" element={<PatientTestRecord />}></Route>
      <Route path="/ame-data" element={<AME />}></Route>
      <Route path="/ame1-data" element={<AME1 />}></Route>
      <Route path="/pme-data" element={<PME />}></Route>
      <Route path="/create-data" element={<AddMedicalData />}></Route>
      <Route path="/create-test-data" element={<AddTestData />}></Route>
    </>,
  ),
);

