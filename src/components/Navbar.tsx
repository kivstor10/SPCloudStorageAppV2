import React, { useState, useEffect } from 'react';
import DeviceConnected from '../assets/DeviceConnected.svg';
import DeviceDisconnected from '../assets/DeviceDisconnected.svg';
import Switch from '@mui/material/Switch';
import DefaultUserIcon from '../assets/DefaultUserIcon.svg';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { signOut } from 'aws-amplify/auth';
import { useTheme } from '../contexts/ThemeContext';
import ConnectDeviceDialog from '../components/ConnectDeviceDialog';
import DisconnectDeviceDialog from '../components/DisconnectDeviceDialog';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface NavBarProps {
    onDeviceConnect?: (code: string, userId: string | undefined) => void;
    onDeviceDisconnect?: () => void;
}

const Navbar: React.FC<NavBarProps> = ({ onDeviceConnect, onDeviceDisconnect }) => {
    const { isDark, toggleTheme } = useTheme();
    const [isDeviceLinked, setIsDeviceLinked] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
    const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
    const { user } = useAuthenticator((context) => [context.user]);
    const userId = user?.userId;

    // console.log("UserId: " + userId);

    const checkDeviceLink = async () => {
        if (!userId) {
            setIsDeviceLinked(false);
            setLoading(false);
            setError("User not authenticated");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(
                `https://hf3d4zck7j.execute-api.eu-west-2.amazonaws.com/dev/check-user-link?userId=${userId}`
            ).then(res => res.json());

            setIsDeviceLinked(response.isLinked);
        } catch (err: any) {
            setError(err.message || 'Failed to check device connection.');
            setIsDeviceLinked(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkDeviceLink();
    }, [userId]);

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
        setIsDeviceLinked(true);
        setIsConnectDialogOpen(false);
        if (onDeviceConnect && userId) {
            onDeviceConnect(code, userId);
        }
        checkDeviceLink();

    };

    const handleDisconnect = () => {
        console.log('Disconnecting device');
        setIsDeviceLinked(false); 
        setIsDisconnectDialogOpen(false);
        if (onDeviceDisconnect) {
            onDeviceDisconnect();
        }
        checkDeviceLink();
    };

    const handleDeviceButtonClick = () => {
        if (isDeviceLinked) {
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

    let deviceStatusText = '';
    let deviceStatusImage = DeviceDisconnected;

    if (loading) {
        deviceStatusText = 'Checking Device...';
    } else if (error) {
        deviceStatusText = "Connection Error";
    }
    else if (isDeviceLinked === null) {
        deviceStatusText = 'Device Status Unknown';
    } else if (isDeviceLinked) {
        deviceStatusText = 'Device Connected';
        deviceStatusImage = DeviceConnected;
    } else {
        deviceStatusText = 'Connect Device';
        deviceStatusImage = DeviceDisconnected;
    }

    return (
        <div className={`NavBarContainer ${isDark ? 'dark' : 'light'}`}>
            <button className="connect_device_button" onClick={handleDeviceButtonClick}>
                <img src={deviceStatusImage} alt={deviceStatusText === 'Device Connected' ? 'Device Connected Icon' : 'Device Disconnected Icon'} />
                {deviceStatusText}
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
                userId={userId}
            />

            <DisconnectDeviceDialog
                open={isDisconnectDialogOpen}
                onClose={handleCloseDisconnectDialog}
                onDisconnect={handleDisconnect}
                userId={userId}
            />
        </div>
    );
};

export default Navbar;
