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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SignUpSideImage from '../assets/login-side-image.jpg';
import { AccountType } from '../constants';

// Zod schema form validation
const signUpSchema = z
  .object({
    profession: z.enum([AccountType.Admin, AccountType.Doctor, AccountType.Patient], {
      required_error: 'Account type is required',
    }),
    name: z
      .string()
      .min(1, 'Name is required')
      .max(50, 'Name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]*$/, 'Name should only contain letters and spaces'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data) => {
    console.log('SignUp data:', data);
    //signup here
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex items-center justify-center border border-gray-300 drop-shadow-md relative rounded-md w-[80%] p-3 m-10 max-w-[1280px]">
        <img
          src={SignUpSideImage}
          alt="signup page side image"
          className="hidden md:block md:w-1/2 lg:w-[40%] object-cover rounded "
        />
        <div
          className="text-white absolute flex flex-col flex-wrap z-10 top-[50%] translate-y-[-50%] left-[0%]
          xl:translate-x-[20%] lg:translate-x-[10%]"
        >
          <h1 className="xl:text-4xl font-bold hidden lg:block lg:text-3xl">Welcome to </h1>
          <h1 className="xl:text-4xl font-bold hidden lg:block lg:text-3xl">DHARAM</h1>
          <p className="text-gray-100 mt-5  md:hidden lg:block lg:text-sm xl:text-base hidden">
            Defence Health Automated Record Management
          </p>
        </div>
        <div className="bg-gray-600 absolute bottom-10 p-4 hidden xl:block rounded-md left-[5%] w-[30%]">
          <p className="text-white">
            "In this modern era of military healthcare, an advanced solution is crucial to
            effectively meet the evolving needs of our troops."
          </p>
        </div>

        <div className="relative flex-1 flex justify-center items-center">
          <div className="flex flex-col gap-8 justify-center items-start p-8 max-w-md w-full">
            <h1 className="text-4xl font-bold">Get Started</h1>
            <p className="text-lg">Create your account now</p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <FormControl fullWidth margin="normal">
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
              <FormControl fullWidth margin="normal">
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      variant="outlined"
                      error={!!errors.name}
                      helperText={errors.name ? errors.name.message : ''}
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{
                  backgroundColor: '#EFB034',
                  height: '56px',
                  color: '#ffffff',
                  margin: '8px 0',
                }}
              >
                Sign Up
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
