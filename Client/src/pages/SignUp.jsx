import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SignUpSideImage from '../assets/login-side-image.jpg';
import { AccountType } from '../constants';
import useAuth from '../stores/authStore';

export default function SignUp() {
  // const signUpSchema = z
  //   .object({
  //     profession: z.enum([AccountType.Admin, AccountType.Doctor, AccountType.Patient], {
  //       required_error: 'Account type is required',
  //     }),
  //     armyNo: z.string().min(1, 'Army No. is required'),
  //     name: z
  //       .string()
  //       .min(1, 'Name is required')
  //       .max(50, 'Name must be less than 50 characters')
  //       .regex(/^[a-zA-Z\s]*$/, 'Name should only contain letters and spaces'),
  //     dob: z.string().min(1, 'Date of birth is required'),
  //     password: z.string().min(6, 'Password must be at least 6 characters'),
  //     confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  //   })
  //   .refine((data) => data.password === data.confirmPassword, {
  //     message: "Passwords don't match",
  //     path: ['confirmPassword'],
  //   });

  const [showPassword, setShowPassword] = useState(false);
  // const signup = useAuthStore((state) => state.signup);
  // const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(signUpSchema),
  });

  const watchProfession = useWatch({
    control,
    name: 'profession',
    defaultValue: '',
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onError = (error) => {
    console.log(error);
  };

  const { signup } = useAuth();

  const onSubmit = (data) => {
    signup(data, navigate);
  };

  return (
    <div className="flex justify-center items-center w-full h-screen p-0 md:p-4 lg:px-12">
      <div
        className="h-full flex items-center justify-center border border-gray-300 drop-shadow-md relative rounded-md
				 w-full md:w-[80%] p-3 md:m-10 max-w-[1280px]"
      >
        <div
          className="h-full relative flex-1 overflow-hidden rounded-md  flex-col justify-end
					gap-48  p-4 md:p-10 hidden md:flex"
        >
          <img
            src={SignUpSideImage}
            alt="signup page side image"
            className="absolute top-0 left-0 h-full object-cover -z-10 xl:w-full"
          />
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-semibold">Welcome to </h1>
            <h1 className="text-4xl md:text-5xl font-bold">DHARAM</h1>
            <p className="text-sm md:text-base">Defence Health Automated Record Management</p>
          </div>
          <div className="p-2 md:p-5 bg-gray-600  rounded-md">
            <p className="text-white text-xs md:text-sm">
              "In this modern era of military healthcare, an advanced solution is crucial to
              effectively meet the evolving needs of our troops."
            </p>
          </div>
        </div>
        <div className="relative flex-1 flex justify-center items-center h-full">
          <div className="flex flex-col gap-5 justify-center items-start p-8 max-w-md w-full h-full">
            <h1 className="text-4xl font-bold">Get Started</h1>
            <p className="text-lg">Create your account now</p>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full">
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="account-type-label">Account Type</InputLabel>
                <Controller
                  name="profession"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="account-type-label"
                      label="Account Type"
                      error={!!errors.profession}
                    >
                      <MenuItem value={AccountType.Admin}>Admin</MenuItem>
                      <MenuItem value={AccountType.Doctor}>Doctor</MenuItem>
                      <MenuItem value={AccountType.Patient}>Patient</MenuItem>
                    </Select>
                  )}
                />
                {errors.profession && (
                  <span className="text-red-500">{errors.profession.message}</span>
                )}
              </FormControl>
              <FormControl fullWidth margin="normal" size="small">
                <Controller
                  name="armyNo"
                  className="text-base"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      size="small"
                      {...field}
                      label="Army No."
                      variant="outlined"
                      error={!!errors.armyNo}
                      helperText={errors.armyNo ? errors.armyNo.message : ''}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Controller
                  name="fullName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      variant="outlined"
                      size="small"
                      error={!!errors.fullName}
                      helperText={errors.fullName ? errors.fullName.message : ''}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
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
                      size="small"
                      error={!!errors.dob}
                      helperText={errors.dob ? errors.dob.message : ''}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        max: new Date().toISOString().split('T')[0],
                      }}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      variant="outlined"
                      size="small"
                      error={!!errors.password}
                      helperText={errors.password ? errors.password.message : ''}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <Controller
                  name="confirmPassword"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      label="Confirm Password"
                      variant="outlined"
                      size="small"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </FormControl>
              {/* Specialization Field - Render only if the profession is Doctor */}
              {watchProfession === AccountType.Doctor && (
                <FormControl fullWidth margin="normal">
                  <Controller
                    name="specialization"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Specialization"
                        variant="outlined"
                        size="small"
                        error={!!errors.specialization}
                        helperText={errors.specialization ? errors.specialization.message : ''}
                      />
                    )}
                  />
                </FormControl>
              )}
              <Button
                onClick={handleSubmit(onSubmit)}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{
                  backgroundColor: '#EFB034',
                  height: '40px',
                  color: '#ffffff',
                  margin: '8px 0',
                }}
              >
                Sign Up
              </Button>
            </form>
            <p className="text-base w-4/5 text-center mx-auto">
              Already have an account?<a href="/login"> Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useForm } from 'react-hook-form';
// import { TextField, Button } from '@mui/material';

// export default function SignUp() {
//   const { register, handleSubmit } = useForm();
//   const onSubmit = (data) => console.log(data);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <TextField name="firstName" label="First Name" />
//       <Button type="submit">Submit</Button>
//     </form>
//   );
// }
