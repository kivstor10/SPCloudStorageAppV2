import React from 'react';
import DeviceConnected from '../assets/DeviceConnected.svg';
import DeviceDisconnected from '../assets/DeviceDisconnected.svg';
import SettingsIcon from '../assets/Settings.svg';
import DefaultUserIcon from '../assets/DefaultUserIcon.svg';

const Navbar: React.FC = () => {
    return (
        <div className="NavBarContainer">
            <img src={DeviceConnected} alt="Device Connected Icon" />
            {/* <img src={DeviceDisconnected} alt="Device Disconnected Icon" /> */}
            <div className="personalPreferances">
                <img src={SettingsIcon} alt="Settings Icon" />
                <img src={DefaultUserIcon} alt="User Icon" />
            </div>
        </div>
    );
};

export default Navbar;