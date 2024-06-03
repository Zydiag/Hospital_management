import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import { Dialog, DialogContent, DialogActions, IconButton, TextField, Button } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import '../../styles/StylesP/DoctorSearchPage.css';
import useAuth from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useCreatePatientProfile } from '../../api/doctor.api';
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
  const { isAuthenticated, accessToken } = useAuth();
  const { patient } = usePatientStore();
  console.log('accessToken', accessToken);
  console.log('patient', patient);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { mutateAsync: createPatientProfile } = useCreatePatientProfile();
  const { setPatient } = usePatientStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(patientProfileSchema),
  });

  if (!isAuthenticated) {
    navigate('/login');
  }
  const onInvalid = (errors) => console.error(errors);

  const handleCreatePatient = async (data) => {
    const { name, armyNo, dob, unit } = data;
    const { firstName, middleName, lastName } = splitFullName(name);

    const formData = {
      ...data,
      firstName,
      middleName,
      lastName,
      dob: new Date(dob).toISOString(),
    };
    delete formData.fullName;

    try {
      const patient = await createPatientProfile(formData);
      console.log('patient', formData);
      setPatient(formData);
      reset();
      setOpen(false);
      navigate('/doctor/create-medical-data');
    } catch (error) {
      console.error('Error creating patient profile:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-tertiary py-10 flex flex-col gap-10 justify-center">
        <SearchBar placeholder="Search Patient by Army no." />
        <div className="flex flex-col-reverse justify-center items-center gap-5">
          <p>Couldn't find the user? Create a New patient Record.</p>
          <Button
            variant="contained"
            color="primary"
            className="h-full"
            onClick={() => setOpen(true)}
            style={{
              padding: '8px 32px',
              backgroundColor: '#E99B00',
              color: '#ffffff',
            }}
          >
            Create Patient Profile
          </Button>
        </div>
      </div>

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
    </div>
  );
}

export default PatientSearchPage;
