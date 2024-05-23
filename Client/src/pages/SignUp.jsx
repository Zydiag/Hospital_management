import React, { useState } from 'react';
import { z } from 'zod';

// Define the validation schema using Zod
const SignUpSchema = z.object({
  role: z.enum(['doctor', 'patient', 'admin']),
  armyNumber: z
    .string()
    .regex(/^[a-zA-Z0-9]{5}$/, {
      message: 'Army Number must be exactly 5 alphanumeric characters',
    }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, { message: 'Password must include at least one lowercase letter' })
    .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must include at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must include at least one special character' }),
});
import '../styles/StylesP/Login.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    role: 'doctor',
    armyNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Validate form data against the schema
      SignUpSchema.parse(formData);
      setErrors({});
      alert('SignUP successful!');
      // Process the validated data
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(Object.fromEntries(error.errors.map((err) => [err.path[0], err.message])));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label>Army Number</label>
        <input
          type="text"
          name="armyNumber"
          value={formData.armyNumber}
          onChange={handleChange}
          placeholder="Enter 16-digit Army Number"
        />
        {errors.armyNumber && <p>{errors.armyNumber}</p>}
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
        />
        {errors.password && <p>{errors.password}</p>}
      </div>
      <button type="submit">SignUP</button>
    </form>
  );
};

export default SignUp;
