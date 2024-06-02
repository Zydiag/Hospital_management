import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../stores/authStore';

const API_URL = 'http://localhost:3000/api/doctor'; // Adjust the URL as per your backend

const createPatientProfileApi = async (makeAuthRequest, patientData) => {
  return makeAuthRequest('POST', `${API_URL}/create-patient-profile`, patientData);
};

export const useCreatePatientProfile = () => {
  const { makeAuthRequest } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientData) => createPatientProfileApi(makeAuthRequest, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries('doctorRequests');
      queryClient.invalidateQueries('patients');
    },
  });
};
