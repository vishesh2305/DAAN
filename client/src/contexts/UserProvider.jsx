import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Restore session from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (userData) => {
        const user = {
            name: userData.name || userData.fullName || '',
            email: userData.email || '',
            avatar: userData.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        };
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(user)); // ✅ save to localStorage
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user"); // ✅ remove on logout
    };

    const updateUser = (newDetails) => {
        const updatedUser = { ...currentUser, ...newDetails };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // keep synced
    };

    return (
        <UserContext.Provider value={{ currentUser, isAuthenticated, updateUser, logout, login }}>
            {children}
        </UserContext.Provider>
    );
};
