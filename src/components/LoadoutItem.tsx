import React from 'react';
import { Link } from 'react-router-dom';
import LoadoutIcon from '../assets/LoadoutIcon.svg';
import MenuButton from './MenuButton';

// Define the prop types for LoadoutItem
interface LoadoutItemProps {
  active?: string; 
}

const LoadoutItem: React.FC<LoadoutItemProps> = ({ active = "" }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <li className={active}>
      <Link to="/loadout">
        <img src={LoadoutIcon} alt="Add new loadout" />
        Loadout 1
      </Link>
      <div onClick={handleClick}>
        <MenuButton />
      </div>
    </li>
  );
};

export default LoadoutItem;
