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
          <div className='adminButton'>
            <Stack spacing={2} direction='row'>
              <Button className='editButton' variant='contained'>
                Edit
              </Button>
              <Button className='saveButton' variant='outlined'>
                Save
              </Button>
              <Button className='exitButton' variant='contained'>
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
