import React from 'react';
import { useState } from 'react';
import Pagination from '../../components/Pagination';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import Dropdown from '../../components/DropDown';
import '../../styles/StylesP/AdminSearchPage.css';
import Row from '../../components/Row';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function AdminSearchPage () {
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
    { armyNumber: 'ARMY015', doctorName: 'Dr. Oliver' },
  ];

  //for the dropdown box
  const status = [
    {
      value: 'Requested',
      label: 'Requested',
    },
    {
      value: 'Accepted',
      label: 'Accepted',
    },
  ];

  const ButtonStatus = [
    {
      label: 'Requested',
      Button1: 'View',
      Button2: 'Accept',
      Button3: 'Reject',
    },
    {
      label: 'Accepted',
      Button1: 'View',
      Button2: 'Remove',
    },
  ];

  //for Modal page---> Profile Page of Doctor
  const [open, setOpen] = React.useState(false);
  const [doctorName, setDoctorName] = React.useState('');
  const [armyNumber, setArmyNumber] = React.useState(0);
  const [ageService, setAgeService] = React.useState('15 YEARS');
  const [unitsArms, setUnitsArms] = React.useState('NSDFJ');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowClick = armyNumber => {
    setArmyNumber(armyNumber);
    handleClickOpen();
  };

  //for search input
  const [searchValue, setSearchValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    console.log('Search button clicked'); // Add this line to debug
    if (!searchValue) {
      setErrorMessage('Search Input is empty.');
      console.log('Error: Input is empty'); // Add this line to debug
    } else {
      const foundRow = rows.find(row => row.armyNumber === searchValue);
      if (foundRow) {
        setSelectedRow(foundRow);
        setErrorMessage('');
        console.log('Found row:', foundRow); // Add this line to debug
      } else {
        setSelectedRow(null);
        setErrorMessage('User not found');
        console.log('Error: User not found'); // Add this line to debug
      }
    }
  };

  //for status of the DropdownMenu
  const [selectedStatus, setSelectedStatus] = useState('Requested');

  // Declare arrayNumber state variable
  const [arrayNumber, setArrayNumber] = useState(0);

  const handleDropdownChange = event => {
    setSelectedStatus(event.target.value);
    const statusIndex = status.findIndex(s => s.value === event.target.value);
    setArrayNumber(statusIndex);
  };

  //for pagination
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const rowPerPage = 2;
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowPerPage);

  const handlePageChange = newpage => {
    setCurrentPage(newpage);
  };

  // Calculate range of rows to display
  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <>
      <React.Fragment>
        <Navbar />
        <div className='adminSearchBar'>
          <h1>Doctor Search</h1>
          <SearchBar
            handleSearch={handleSearch}
            onChange={handleSearchChange}
            value={searchValue}
            placeholder='Search the doctor by Army Number'
          />
          {errorMessage && <p className='searchError'>{errorMessage}</p>}
        </div>
        {selectedRow && (
          <div className='searchRow'>
            <p className='SearchPara'>Look, What we found?</p>
            <Row
              key={selectedRow.armyNumber}
              armyNumber={selectedRow.armyNumber}
              doctorName={selectedRow.doctorName}
              button1={ButtonStatus[arrayNumber].Button1}
              handleClick={handleRowClick}
              button2={ButtonStatus[arrayNumber].Button2}
              button3={ButtonStatus[arrayNumber].Button3}
              status={selectedStatus}
            />
          </div>
        )}
        <div className='doctorStatus'>
          <div className='adminDropdown'>
            <Dropdown
              style={{ width: ' 80%' }}
              onChange={handleDropdownChange}
              obj={status}
              value={selectedStatus}
              defaultValue={status[0].value}
              label='Status'
              helperText='Select the option'
            />
          </div>

          {currentRows.map(row => (
            <Row
              key={row.armyNumber}
              armyNumber={row.armyNumber}
              doctorName={row.doctorName}
              button1={ButtonStatus[arrayNumber].Button1}
              handleClick={handleRowClick}
              button2={ButtonStatus[arrayNumber].Button2}
              button3={ButtonStatus[arrayNumber].Button3}
              status={selectedStatus}
            />
          ))}

          <div className='adminPagination'>
            <Pagination total={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>

        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby='customized-dialog-title'
          open={open}
          sx={{
            '& .MuiPaper-root': {
              maxWidth: '90%', // Maximum width of the dialog paper element
              maxHeight: '80vh', // Maximum height of the dialog paper element
              width: '40vw', // Adjust width as necessary
              height: '70vh', // Adjust height as necessary
            },
          }}
        >
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            style={{
              fontSize: '30px',
              fontFamily: 'Manrope',
              fontWeight: 'bold',
              marginTop: '20px',
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
              color: theme => theme.palette.grey[500],
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
              marginTop: '20px',
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
                marginTop: '30px',
              }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              id='outlined-basic'
              label='ARMY NUMBER'
              variant='outlined'
              value={armyNumber}
              className='doctorProfileInput'
              sx={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
              InputProps={{
                readOnly: true,
              }}
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
                readOnly: true,
              }}
            />
            <TextField
              id='outlined-basic'
              label='Units/Service/Arms'
              variant='outlined'
              value={unitsArms}
              className='doctorProfileInput'
              sx={{ width: '60%', marginLeft: 'auto', marginRight: 'auto' }}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              id='outlined-basic'
              label='status'
              variant='outlined'
              value={selectedStatus}
              className='doctorProfileStatus'
              sx={{ width: '60%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '30px' }}
              InputProps={{
                readOnly: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            {selectedStatus == 'Requested' ? (
              <Button
                variant='outlined'
                className='modalButton'
                autoFocus
                style={{
                  fontSize: '16px',
                  padding: '7px',
                }}
              >
                Accept
              </Button>
            ) : (
              <Button
                variant='outlined'
                className='modalButton'
                autoFocus
                style={{
                  fontSize: '16px',
                  padding: '7px',
                }}
              >
                Remove
              </Button>
            )}
            {selectedStatus === 'Requested' && (
              <Button
                className='modalButton'
                autoFocus
                variant='outlined'
                color='error'
                style={{
                  fontSize: '16px',
                  padding: '7px',
                }}
              >
                Decline
              </Button>
            )}
          </DialogActions>
        </BootstrapDialog>
      </React.Fragment>
    </>
  );
}

export default AdminSearchPage;
