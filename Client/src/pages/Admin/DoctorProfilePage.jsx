import React from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import '../../../public/StylesP/DoctorProfilePages.css'
import vector from '../../assets/Vector.png'


function DoctorProfilePage () {
  return (
    <>
      <div className='doctorProfile'>
        <img src={vector}></img>
        <h1>Doctor Profile</h1>
        <form>
          <label>Name of the Doctor</label>
          <input value='Mrs Hanuman Singh'></input>
          <label>ARMY NUMBER</label>
          <input value='MQR12681437'></input>
          <label>Age/Service</label>
          <input value='15 YEARS'></input>
          <label>Units/Service/Arms</label>
          <input value='NSDFJ'></input>
          <Stack spacing={2} direction='row'>
            <Button variant='contained'>Edit</Button>
            <Button variant='outlined'>Save</Button>
            <Button variant='contained'>Exit</Button>
          </Stack>
        </form>
      </div>
    </>
  )
}

export default DoctorProfilePage
