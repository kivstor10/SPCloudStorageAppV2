import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';


interface ConnectDeviceDialogProps {
  open: boolean;
  onClose: () => void;
  onConnect: (code: string) => void;
  userId: string | undefined | null; 
}

export default function ConnectDeviceDialog({ open, onClose, onConnect, userId }: ConnectDeviceDialogProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerifying(true);
    setVerificationError(null);

    const apiUrl = 'https://q88recf690.execute-api.eu-west-2.amazonaws.com/dev';

    console.log('Code on submit:', code); 
    console.log('User ID:', userId); 

    try {
      const response = await fetch(`${apiUrl}/verify-reg-code?regCode=${code.toUpperCase()}&userId=${userId}`);
      const data = await response.json();

      if (response.ok && data && data.deviceId) {
        onConnect(data.deviceId); 
        onClose();
        setCode('');
      } else {
        setVerificationError(data?.error || 'Invalid registration code.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationError('Failed to verify registration code.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value.toUpperCase());
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
          sx: { 
            backgroundColor: 'var(--background-primary)',
            color: 'var(--text-primary)',
          },
        },
      }}
    >
      <DialogTitle>Connect Device</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: 'var(--text-primary)' }}>
          Please enter the 6-character alphanumeric code displayed on your device screen.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="device-code"
          name="deviceCode"
          label="Device Code"
          type="text"
          fullWidth
          variant="standard"
          slotProps={{ htmlInput: { maxLength: 6 } }}
          value={code}
          onChange={handleInputChange}
          sx={{
            '& label': {
              color: '#dbdbdb',
            },
            '& input': {
              color: 'var(--text-primary)',
            },
            '& .MuiInput-underline:before': {
              borderColor: '#dbdbdb',
            },
            '& .MuiInput-underline:after': {
              borderColor: 'var(--text-primary)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#F28E32',
            },
          }}
        />
        {verificationError && <div style={{ color: 'red', marginTop: '10px' }}>{verificationError}</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#F28E32' }}>Cancel</Button>
        <Button
          type="submit"
          disabled={isVerifying || code.length !== 6}
          sx={{
            color: '#F28E32', 
            '&.Mui-disabled': { 
              color: '#A46122',
            },
          }}
        >
          {isVerifying ? <span style={{ color: '#F28E32' }}>Verifying...</span> : 'Connect'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}