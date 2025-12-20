import React from 'react';
import Landing from './Landing';
import Dashboard from './Dashboard';

const Home = () => {
    const token = localStorage.getItem('token');
    // Simple auth check. For more robustness, could verify token expiry, but handling that in axios/protected route usually.
    // If token exists, we show Dashboard.

    // Note: Dashboard/Landing both include Navbar, so we don't render it here.
    return token ? <Dashboard /> : <Landing />;
};

export default Home;
