import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

interface LoadoutPageProps {
  id?: string;
}

const LoadoutPage: React.FC<LoadoutPageProps> = ({ }) => {
  const banks = ["BANK A", "BANK B", "BANK C", "BANK D", "BANK E", 
                "BANK F", "BANK G", "BANK H", "BANK I", "BANK J"];
  
  const [loadoutPads, setLoadoutPads] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Load all pad images dynamically in a Vite-compatible way
    const loadImages = async () => {
      const images = await Promise.all(
        Object.values(padImports).map(importer => importer().then(module => module.default))
      );
      setLoadoutPads(images);
    };

    loadImages();
  }, []);

  return (
    <div className="LoadoutPageContainer">
      <Navbar isConnected={false} />
      <h1>
        <Link to="/">
          MY <b>SP</b>CLOUD
        </Link>
        &gt; LOADOUT 1
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
                      <div key={padIndex} className="loadoutPad">
                        <img src={pad} alt={`Loadout Pad ${padIndex + 1}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>Loading pads...</div>
                )}
                <div>
                  <button>Import</button>
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