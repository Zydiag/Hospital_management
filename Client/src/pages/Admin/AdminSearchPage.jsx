import React from 'react';
import { useState, useEffect, useRef } from 'react';
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
import '../../styles/StylesC/Row.css';
import TextField from '@mui/material/TextField';
import { useDoctorRequestsByStatus } from '../../api/admin.api';
import useAuth from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { calculateAge } from '../../utils/getAge';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function AdminSearchPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [armyNumber, setArmyNumber] = useState(0);
  const [ageService, setAgeService] = useState('');
  const [unitsArms, setUnitsArms] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Requested');

  if (!isAuthenticated) {
    navigate('/login');
  }

  const query = selectedStatus === 'Requested' ? 'PENDING' : 'APPROVED';

  const { data, error, isLoading, isError } = useDoctorRequestsByStatus(query);

  console.log(data);

  //for Modal page---> Profile Page of Doctor
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleRowClick = (doctorName, armyNumber, age, unit, doctorId) => {
    setArmyNumber(armyNumber);
    setDoctorName(doctorName);
    setAgeService(age);
    setUnitsArms(unit);
    setDoctorId(doctorId);
    handleClickOpen();
  };

  //for search input
  const [searchValue, setSearchValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  const [rows, setRows] = useState([]);

  useEffect(() => {
    console.log('data', data);
    if (data) {
      // Update rows state with fetched data
      setRows(
        data.map((item) => ({
          armyNumber: item.armyNo,
          doctorName: item.fullName,
          doctorId: item.doctorId,
          age: calculateAge(item.dob),
          unit: item.unit,
        }))
      );
    }
  }, [data]);

  
  const handleSearch = () => {
    console.log('Search button clicked'); // Debug: Add this line to debug
    if (!searchValue) {
      setErrorMessage('Search Input is empty.');
      setSelectedRow(null); // Clear the selected row if input is empty
      console.log('Error: Input is empty'); // Debug: Add this line to debug
    } else {
      const foundRow = rows.find((row) => row.armyNumber === searchValue);
      if (foundRow) {
        setSelectedRow(foundRow);
        setErrorMessage('');
        console.log('Found row:', foundRow); // Debug: Add this line to debug
      } else {
        setSelectedRow(null); // Clear the selected row if not found
        setErrorMessage('User not found');
        console.log('Error: User not found'); // Debug: Add this line to debug
      }
    }
  };

  const doctorSearchRef = useRef(null);

  useEffect(() => {
    if (selectedRow) {
      doctorSearchRef.current.scrollIntoView({ behavior: 'smooth' });
      // Add the show class after scrolling into view
      setTimeout(() => {
        doctorSearchRef.current.classList.add('show');
      }, 200); // Adjust timeout as needed
    }
  }, [selectedRow]);

  //for status of the DropdownMenu
  const [arrayNumber, setArrayNumber] = useState(0);
  const handleDropdownChange = (event) => {
    setSelectedStatus(event.target.value);

    const statusIndex = status.findIndex((s) => s.value === event.target.value);
    setArrayNumber(statusIndex);
  };

  //for pagination
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const rowPerPage = 2;
  const totalRows = rows?.length;
  const totalPages = Math.ceil(totalRows / rowPerPage);
  const handlePageChange = (newpage) => {
    setCurrentPage(newpage);
  };
  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const currentRows = rows?.slice(indexOfFirstRow, indexOfLastRow);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log(data);

  const status = [
    { value: 'Requested', label: 'Requested' },
    { value: 'Accepted', label: 'Accepted' },
  ];

  const ButtonStatus = [
    { label: 'Requested', Button1: 'View', Button2: 'Accept', Button3: 'Reject' },
    { label: 'Accepted', Button1: 'View', Button2: 'Remove' },
  ];

  return (
    <>
      <Navbar />
      <div className="adminSearchBar">
        <h1>Doctor Search</h1>
        <SearchBar
          handleSearch={handleSearch}
          onChange={handleSearchChange}
          value={searchValue}
          placeholder="Search the doctor by Army Number"
        />
        {errorMessage && <p className="searchError">{errorMessage}</p>}
      </div>
      {selectedRow && (
        <div className="searchRow">
          <p className="SearchPara">Look, What we found?</p>
          <Row
            key={selectedRow.armyNumber}
            armyNumber={selectedRow.armyNumber}
            doctorName={selectedRow.doctorName}
            age={selectedRow.age}
            unit={selectedRow.unit}
            doctorId={selectedRow.doctorId}
            button1={ButtonStatus[arrayNumber].Button1}
            handleClick={handleRowClick}
            button2={ButtonStatus[arrayNumber].Button2}
            button3={ButtonStatus[arrayNumber].Button3}
            status={selectedStatus}
          />
        </div>
      )}
      <div className="doctorStatus">
        <div className="adminDropdown">
          <Dropdown
            style={{ width: ' 80%' }}
            onChange={handleDropdownChange}
            obj={status}
            value={selectedStatus}
            defaultValue={status[0].value}
            label="Status"
            helperText="Select the option"
          />
        </div>

        {currentRows?.map((row) => {
          console.log('row', row);
          return (
            <Row
              key={row.armyNumber}
              armyNumber={row.armyNumber}
              doctorName={row.doctorName}
              age={row.age}
              unit={row.unit}
              doctorId={row.doctorId}
              button1={ButtonStatus[arrayNumber].Button1}
              handleClick={handleRowClick}
              button2={ButtonStatus[arrayNumber].Button2}
              button3={ButtonStatus[arrayNumber].Button3}
              status={selectedStatus}
            />
          );
        })}

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
              maxHeight: '100vh', // Maximum height of the dialog paper element
              width: '100vh', // Adjust width as necessary
              height: '90vh', // Adjust height as necessary
            },
          }}
        >
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
            <form className='doctorForm'>
              <h1
                className='text-3xl font-bold text-center'
                style={{
                  paddingBottom: '5vh',
                  paddingTop: '5vh',
                }}
              >
                Doctor Profile
              </h1>
              <div className='formGroup w-4/5 mx-auto '>
                <label
                  className='text-left font-semibold text-1xl w-full '
                  style={{ fontFamily: 'Manrope', marginBottom: '0.5vh' }}
                >
                  Name of the Doctor
                </label>
                <input
                  className='patientProfileInput text-left font-medium text-sm w-full '
                  placeholder='Name..'
                  style={{ fontFamily: 'Manrope', marginBottom: '0.8vh' }}
                  value={doctorName}
                  InputProps={{
                    readOnly: true,
                  }}
                ></input>
              </div>
              <div className='formGroup w-4/5 mx-auto '>
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
                  value={armyNumber}
                  InputProps={{
                    readOnly: true,
                  }}
                ></input>
              </div>
              <div className='formGroup w-4/5 mx-auto '>
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
                  value={ageService}
                  InputProps={{
                    readOnly: true,
                  }}
                ></input>
              </div>
              <div className='formGroup w-4/5 mx-auto '>
                <label
                  className='text-left font-semibold text-1xl w-full'
                  style={{ fontFamily: 'Manrope', marginBottom: '0.5vh' }}
                >
                  Units/Service/Arms
                </label>
                <input
                  className='patientProfileInput text-left font-medium text-sm w-full'
                  placeholder='Units..'
                  style={{ fontFamily: 'Manrope', marginBottom: '0.8vh' }}
                  value={unitsArms}
                  InputProps={{
                    readOnly: true,
                  }}
                ></input>
              </div>
              <div className='formGroup w-4/5 mx-auto '>
                <label
                  className='text-left font-semibold text-1xl w-full'
                  style={{ fontFamily: 'Manrope', marginBottom: '0.5vh' }}
                >
                  status
                </label>
                <input
                  className='patientProfileInput text-left font-medium text-sm w-full'
                  placeholder='Units..'
                  style={{ fontFamily: 'Manrope', marginBottom: '0.8vh' }}
                  value={selectedStatus}
                  InputProps={{
                    readOnly: true,
                  }}
                ></input>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            {selectedStatus == 'Requested' ? (
              <Button
                variant='contained'
                lassName='modalButton'
                autoFocus
                style={{
                  padding: '5px',
                  width: '15%',
                  backgroundColor: '#fff',
                  color: '#efb034',
                  border: 'solid',
                  borderWidth:'2px',
                  borderColor: '#efb034'
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
                  padding: '5px',
                  width: '15%',
                  backgroundColor: '#fff',
                  color: '#efb034',
                  border: 'solid',
                  borderWidth:'2px',
                  borderColor: '#efb034'
                }}
              >
                Remove
              </Button>
            )}
            {selectedStatus === 'Requested' && (
              <Button
                className='modalButton text-lg'
                autoFocus
                style={{
                  padding: '5px',
                  width: '15%',
                  backgroundColor: '#efb034',
                  color: 'white',
                  border: 'none'
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
