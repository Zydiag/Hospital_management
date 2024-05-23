import React, { useState } from 'react';
import { z } from 'zod';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../styles/StylesP/Login.css';
import loginImg from '../assets/LoginImg.png';

// Define the validation schema using Zod
const loginSchema = z.object({
  role: z.enum(['doctor', 'patient', 'admin']),
  armyNumber: z
    .string()
    .regex(/^[a-zA-Z0-9]{16}$/, 'Army Number must be exactly 16 alphanumeric characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[a-z]/, 'Password must include at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[0-9]/, 'Password must include at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must include at least one special character'),
});

const Login = () => {
  const [formData, setFormData] = useState({
    role: '',
    armyNumber: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear specific field error on change
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      loginSchema.parse(formData);
      setErrors({});
      alert('Login successful!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(Object.fromEntries(error.errors.map((err) => [err.path[0], err.message])));
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login">
      <div className="loginDescription">
        <h1>
          Welcome back to <span>DHRAM</span>
        </h1>
        <p>Defence Health Automated Record Management</p>
        <img src={loginImg} alt="login"></img>
      </div>

      <div className="loginForm">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={Boolean(errors.role)}
            helperText={errors.role}
          >
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="patient">Patient</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <TextField
            type="text"
            name="armyNumber"
            label="Army Number"
            value={formData.armyNumber}
            onChange={handleChange}
            placeholder="Enter 16-digit Army Number"
            margin="normal"
            variant="outlined"
            error={Boolean(errors.armyNumber)}
            helperText={errors.armyNumber}
          />
          <FormControl margin="normal" variant="outlined" error={Boolean(errors.password)}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />

            {errors.password && (
              <p style={{ color: '#d32f2f', fontSize: '0.8rem', fontFamily: 'sans-serif' }}>
                {errors.password}
              </p>
            )}
          </FormControl>
          <Button type="submit" variant="contained">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
