import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreOptions from '../assets/LoadoutOptions.svg';

interface LoadoutOptionsProps {
  active?: boolean;
}

const LoadoutOptions: React.FC<LoadoutOptionsProps> = ({ active = false }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleDelete = () => {
    console.log("Handle delete...");
    setAnchorEl(null);
  };

  const handleSetActive = () => {
    console.log("Handle setActive...");
    setAnchorEl(null);
  };

  const handleRename = () =>{
    console.log("Handle rename...");
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <img src={MoreOptions} alt="More Options Icon" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleSetActive}>
          {active ? 'Deactivate' : 'Set as active'}
        </MenuItem>
        <MenuItem onClick={handleRename}>Rename</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </div>
  );
};

export default LoadoutOptions;