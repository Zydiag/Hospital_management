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

import SignUpSideImage from '../assets/login-side-image.jpg';
import { useState } from 'react';
import { AccountType } from '../constants';

export default function SignUp() {
  const [profession, setProfession] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    // Implement your signup logic here
    console.log('SignUp:', { profession, password, confirmPassword });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const handleChange = (event) => {
    setProfession(event.target.value);
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="flex items-center justify-center border border-gray-300 drop-shadow-md relative rounded-md w-[80%] p-3 m-10 max-w-[1280px]">
        <img
          src={SignUpSideImage}
          alt="login page side image"
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Account Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={profession}
                label="Account Type"
                onChange={handleChange}
              >
                <MenuItem value={AccountType.Admin}>Admin</MenuItem>
                <MenuItem value={AccountType.Doctor}>Doctor</MenuItem>
                <MenuItem value={AccountType.Patient}>Patient</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth id="outlined-basic" label="Name" variant="outlined" />
            <TextField
              id="outlined-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSignUp}
              style={{
                backgroundColor: '#EFB034', // Your theme color
                height: '56px', // Match the height of the TextField component
                color: '#ffffff',
              }}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
