import React from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Paper from '@mui/material/Paper';

const CustomTable = ({ headings, rows }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="custom table">
        <TableHead>
          <TableRow>
            {headings.map((heading, index) => (
              <TableCell
                key={index}
                sx={{
                  '&.MuiTableCell-root':{
                    fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                    backgroundColor:'#efb034',
                    fontFamily:'Manrope',
                    fontWeight:'bold'

                  }
                  
                }}
              >
                {heading}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {Object.values(row).map((value, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  component={cellIndex === 0 ? 'th' : undefined}
                  scope={cellIndex === 0 ? 'row' : undefined}
                  align={cellIndex === 0 ? 'left' : 'left'}
                  sx={{
                    fontSize: 'clamp(1rem, 1.2vw, 1.4rem)',
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

