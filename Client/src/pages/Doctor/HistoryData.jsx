import React from 'react';
import CustomTable from '../../components/CustomTable';

import { rows } from '../../constants';

function HistoryData() {
  return (
    <div>
      <CustomTable headings={rows} rows={rows} />
    </div>
  );
}

export default HistoryData;

