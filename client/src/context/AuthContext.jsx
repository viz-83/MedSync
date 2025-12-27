import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');



                if (storedUser && storedUser !== "undefined" && storedToken) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth Load Error:", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();

        // Listen for storage events (multi-tab support)
        window.addEventListener('storage', checkAuth);
        // Listen for custom auth-change events
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
        window.dispatchEvent(new Event('auth-change'));
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken'); // Ensure cleanup
        setUser(null);
        window.dispatchEvent(new Event('auth-change'));
    };

    const updateUser = (updates) => {
        const newUser = { ...user, ...updates };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        window.dispatchEvent(new Event('auth-change'));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
