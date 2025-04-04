import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
// import Chevron from "../assets/Chevron.svg";
import React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface LoadoutPageProps {
  id?: string;
}

const LoadoutPage: React.FC<LoadoutPageProps> = ({ }) => {
  // const [file, setFile] = React.useState<File | undefined>(undefined);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFile(event.target.files?.[0]);
  // };

  // // const handleClick = () => {
  // //   if (!file) {
  // //     return;
  // //   }
  // //   // upload logic
  // // };

  const banks = ["BANK A", "BANK B", "BANK C", "BANK D", "BANK E", 
                "BANK F", "BANK G", "BANK H", "BANK I", "BANK J"];

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
            backgroundColor: 'var(--background-primary)',
            color: 'var(--text-primary)',
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
              {/* Replace this with your bank content */}
              <Typography>
                This is where you would put the contents of {bank}.
                You can add buttons, sounds, or other components here.
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default LoadoutPage;