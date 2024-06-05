import { create } from 'zustand';

export const usePatientStore = create((set) => ({
  patient: {},
  medicalDate: null,
  setPatient: (patient) => {
    console.log('no set patient', patient);
    set({ patient });
    console.log('set patient', patient);
  },
  setMedicalDate: (date) => set({ medicalDate: date }),
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
