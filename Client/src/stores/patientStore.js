import { create } from 'zustand';

export const usePatientStore = create((set) => ({
  patient: {},
  medicalDate: null,
  testDate: null,
  setPatient: (patient) => {
    set({ patient });
  },
  setMedicalDate: (date) => set({ medicalDate: date }),
  setTestDate: (date) => set({ testDate: date }),
  clearPatient: () => set({ patient: null }),
}));

// export const useGetMedicalOnDate = create((set) => ({
//   date: null,
//   setDate: (date) => {
//     console.log('date set', date);
//     set(date);
//   },
// }));
// export default usePatientStore;
