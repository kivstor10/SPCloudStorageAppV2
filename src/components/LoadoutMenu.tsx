import React, { useState, useEffect } from 'react';
import LoadoutItem from './LoadoutItem';
import AddNewIcon from '../assets/AddNewIcon.svg';
import { useAuthenticator } from '@aws-amplify/ui-react';
import UploadLoadoutButton from './UploadLoadoutButton';
import CircularProgress from '@mui/material/CircularProgress';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { fetchAuthSession } from 'aws-amplify/auth'; 

interface Loadout {
    id: string;
    active: boolean;
    name: string;
}

const LoadoutMenu: React.FC = () => {
    const { user } = useAuthenticator((context) => [context.user]);
    const userId = user?.userId;

    const [loadouts, setLoadouts] = useState<Loadout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLoadoutName, setSelectedLoadoutName] = useState<string>('NEW LOADOUT');
    const [apiKey, setApiKey] = useState<string | null>(null);

    // Function to fetch API key from Secrets Manager
    const getApiKey = async () => {
        // Fetch the current authentication session which includes AWS credentials
        const session = await fetchAuthSession({ forceRefresh: true }); 

        if (!session.credentials) {
            console.error("AWS credentials not found in session.");
            throw new Error("AWS credentials not found. Ensure the user is properly authenticated and the Cognito Identity Pool is configured to provide credentials.");
        }

        const client = new SecretsManagerClient({
            region: 'eu-west-2',
            credentials: session.credentials 
        });
        const command = new GetSecretValueCommand({ SecretId: 'WebAppApiKey' });

        const response = await client.send(command);

        if (!response.SecretString) {
            throw new Error('SecretString is undefined in Secrets Manager response.');
        }

        const secretValue = JSON.parse(response.SecretString);

        if (!secretValue.WebAppApiKey) { 
            throw new Error('apiKey field is missing in the secret JSON.');
        }
        return secretValue.WebAppApiKey;
    };

    // Function to fetch loadouts from the API
    const fetchLoadouts = async (currentUserId: string, currentApiKey: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `https://c9xg7aqnmf.execute-api.eu-west-2.amazonaws.com/dev/loadouts?userId=${currentUserId}`,
                {
                    method: 'GET',
                    headers: {
                        'x-api-key': currentApiKey,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch loadouts: ${response.status}`);
            }
            const data = await response.json();

            const transformedLoadouts = data.map((item: any) => ({
                id: item.loadoutId,
                active: item.active,
                name: item.loadoutName,
            }));
            setLoadouts(transformedLoadouts);

            const activeLoadout = transformedLoadouts.find((loadout: Loadout) => loadout.active);
            if (activeLoadout) {
                setSelectedLoadoutName(activeLoadout.name.toUpperCase());
            } else if (transformedLoadouts.length > 0) {
                setSelectedLoadoutName(transformedLoadouts[0].name.toUpperCase());
            } else {
                setSelectedLoadoutName('NEW LOADOUT');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching loadouts.');
            console.error("Error fetching loadouts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                setLoading(true); // Set loading true at the beginning of data fetching
                setError(null);
                try {

                    const fetchedApiKey = await getApiKey();
                    setApiKey(fetchedApiKey);
                    await fetchLoadouts(userId, fetchedApiKey);

                } catch (error: any) {
                    console.error("Error in fetchData useEffect:", error);
                    setError(error.message || 'Failed to fetch initial data. Check console for details.');
                    setApiKey(null); // Clear API key on error
                } finally {
                    setLoading(false); // Ensure loading is set to false in all cases
                }
            } else {
                setError("User not authenticated.");
                setLoading(false);
                setLoadouts([]); // Clear loadouts if user is not authenticated
                setApiKey(null);
            }
        };
        fetchData();
    }, [userId]); // Re-run when userId changes

    useEffect(() => {
        const activeLoadout = loadouts.find(loadout => loadout.active);
        if (activeLoadout) {
            setSelectedLoadoutName(activeLoadout.name.toUpperCase());
        } else if (loadouts.length > 0) {
            setSelectedLoadoutName(loadouts[0].name.toUpperCase());
        } else {
            setSelectedLoadoutName('NEW LOADOUT');
        }
    }, [loadouts]);

    const handleLoadoutClick = (id: string) => {
        setLoadouts(prev => prev.map(loadout => ({
            ...loadout,
            active: loadout.id === id
        })));
    };

    const handleAddLoadout = () => {
        const newLoadout = {
            id: Date.now().toString(), // Consider a more robust ID generation for production
            active: loadouts.length === 0, // Make the first added loadout active
            name: `Loadout ${loadouts.length + 1}`
        };
        setLoadouts(prev => {
            const updated = prev.map(p => ({...p, active: false })); // Deactivate others
            return [...updated, {...newLoadout, active: true }];
        });
        setSelectedLoadoutName(newLoadout.name.toUpperCase());
    };

    const handleDeleteLoadout = (id: string) => {
        setLoadouts((prevLoadouts) => {
            const updatedLoadouts = prevLoadouts.filter((loadout) => loadout.id !== id);

            // If the deleted loadout was active and there are other loadouts, make the first one active.
            const deletedLoadoutWasActive = prevLoadouts.find(l => l.id === id)?.active;
            if (deletedLoadoutWasActive && updatedLoadouts.length > 0 && !updatedLoadouts.some((loadout) => loadout.active)) {
                updatedLoadouts[0].active = true;
            }
            return updatedLoadouts;
        });
    };

    if (loading) {
        return (
            <div className="LoadoutMenuContainer">
                <div className='circularProgressContainer'><CircularProgress color="inherit" /></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="LoadoutMenuContainer">
                <div>Error: {error}</div>
                {/* Optionally, provide a retry mechanism */}
            </div>
        );
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

            {apiKey && <UploadLoadoutButton loadoutName={selectedLoadoutName} />}
        </div>
    );
};

export default LoadoutMenu;