import React from 'react';
import { Link } from 'react-router-dom';
import LoadoutIcon from '../assets/LoadoutIcon.svg';
import LoadoutOptions from './LoadoutOptions';

interface LoadoutItemProps {
  active?: string;
  name: string;
  id: string;
  onClick: () => void;
  onDelete: () => void;
}

const LoadoutItem: React.FC<LoadoutItemProps> = ({
  active = "",
  name = "Loadout",
  id,
  onClick,
  onDelete
}) => {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(); // Set as active when clicking the link
    // Navigation is handled by the Link component
  };

  const handleItemClick = () => {
    onClick(); // Set as active when clicking anywhere in the item
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <li className={active} onClick={handleItemClick}>
      <Link 
        to={`/loadout/${id}`} 
        onClick={handleLinkClick}
        style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
      >
        <img src={LoadoutIcon} alt="Loadout icon" />
        {name}
      </Link>
      <div onClick={handleOptionsClick}>
        <LoadoutOptions 
          onDelete={onDelete} 
          onRename={() => console.log('Rename action')} 
          onToggleActive={() => console.log('Toggle active action')} 
        />
      </div>
    </li>
  );
};

export default LoadoutItem;