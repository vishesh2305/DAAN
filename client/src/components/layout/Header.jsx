import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Plus,
  Menu,
  X,
  Heart,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeProvider";
import { useUser } from "../../contexts/UserProvider";
import Button from "../common/Button";

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { currentUser, isAuthenticated, logout } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const navLinkClasses = ({ isActive }) =>
        `block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isActive ? "bg-gray-100 dark:bg-gray-700" : ""
        }`;

    const handleCreateCampaignClick = () => {
        navigate('/create');
        setIsMenuOpen(false);
    };

    const handleSignOut = () => {
        logout();
        setIsProfileMenuOpen(false);
    };

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Heart className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-gray-800 dark:text-white">DAAN</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-2">
                            <NavLink to="/" className={({isActive}) => `font-medium px-3 py-2 rounded-lg ${isActive ? 'text-blue-600' : 'hover:text-blue-600'}`} end>Home</NavLink>
                            <NavLink to="/dashboard" className={({isActive}) => `font-medium px-3 py-2 rounded-lg ${isActive ? 'text-blue-600' : 'hover:text-blue-600'}`}>Campaigns</NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            <Button onClick={handleCreateCampaignClick}><Plus className="h-5 w-5 mr-2" />Create Campaign</Button>
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    <img src={currentUser.avatar} alt="Profile" className="h-9 w-9 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover" />
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-3 border-b dark:border-gray-600">
                                            <p className="text-sm font-semibold">Signed in as</p>
                                            <p className="text-sm font-medium truncate">{currentUser.name}</p>
                                        </div>
                                        <NavLink to="/profile" className={navLinkClasses} onClick={() => setIsProfileMenuOpen(false)}><User className="h-4 w-4 mr-2 inline-block"/> My Profile</NavLink>
                                        <NavLink to="/settings" className={navLinkClasses} onClick={() => setIsProfileMenuOpen(false)}><Settings className="h-4 w-4 mr-2 inline-block"/> Settings</NavLink>
                                        <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <LogOut className="h-4 w-4 mr-2 inline-block"/> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link to="/auth" state={{ isSignUp: false }}>
                                    <Button variant="outline">Sign In</Button>
                                </Link>
                                <Link to="/auth" state={{ isSignUp: true }}>
                                    <Button>Sign Up</Button>
                                </Link>
                            </div>
                        )}
                        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                         <nav className="flex flex-col space-y-4">
                            <NavLink to="/" className="text-center" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                            <NavLink to="/dashboard" className="text-center" onClick={() => setIsMenuOpen(false)}>Campaigns</NavLink>
                            <hr className="dark:border-gray-700"/>
                            {isAuthenticated ? (
                                <>
                                    <Button onClick={handleCreateCampaignClick} className="w-full justify-center">Create Campaign</Button>
                                    <Button as={Link} to="/profile" variant="outline" onClick={() => setIsMenuOpen(false)}>My Profile</Button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2">
                                     <Link to="/auth" state={{ isSignUp: false }} onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">Sign In</Button>
                                    </Link>
                                    <Link to="/auth" state={{ isSignUp: true }} onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full">Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;