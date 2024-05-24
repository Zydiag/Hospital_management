import React from 'react'
import { useState } from 'react'
import Pagination from '../../components/Pagination'
import Navbar from '../../components/Navbar'
import SearchBar from '../../components/SearchBar'
import Dropdown from '../../components/DropDown'
import '../../styles/StylesP/AdminSearchPage.css'
import Row from '../../components/Row'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

function AdminSearchPage () {
  //for Modal page---> Profile Page of Doctor
  const [open, setOpen] = React.useState(false)
  const [doctorName, setDoctorName] = React.useState('Mrs Hanuman Singh')
  const [armyNumber, setArmyNumber] = React.useState('MQR12681437')
  const [ageService, setAgeService] = React.useState('15 YEARS')
  const [unitsArms, setUnitsArms] = React.useState('NSDFJ')
  const [isEditing, setIsEditing] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveChanges = () => {
    setIsEditing(false)
    setOpen(false)
    // Perform any actions needed to save the changes (e.g., send data to server)
  }

  const handleClose = () => {
    setIsEditing(false)
    setOpen(false)
  }

  const handleRowClick = (doctorName, armyNumber) => {
    setDoctorName(doctorName)
    setArmyNumber(armyNumber)
    handleClickOpen()
  }

  //for status of the DropdownMenu
  const [selectedStatus, setSelectedStatus] = useState('Requested')

  const rows = [
    { armyNumber: 'ARMY001', doctorName: 'Dr. Alice' },
    { armyNumber: 'ARMY002', doctorName: 'Dr. Bob' },
    { armyNumber: 'ARMY003', doctorName: 'Dr. Charlie' },
    { armyNumber: 'ARMY004', doctorName: 'Dr. Diana' },
    { armyNumber: 'ARMY005', doctorName: 'Dr. Ethan' },
    { armyNumber: 'ARMY006', doctorName: 'Dr. Fiona' },
    { armyNumber: 'ARMY007', doctorName: 'Dr. George' },
    { armyNumber: 'ARMY008', doctorName: 'Dr. Hannah' },
    { armyNumber: 'ARMY009', doctorName: 'Dr. Ian' },
    { armyNumber: 'ARMY010', doctorName: 'Dr. Julia' },
    { armyNumber: 'ARMY011', doctorName: 'Dr. Kyle' },
    { armyNumber: 'ARMY012', doctorName: 'Dr. Laura' },
    { armyNumber: 'ARMY013', doctorName: 'Dr. Mike' },
    { armyNumber: 'ARMY014', doctorName: 'Dr. Nancy' },
    { armyNumber: 'ARMY015', doctorName: 'Dr. Oliver' }
  ]

  const status = [
    {
      value: 'Requested',
      label: 'Requested'
    },
    {
      value: 'Accepted',
      label: 'Accepted'
    },
    {
      value: 'Declined',
      label: 'Declined'
    }
  ]

  const ButtonStatus = [
    {
      label: 'Requested',
      Button1: 'View',
      Button2: 'Accept'
    },
    {
      label: 'Accepted',
      Button1: 'View',
      Button2: 'Block'
    },
    {
      label: 'Declined',
      Button1: 'Review',
      Button2: 'Block'
    }
  ]

  // Declare arrayNumber state variable
  const [arrayNumber, setArrayNumber] = useState(0)

  const handleDropdownChange = event => {
    setSelectedStatus(event.target.value)
    const statusIndex = status.findIndex(s => s.value === event.target.value)
    setArrayNumber(statusIndex)
  }

  //for pagination
  const [currentPage, setCurrentPage] = useState(1) // Current page state
  const rowPerPage = 4
  const totalRows = rows.length
  const totalPages = Math.ceil(totalRows / rowPerPage)

  const handlePageChange = newpage => {
    setCurrentPage(newpage)
  }

  // Calculate range of rows to display
  const indexOfLastRow = currentPage * rowPerPage
  const indexOfFirstRow = indexOfLastRow - rowPerPage
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow)

  return (
    <>
      <React.Fragment>
        <Navbar />
        <div className='adminSearchBar'>
          <SearchBar />
        </div>
        <div className='doctorStatus'>
          <Dropdown
            className='adminDropdown'
            onChange={handleDropdownChange}
            obj={status}
            value={selectedStatus}
            defaultValue={status[0].value}
            label='Status'
            helperText='Select the option'
          />

          {currentRows.map(row => (
            <Row
              key={row.armyNumber}
              armyNumber={row.armyNumber}
              doctorName={row.doctorName}
              button1={ButtonStatus[arrayNumber].Button1}
              handleClick={handleRowClick}
              button2={ButtonStatus[arrayNumber].Button2}
            />
          ))}
        </div>
        <div className='adminPagination'>
          <Pagination total={totalPages} onPageChange={handlePageChange} />
        </div>
        //Modal page
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby='customized-dialog-title'
          open={open}
          sx={{
            '& .MuiPaper-root': {
              maxWidth: '90%', // Maximum width of the dialog paper element
              maxHeight: '80vh', // Maximum height of the dialog paper element
              width: '40vw', // Adjust width as necessary
              height: '70vh' // Adjust height as necessary
            }
          }}
        >
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            style={{
              fontSize: '30px',
              fontFamily: 'Manrope',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
            id='customized-dialog-title'
          >
            Doctor Profile
          </DialogTitle>
          <IconButton
            aria-label='close'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent
            dividers
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              marginTop: '20px'
            }}
          >
            <TextField
              id='outlined-basic'
              label='Name of the Doctor'
              variant='outlined'
              value={doctorName}
              className='doctorProfileInput'
              sx={{
                width: '60%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '30px'
              }}
              InputProps={{
                readOnly: !isEditing
              }}
              onChange={e => setDoctorName(e.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='ARMY NUMBER'
              variant='outlined'
              value={armyNumber}
              className='doctorProfileInput'
              sx={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
              InputProps={{
                readOnly: !isEditing
              }}
              onChange={e => setArmyNumber(e.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='Age/Service'
              variant='outlined'
              value={ageService}
              className='doctorProfileInput'
              sx={{
                width: '60%',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              InputProps={{
                readOnly: !isEditing
              }}
              onChange={e => setAgeService(e.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='Units/Service/Arms'
              variant='outlined'
              value={unitsArms}
              className='doctorProfileInput'
              sx={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
              InputProps={{
                readOnly: !isEditing
              }}
              onChange={e => setUnitsArms(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {!isEditing ? (
              <Button
                style={{
                  fontSize: '16px',
                  padding: '10px'
                }}
              >
                Edit Data
              </Button>
            ) : (
              <Button
                className='modalButton'
                autoFocus
                style={{
                  fontSize: '16px',
                  padding: '10px'
                }}
                onClick={handleSaveChanges}
              >
                Save changes
              </Button>
            )}
          </DialogActions>
        </BootstrapDialog>
      </React.Fragment>
    </>
  )
}

export default AdminSearchPage
