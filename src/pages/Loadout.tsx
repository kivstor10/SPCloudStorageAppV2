import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import React, { useState, useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Pause from '../assets/PauseIcon.svg';
import Play from '../assets/PlayIcon.svg';
import { useAuthenticator } from '@aws-amplify/ui-react'; 

// Create a mapping of all possible pad imports
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
    const { loadoutId: loadoutIdFromRoute } = useParams<{ loadoutId?: string }>(); // Get loadoutId from the route

    const banks = ["BANK A", "BANK B", "BANK C", "BANK D", "BANK E",
        "BANK F", "BANK G", "BANK H", "BANK I", "BANK J"];

    const [loadoutPads, setLoadoutPads] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadoutName, setLoadoutName] = useState<string>("LOADOUT"); // Initial loadout name
    const [loadingName, setLoadingName] = useState(true);
    const [errorName, setErrorName] = useState<string | null>(null);
    const [selectedPadElement, setSelectedPadElement] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        // Load all pad images dynamically
        const loadImages = async () => {
            const images = await Promise.all(
                Object.values(padImports).map(importer => importer().then(module => module.default))
            );
            setLoadoutPads(images);
        };

        loadImages();
    }, []);

    const handlePadSelect = (event: React.MouseEvent<HTMLDivElement>) => {
      const clickedDiv = event.currentTarget;

      if (selectedPadElement) {
          selectedPadElement.classList.remove('selected');
      }

      clickedDiv.classList.add('selected');
      setSelectedPadElement(clickedDiv);
      // console.log("Selected Pad:", clickedDiv);
    };


    useEffect(() => {
      // console.log("userId:", userId);
      // console.log("loadoutIdFromRoute:", loadoutIdFromRoute);
  
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
    
                // Access the loadoutName from the first object in the array
                if (Array.isArray(data) && data.length > 0 && data[0].loadoutName) {
                    setLoadoutName(data[0].loadoutName);
                } else {
                    setLoadoutName("LOADOUT"); // Fallback if data structure is unexpected
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
        // console.log(isPlaying ? "Paused" : "Playing");
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
                                            <div key={padIndex} onClick={ handlePadSelect } className="loadoutPad">
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
                                    <button>Upload</button>
                                    <button>Export</button>
                                    <button>Delete</button>
                                </div>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    );
};

export default LoadoutPage;