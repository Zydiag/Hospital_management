import React from 'react'
import { useState } from 'react'
import Pagination from '../../components/Pagination'
import Navbar from '../../components/Navbar'
import SearchBar from '../../components/SearchBar'
import Dropdown from '../../components/DropDown'
import '../../../public/StylesP/AdminSearchPage.css'
import Row from '../../components/Row'

function AdminSearchPage () {
  const [selectedStatus, setSelectedStatus] = useState('Requested')

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

        <Row
          button1={ButtonStatus[arrayNumber].Button1}
          button2={ButtonStatus[arrayNumber].Button2}
        />
        <Row
          button1={ButtonStatus[arrayNumber].Button1}
          button2={ButtonStatus[arrayNumber].Button2}
        />
        <Row
          button1={ButtonStatus[arrayNumber].Button1}
          button2={ButtonStatus[arrayNumber].Button2}
        />
        <Row
          button1={ButtonStatus[arrayNumber].Button1}
          button2={ButtonStatus[arrayNumber].Button2}
        />
        <Row
          button1={ButtonStatus[arrayNumber].Button1}
          button2={ButtonStatus[arrayNumber].Button2}
        />
      </div>
      <div className='pagination'>
        <Pagination />
      </div>
    </>
  )
}

export default AdminSearchPage
