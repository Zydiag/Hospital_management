import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../stores/authStore';

const API_URL = 'http://localhost:3000/api/doctor';

const createPatientProfileApi = async (makeAuthRequest, patientData) => {
  return makeAuthRequest('POST', `${API_URL}/create-patient-profile`, patientData);
};

const updateHealthRecordApi = async (makeAuthRequest, healthRecordData) => {
  console.log('healthRecordData', healthRecordData);
  return makeAuthRequest('POST', `${API_URL}/update-health-record`, healthRecordData);
};

const updateTreatmentRecordApi = async (makeAuthRequest, treatmentRecordData) => {
  return makeAuthRequest('POST', `${API_URL}/update-treatment-record`, treatmentRecordData);
};

const updateFamilyHistoryApi = async (makeAuthRequest, familyHistoryData) => {
  return makeAuthRequest('POST', `${API_URL}/update-family-history`, familyHistoryData);
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

export const useUpdateHealthRecord = () => {
  const { makeAuthRequest } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (healthRecordData) => updateHealthRecordApi(makeAuthRequest, healthRecordData),
    onSuccess: () => {
      queryClient.invalidateQueries('doctorRequests');
      queryClient.invalidateQueries('patients');
    },
  });
};

export const useUpdateTreatmentRecord = () => {
  const { makeAuthRequest } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (treatmentRecordData) =>
      updateTreatmentRecordApi(makeAuthRequest, treatmentRecordData),
    onSuccess: () => {
      queryClient.invalidateQueries('doctorRequests');
      queryClient.invalidateQueries('patients');
    },
  });
};

export const useUpdateFamilyHistory = () => {
  const { makeAuthRequest } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (familyHistoryData) => updateFamilyHistoryApi(makeAuthRequest, familyHistoryData),
    onSuccess: () => {
      queryClient.invalidateQueries('doctorRequests');
      queryClient.invalidateQueries('patients');
    },
  });
};
