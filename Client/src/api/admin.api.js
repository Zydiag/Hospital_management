import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../stores/authStore';

const API_URL = 'http://localhost:3000/api/admin';

export const useDoctorRequestsByStatus = (status) => {
  const { makeAuthRequest } = useAuth();
  return useQuery({
    queryKey: ['doctorRequests', status],
    queryFn: () => makeAuthRequest('GET', `${API_URL}/all-doctor-requests?status=${status}`),
  });
};

// export const useApprovedDoctorRequests = () => {
//   const { makeAuthRequest } = useAuth();
//   return useQuery({
//     queryKey: ['approvedDoctorRequests'],
//     queryFn: () => makeAuthRequest('GET', `${API_URL}/all-approved-doctor-requests`),
//   });
// };

const approveRequestApi = async (makeAuthRequest, doctorId) => {
  return makeAuthRequest('POST', `${API_URL}/approve-request?doctorId=${doctorId}`);
};

const rejectRequestApi = async (makeAuthRequest, doctorId) => {
  return makeAuthRequest('POST', `${API_URL}/reject-request?doctorId=${doctorId}`);
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
