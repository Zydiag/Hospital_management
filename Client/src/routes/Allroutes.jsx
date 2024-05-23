import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import AdminSearchPage from '../pages/Admin/AdminSearchPage';
import DoctorProfilePage from '../pages/Admin/DoctorProfilePage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/doctor-profile" element={<DoctorProfilePage />} />
      <Route path="/admin-panel" element={<AdminSearchPage />} />
      <Route path="/" element={<SignUp />}></Route>
    </>
  )
);