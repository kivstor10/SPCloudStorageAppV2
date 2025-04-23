import React from 'react';
import LoadoutMenu from "../components/LoadoutMenu";
import Navbar from "../components/Navbar";



const Landing: React.FC = () => {


    return (
        <div className="landingPage">
            <Navbar />
                <h1>MY <b>SP</b>CLOUD</h1>
            <LoadoutMenu />
        </div>
    );
};

export default Landing;