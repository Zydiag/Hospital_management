import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = 'http://localhost:3000/api/admin';

const fetchPendingDoctorRequests = async () => {
  const response = await axios.get(`${API_URL}/all-pending-doctor-requests`);
  return response.data;
};

export const usePendingDoctorRequests = () => {
  return useQuery({
    queryKey: ['pendingDoctorRequests'],
    queryFn: fetchPendingDoctorRequests,
  });
};
