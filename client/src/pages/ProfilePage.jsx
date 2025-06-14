import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Eye, EyeOff, Heart, Plus, ExternalLink, Shield } from 'lucide-react';
import { mockData } from '../data/mockData';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPassword, setShowPassword] = useState(false);
    const [showAmounts, setShowAmounts] = useState(false);

    const tabClasses = (tabName) => 
        `py-2 px-4 font-semibold border-b-2 transition-colors duration-200 ${
            activeTab === tabName 
            ? 'border-blue-600 text-blue-600 dark:text-blue-300' 
            : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
        }`;
    
    const ToggleSwitch = ({ label, isEnabled, onToggle }) => (
        <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={isEnabled} onChange={onToggle} />
                <div className={`block w-12 h-6 rounded-full transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isEnabled ? 'transform translate-x-6' : ''}`}></div>
            </div>
        </label>
    );

    return (
        <main className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account settings and view your campaign activity.</p>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto">
                    <button onClick={() => setActiveTab('overview')} className={tabClasses('overview')}>Overview</button>
                    <button onClick={() => setActiveTab('donations')} className={tabClasses('donations')}>Donations</button>
                    <button onClick={() => setActiveTab('campaigns')} className={tabClasses('campaigns')}>My Campaigns</button>
                    <button onClick={() => setActiveTab('settings')} className={tabClasses('settings')}>Settings</button>
                </nav>
            </div>
            
            {activeTab === 'overview' && (
                // --- Overview Tab ---
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center">
                               <Users className="h-5 w-5 mr-2 text-gray-500"/> Profile Information
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your personal information and account details.</p>
                            <div className="flex items-center mb-8">
                                <img src={mockData.user.profileImage} alt="profile" className="h-20 w-20 rounded-full mr-6"/>
                                <div>
                                    <p className="font-bold text-xl capitalize">{mockData.user.name}</p>
                                    <p className="text-gray-500">Individual</p>
                                </div>
                            </div>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input type="text" defaultValue={mockData.user.name} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 capitalize" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input type="email" defaultValue={mockData.user.email} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                    <input type="tel" defaultValue={mockData.user.phone} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                                     <div className="relative">
                                        <input type={showPassword ? "text" : "password"} defaultValue="fakepassword" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 pr-10" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                                            {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                        </button>
                                    </div>
                                </div> */}
                            </form>
                        </Card>
                    </div>
                     <div className="space-y-6">
                         <Card className="p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center">
                               <TrendingUp className="h-5 w-5 mr-2 text-gray-500"/> Activity Stats
                            </h3>
                            <div className="space-y-4">
                               <div className="flex justify-between items-center">
                                 <p className="text-gray-500 dark:text-gray-400">Total Donated</p>
                                 <p className="font-bold text-green-600 text-2xl">₿{mockData.user.totalDonated}</p>
                               </div>
                               <div className="flex justify-between items-center text-sm">
                                 <p className="text-gray-500 dark:text-gray-400 flex items-center"><Heart className="h-4 w-4 mr-2 text-red-500"/> Campaigns Supported</p>
                                 <p className="font-semibold">{mockData.user.campaignsSupported}</p>
                               </div>
                               <div className="flex justify-between items-center text-sm">
                                 <p className="text-gray-500 dark:text-gray-400 flex items-center"><Plus className="h-4 w-4 mr-2 text-blue-500"/> Campaigns Created</p>
                                 <p className="font-semibold">{mockData.user.campaignsCreated}</p>
                               </div>
                                <div className="flex justify-between items-center text-sm">
                                 <p className="text-gray-500 dark:text-gray-400 flex items-center"><Users className="h-4 w-4 mr-2 text-purple-500"/> Participated</p>
                                 <p className="font-semibold">{mockData.user.participated}</p>
                               </div>
                            </div>
                         </Card>
                         <Button as={Link} to="/create-campaign" size="lg" className="w-full">
                           <Plus className="mr-2 h-5 w-5"/> Create Campaign
                         </Button>
                    </div>
                </div>
            )}
            
            {/* --- Donations Tab with Fix --- */}
            {activeTab === 'donations' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Donation History</h2>
                            <p className="text-gray-500 dark:text-gray-400">Your complete donation history and impact tracking</p>
                        </div>
                        <ToggleSwitch label="Show amounts" isEnabled={showAmounts} onToggle={() => setShowAmounts(!showAmounts)} />
                    </div>
                    <div className="space-y-4">
                        {/* Safely check if mockData.donations exists and has items */}
                        {mockData.donations && mockData.donations.length > 0 ? (
                            mockData.donations.map(donation => (
                                <Card key={donation.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-lg">{donation.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">by {donation.by} &bull; {donation.date}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button className="text-gray-400 hover:text-blue-600"><ExternalLink className="h-5 w-5"/></button>
                                        <span className="text-xs font-semibold uppercase bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                            {donation.status}
                                        </span>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            // Show a message if there are no donations
                            <Card className="p-8 text-center">
                                <p className="text-gray-500 dark:text-gray-400">No donation history found.</p>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {/* --- My Campaigns Tab with Fix --- */}
            {activeTab === 'campaigns' && (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">My Campaigns</h2>
                            <p className="text-gray-500 dark:text-gray-400">Manage and track your created campaigns</p>
                        </div>
                        <Button as={Link} to="/create-campaign">
                            <Plus className="mr-2 h-5 w-5"/> Create New Campaign
                        </Button>
                    </div>
                    {/* Safely check if mockData.campaigns exists and has items */}
                    {mockData.campaigns && mockData.campaigns.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mockData.campaigns.map(campaign => (
                                 <Card key={campaign.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-xl">{campaign.title}</h3>
                                         <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {campaign.status}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500 dark:text-gray-400">Progress</span>
                                            <span className="font-semibold">{campaign.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `{campaign.progress}%`}}></div>
                                        </div>
                                        <div className="flex justify-between text-sm mt-2">
                                            <p><span className="font-bold">₿{campaign.raised.toLocaleString()}</span> raised</p>
                                            <p>{campaign.backers} funds</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <Button variant="outline" className="w-full">View Campaign</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         // Show a message if there are no campaigns
                        <Card className="p-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">You have not created any campaigns yet.</p>
                        </Card>
                    )}
                </div>
            )}

            {/* --- Settings Tab --- */}
            {activeTab === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-6">
                        <h3 className="font-bold text-lg mb-1 flex items-center">
                           <Users className="h-5 w-5 mr-2 text-gray-500"/> Personal Information
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Update your account details and contact information</p>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                    <input type="text" defaultValue="Sarah" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                    <input type="text" defaultValue="Johnson" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input type="email" defaultValue={mockData.user.email} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                <input type="tel" defaultValue={mockData.user.phone} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                <input type="text" defaultValue="San Francisco, CA" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                            </div>
                            <div className="pt-2">
                                <Button type="submit" className="w-full sm:w-auto">Update Information</Button>
                            </div>
                        </form>
                    </Card>
                     <Card className="p-6">
                        <h3 className="font-bold text-lg mb-1 flex items-center">
                           <Shield className="h-5 w-5 mr-2 text-gray-500"/> Privacy & Security
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your privacy settings and account security</p>
                        <div className="space-y-6">
                            <ToggleSwitch label="Public Profile" isEnabled={true} />
                            {/* <ToggleSwitch label="Show Donation History" isEnabled={false} /> */}
                             <div className="border-t border-gray-200 dark:border-gray-700"></div>
                             <div>
                                <h4 className="font-semibold text-md mb-4">Change Password</h4>
                                <form className="space-y-4">
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                        <input type="password" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                        <input type="password" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                        <input type="password" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                                    </div>
                                    <div className="pt-2">
                                        <Button type="submit" variant="outline" className="w-full sm:w-auto">Update Password</Button>
                                    </div>
                                </form>
                             </div>
                        </div>
                    </Card>
                </div>
            )}
        </main>
    );
};

export default ProfilePage;