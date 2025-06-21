import React, { useState } from 'react';
import { User, Shield, Bell, XCircle, LogOut, LoaderCircle, ImagePlus } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../contexts/UserProvider';

const SettingsPage = () => {
const { currentUser, updateUser, logout } = useUser();
const [activeTab, setActiveTab] = useState('profile');
const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState({
  name: currentUser?.name || '',
  email: currentUser?.email || ''
});
const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);
const fileInputRef = React.useRef(null);

    
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const newDetails = {
            name: formData.name,
            email: formData.email,
            avatar: avatarPreview,
        };
        updateUser(newDetails);

        setTimeout(() => {
            setIsLoading(false);
            alert("Profile updated successfully!");
        }, 1000);
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <nav className="flex flex-col space-y-2">
                        <button onClick={() => setActiveTab('profile')} className={`flex items-center p-3 rounded-lg text-left ${activeTab === 'profile' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}><User className="h-5 w-5 mr-3" /> Profile</button>
                        <button onClick={() => setActiveTab('account')} className={`flex items-center p-3 rounded-lg text-left ${activeTab === 'account' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}><Shield className="h-5 w-5 mr-3" /> Account</button>
                    </nav>
                </div>
                <div className="md:col-span-3">
                    <Card className="p-6">
                        {activeTab === 'profile' && (
                            <div>
                                <h3 className="text-xl font-bold mb-4">Profile Information</h3>
                                <div className="mb-6 flex items-center gap-4">
                                    <img src={avatarPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-blue-200" />
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                    <Button variant="outline" type="button" onClick={() => fileInputRef.current.click()}>
                                        <ImagePlus className="h-4 w-4 mr-2" /> Change Picture
                                    </Button>
                                </div>
                                <form onSubmit={handleSaveChanges} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium">Email Address</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="pt-2">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? <LoaderCircle className="animate-spin" /> : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                        {activeTab === 'account' && (
                            <div>
                                <h3 className="text-xl font-bold mb-4">Account & Security</h3>
                                <div className="space-y-6">
                                    <Button variant="outline"><Shield className="mr-2 h-4 w-4" /> Change Password</Button>
                                    <div className="p-4 border-l-4 border-red-500 bg-red-50">
                                        <h4 className="font-bold text-red-800">Danger Zone</h4>
                                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                            <Button variant="danger_outline" onClick={() => alert('Deactivate account clicked!')}><XCircle className="mr-2 h-4 w-4"/>Deactivate Account</Button>
                                            <Button variant="danger" onClick={logout}><LogOut className="mr-2 h-4 w-4"/>Log Out</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </main>
    );
};

export default SettingsPage;