// DisconnectDeviceDialog.tsx
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DisconnectDeviceDialogProps {
  open: boolean;
  onClose: () => void;
  onDisconnect: () => void;
}

const DisconnectDeviceDialog: React.FC<DisconnectDeviceDialogProps> = ({ open, onClose, onDisconnect }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="disconnect-device-dialog-title"
      aria-describedby="disconnect-device-dialog-description"
      slotProps={{
        paper: {
          sx: { // Apply custom styles to the Dialog's Paper component
            backgroundColor: 'var(--background-primary)',
            color: 'var(--text-primary)',
          },
        },
      }}
    >
      <DialogTitle id="disconnect-device-dialog-title">
        Disconnect Device
      </DialogTitle>
      <DialogContent>
        <DialogContentText 
            id="disconnect-device-dialog-description"
            sx={{ color: 'var(--text-primary)' }}
        >
          Are you sure you want to disconnect the currently connected device?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}  sx={{ color: '#F28E32' }}>Cancel</Button>
        <Button onClick={onDisconnect}  sx={{ color: '#F28E32' }}>
          Disconnect
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisconnectDeviceDialog;