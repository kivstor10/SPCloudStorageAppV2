import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Pause from '../assets/PauseIcon.svg';
import Play from '../assets/PlayIcon.svg';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { uploadData } from "aws-amplify/storage";
import DeleteDialog from "../components/DeleteDialog";
import UploadLoadoutButton from "../components/UploadLoadoutButton";
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

const padImports = {
    pad1: () => import("../assets/1.svg"),
    pad2: () => import("../assets/2.svg"),
    pad3: () => import("../assets/3.svg"),
    pad4: () => import("../assets/4.svg"),
    pad5: () => import("../assets/5.svg"),
    pad6: () => import("../assets/6.svg"),
    pad7: () => import("../assets/7.svg"),
    pad8: () => import("../assets/8.svg"),
    pad9: () => import("../assets/9.svg"),
    pad10: () => import("../assets/10.svg"),
    pad11: () => import("../assets/11.svg"),
    pad12: () => import("../assets/12.svg"),
};

const LoadoutPage: React.FC = ({ }) => {
    const { user } = useAuthenticator((context) => [context.user]);
    const userId = user?.userId;

    console.log("UserId: " + userId);

    const { loadoutId: loadoutIdFromRoute } = useParams<{ loadoutId?: string }>();

    const banks = ["BANK A", "BANK B", "BANK C", "BANK D", "BANK E",
        "BANK F", "BANK G", "BANK H", "BANK I", "BANK J"];

    const [loadoutPads, setLoadoutPads] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadoutName, setLoadoutName] = useState<string>("LOADOUT");
    const [loadingName, setLoadingName] = useState(true);
    const [errorName, setErrorName] = useState<string | null>(null);
    const [selectedPadElement, setSelectedPadElement] = useState<HTMLDivElement | null>(null);
    const [selectedPadNumber, setSelectedPadNumber] = useState<number | null>(null);
    const [selectedBankLetter, setSelectedBankLetter] = useState<string | null>(null);

    const [file, setFile] = useState<File | undefined>();
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [padToDelete, setPadToDelete] = useState<number | null>(null);

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');


    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const loadImages = async () => {
            const images = await Promise.all(
                Object.values(padImports).map(importer => importer().then(module => module.default))
            );
            setLoadoutPads(images);
        };

        loadImages();
    }, []);

    const handlePadSelect = (event: React.MouseEvent<HTMLDivElement>, padNumber: number, bank: string) => {
        const clickedDiv = event.currentTarget;

        if (selectedPadElement) {
            selectedPadElement.classList.remove('selected');
        }

        clickedDiv.classList.add('selected');
        setSelectedPadElement(clickedDiv);
        setSelectedPadNumber(padNumber);
        setSelectedBankLetter(bank.charAt(bank.length - 1)); // Extract the letter from "BANK A"
    };


    useEffect(() => {
        const fetchLoadoutName = async () => {
            if (userId && loadoutIdFromRoute) {
                setLoadingName(true);
                setErrorName(null);
                const apiUrl = `https://c9xg7aqnmf.execute-api.eu-west-2.amazonaws.com/dev/loadouts/${loadoutIdFromRoute}?userId=${userId}`;
                console.log("Fetching loadout name from:", apiUrl);
                try {
                    const response = await fetch(apiUrl);
                    console.log("API Response Status:", response.status);
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Failed to fetch loadout name: ${response.status} - ${errorText}`);
                    }
                    const data = await response.json();
                    console.log("API Response Data:", data);

                    if (Array.isArray(data) && data.length > 0 && data[0].loadoutName) {
                        setLoadoutName(data[0].loadoutName);
                    } else {
                        setLoadoutName("LOADOUT");
                    }

                } catch (err: any) {
                    setErrorName(err.message || 'Failed to load loadout name.');
                    console.error("Error fetching loadout name:", err);
                    setLoadoutName("LOADOUT");
                } finally {
                    setLoadingName(false);
                }
            }
        };

        fetchLoadoutName();
    }, [userId, loadoutIdFromRoute]);

    const handlePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0]);
        setUploadProgress(null);
    };

    const handleClick = async () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleStartDelete = (padNumber: number) => {
        setPadToDelete(padNumber);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        if (padToDelete !== null) {
            setIsUploading(true);
            try {
                setLoadoutPads(prevPads => {
                    const newPads = [...prevPads];
                    newPads.splice(padToDelete - 1, 1);
                    return newPads;
                });
                setIsUploading(false);
                setSnackbarMessage(`Pad ${padToDelete} deleted successfully!`);
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } catch (error: any) {
                console.error("Error deleting file:", error);
                setErrorName("Failed to delete file. Please try again.");
                setSnackbarMessage("Failed to delete file. Please try again.");
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setIsUploading(false);
            } finally {
                setDeleteDialogOpen(false);
                setPadToDelete(null);
            }
        }
    };

    const generateS3Key = useCallback(() => {
        if (selectedBankLetter && selectedPadNumber && loadoutIdFromRoute && userId && file) {
            const padNumberString = String(selectedPadNumber);
            const paddingLength = 7 - padNumberString.length;
            const padding = '0'.repeat(Math.max(0, paddingLength));
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            return `public/${userId}/${loadoutIdFromRoute}/${selectedBankLetter}${padding}${padNumberString}.${fileExtension}`;
        }
        return null;
    }, [selectedBankLetter, selectedPadNumber, loadoutIdFromRoute, userId, file]);

    const performUpload = useCallback(async () => {
        if (file && selectedPadNumber && selectedBankLetter && loadoutIdFromRoute && user) {
            setIsUploading(true);
            const s3Key = generateS3Key();
            if (s3Key) {
                try {
                    const result = await uploadData({
                        key: s3Key,
                        data: file,
                        options: {
                            onProgress: ({ transferredBytes, totalBytes }) => {
                                if (totalBytes) {
                                    const progress = Math.round((transferredBytes / totalBytes) * 100);
                                    console.log(`Upload progress ${progress} %`);
                                    setUploadProgress(progress);
                                }
                            },
                            bucket: 'SPCloudBucket',
                        },
                    }).result;
                    console.log("Upload result", result);
                    setIsUploading(false);
                    setSnackbarMessage("File uploaded successfully!");
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                } catch (error: any) {
                    console.error("Error uploading file:", error);
                    setSnackbarMessage("Failed to upload file. Please try again.");
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    setIsUploading(false);
                } finally {
                    setFile(undefined);
                }
            } else {
                console.warn("Could not generate S3 key. Missing bank, pad number, or loadout ID.");
                setSnackbarMessage("Could not generate S3 key. Check selection.");
                setSnackbarSeverity('warning');
                setSnackbarOpen(true);
                setIsUploading(false);
            }
        }
    }, [file, selectedPadNumber, selectedBankLetter, loadoutIdFromRoute, user, generateS3Key]);


    useEffect(() => {
        if (file && selectedPadNumber && selectedBankLetter && loadoutIdFromRoute && user) {
            performUpload();
        }
    }, [performUpload, file, selectedPadNumber, selectedBankLetter, loadoutIdFromRoute, user]);

    // State to hold the loadout name.
      const [currentLoadoutName, setCurrentLoadoutName] = useState<string>('LOADOUT');

    // Effect to update the loadout name.
    useEffect(() => {
        const fetchLoadoutName = async () => {
            if (userId && loadoutIdFromRoute) {
                setLoadingName(true);
                setErrorName(null);
                const apiUrl = `https://c9xg7aqnmf.execute-api.eu-west-2.amazonaws.com/dev/loadouts/${loadoutIdFromRoute}?userId=${userId}`;
                console.log("Fetching loadout name from:", apiUrl);
                try {
                    const response = await fetch(apiUrl);
                    console.log("API Response Status:", response.status);
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Failed to fetch loadout name: ${response.status} - ${errorText}`);
                    }
                    const data = await response.json();
                    console.log("API Response Data:", data);

                    if (Array.isArray(data) && data.length > 0 && data[0].loadoutName) {
                        setCurrentLoadoutName(data[0].loadoutName); // Set the state
                        setLoadoutName(data[0].loadoutName);
                    } else {
                        setCurrentLoadoutName("LOADOUT");
                        setLoadoutName("LOADOUT");
                    }

                } catch (err: any) {
                    setErrorName(err.message || 'Failed to load loadout name.');
                    console.error("Error fetching loadout name:", err);
                    setCurrentLoadoutName("LOADOUT");
                    setLoadoutName("LOADOUT");
                } finally {
                    setLoadingName(false);
                }
            }
        };

        fetchLoadoutName();
    }, [userId, loadoutIdFromRoute]);


    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div className="LoadoutPageContainer">
            <Navbar />
            <h1>
                <Link to="/">
                    MY <b>SP</b>CLOUD
                </Link>
                &nbsp;
                &gt;
                &nbsp;
                {loadingName ? "Loading..." : errorName ? "Error Loading Name" : loadoutName.toUpperCase()}
            </h1>
            <div className="ViewLoadout">
                {banks.map((bank, index) => (
                    <Accordion
                        key={index}
                        sx={{
                            backgroundColor: '#DECFC2',
                            color: '#231F20',
                            marginBottom: '8px',
                            borderRadius: '4px',
                            '&:before': { display: 'none' },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                        >
                            <Typography component="span">{bank}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="div">
                                {loadoutPads.length > 0 ? (
                                    <div className="loadoutPadsContainer">
                                        {loadoutPads.map((pad, padIndex) => (
                                            <div
                                                key={padIndex}
                                                onClick={(e) => handlePadSelect(e, padIndex + 1, bank)}
                                                className="loadoutPad"
                                            >
                                                <img src={pad} alt={`Loadout Pad ${padIndex + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>Loading pads...</div>
                                )}
                                <div>
                                    <button onClick={handlePlay}>
                                        <img src={isPlaying ? Pause : Play} alt={isPlaying ? "Pause" : "Play"} />
                                    </button>
                                    <input
                                        type="file"
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                        ref={fileInputRef}
                                        accept=".wav,.mp3"
                                    />
                                    <button onClick={handleClick} disabled={isUploading || !selectedPadNumber || !selectedBankLetter}>
                                        {isUploading ? 'Uploading...' : 'Upload'}
                                    </button>
                                    <button onClick={() => {
                                        if (selectedPadNumber !== null) {
                                            handleStartDelete(selectedPadNumber);
                                        }
                                    }}>Delete</button>
                                    <button>Export</button>
                                </div>
                                {uploadProgress !== null && (
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 12 }}>
                                        <div style={{ width: '100%', textAlign: 'center', background: '#f5f5f5', borderRadius: 4, padding: 8 }}>
                                            Upload Progress: {uploadProgress}%
                                        </div>
                                    </div>
                                )}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
            <DeleteDialog
                open={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setPadToDelete(null);
                }}
                onDelete={handleDeleteConfirmed}
                padNumber={padToDelete}
            />
            <UploadLoadoutButton loadoutName={currentLoadoutName} loadoutId={loadoutIdFromRoute} />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarSeverity} 
                    sx={{
                        width: '100%',
                        backgroundColor: 'var(--background-primary)',
                        color: 'var(--text-primary)',
                        '.MuiAlert-icon': {
                            color: 'var(--text-primary)',
                        }
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default LoadoutPage;
