// Layout doesn't use localStorage directly, but let's check Navbar
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-body">
            <Navbar />
            <main className="flex-grow relative">
                <div key={location.pathname} className="animate-enter w-full h-full">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
