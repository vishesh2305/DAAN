import React, { createContext, useState, useContext, useEffect } from 'react';
import defaultprofileimg from "../assets/images/default_profile_image.jpg"
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
            avatar: userData.avatar || defaultprofileimg,
        };
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(user)); // ✅ save to localStorage
    };

const logout = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include", // ⬅️ VERY IMPORTANT to send cookies (session ID)
    });

    const data = await res.json();
    console.log("🚪 Logout response:", data.message);

    // Now update local state
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Logout request failed.");
  }
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
 