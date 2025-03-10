import React, { useState } from 'react';
import LoadoutMenu from "../components/LoadoutMenu";
import Navbar from "../components/Navbar";



const Landing: React.FC = () => {

    // State to track device connection status
    const [isConnected, setIsConnected] = useState(false);

    return (
        <div className="landingPage">
            <Navbar isConnected={isConnected} setIsConnected={setIsConnected} />
                <h1>MY <b>SP</b>CLOUD</h1>
            <LoadoutMenu isConnected={isConnected} />
        </div>
    );
};

export default Landing;