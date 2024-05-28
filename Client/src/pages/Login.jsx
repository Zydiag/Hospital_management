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
import LoginSideImage from '../assets/login-side-image.jpg';
import { AccountType } from '../constants';

// Zod schema for validation
const loginSchema = z.object({
  profession: z.enum([AccountType.Admin, AccountType.Doctor, AccountType.Patient], {
    required_error: 'Account type is required',
  }),
  armyNo: z
    .string()
    .min(1, 'ArmyNo is required')
    .max(50, 'ArmyNo must be less than 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'ArmyNo should only contain letters and spaces'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log('Login data:', data);
    // Implement your login logic here
  };

  return (
    <div className="flex justify-center items-center w-full h-screen p-0 md:p-4 lg:p-12">
      <div
        className="h-full flex items-center justify-center border border-gray-300 drop-shadow-md relative rounded-md
				 w-full md:w-[80%] p-3 md:m-10 max-w-[1280px]"
      >
        <div
          className="h-full relative flex-1 overflow-hidden rounded-md  flex-col justify-end
					gap-48  p-4 md:p-10 hidden md:flex"
        >
          <img
            src={LoginSideImage}
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
          <div className="flex flex-col gap-8 justify-center items-start p-8 max-w-md w-full h-full">
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
                  name="armyNo"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
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
