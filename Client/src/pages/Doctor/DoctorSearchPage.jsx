import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import RowPatient from '../../components/RowPatient';
import { Dialog, DialogContent, DialogActions, IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../../styles/StylesP/DoctorSearchPage.css';

function patientSearchPage() {
  const patientData = [
    { armyNumber: 'ARMY001', patientName: 'Dr. Alice' },
    { armyNumber: 'ARMY002', patientName: 'Dr. Bob' },
    { armyNumber: 'ARMY003', patientName: 'Dr. Charlie' },
    { armyNumber: 'ARMY004', patientName: 'Dr. Diana' },
    { armyNumber: 'ARMY005', patientName: 'Dr. Ethan' },
    { armyNumber: 'ARMY006', patientName: 'Dr. Fiona' },
    { armyNumber: 'ARMY007', patientName: 'Dr. George' },
    { armyNumber: 'ARMY008', patientName: 'Dr. Hannah' },
    { armyNumber: 'ARMY009', patientName: 'Dr. Ian' },
    { armyNumber: 'ARMY010', patientName: 'Dr. Julia' },
    { armyNumber: 'ARMY011', patientName: 'Dr. Kyle' },
    { armyNumber: 'ARMY012', patientName: 'Dr. Laura' },
    { armyNumber: 'ARMY013', patientName: 'Dr. Mike' },
    { armyNumber: 'ARMY014', patientName: 'Dr. Nancy' },
    { armyNumber: 'ARMY015', patientName: 'Dr. Oliver' },
  ];

  //for the search request
  const [searchValuePatient, setSearchValuePatient] = React.useState('');
  const [errorMessagePatient, setErrorMessagePatient] = React.useState('');
  const [selectedRowPatient, setSelectedRowPatient] = useState(null);

  const handleSearchChange = (event) => {
    setSearchValuePatient(event.target.value);
  };

  const handleSearch = () => {
    console.log('Search button clicked'); // Add this line to debug
    if (!searchValuePatient) {
      setErrorMessagePatient('Search Input is empty.');
      console.log('Error: Input is empty'); // Add this line to debug
    } else {
      const foundData = patientData.find((data) => data.armyNumber === searchValuePatient);
      if (foundData) {
        setSelectedRowPatient(foundData);
        setErrorMessagePatient('');
        console.log('Found row:', foundData); // Add this line to debug
      } else {
        setSelectedRowPatient(null);
        setErrorMessagePatient('User not found');
        console.log('Error: User not found'); // Add this line to debug
      }
    }
  };

  const patientSearchRef = useRef(null);

  useEffect(() => {
    if (selectedRowPatient) {
      patientSearchRef.current.scrollIntoView({ behavior: 'smooth' });
      // Add the show class after scrolling into view
      setTimeout(() => {
        patientSearchRef.current.classList.add('show');
      }, 200); // Adjust timeout as needed
    }
  }, [selectedRowPatient]);

  //for Dialog Box

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <React.Fragment>
        <Navbar />
        <div className="bg-tertiary py-10 flex flex-col gap-10 justify-center">
          <SearchBar
            handleSearch={handleSearch}
            onChange={handleSearchChange}
            value={searchValuePatient}
            placeholder="Search Patient by Army no."
          />
          {errorMessagePatient && <p className="searchError">{errorMessagePatient}</p>}
          <div className="flex justify-center items-center gap-5">
            <p>Couldn't find the user? Create a New patient Record.</p>
            <Button
              variant="contained"
              color="primary"
              className="h-full"
              onClick={handleClickOpen}
              style={{
                padding: '8px 32px', // Adjust the padding here
                backgroundColor: '#E99B00',
                color: '#ffffff',
              }}
            >
              Create Patient Profile
            </Button>
          </div>
        </div>
        {selectedRowPatient && (
          <div className="searchRow" id="patientSearch" ref={patientSearchRef}>
            <p className="SearchPara">Look, What we found?</p>
            <RowPatient
              key={selectedRowPatient.armyNumber}
              armyNumber={selectedRowPatient.armyNumber}
              patientName={selectedRowPatient.patientName}
              button1="View Patient History"
              href="/patient-history"
            />
          </div>
        )}

        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          sx={{
            '& .MuiPaper-root': {
              maxWidth: '90%', // Maximum width of the dialog paper element
              maxHeight: '80vh', // Maximum height of the dialog paper element
              width: '40vw', // Adjust width as necessary
              height: '80vh', // Adjust height as necessary
            },
          }}
        >

          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
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
            <form className="patientProfileForm">
              <h1>Create a Patient Profile</h1>
              <div className="formGroup">
                <label className="patientProfileLabel">Name of the Doctor</label>
                <input className="patientProfileInput" placeholder="Name.."></input>
              </div>
              <div className="formGroup">
                <label className="patientProfileLabel">ARMY NUMBER</label>
                <input className="patientProfileInput" placeholder="Army Number.."></input>
              </div>
              <div className="formGroup">
                <label className="patientProfileLabel">Age/Service</label>
                <input className="patientProfileInput" placeholder="Service.."></input>
              </div>
              <div className="formGroup">
                <label className="patientProfileLabel">Units/Service/Arms</label>
                <input className="patientProfileInput" placeholder="Units.."></input>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className="modalButton"
              autoFocus
              style={{
                fontSize: '16px',
                padding: '8px',
                width: '20%',
                backgroundColor: '#efb034',
                color: 'white',
                marginLeft: 'auto',
                marginRight: 'auto',
                border: 'none',
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}

export default patientSearchPage;
