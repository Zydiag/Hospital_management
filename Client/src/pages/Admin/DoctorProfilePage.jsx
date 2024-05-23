import React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import vector from '../../assets/Vector.png'
import '../../styles/StylesP/DoctorProfilePages.css'

function DoctorProfilePage () {
  return (
    <>
      <div className='doctorProfile'>
        <img src={vector}></img>
        <h1>Doctor Profile</h1>
        <form className='doctorProfileForm'>
          <label className='doctorProfileLabel'>Name of the Doctor</label>
          <input  className='doctorProfileInput' value='Mrs Hanuman Singh'></input>
          <label className='doctorProfileLabel'>ARMY NUMBER</label>
          <input  className='doctorProfileInput' value='MQR12681437'></input>
          <label className='doctorProfileLabel'>Age/Service</label>
          <input  className='doctorProfileInput' value='15 YEARS'></input>
          <label className='doctorProfileLabel'>Units/Service/Arms</label>
          <input  className='doctorProfileInput' value='NSDFJ'></input>
          <div className='adminButton'>
            <Stack spacing={2} direction='row'>
              <Button className='editButton' variant='contained'>
                Edit
              </Button>
              <Button className='saveButton' variant='outlined'>
                Save
              </Button>
              <Button href='/admin-panel' className='exitButton' variant='contained'>
                Exit
              </Button>
            </Stack>
          </div>
        </form>
      </div>
    </>
  )
}

export default DoctorProfilePage
