import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const CustomTable = ({ headings, rows }) => {


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='custom table'>
        <TableHead>
          <TableRow>
            {headings.map((heading, index) => (
              <TableCell
                key={index}
                style={{
                  fontSize: '25px',
                  backgroundColor: '#ffc34c',
                  fontFamily: 'Manrope',
                  fontWeight: 'bold',
                }}
              >
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: '2' } }}>
              {Object.values(row).map((value, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  component={cellIndex === 0 ? 'th' : undefined}
                  scope={cellIndex === 0 ? 'row' : undefined}
                  align={cellIndex === 0 ? 'left' : 'left'}
                  style={{
                    fontSize: '20px',
                    fontFamily: 'Manrope',
                    fontWeight: cellIndex === 0 ? 'bold' : 'normal',
                    width: cellIndex === 0 ? '30%' : 'auto',
                  }}
                >
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
