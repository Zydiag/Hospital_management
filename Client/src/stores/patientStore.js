import { create } from 'zustand';
import axios from 'axios';

const API = 'http://localhost:3000/api';

const usePatientStore = create((set) => ({
  patient: null,
  setPatient: (patient) => {
    console.log('no set patient', patient);
    set({ patient });
    console.log('set patient', patient);
  },
  clearPatient: () => set({ patient: null }),
}));

export default usePatientStore;
