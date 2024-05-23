import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faForward } from '@fortawesome/free-solid-svg-icons'
import { faBackward } from '@fortawesome/free-solid-svg-icons'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

function Pagination ({ total, onPageChange }) {
  const [currentPage, setCurrentpage] = useState(0)

  const handleForward = () => {
    if (currentPage < total) {
      setCurrentpage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  const handleBackward = () => {
    if (currentPage > 1) {
      setCurrentpage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div>
      <ButtonGroup variant='contained' aria-label='Basic button group'>
        <Button onClick={handleBackward} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faBackward} />
        </Button>
        {Array.from({ length: total }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            onClick={() => {
              setCurrentpage(page)
              onPageChange(page)
            }}
            style={{
              backgroundColor: currentPage === page ? '#ffffff' : '#EFB034', // Use theme color codes directly
              color: currentPage === page ? '#EFB034' : 'inherit',
              borderColor: currentPage === page ? '#EFB034' : 'inherit'
            }}
          >
            {page}
          </Button>
        ))}
        <Button onClick={handleForward} disabled={currentPage === total}>
          <FontAwesomeIcon icon={faForward} />
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default Pagination
