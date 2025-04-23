import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography'; 

interface DisconnectDeviceDialogProps {
    open: boolean;
    onClose: () => void;
    onDisconnect: () => void;
    userId: string | undefined;
}

const DisconnectDeviceDialog: React.FC<DisconnectDeviceDialogProps> = ({ open, onClose, onDisconnect, userId }) => {
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [disconnectError, setDisconnectError] = useState<string | null>(null);

    const handleDisconnectConfirmed = async () => {
        if (!userId) {
            setDisconnectError("User not authenticated.");
            return;
        }

        setIsDisconnecting(true);
        setDisconnectError(null);

        try {
            const response = await fetch(
                `https://y7wqcp2aol.execute-api.eu-west-2.amazonaws.com/dev/disconnect-device?userId=${userId}`, 
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                let errorMessage = 'Failed to disconnect device.';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    errorMessage = `Failed to disconnect device. Server responded with status: ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            onDisconnect(); // Notify parent component
            onClose();      // Close the dialog

        } catch (error: any) {
            setDisconnectError(error.message || 'An error occurred while disconnecting.');
        } finally {
            setIsDisconnecting(false);
        }
    };

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
                Disconnect Device
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="disconnect-device-dialog-description"
                    sx={{ color: 'var(--text-primary)' }}
                >
                    Are you sure you want to disconnect the currently connected device?
                    {disconnectError && (
                        <Typography variant="body2" color="error">
                            {disconnectError}
                        </Typography>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: '#F28E32' }}>Cancel</Button>
                <Button
                    onClick={handleDisconnectConfirmed}
                    sx={{ color: '#F28E32' }}
                    disabled={isDisconnecting}
                >
                    {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DisconnectDeviceDialog;
