import React, { useState } from 'react';
import LoadoutItem from './LoadoutItem';
import AddNewIcon from '../assets/AddNewIcon.svg';
import Snackbar from '@mui/material/Snackbar';

interface LoadoutMenuProps {
  isConnected: boolean;
}

const LoadoutMenu: React.FC<LoadoutMenuProps> = ({ isConnected }) => {
  const [open, setOpen] = useState(false);
  const [loadouts, setLoadouts] = useState([{ 
    id: 1, 
    active: true,
    name: "Loadout"
  }]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleLoadoutClick = (id: number) => {
    if (!isConnected) {
      setOpen(true);
      return;
    }
    
    setLoadouts(prev => prev.map(loadout => ({
      ...loadout,
      active: loadout.id === id
    })));
  };

  const handleAddLoadout = () => {
    if (!isConnected) {
      setOpen(true);
      return;
    }
    
    const newLoadout = {
      id: Date.now(),
      active: false,
      name: `Loadout ${loadouts.length + 1}`
    };
    
    setLoadouts(prev => [...prev, newLoadout]);
  };

  return (
    <div className="LoadoutMenuContainer">
      <ol>
        {loadouts.map((loadout) => (
          <LoadoutItem 
            key={loadout.id}
            active={loadout.active ? "active" : ""}
            isConnected={isConnected}
            name={loadout.name}
            id={loadout.id.toString()}
            onClick={() => handleLoadoutClick(loadout.id)}
          />
        ))}
      </ol>
      <div 
        className="addNewLoadoutButton" 
        onClick={handleAddLoadout}
      >
        <img src={AddNewIcon} alt="Add new loadout" />
        <h2>ADD NEW LOADOUT</h2>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        onClose={handleClose}
        autoHideDuration={4000}
        message="Please connect your device to access your loadout"
      />
    </div>
  );
};

export default LoadoutMenu;