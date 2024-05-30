import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import '../styles/StylesC/Pagination.css';

function Pagination({ total, onPageChange }) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleForward = () => {
    if (currentPage < total) {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  const handleBackward = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPages = () => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <Button
          className="paginationButton"
          key={page}
          onClick={() => handlePageChange(page)}
          style={{
            backgroundColor: currentPage === page ? '#ffffff' : '#EFB034',
            color: currentPage === page ? '#EFB034' : 'inherit',
            borderColor: currentPage === page ? '#EFB034' : 'inherit',
          }}
        >
          {page}
        </Button>
      ));
    }

    const pages = [];

    if (currentPage <= 4) {
      for (let i = 1; i <= 4; i++) {
        pages.push(
          <Button
            className="paginationButton"
            key={i}
            onClick={() => handlePageChange(i)}
            style={{
              backgroundColor: currentPage === i ? '#ffffff' : '#EFB034',
              color: currentPage === i ? '#EFB034' : 'inherit',
              borderColor: currentPage === i ? '#EFB034' : 'inherit',
            }}
          >
            {i}
          </Button>
        );
      }
      pages.push(
        <Button
        className='paginationButton'
          key="dots"
        >
          ...
        </Button>
      );
      pages.push(
        <Button
          className="paginationButton"
          key={total}
          onClick={() => handlePageChange(total)}
          style={{
            backgroundColor: currentPage === total ? '#ffffff' : '#EFB034',
            color: currentPage === total ? '#EFB034' : 'inherit',
            borderColor: currentPage === total ? '#EFB034' : 'inherit',
          }}
        >
          {total}
        </Button>
      );
    } else if (currentPage > total - 4) {
      pages.push(
        <Button
          className="paginationButton"
          key={1}
          onClick={() => handlePageChange(1)}
          style={{
            backgroundColor: currentPage === 1 ? '#ffffff' : '#EFB034',
            color: currentPage === 1 ? '#EFB034' : 'inherit',
            borderColor: currentPage === 1 ? '#EFB034' : 'inherit',
          }}
        >
          1
        </Button>
      );
      pages.push(
        <Button
          className='paginationButton'
          key="dots"
        >
          ...
        </Button>
      );
      for (let i = total - 3; i <= total; i++) {
        pages.push(
          <Button
            className="paginationButton"
            key={i}
            onClick={() => handlePageChange(i)}
            style={{
              backgroundColor: currentPage === i ? '#ffffff' : '#EFB034',
              color: currentPage === i ? '#EFB034' : 'inherit',
              borderColor: currentPage === i ? '#EFB034' : 'inherit',
            }}
          >
            {i}
          </Button>
        );
      }
    } else {
      pages.push(
        <Button
          className="paginationButton"
          key={1}
          onClick={() => handlePageChange(1)}
          style={{
            backgroundColor: currentPage === 1 ? '#ffffff' : '#EFB034',
            color: currentPage === 1 ? '#EFB034' : 'inherit',
            borderColor: currentPage === 1 ? '#EFB034' : 'inherit',
          }}
        >
          1
        </Button>
      );
      pages.push(
        <Button
          style={{
            backgroundColor: '#fff',
            color: '#EFB034',
          }}
          key="dots1"
        >
          ...
        </Button>
      );
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(
          <Button
            className="paginationButton"
            key={i}
            onClick={() => handlePageChange(i)}
            style={{
              backgroundColor: currentPage === i ? '#ffffff' : '#EFB034',
              color: currentPage === i ? '#EFB034' : 'inherit',
              borderColor: currentPage === i ? '#EFB034' : 'inherit',
            }}
          >
            {i}
          </Button>
        );
      }
      pages.push(
        <Button
          style={{
            backgroundColor: '#fff',
            color: '#EFB034',
          }}
          key="dots2"
        >
          ...
        </Button>
      );
      pages.push(
        <Button
          className="paginationButton"
          key={total}
          onClick={() => handlePageChange(total)}
          style={{
            backgroundColor: currentPage === total ? '#ffffff' : '#EFB034',
            color: currentPage === total ? '#EFB034' : 'inherit',
            borderColor: currentPage === total ? '#EFB034' : 'inherit',
          }}
        >
          {total}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button className="paginationButton" onClick={handleBackward} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faBackward} />
        </Button>
        {renderPages()}
        <Button
          className="paginationButton"
          onClick={handleForward}
          disabled={currentPage === total}
        >
          <FontAwesomeIcon icon={faForward} />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default Pagination;