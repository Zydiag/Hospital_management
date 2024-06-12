import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../stores/authStore';

const API_URL = `${import.meta.env.VITE_SERVER}/api/admin`;

export const useDoctorRequestsByStatus = (status) => {
  const { makeAuthRequest } = useAuth();
  return useQuery({
    queryKey: ['doctorRequests', status],
    queryFn: () => makeAuthRequest('GET', `${API_URL}/all-doctor-requests?status=${status}`),
  });
};

const approveRequestApi = async (makeAuthRequest, doctorId) => {
  return makeAuthRequest('POST', `${API_URL}/approve-request?doctorId=${doctorId}`);
};

const rejectRequestApi = async (makeAuthRequest, doctorId) => {
  return makeAuthRequest('POST', `${API_URL}/reject-request?doctorId=${doctorId}`);
};

const blockRequestApi = async (makeAuthRequest, doctorId) => {
  return makeAuthRequest('POST', `${API_URL}/block-request?doctorId=${doctorId}`);
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  const { makeAuthRequest } = useAuth();
  return useMutation({
    mutationFn: (doctorId) => approveRequestApi(makeAuthRequest, doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorRequests', 'PENDING']);
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  const { makeAuthRequest } = useAuth();
  return useMutation({
    mutationFn: (doctorId) => rejectRequestApi(makeAuthRequest, doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorRequests', 'PENDING']);
    },
  });
};

export const useBlockRequest = () => {
  const queryClient = useQueryClient();
  const { makeAuthRequest } = useAuth();
  return useMutation({
    mutationFn: (doctorId) => blockRequestApi(makeAuthRequest, doctorId),
    onSuccess: () => {
      queryClient.invalidateQueries(['doctorRequests', 'APPROVED']);
    },
  });
};
