import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/Navbar';
import RowPatient from '../../components/RowPatient';
import SearchBar from '../../components/SearchBar';
import { AccountType } from '../../constants';
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  FormControl,
  dividerClasses,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../../styles/StylesP/DoctorSearchPage.css';
import useAuth from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import {
  getPersonalInfoApi,
  useCreatePatientProfile,
  useGetPersonalInfo,
} from '../../api/doctor.api';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { splitFullName } from '../../api/signUpService';
import { usePatientStore } from '../../stores/patientStore';

const patientProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name should only contain letters and spaces'),
  armyNo: z.string().min(1, { message: 'Army Number is required' }),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
  unit: z.string().min(1, { message: 'Unit is required' }),
});

function PatientSearchPage() {
  const { isAuthenticated, user, accessToken } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || (user && user.role !== 'DOCTOR') || !user) {
      // console.log('go back you need to login');
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate]);

  const [open, setOpen] = useState(false);
  const { mutateAsync: createPatientProfile } = useCreatePatientProfile();
  const { patient, setPatient } = usePatientStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(patientProfileSchema),
  });

  // if (!isAuthenticated) {
  //   navigate('/login');
  // }
  const onInvalid = (errors) => console.error(errors);

  const handleCreatePatient = async (data) => {
    const { name, armyNo, dob, unit } = data;
    // const { firstName, middleName, lastName } = splitFullName(name);

    const formData = {
      ...data,
      fullname: name,
      dob: new Date(dob).toISOString(),
    };

    try {
      const patient = await createPatientProfile(formData);
      setPatient(formData);
      reset();
      setOpen(false);
      navigate('/doctor/patient-record');
    } catch (error) {
      console.error('Error creating patient profile:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const accountType = AccountType.Doctor;

  // const patientData = [
  //   { armyNumber: 'ARMY001', patientName: 'Dr. Alice' },
  //   { armyNumber: 'ARMY002', patientName: 'Dr. Bob' },
  //   { armyNumber: 'ARMY003', patientName: 'Dr. Charlie' },
  // ];

  const [searchValuePatient, setSearchValuePatient] = useState('');
  const [errorMessagePatient, setErrorMessagePatient] = useState('');
  const [selectedRowPatient, setSelectedRowPatient] = useState(null);

  const handleSearchChange = (event) => {
    setSearchValuePatient(event.target.value);
  };

  // const { data, isLoading, isError, error } = useGetPersonalInfo(searchValuePatient);
  // console.log('data', data);
  // console.log('isError', isError);
  // console.log('error', error);
  // useEffect(() => {
  //   // setErrorMessagePatient('');
  // }, [searchValuePatient]);
  const { makeAuthRequest } = useAuth();
  // const {patient, setPatient} = usePatientStore();

  const handleSearch = async () => {
    setSearchValuePatient('');
    if (!searchValuePatient) {
      setErrorMessagePatient('Search Input is empty.');
      // console.log('Error: Input is empty'); // Add this line to debug
    } else {
      const data = await getPersonalInfoApi(makeAuthRequest, searchValuePatient);
      setPatient(data);
      if (data) {
        setSelectedRowPatient(data);
        setErrorMessagePatient('');
      } else {
        setSelectedRowPatient(null);
        setErrorMessagePatient('User not found');
      }
    }
  };
  const patientSearchRef = useRef(null);
  useEffect(() => {
    if (selectedRowPatient) {
      patientSearchRef.current.scrollIntoView({ behavior: 'smooth' });
      // Add the show class after scrolling into view
      setTimeout(() => {
        patientSearchRef.current.classList.add('show');
      }, 200); // Adjust timeout as needed
    }
  }, [selectedRowPatient]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <Navbar accountType={accountType} />
          <div
            className="bg-tertiary py-10 flex flex-col gap-10 justify-center "
            style={{ height: '50vh' }}
          >
            <SearchBar
              placeholder="Search Patient by Army no."
              handleSearch={handleSearch}
              onChange={handleSearchChange}
              value={searchValuePatient}
            />
            {errorMessagePatient && <p className="searchError">{errorMessagePatient}</p>}
            <div className="flex flex-col-reverse justify-center items-center gap-5">
              <p className="md:text-lg text-base">
                Couldn't find the user? Create a New patient Record.
              </p>
              <Button
                variant="contained"
                color="primary"
                className="h-full md:text-2xl text-xl"
                onClick={() => setOpen(true)}
                style={{
                  padding: '15px 32px',
                  backgroundColor: '#E99B00',
                  color: '#ffffff',
                }}
              >
                Create Patient Profile
              </Button>
            </div>
          </div>

          {selectedRowPatient && (
            <div className="searchRow" id="patientSearch" ref={patientSearchRef}>
              <p
                className="text-left text-3xl font-semibold searchPara"
                style={{
                  width: '85%',
                  marginLeft: '8vw',
                  paddingBottom: '3vh',
                  paddingTop: '8vh',
                }}
              >
                Look, What we found?
              </p>
              <RowPatient
                key={selectedRowPatient.armyNo}
                armyNumber={selectedRowPatient.armyNo}
                patientName={selectedRowPatient.fullname}
                button1="View Patient History"
                handleClick={() => navigate('/doctor/patient-record')}
                sx={{
                  '& .MuiPaper-root': {
                    maxWidth: '90%', // Maximum width of the dialog paper element
                    maxHeight: '80vh', // Maximum height of the dialog paper element
                    width: '40vw', // Adjust width as necessary
                    height: '80vh', // Adjust height as necessary
                    // width: '100vh', // Adjust width as necessary
                    // height: '80%', // Adjust height as necessary
                  },
                }}
              />
            </div>
          )}

          <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{
              '& .MuiPaper-root': {
                maxWidth: '90%',
                maxHeight: '80vh',
                width: '100vh',
                height: '80%',
              },
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent
              dividers
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                marginTop: '20px',
              }}
            >
              <form
                className="flex flex-col justify-between h-full"
                onSubmit={handleSubmit(handleCreatePatient, onInvalid)}
              >
                <div className="flex flex-col gap-5">
                  <h1 className="text-3xl">Create a Patient Profile</h1>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Full Name"
                        variant="outlined"
                        error={!!errors.doctorName}
                        helperText={errors.doctorName ? errors.doctorName.message : ''}
                        fullWidth
                        margin="normal"
                      />
                    )}
                  />
                  <Controller
                    name="armyNo"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Army Number"
                        variant="outlined"
                        error={!!errors.armyNumber}
                        helperText={errors.armyNumber ? errors.armyNumber.message : ''}
                        fullWidth
                        margin="normal"
                      />
                    )}
                  />
                  <Controller
                    name="dob"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Date of Birth"
                        type="date"
                        variant="outlined"
                        error={!!errors.dob}
                        helperText={errors.dob ? errors.dob.message : ''}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        margin="normal"
                        inputProps={{ max: new Date().toISOString().split('T')[0] }}
                      />
                    )}
                  />
                  <Controller
                    name="unit"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Units"
                        variant="outlined"
                        error={!!errors.units}
                        helperText={errors.units ? errors.units.message : ''}
                        fullWidth
                        margin="normal"
                      />
                    )}
                  />
                </div>
                <DialogActions>
                  <Button
                    type="submit"
                    variant="outlined"
                    className="modalButton text-lg"
                    onClick={handleSubmit(handleCreatePatient, onInvalid)}
                    autoFocus
                    style={{
                      padding: '8px',
                      width: '20%',
                      backgroundColor: '#efb034',
                      color: 'white',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      border: 'none',
                    }}
                  >
                    Create
                  </Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default PatientSearchPage;
