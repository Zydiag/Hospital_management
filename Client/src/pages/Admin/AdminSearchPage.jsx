import React from 'react'
import { useState } from 'react'
import Pagination from '../../components/Pagination'
import Navbar from '../../components/Navbar'
import SearchBar from '../../components/SearchBar'
import Dropdown from '../../components/DropDown'
import '../../styles/StylesP/AdminSearchPage.css'
import Row from '../../components/Row'

function AdminSearchPage () {

  const [selectedStatus, setSelectedStatus] = useState('Requested');

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
  ];

  

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
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const rowPerPage = 4;
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / rowPerPage)


  const handlePageChange = newpage => {
    setCurrentPage(newpage)
  }

  // Calculate range of rows to display
  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);


  return (
    <>
      <Navbar />
      <div className='adminSearchBar'>
        <SearchBar />
      </div>
      <div className='doctorStatus'>
        <Dropdown
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
            button2={ButtonStatus[arrayNumber].Button2}
          />
        ))}
      </div>
      <div className='adminPagination'>
        <Pagination total={totalPages} onPageChange={handlePageChange} />
      </div>
    </>
  )
}

export default AdminSearchPage
