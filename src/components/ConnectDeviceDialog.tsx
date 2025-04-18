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
}

export default function ConnectDeviceDialog({ open, onClose, onConnect }: ConnectDeviceDialogProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerifying(true);
    // Simulate code verification process
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConnect(code);
    setIsVerifying(false);
    onClose();
    setCode('');
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
            sx: { // Apply custom styles to the Dialog's Paper component
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#F28E32' }}>Cancel</Button>
        <Button 
            type="submit" 
            disabled={isVerifying || code.length !== 6} 
              sx={{
                color: '#F28E32', // Default color
                '&.Mui-disabled': { // Target the disabled state
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