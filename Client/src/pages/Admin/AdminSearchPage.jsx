import React from 'react'
import Navbar from '../../components/Navbar'
import SearchBar from '../../components/SearchBar'
import Dropdown from '../../components/DropDown'
import '../../../public/StylesP/AdminSearchPage.css'
import Row from '../../components/Row'

function AdminSearchPage () {
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

  return (
    <>
      <Navbar />
      <div className='adminSearchBar'>
        <SearchBar />
      </div>
      <div className='doctorStatus'>
        <Dropdown
          obj={status}
          defaultValue={status[0].value}
          label='Status'
          helperText='Select the option'
        />

        <Row />
        <Row />
        <Row />
      </div>
    </>
  )
}

export default AdminSearchPage
