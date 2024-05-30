import { useQuery } from '@tanstack/react-query';
import useAuth from '../stores/authStore';

const API_URL = 'http://localhost:3000/api/admin';

export const usePendingDoctorRequests = () => {
  const { makeAuthRequest } = useAuth();
  return useQuery({
    queryKey: ['pendingDoctorRequests'],
    queryFn: () => makeAuthRequest('GET', `${API_URL}/all-pending-doctor-requests`),
  });
};
