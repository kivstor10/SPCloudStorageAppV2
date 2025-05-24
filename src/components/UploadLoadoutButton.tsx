import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface UploadLoadoutButtonProps {
    loadoutName: string; 
    loadoutId?: string;
}

const UploadLoadoutButton: React.FC<UploadLoadoutButtonProps> = ({ loadoutName, loadoutId: propLoadoutId }) => {
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("Please connect your device to access your loadout");
    const { user } = useAuthenticator((context) => [context.user]);
    const userId = user?.userId;
    const generateUrlsApiUrl = "https://406kys45ca.execute-api.eu-west-2.amazonaws.com/dev/generate-urls";
    const [loadoutId, setLoadoutId] = useState<string | undefined>(propLoadoutId);

    // Try to find loadoutId from DOM if not provided
    React.useEffect(() => {
        if (!propLoadoutId) {
            // Try to find an element with class 'active' and a data-loadout-id attribute
            const activeEl = document.querySelector('.active[data-loadout-id]');
            if (activeEl) {
                const id = activeEl.getAttribute('data-loadout-id');
                if (id) setLoadoutId(id);
            }
        } else {
            setLoadoutId(propLoadoutId);
        }
    }, [propLoadoutId]);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleUpload = async () => {
        setOpen(true);
        setSnackbarMessage(`Uploading loadout: ${loadoutName}...`); // Set a loading message

        try {
            if (!userId) {
                setSnackbarMessage("User ID not found. Please sign in.");
                return;
            }
            if (!loadoutId) {
                setSnackbarMessage("Loadout ID not found. Please try again.");
                return;
            }

            // Build URL with query parameters
            const url = `${generateUrlsApiUrl}?userSub=${encodeURIComponent(userId)}&loadoutId=${encodeURIComponent(loadoutId)}`;

            // Call your generate URLs API, passing only userSub and loadoutId as query params
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json(); // Attempt to get error message
                throw new Error(errorData.message || `Failed to upload loadout: ${response.status}`);
            }

            await response.json();
            setSnackbarMessage(`Loadout "${loadoutName}" uploaded successfully!`); // Success message

        } catch (error: any) {
            setSnackbarMessage(`Error uploading loadout: ${error.message || 'Unknown error'}`); // Show error
            console.error("Error uploading loadout:", error);
        }
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
                message={snackbarMessage}
            />
        </>
    );
};

export default UploadLoadoutButton;
