import axios from 'axios';

export const signup = async (data, navigate) => {
  const api = `${import.meta.env.VITE_SERVER}/api/user`;
  const rolePaths = {
    Admin: { url: '/admin/create-admin-profile', navigate: '/admin/admin-panel' },
    Doctor: { url: '/doctor/create-doctor-profile', navigate: '/login' },
    Patient: { url: '/patient/create-patient-profile', navigate: '/patient/profile' },
  };
  try {
    const { profession, fullName, dob } = data;
    // const { firstName, middleName, lastName } = splitFullName(fullName);

    const formData = {
      ...data,
      fullname: fullName,
      // firstName,
      // middleName,
      // lastName,
      dob: new Date(dob).toISOString(),
    };
    delete formData.fullName;
    const { url, navigate: navigatePath } = rolePaths[profession];
    const response = await axios.post(`${api}${url}`, formData, { withCredentials: true });
    if (response.status === 200 || response.status === 201) {
      // console.log('signup service:', response.data);
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      navigate(navigatePath);
    }
  } catch (error) {
    console.error('Error creating profile:', error.response?.data || error.message);
  }
};

export const splitFullName = (fullName) => {
  const [firstName, middleName, lastName] = fullName.split(' ');
  return { firstName, middleName, lastName };
};
