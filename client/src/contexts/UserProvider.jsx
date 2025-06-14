import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const UserContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useUser = () => useContext(UserContext);

// 3. Create the Provider component
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({
        name: "Vishesh",
        email: 'vishesh@example.com',
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // Default avatar
    });
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Simulated auth state

    // Function to update user details
    const updateUser = (newDetails) => {
        setCurrentUser(prevUser => ({ ...prevUser, ...newDetails }));
    };
    
    // Function to handle logout
    const logout = () => {
        setIsAuthenticated(false);
        // In a real app, you would also clear tokens here
    };

    const value = {
        currentUser,
        isAuthenticated,
        updateUser,
        logout,
        // You can add login function here as well
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};