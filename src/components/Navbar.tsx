import React, { useState } from 'react';
import DeviceConnected from '../assets/DeviceConnected.svg';
import DeviceDisconnected from '../assets/DeviceDisconnected.svg';
import Switch from '@mui/material/Switch';
import DefaultUserIcon from '../assets/DefaultUserIcon.svg';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { signOut } from 'aws-amplify/auth';
import { useTheme } from '../contexts/ThemeContext';
import ConnectDeviceDialog from '../components/ConnectDeviceDialog'; // Import the connect dialog
import DisconnectDeviceDialog from '../components/DisconnectDeviceDialog'; // Import the disconnect dialog

interface NavBarProps {
  isConnected: boolean;
  setIsConnected?: React.Dispatch<React.SetStateAction<boolean>>;
  onDeviceConnect?: (code: string) => void;
  onDeviceDisconnect?: () => void; // Optional callback for device disconnection
}

const Navbar: React.FC<NavBarProps> = ({ isConnected, setIsConnected, onDeviceConnect, onDeviceDisconnect }) => {
  const { isDark, toggleTheme } = useTheme();
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);

  const handleOpenConnectDialog = () => {
    setIsConnectDialogOpen(true);
  };

  const handleCloseConnectDialog = () => {
    setIsConnectDialogOpen(false);
  };

  const handleOpenDisconnectDialog = () => {
    setIsDisconnectDialogOpen(true);
  };

  const handleCloseDisconnectDialog = () => {
    setIsDisconnectDialogOpen(false);
  };

  const handleConnect = (code: string) => {
    console.log('Connecting with code:', code);
    // Simulate successful connection
    setTimeout(() => {
      if (setIsConnected) {
        setIsConnected(true);
      }
      setIsConnectDialogOpen(false);
    }, 1500);
    if (onDeviceConnect) {
      onDeviceConnect(code);
    }
  };

  const handleDisconnect = () => {
    console.log('Disconnecting device');
    // Simulate successful disconnection
    setTimeout(() => {
      if (setIsConnected) {
        setIsConnected(false);
      }
      setIsDisconnectDialogOpen(false);
    }, 1500);
    if (onDeviceDisconnect) {
      onDeviceDisconnect();
    }
  };

  const handleDeviceButtonClick = () => {
    if (isConnected) {
      handleOpenDisconnectDialog();
    } else {
      handleOpenConnectDialog();
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleLogout() {
    await signOut();
  }

  return (
    <div className={`NavBarContainer ${isDark ? 'dark' : 'light'}`}>
      <button className="connect_device_button" onClick={handleDeviceButtonClick}>
        {isConnected ?
          <img src={DeviceConnected} alt="Device Connected Icon" /> :
          <img src={DeviceDisconnected} alt="Device Disconnected Icon" />
        }
        {isConnected ? 'Device Connected' : 'Connect Device'}
      </button>

      <div className="personalPreferances">
        <Switch
          checked={isDark}
          onChange={toggleTheme}
          color="warning"
        />

        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <img src={DefaultUserIcon} alt="User Icon" />
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>

      <ConnectDeviceDialog
        open={isConnectDialogOpen}
        onClose={handleCloseConnectDialog}
        onConnect={handleConnect}
      />

      <DisconnectDeviceDialog
        open={isDisconnectDialogOpen}
        onClose={handleCloseDisconnectDialog}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
};

export default Navbar;