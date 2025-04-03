import React from 'react';
import DeviceConnected from '../assets/DeviceConnected.svg';
import DeviceDisconnected from '../assets/DeviceDisconnected.svg';
import SettingsIcon from '../assets/Settings.svg';
import DefaultUserIcon from '../assets/DefaultUserIcon.svg';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { signOut } from 'aws-amplify/auth';

interface NavBarProps{
    isConnected: boolean 
    setIsConnected?: React.Dispatch<React.SetStateAction<boolean>> 
}

const Navbar: React.FC<NavBarProps> = ({ isConnected, setIsConnected }) => {
    
    // Handler to toggle connection status
    const handleConnectDevice = () => {
        if (setIsConnected) {
            setIsConnected(!isConnected);
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
        <div className="NavBarContainer">
            { isConnected ? 
                <img src={DeviceConnected} alt="Device Connected Icon" />
                : 
                <img src={DeviceDisconnected} alt="Device Dsconnected Icon" />
            }

            <a className="connect_device_button" href="#" onClick={handleConnectDevice}>
                { isConnected ? 'Device Connected' : 'Connect device' }
            </a>
            {/* <img src={DeviceDisconnected} alt="Device Disconnected Icon" /> */}

            <div className="personalPreferances">
                <img src={SettingsIcon} alt="Settings Icon" />
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
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleClose}>Preferances</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>       
            </div>
        </div>
    );
};

export default Navbar;