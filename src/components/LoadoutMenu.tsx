import React, { useState, useEffect } from 'react';
import LoadoutItem from './LoadoutItem';
import AddNewIcon from '../assets/AddNewIcon.svg';
import Snackbar from '@mui/material/Snackbar';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface Loadout {
    id: string;
    active: boolean;
    name: string;
}

const LoadoutMenu: React.FC = () => {
    const { user } = useAuthenticator((context) => [context.user]); // Move hook to the top level
    const userId = user?.userId;

    const [open, setOpen] = useState(false);
    const [loadouts, setLoadouts] = useState<Loadout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch loadouts from the API
    const fetchLoadouts = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://c9xg7aqnmf.execute-api.eu-west-2.amazonaws.com/dev/loadouts?userId=${userId}`
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch loadouts: ${response.status}`);
            }
            const data = await response.json();
            console.log("Fetched Loadouts:", data);

            // Transform the API response to match the Loadout interface
            const transformedLoadouts = data.map((item: any) => ({
                id: item.loadoutId,
                active: item.loadoutId === 'default',
                name: item.loadoutName,
            }));
            setLoadouts(transformedLoadouts);
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching loadouts.');
            console.error("Error fetching loadouts:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch loadouts when the component mounts or when userId changes
    useEffect(() => {
        if (userId) {
            fetchLoadouts(userId);
        } else {
            setError("User not authenticated.");
            setLoading(false);
        }
    }, [userId]); // Add userId as a dependency

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleLoadoutClick = (id: string) => {
        setLoadouts(prev => prev.map(loadout => ({
            ...loadout,
            active: loadout.id === id
        })));
    };

    const handleAddLoadout = () => {
        const newLoadout = {
            id: Date.now().toString(),
            active: false,
            name: `Loadout ${loadouts.length + 1}`
        };
        setLoadouts(prev => [...prev, newLoadout]);
    };

    const handleDeleteLoadout = (id: string) => {
        setLoadouts((prevLoadouts) => {
            const updatedLoadouts = prevLoadouts.filter((loadout) => loadout.id !== id);

            if (updatedLoadouts.length > 0 && !updatedLoadouts.some((loadout) => loadout.active)) {
                updatedLoadouts[0].active = true;
            }

            return updatedLoadouts;
        });
    };

    const handleUpload = () => {
        setOpen(true);
    };

    if (loading) {
        return (
            <div className="LoadoutMenuContainer">
                <div>Loading loadouts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="LoadoutMenuContainer">
                <div>Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="LoadoutMenuContainer">
            <ol>
                {loadouts.map((loadout) => (
                    <LoadoutItem
                        key={loadout.id}
                        active={loadout.active ? "active" : ""}
                        name={loadout.name}
                        id={loadout.id}
                        onClick={() => handleLoadoutClick(loadout.id)}
                        onDelete={() => handleDeleteLoadout(loadout.id)}
                    />
                ))}
            </ol>

            <div className="addNewLoadoutButton" onClick={handleAddLoadout}>
                <img src={AddNewIcon} alt="Add new loadout" />
                <h2>ADD NEW LOADOUT</h2>
            </div>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                onClose={handleClose}
                autoHideDuration={2800}
                message="Please connect your device to access your loadout"
            />

            <div className="uploadLoadoutButton">
                <h2 onClick={handleUpload}>UPLOAD NEW LOADOUT</h2>
            </div>
        </div>
    );
};

export default LoadoutMenu;
