import axios from 'axios';

export const signup = async (data, navigate) => {
  const api = 'http://localhost:3000/api';
  const rolePaths = {
    Admin: { url: '/admin/create-admin-profile', navigate: '/admin-panel' },
    Doctor: { url: '/doctor/doctor-profile', navigate: '/doctor-panel' },
    Patient: { url: '/patient/create-patient-profile', navigate: '/patient-history' },
  };
  try {
    const { profession, fullName, dob } = data;
    const { firstName, middleName, lastName } = splitFullName(fullName);

    const formData = {
      ...data,
      firstName,
      middleName,
      lastName,
      dob: new Date(dob).toISOString(),
    };
    delete formData.fullName;

    const { url, navigate: navigatePath } = rolePaths[profession];
    const response = await axios.post(`${api}${url}`, formData, { withCredentials: true });
    if (response.status === 200 || response.status === 201) {
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      navigate(navigatePath);
    }
  } catch (error) {
    console.error('Error creating profile:', error.response?.data || error.message);
  }
};

const splitFullName = (fullName) => {
  const [firstName, middleName, lastName] = fullName.split(' ');
  return { firstName, middleName, lastName };
};
