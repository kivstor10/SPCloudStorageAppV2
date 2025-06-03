import React from 'react';
import { Link } from 'react-router-dom';
import LoadoutIcon from '../assets/LoadoutIcon.svg';
import LoadoutOptions from './LoadoutOptions'; 

interface LoadoutItemProps {
  active: boolean;
  name: string;
  loadoutId: string;
  userId: string;
  apiKey: string;
  apiEndpoint: string;
  onClick: () => void; 
  onToggleActive: () => Promise<void>;
  onSuccess: () => void;
  onError: (action: string, error: any) => void;
}

const LoadoutItem: React.FC<LoadoutItemProps> = ({
  active,
  name,
  loadoutId,
  userId,
  apiKey,
  apiEndpoint,
  onClick,
  onToggleActive, 
  onSuccess,
  onError,
}) => {
  const activeClassName = active ? "active" : "";

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(); 
  };

  const handleItemClick = () => {
    onClick(); 
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <li className={activeClassName} data-loadout-id={loadoutId} onClick={handleItemClick}>
      <Link 
        to={`/loadout/${loadoutId}`} 
        onClick={handleLinkClick}
        style={{ display: 'flex', alignItems: 'center', flexGrow: 1, textDecoration: 'none', color: '#242424' }}
      >
        <img src={LoadoutIcon} alt="Loadout icon" style={{ marginRight: '10px' }}/>
        {name}
      </Link>
      <div onClick={handleOptionsClick}>
        <LoadoutOptions 
          userId={userId}
          loadoutId={loadoutId}
          loadoutName={name}
          active={active}
          apiKey={apiKey}
          apiEndpoint={apiEndpoint}
          onSuccess={onSuccess}
          onError={onError}
          onToggleActive={onToggleActive} 
        />
      </div>
    </li>
  );
};

export default LoadoutItem;