import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MoreOptions from '../assets/LoadoutOptions.svg';

interface LoadoutOptionsProps {
  userId: string;
  loadoutId: string;
  loadoutName: string;
  active: boolean;
  apiKey: string;
  apiEndpoint: string;
  onSuccess: () => void;
  onError: (action: string, error: any) => void;
  onToggleActive: () => void;
}

const LoadoutOptions: React.FC<LoadoutOptionsProps> = ({
  userId,
  loadoutId,
  loadoutName,
  active,
  apiKey,
  apiEndpoint,
  onSuccess,
  onError,
  onToggleActive,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isRenameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newLoadoutName, setNewLoadoutName] = useState(loadoutName);
  const [isLoading, setIsLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Handlers to open dialogs or trigger parent functions
  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    handleCloseMenu();
  };

  const handleRenameClick = () => {
    setNewLoadoutName(loadoutName);
    setRenameDialogOpen(true);
    handleCloseMenu();
  };

  const handleToggleClick = () => {
    onToggleActive();
    handleCloseMenu();
  };

  // API call for DELETING a loadout
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}/loadouts/${loadoutId}?userId=${userId}`, {
        method: 'DELETE',
        headers: { 'x-api-key': apiKey }
      });
      if (!response.ok) {
        throw new Error('Failed to delete loadout');
      }
      onSuccess();
    } catch (error) {
      onError('delete', error);
    } finally {
      setIsLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  // API call for RENAMING a loadout
  const handleRenameSubmit = async () => {
    if (!newLoadoutName || newLoadoutName === loadoutName) {
      setRenameDialogOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}/loadouts/${loadoutId}?userId=${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({ newLoadoutName: newLoadoutName }),
      });
      if (!response.ok) {
        throw new Error('Failed to rename loadout');
      }
      onSuccess();
    } catch (error) {
      onError('rename', error);
    } finally {
      setIsLoading(false);
      setRenameDialogOpen(false);
    }
  };

  return (
    <div>
      <Button
        id="loadout-options-button"
        onClick={handleClick}
        disabled={isLoading}
        sx={{ minWidth: 'auto', padding: 0 }}
      >
        <img src={MoreOptions} alt="More Options" />
      </Button>
      
      <Menu
        id="loadout-options-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
      >
        {/* Remove Deactivate option: only allow activating if not already active */}
        {!active && (
          <MenuItem onClick={handleToggleClick} disabled={isLoading}>
            Set as active
          </MenuItem>
        )}
        <MenuItem onClick={handleRenameClick} disabled={isLoading}>
          Rename
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }} disabled={isLoading}>
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete this loadout permanently?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={isLoading}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Rename Dialog */}
      <Dialog
        open={isRenameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
      >
        <DialogTitle>Rename Loadout</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Loadout Name"
            type="text"
            fullWidth
            variant="standard"
            value={newLoadoutName}
            onChange={(e) => setNewLoadoutName(e.target.value)}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleRenameSubmit} disabled={isLoading}>
            {isLoading ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LoadoutOptions;