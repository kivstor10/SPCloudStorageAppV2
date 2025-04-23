import React, { useState } from 'react';
import LoadoutItem from './LoadoutItem';
import AddNewIcon from '../assets/AddNewIcon.svg';
import Snackbar from '@mui/material/Snackbar';



interface Loadout {
  id: number;
  active: boolean;
  name: string;
}

const LoadoutMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loadouts, setLoadouts] = useState<Loadout[]>([{ 
    id: 1, 
    active: true,
    name: "Loadout"
  }]);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleLoadoutClick = (id: number) => {
    setLoadouts(prev => prev.map(loadout => ({
      ...loadout,
      active: loadout.id === id
    })));
  };

  const handleAddLoadout = () => {
    const newLoadout = {
      id: Date.now(),
      active: false,
      name: `Loadout ${loadouts.length + 1}`
    };
    setLoadouts(prev => [...prev, newLoadout]);
  };

  const handleDeleteLoadout = (id: number) => {
    setLoadouts(prev => {
      const newLoadouts = prev.filter(loadout => loadout.id !== id);
      // Ensure at least one loadout remains active
      if (newLoadouts.length > 0 && !newLoadouts.some(l => l.active)) {
        newLoadouts[0].active = true;
      }
      return newLoadouts;
    });
  };

  const handleUpload = () => {

    // Handle upload logic here   
  };

  return (
    <div className="LoadoutMenuContainer">
      <ol>
        {loadouts.map((loadout) => (
          <LoadoutItem 
            key={loadout.id}
            active={loadout.active ? "active" : ""}
            name={loadout.name}
            id={loadout.id.toString()}
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