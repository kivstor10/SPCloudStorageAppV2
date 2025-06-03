import React, { useState, useEffect, useCallback } from 'react';
import LoadoutItem from './LoadoutItem';
import AddNewIcon from '../assets/AddNewIcon.svg';
import { useAuthenticator } from '@aws-amplify/ui-react';
import UploadLoadoutButton from './UploadLoadoutButton';
import CircularProgress from '@mui/material/CircularProgress';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { fetchAuthSession } from 'aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';

interface Loadout {
    loadoutId: string;
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

    const API_ENDPOINT = 'https://c9xg7aqnmf.execute-api.eu-west-2.amazonaws.com/dev';

    const getApiKey = async () => {
        const session = await fetchAuthSession({ forceRefresh: true }); 
        if (!session.credentials) {
            throw new Error("AWS credentials not found in session.");
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

    const fetchLoadouts = useCallback(async (currentUserId: string, currentApiKey: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_ENDPOINT}/loadouts?userId=${currentUserId}`, {
                method: 'GET',
                headers: { 'x-api-key': currentApiKey },
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch loadouts: ${response.status}`);
            }
            const data = await response.json();
            const transformedLoadouts = data.map((item: any) => ({
                loadoutId: item.loadoutId,
                active: item.active,
                name: item.loadoutName,
            }));
            setLoadouts(transformedLoadouts);
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching loadouts.');
            console.error("Error fetching loadouts:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialFetch = async () => {
            if (userId) {
                setLoading(true);
                setError(null);
                try {
                    const fetchedApiKey = await getApiKey();
                    setApiKey(fetchedApiKey);
                    await fetchLoadouts(userId, fetchedApiKey);
                } catch (error: any) {
                    console.error("Error in initialFetch:", error);
                    setError(error.message || 'Failed to fetch initial data.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setLoadouts([]);
                setError("User not authenticated.");
            }
        };
        initialFetch();
    }, [userId, fetchLoadouts]);

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
    
    const handleSuccess = () => {
        console.log("Action successful! Refreshing data.");
        if (userId && apiKey) {
            fetchLoadouts(userId, apiKey);
        }
    };

    const handleError = (action: string, error: any) => {
        console.error(`Failed to ${action}:`, error);
        setError(`Error: Could not ${action} the loadout. Please try again.`);
    };

    const handleToggleActive = async (loadoutToToggle: Loadout) => {
        if (!userId || !apiKey) return;

        if (loadoutToToggle.active) {
            console.log("This loadout is already active.");
            return;
        }

        setLoading(true);
        const currentActiveLoadout = loadouts.find(l => l.active);

        try {
            // Deactivate the old active loadout if it exists
            if (currentActiveLoadout) {
                await fetch(`${API_ENDPOINT}/loadouts/${currentActiveLoadout.loadoutId}/active?userId=${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
                    body: JSON.stringify({ active: false }),
                });
            }

            // Activate the new loadout
            await fetch(`${API_ENDPOINT}/loadouts/${loadoutToToggle.loadoutId}/active?userId=${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
                body: JSON.stringify({ active: true }),
            });
            
            // Refresh data to get the final state from the server
            handleSuccess();

        } catch (error: any) {
            handleError('toggle active', error);
            if (userId && apiKey) {
                fetchLoadouts(userId, apiKey);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddLoadout = async () => {
        const newLoadoutName = `Loadout ${loadouts.length + 1}`;
        if (!userId || !apiKey) {
            handleError('create', new Error('User not authenticated or API key is missing.'));
            return;
        }
        setLoading(true);
        const newLoadoutId = uuidv4();
        const defaultLoadoutBody = {
            banks: {
                "A": Array(12).fill({ s3Key: "" }), "B": Array(12).fill({ s3Key: "" }),
                "C": Array(12).fill({ s3Key: "" }), "D": Array(12).fill({ s3Key: "" }),
                "E": Array(12).fill({ s3Key: "" }), "F": Array(12).fill({ s3Key: "" }),
                "G": Array(12).fill({ s3Key: "" }), "H": Array(12).fill({ s3Key: "" }),
                "I": Array(12).fill({ s3Key: "" }), "J": Array(12).fill({ s3Key: "" }),
            },
        };
        // When adding a new loadout, set it as inactive by default.
        const isActive = false;
        try {
            // Do not deactivate any existing loadout, just add a new inactive one
            const url = `${API_ENDPOINT}/loadouts?userId=${userId}&loadoutId=${newLoadoutId}&loadoutName=${encodeURIComponent(newLoadoutName)}&active=${isActive}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
                body: JSON.stringify(defaultLoadoutBody),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create loadout');
            }
            handleSuccess();
        } catch (error: any) {
            handleError('create', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="LoadoutMenuContainer"><div className='circularProgressContainer'><CircularProgress color="inherit" /></div></div>;
    }
    if (error) {
        return <div className="LoadoutMenuContainer"><div>Error: {error}</div></div>;
    }
    return (
        <div className="LoadoutMenuContainer">
            <ol>
                {loadouts.map((loadout) => (
                    <LoadoutItem
                        key={loadout.loadoutId}
                        active={loadout.active}
                        name={loadout.name}
                        userId={userId!}
                        loadoutId={loadout.loadoutId}
                        apiKey={apiKey!}
                        apiEndpoint={API_ENDPOINT}
                        onClick={() => handleToggleActive(loadout)}
                        onToggleActive={() => handleToggleActive(loadout)} 
                        onSuccess={handleSuccess}
                        onError={handleError}
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