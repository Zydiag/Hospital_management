import React from 'react';
import CustomTable from '../../components/CustomTable'; // Adjust the import path as necessary
import '../../styles/StylesP/HistoryData.css';
import { Button } from '@mui/material';
import Navbar from '../../components/Navbar';

import { rows } from '../../constants';

function HistoryData() {
  return (
    <div>
      <CustomTable headings={rows} rows={rows} />
    </div>
  );
}

export default HistoryData;

