import React from 'react';
import { Avatar, IconButton } from '@mui/material';

function stringToColor (string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar (name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

function Profile () {
  const user = { name: 'some name' };

  return (
    <div>
     
      <form className='w-2/3' style={{ height: '70vh', marginTop: '5vh', marginBottom: '5vh' }}>
      <div className='bg-amber-400 w-full' style={{ height: '25vh' }}>
        <IconButton
          size='large'
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
         
        >
          <Avatar
            {...stringAvatar(user?.name || 'User')}
            sx={{ width: 120, height: 120 , marginLeft:'15vw' , marginTop:'17vh'}}
          />
        </IconButton>
      </div>
        <h1
          className='text-3xl font-bold text-left w-1/2 mx-auto'
          style={{
            paddingBottom: '5vh',
            paddingTop: '5vh',
          }}
        >
          My account
        </h1>
        <div className='formGroup w-1/2 text-left mx-auto'>
          <label
            className='text-left font-semibold text-1xl w-full '
            style={{ fontFamily: 'Manrope', marginBottom: '0.5vh' }}
          >
            Name of the User
          </label>
          <input
            className='patientProfileInput text-left font-medium text-sm w-full '
            placeholder='Name..'
            style={{ fontFamily: 'Manrope', marginBottom: '0.8vh' }}
            InputProps={{
              readOnly: true,
            }}
          ></input>
        </div>
        <div className='formGroup w-1/2 text-left mx-auto'>
          <label
            className='text-left font-semibold text-1xl w-full'
            style={{ fontFamily: 'Manrope', marginBottom: '0.5vh' }}
          >
            ARMY NUMBER
          </label>
          <input
            className='patientProfileInput text-left font-medium text-sm w-full'
            placeholder='Army Number..'
            style={{ fontFamily: 'Manrope', marginBottom: '0.8vh' }}
            InputProps={{
              readOnly: true,
            }}
          ></input>
        </div>
        <div className='formGroup w-1/2 text-left mx-auto'>
          <label
            className='text-left font-semibold text-1xl w-full'
            style={{ fontFamily: 'Manrope', marginBottom: '0.5vh' }}
          >
            Age/Service
          </label>
          <input
            className='patientProfileInput text-left font-medium text-sm w-full'
            placeholder='Service..'
            style={{ fontFamily: 'Manrope', marginBottom: '0.8vh' }}
            InputProps={{
              readOnly: true,
            }}
          ></input>
        </div>
        <div className='formGroup w-1/2 text-left mx-auto'>
          <label
            className='text-left font-semibold text-1xl w-full'
            style={{ fontFamily: 'Manrope', marginBottom: '0.5vh' }}
          >
            Date of Birth
          </label>
          <input
            className='patientProfileInput text-left font-medium text-sm w-full'
            placeholder='Units..'
            style={{ fontFamily: 'Manrope', marginBottom: '0.8vh' }}
            InputProps={{
              readOnly: true,
            }}
          ></input>
        </div>
        <div className='formGroup w-1/2 text-left mx-auto'>
          <label
            className='text-left font-semibold text-1xl w-full'
            style={{ fontFamily: 'Manrope', marginBottom: '0.5vh' }}
          >
            Role of the User
          </label>
          <input
            className='patientProfileInput text-left font-medium text-sm w-full'
            placeholder='Units..'
            style={{ fontFamily: 'Manrope', marginBottom: '0.8vh' }}
            InputProps={{
              readOnly: true,
            }}
          ></input>
        </div>
      </form>
    </div>
  );
}

export default Profile;
