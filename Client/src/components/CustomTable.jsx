import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function CustomTable({ headings, rows }) {
  function createData() {
    return { headings, rows};
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 1000 }} aria-label="custom table" className="w-full">
        <TableHead>
          <TableRow className="bg-amber-400 md:text-2xl text-xl">
            {headings.map((heading, index) => (
              <TableCell className="" key={index}>{heading[0]}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{Object.values(row)[0]}</TableCell>
              <TableCell align="left">{Object.values(row)[1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomTable;