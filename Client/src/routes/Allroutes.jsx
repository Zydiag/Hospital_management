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
import HistoryData from "../pages/Doctor/HistoryData";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/admin-panel" element={<AdminSearchPage />} />
      <Route path="/" element={<SignUp />}></Route>
      <Route path="/doctor-panel" element={<DoctorSearchPage />}></Route>
      <Route path="/patient-history" element={<PatientMedicalHistory />}></Route>
      <Route path="/history-data" element={<HistoryData />}></Route>
    </>,
  ),
);

