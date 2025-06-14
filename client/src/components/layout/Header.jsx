import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Sun,
  Moon,
  Plus,
  Menu,
  X,
  Heart,
  Users,
  Settings,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeProvider";
import { mockData } from "../../data/mockData";
import Button from "../common/Button";
import CreateCampaignModal from "../CreateCampaignModal";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `font-medium text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
        : "hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white">
                DAAN 
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-2">
              <NavLink to="/" className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/dashboard" className={navLinkClasses}>
                Campaigns
              </NavLink>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-600" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-400" />
                )}
              </button>
              <div className="hidden md:block">
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-5 w-5 mr-2" />
                  Create
                </Button>
              </div>
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <img
                    src={mockData.user.profileImage}
                    alt="profile"
                    className="h-8 w-8 rounded-full"
                  />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50 border dark:border-gray-700 animate-fade-in-down">
                    <div className="p-4 border-b dark:border-gray-700">
                      <p className="font-semibold text-gray-800 dark:text-white capitalize">
                        {mockData.user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {mockData.user.email}
                      </p>
                      <p className="text-xs font-semibold text-orange-500 mt-2">
                        Verification required
                      </p>
                    </div>
                    <nav className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Users className="h-5 w-5 mr-3 text-gray-500" />
                        Profile
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Settings className="h-5 w-5 mr-3 text-gray-500" />
                        Settings
                      </Link>
                    </nav>
                    <div className="border-t dark:border-gray-700">
                      <Link
                        to="/auth"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <ArrowRight className="h-5 w-5 mr-3 transform rotate-180" />
                        Logout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col space-y-2">
                <NavLink
                  to="/"
                  className={navLinkClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={navLinkClasses}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Campaigns
                </NavLink>
                <Button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Campaign
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>
      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default Header;