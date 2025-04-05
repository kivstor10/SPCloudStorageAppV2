import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import MoreOptions from '../assets/LoadoutOptions.svg';

interface LoadoutOptionsProps {
  active?: boolean;
  onDelete: () => void;
  onRename: () => void;
  onToggleActive: () => void;
}

const LoadoutOptions: React.FC<LoadoutOptionsProps> = ({ 
  active = false, 
  onDelete,
  onRename,
  onToggleActive
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
    handleClose();
  };

  const confirmDelete = () => {
    onDelete();
    setConfirmOpen(false);
  };

  return (
    <div>
      <Button
        id="loadout-options-button"
        aria-controls={open ? 'loadout-options-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ minWidth: 'auto', padding: '8px' }}
      >
        <img src={MoreOptions} alt="More Options" />
      </Button>
      
      <Menu
        id="loadout-options-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { onToggleActive(); handleClose(); }}>
          {active ? 'Deactivate' : 'Set as active'}
        </MenuItem>
        <MenuItem onClick={() => { onRename(); handleClose(); }}>
          Rename
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Delete this loadout permanently?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoadoutOptions;