import React from 'react';
import DeviceConnected from '../assets/DeviceConnected.svg';
import DeviceDisconnected from '../assets/DeviceDisconnected.svg';
import SettingsIcon from '../assets/Settings.svg';
import DefaultUserIcon from '../assets/DefaultUserIcon.svg';

interface NavBarProps{
    isConnected: boolean 
    setIsConnected?: React.Dispatch<React.SetStateAction<boolean>> 
}




const Navbar: React.FC<NavBarProps> = ({ isConnected, setIsConnected }) => {


    // Handler to toggle connection status
    const handleConnectDevice = () => {
        // setIsConnected(true);
        if (setIsConnected) {
            setIsConnected(!isConnected);
        }
    };

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
                <img src={DefaultUserIcon} alt="User Icon" />
            </div>
        </div>
    );
};

export default Navbar;