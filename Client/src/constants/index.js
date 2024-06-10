export const AccountType = {
  Admin: 'Admin',
  Doctor: 'Doctor',
  Patient: 'Patient',
};

// use icon from material ui
export const linksAdmin = [
  { to: '/admin/admin-panel', label: 'Home', icon: 'Home' },
  { to: '/admin/admin-panel', label: 'Search Doctor', icon: 'Search' },
  // { to: '/create-patient', label: 'Create Patient', icon: 'Add' },
];

export const linksDoctor = [
  { to: '/doctor/doctor-panel', label: 'Home', icon: 'Home' },
  { to: '/doctor/doctor-panel', label: 'Search Patient', icon: 'Search' },
  { to: '/create-patient', label: 'Create Patient', icon: 'Add' },
];

export const rows = [
  { armyNumber: 'ARMY001', doctorName: 'Dr. Alice' },
  { armyNumber: 'ARMY002', doctorName: 'Dr. Bob' },
  { armyNumber: 'ARMY003', doctorName: 'Dr. Charlie' },
  { armyNumber: 'ARMY004', doctorName: 'Dr. Diana' },
  { armyNumber: 'ARMY005', doctorName: 'Dr. Ethan' },
  { armyNumber: 'ARMY006', doctorName: 'Dr. Fiona' },
  { armyNumber: 'ARMY007', doctorName: 'Dr. George' },
  { armyNumber: 'ARMY008', doctorName: 'Dr. Hannah' },
  { armyNumber: 'ARMY009', doctorName: 'Dr. Ian' },
  { armyNumber: 'ARMY010', doctorName: 'Dr. Julia' },
  { armyNumber: 'ARMY011', doctorName: 'Dr. Kyle' },
  { armyNumber: 'ARMY012', doctorName: 'Dr. Laura' },
  { armyNumber: 'ARMY013', doctorName: 'Dr. Mike' },
  { armyNumber: 'ARMY014', doctorName: 'Dr. Nancy' },
  { armyNumber: 'ARMY015', doctorName: 'Dr. Oliver' },
];
