import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    padNumber: number | null;
}

const DisconnectDeviceDialog: React.FC<DeleteDialogProps> = ({ open, onClose, onDelete, padNumber }) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="disconnect-device-dialog-title"
            aria-describedby="disconnect-device-dialog-description"
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: 'var(--background-primary)',
                        color: 'var(--text-primary)',
                    },
                },
            }}
        >
            <DialogTitle id="disconnect-device-dialog-title">
                Delete File
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="disconnect-device-dialog-description"
                    sx={{ color: 'var(--text-primary)' }}
                >
                    Are you sure you want to delete pad {padNumber}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: '#F28E32' }}>Cancel</Button>
                <Button
                    onClick={onDelete}
                    sx={{ color: '#F28E32' }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DisconnectDeviceDialog;
