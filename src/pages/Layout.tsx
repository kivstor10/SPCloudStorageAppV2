import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div>
            <main>
                 <Outlet />
            </main>
        
        </div>
    );
};

export default Layout;