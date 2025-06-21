import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import Web3 from 'web3';
import { CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS } from '../constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../contexts/UserProvider';

const ProfilePage = () => {
    const { currentUser } = useUser();
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAccount, setUserAccount] = useState(null);
    const [createdCampaigns, setCreatedCampaigns] = useState([]);
    const [donatedCampaigns, setDonatedCampaigns] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
    if (!window.ethereum) {
        setError("Please install MetaMask to view your profile.");
        setIsLoading(false);
        return;
    }

    try {
        setIsLoading(true);
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentUserAddress = accounts[0];
        setUserAccount(currentUserAddress);

        // ✅ Update wallet address in MongoDB
        const res = await fetch("http://localhost:3000/api/update-wallet", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ blockchainAddress: currentUserAddress })
});

const data = await res.json();

if (res.ok) {
  alert(data.message || "Wallet address updated!");
  console.log("✅ Wallet Update Success:", data);
} else {
  alert(data.error || "Wallet update failed.");
  console.error("❌ Wallet Update Error:", data);
}

        // ⛓️ Contract setup
        const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);
        const allCampaigns = await contract.methods.getCampaigns().call();

        const created = [];
        const donated = [];

        for (let i = 0; i < allCampaigns.length; i++) {
            const campaign = allCampaigns[i];
            const formattedCampaign = {
                id: i,
                owner: campaign.owner,
                title: campaign.title,
                target: web3.utils.fromWei(campaign.target.toString(), 'ether'),
                amountCollected: web3.utils.fromWei(campaign.amountCollected.toString(), 'ether'),
                image: campaign.image || 'https://placehold.co/600x400/94a3b8/ffffff?text=Daan',
            };

            if (formattedCampaign.owner.toLowerCase() === currentUserAddress.toLowerCase()) {
                created.push(formattedCampaign);
            }

            const donatorsData = await contract.methods.getDonators(i).call();
            if (donatorsData[0].map(d => d.toLowerCase()).includes(currentUserAddress.toLowerCase())) {
                donated.push(formattedCampaign);
            }
        }

        setCreatedCampaigns(created);
        setDonatedCampaigns(donated);
    } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setError("Could not load profile data.");
    } finally {
        setIsLoading(false);
    }
};


        fetchData();
    }, []);

    const tabClasses = (tabName) => `py-2 px-4 font-semibold border-b-2 transition-colors ${activeTab === tabName ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`;

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin h-8 w-8 text-blue-500" /></div>;
        }
        if (error) {
            return <div className="text-center text-red-500 p-4">{error}</div>;
        }
        switch (activeTab) {
            case 'created':
                return <CampaignList campaigns={createdCampaigns} emptyMessage="You have not created any campaigns yet." />;
            case 'donated':
                return <CampaignList campaigns={donatedCampaigns} emptyMessage="You have not donated to any campaigns yet." />;
            default:
                return <p className="text-gray-600 dark:text-gray-400">Welcome! This is your overview. Select a tab to see more details.</p>;
        }
    };

    const CampaignList = ({ campaigns, emptyMessage }) => {
        if (campaigns.length === 0) {
            return <p className="text-center text-gray-500 py-8">{emptyMessage}</p>;
        }
        return (
            <div className="space-y-4">
                {campaigns.map(campaign => (
                    <Card key={campaign.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <img src={campaign.image} alt={campaign.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div>
                                <h4 className="font-bold">{campaign.title}</h4>
                                <p className="text-sm text-gray-500">{campaign.amountCollected} ETH of {campaign.target} ETH</p>
                            </div>
                        </div>
                        <Button as={Link} to={`/dashboard`} variant="outline" size="sm">View</Button>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <Card className="p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover" />
                    <div>
                        <h2 className="text-2xl font-bold">{currentUser.name}'s Profile</h2>
                        <p className="text-gray-500 dark:text-gray-400 break-all">{userAccount || 'Loading wallet address...'}</p>
                    </div>
                </div>
            </Card>
            <div>
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-6">
                        <button className={tabClasses('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
                        <button className={tabClasses('created')} onClick={() => setActiveTab('created')}>Created ({createdCampaigns.length})</button>
                        <button className={tabClasses('donated')} onClick={() => setActiveTab('donated')}>Donated ({donatedCampaigns.length})</button>
                    </nav>
                </div>
                <div className="py-6">{renderContent()}</div>
            </div>
        </main>
    );
};

export default ProfilePage;