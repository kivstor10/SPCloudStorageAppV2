import React from 'react';
import LoadoutItem from './LoadoutItem';
import AddNewIcon from '../assets/AddNewIcon.svg';

// Define the component
const LoadoutMenu: React.FC<{ isConnected: boolean }> = ({ isConnected }) => {
  return (
    <div className="LoadoutMenuContainer">
      <ol>
        <LoadoutItem active="active" isConnected={ isConnected }/>
      </ol>
      <div className="addNewLoadoutButton">
        <img src={AddNewIcon} alt="Add new loadout" />
        <h2>ADD NEW LOADOUT</h2>
      </div>
    </div>
  );
};

export default LoadoutMenu;
