import React from 'react';
import { Link } from 'react-router-dom';
import LoadoutIcon from '../assets/LoadoutIcon.svg';
import LoadoutOptions from './LoadoutOptions';

interface LoadoutItemProps {
  active?: string; 
  name: string;
  id: string;
  onClick: () => void;
}

const LoadoutItem: React.FC<LoadoutItemProps> = ({ 
  active = "", 
  name = "Loadout",
  onClick
}) => {
  const handleOptionsClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <li className={active} onClick={onClick}>
      <Link to={"/loadout"} onClick={(e) => e.stopPropagation()}>
        <img src={LoadoutIcon} alt="Loadout icon" />
        {name}
      </Link>
      <div onClick={handleOptionsClick}>
        <LoadoutOptions />
      </div>
    </li>
  );
};

export default LoadoutItem;