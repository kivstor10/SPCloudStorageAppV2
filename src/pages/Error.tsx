import React from 'react';
import ErrorSVG from '../assets/Error404.svg';

const ErrorPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
           <img src={ErrorSVG} alt="Error 404" style={{ width: '20%', height: 'auto' }} />
        </div>
    );
};

export default ErrorPage;