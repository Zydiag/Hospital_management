import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../stores/authStore';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3000/api/doctor';

const createPatientProfileApi = async (makeAuthRequest, patientData) => {
  return makeAuthRequest('POST', `${API_URL}/create-patient-profile`, patientData);
};

const updatePatientProfileApi = async (makeAuthRequest, patientData) => {
  console.log(`${API_URL}/update-patient-profile`, patientData);
  return makeAuthRequest('POST', `${API_URL}/update-personal-info`, patientData);
};

const updateHealthRecordApi = async (makeAuthRequest, healthRecordData) => {
  return makeAuthRequest('POST', `${API_URL}/update-health-record`, healthRecordData);
};

const updateTreatmentRecordApi = async (makeAuthRequest, treatmentRecordData) => {
  return makeAuthRequest('POST', `${API_URL}/update-treatment-record`, treatmentRecordData);
};

const updateFamilyHistoryApi = async (makeAuthRequest, familyHistoryData) => {
  return makeAuthRequest('POST', `${API_URL}/update-family-history`, familyHistoryData);
};

export const getPersonalInfoApi = async (makeAuthRequest, armyNo) => {
  const response = await makeAuthRequest('GET', `${API_URL}/personal-info?armyNo=${armyNo}`, {
    armyNo,
  });
  console.log(response.data);
  return response.data;
};
export const getUpdateDatesApi = async (makeAuthRequest, armyNo, startDate, endDate) => {
  const response = await makeAuthRequest('POST', `${API_URL}/get-dates`, {
    armyNo,
    startDate,
    endDate,
  });
  console.log(response.data);
  return response.data;
};
export const getTreatmentRecordApi = async (makeAuthRequest, armyNo) => {
  const response = await makeAuthRequest(
    'GET',
    `${API_URL}/treatment-record?armyNo=${armyNo}&date=${date}`,
    {
      armyNo,
    }
  );
  console.log(response.data);
  return response.data;
};

export const useGetPersonalInfo = (armyNo) => {
  const { makeAuthRequest } = useAuth();

  return useQuery({
    queryKey: ['personalInfo', armyNo],
    queryFn: () => getPersonalInfoApi(makeAuthRequest, armyNo),
    onError: (error) => {
      console.log('error from get personal info', error);
      toast.error(
        error.response ? error.response.data.message : 'Error fetching personal information'
      );
    },
  });
};

export const useCreatePatientProfile = () => {
  const { makeAuthRequest } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientData) => createPatientProfileApi(makeAuthRequest, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries('doctorRequests');
      queryClient.invalidateQueries('patients');
      toast.success('Patient profile created successfully');
    },
    onError: (error) => {
      console.log('error from create patient', error);
      // toast.error(error);
      toast.error(error.response ? error.response.data.message : 'Error creating patient profile');
    },
  });
};

export const useUpdatePatientProfile = () => {
  const { makeAuthRequest } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientData) => updatePatientProfileApi(makeAuthRequest, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries('doctorRequests');
      queryClient.invalidateQueries('patients');
      toast.success('Patient profile created successfully');
    },
    onError: (error) => {
      toast.error(error.response ? error.response.data.message : 'Error updating patient profile');
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
      toast.success('Health record updated successfully');
    },
    onError: (error) => {
      toast.error('Error updating health record');
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
      toast.success('Treatment record updated successfully');
    },
    onError: (error) => {
      toast.error('Error updating treatment record');
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
      toast.success('Family history updated successfully');
    },
    onError: (error) => {
      toast.error('Error updating family history');
    },
  });
};
