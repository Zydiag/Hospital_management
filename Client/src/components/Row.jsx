import React from 'react';
import '../styles/StylesC/Row.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useApproveRequest, useBlockRequest, useRejectRequest } from '../api/admin.api';

function Row({
  button1,
  button2,
  button3,
  doctorName,
  doctorId,
  armyNumber,
  age = '',
  unit = '',
  handleClick,
  status,
  disabled,
  href,
}) {
  const approveRequestMutation = useApproveRequest();
  const rejectRequestMutation = useRejectRequest();
  const blockRequestMutation = useBlockRequest();

  const [message, setMessage] = React.useState({ type: '', text: '' });

  const handleApprove = () => {
    approveRequestMutation.mutate(doctorId, {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Request approved successfully!' });
      },
      onError: (error) => {
        setMessage({ type: 'error', text: `Failed to approve request: ${error.message}` });
      },
    });
  };

  const handleReject = () => {
    setMessage({ type: '', text: '' }); // Clear previous message
    rejectRequestMutation.mutate(doctorId, {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Request rejected successfully!' });
      },
      onError: (error) => {
        setMessage({ type: 'error', text: `Failed to reject request: ${error.message}` });
      },
    });
  };

  const handleBlock = () => {
    blockRequestMutation.mutate(doctorId, {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Request approved successfully!' });
      },
      onError: (error) => {
        setMessage({ type: 'error', text: `Failed to approve request: ${error.message}` });
      },
    });
  };

  return (
    <div className="row">
      <p className="doctor text-lg text-center font-medium" style={{ marginLeft: '3vw' }}>
        {doctorName}
      </p>
      <p className="armyNumber text-lg text-center font-medium" style={{ fontFamily: 'Manrope' }}>
        {armyNumber}
      </p>
      <div className="rowButton">
        <Stack spacing={2} direction="row">
          <Button
            onClick={() => handleClick(doctorName, armyNumber, age, unit)}
            className="button1"
            variant="contained"
          >
            {button1}
          </Button>
          <Button
            className="button2"
            onClick={status === 'Requested' ? handleApprove : handleBlock}
            variant="outlined"
            disabled={disabled || approveRequestMutation.isLoading}
            href={href}
          >
            {button2}
          </Button>
          {status === 'Requested' && (
            <Button
              className="button3"
              variant="outlined"
              onClick={handleReject}
              disabled={rejectRequestMutation.isLoading}
            >
              {button3}
            </Button>
          )}
        </Stack>
      </div>
    </div>
  );
}

export default Row;
