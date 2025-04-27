import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';

interface UploadLoadoutButtonProps {
    loadoutName: string; // The name of the loadout to be uploaded
}

const UploadLoadoutButton: React.FC<UploadLoadoutButtonProps> = ({ loadoutName }) => {
    const [open, setOpen] = useState(false);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleUpload = () => {
        setOpen(true);
        //  Add your upload logic here. This component is responsible for
        //  displaying the button and the snackbar.  The actual upload
        //  logic (generating pre-signed URLs, sending to MQTT, etc.)
        //  should be handled in the parent component where this button is used.
    };

    return (
        <>
            <div className="uploadLoadoutButton">
                <h2 onClick={handleUpload}>UPLOAD {loadoutName}</h2>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                onClose={handleClose}
                autoHideDuration={2800}
                message="Please connect your device to access your loadout"
            />
        </>
    );
};

export default UploadLoadoutButton;
