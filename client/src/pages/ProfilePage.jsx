import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoaderCircle, Pencil, Target, Heart, TrendingUp, Users, CheckCircle } from 'lucide-react';
import Web3 from 'web3';
import { CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS } from '../constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../contexts/UserProvider';
import ProgressBar from '../components/common/ProgressBar';

const ProfilePage = () => {
    const { currentUser } = useUser();
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAccount, setUserAccount] = useState(null);
    const [createdCampaigns, setCreatedCampaigns] = useState([]);
    const [donatedCampaigns, setDonatedCampaigns] = useState([]);
    const [totalDonatedAmount, setTotalDonatedAmount] = useState('0');
    const [isClaiming, setIsClaiming] = useState(null);
    const navigate = useNavigate();

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
            const currentUserAddress = accounts[0].toLowerCase();
            setUserAccount(currentUserAddress);

            const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);
            const allCampaigns = await contract.methods.getCampaigns().call();
            
            const created = [];
            const donated = new Set();
            let userTotalDonation = BigInt(0);

            await Promise.all(allCampaigns.map(async (campaignData, i) => {
                const formattedCampaign = {
                    id: i,
                    owner: campaignData.owner,
                    title: campaignData.title,
                    target: web3.utils.fromWei(campaignData.target.toString(), 'ether'),
                    amountCollected: web3.utils.fromWei(campaignData.amountCollected.toString(), 'ether'),
                    deadline: Number(campaignData.deadline) * 1000,
                    claimed: campaignData.claimed,
                    image: campaignData.image || 'https://placehold.co/600x400/94a3b8/ffffff?text=Daan',
                };

                if (formattedCampaign.owner.toLowerCase() === currentUserAddress) {
                    created.push(formattedCampaign);
                }

                const donatorsData = await contract.methods.getDonators(i).call();
                const donatorAddresses = donatorsData[0];
                const donationAmounts = donatorsData[1];
                let userHasDonatedToThisCampaign = false;

                donatorAddresses.forEach((addr, index) => {
                    if (addr.toLowerCase() === currentUserAddress) {
                        userTotalDonation += BigInt(donationAmounts[index].toString());
                        userHasDonatedToThisCampaign = true;
                    }
                });

                if (userHasDonatedToThisCampaign) {
                    donated.add(formattedCampaign);
                }
            }));

            setCreatedCampaigns(created);
            setDonatedCampaigns(Array.from(donated));
            setTotalDonatedAmount(web3.utils.fromWei(userTotalDonation.toString(), 'ether'));

        } catch (err) {
            console.error("Failed to fetch profile data:", err);
            setError("Could not load profile data.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    const handleClaim = async (campaignId) => {
        setIsClaiming(campaignId);
        try {
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);

            await contract.methods.claim(campaignId).send({ from: accounts[0] });

            alert("Funds claimed successfully! The page will now refresh.");
            fetchData(); 
        } catch (err) {
            console.error("Failed to claim funds:", err);
            alert(`Error claiming funds: ${err.message}`);
        } finally {
            setIsClaiming(null);
        }
    };

    // ✅ FIX: The missing tabClasses function is added back here.
    const tabClasses = (tabName) => `py-2 px-4 font-semibold border-b-2 transition-colors ${
        activeTab === tabName 
        ? 'border-blue-600 text-blue-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
    }`;

    const OverviewDashboard = () => {
        const totalRaisedInUserCampaigns = createdCampaigns.reduce((sum, campaign) => sum + parseFloat(campaign.amountCollected), 0).toFixed(4);

        return (
             <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Your Impact Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-4 text-center">
                        <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{parseFloat(totalDonatedAmount).toFixed(4)} ETH</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Donated by You</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{totalRaisedInUserCampaigns} ETH</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Raised in Your Campaigns</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <Users className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{donatedCampaigns.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Campaigns Supported</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{createdCampaigns.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Campaigns Created</p>
                    </Card>
                </div>
            </div>
        );
    };

    const CampaignList = ({ campaigns, emptyMessage, isCreatedTab = false }) => {
        if (campaigns.length === 0) {
            return <p className="text-center text-gray-500 py-8">{emptyMessage}</p>;
        }
        return (
            <div className="space-y-4">
                {campaigns.map(campaign => {
                    const isOwner = campaign.owner.toLowerCase() === userAccount;
                    const isExpired = Date.now() > campaign.deadline;
                    
                    return (
                        <Card key={campaign.id} className="p-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 w-full">
                                    <img src={campaign.image} alt={campaign.title} className="w-20 h-20 rounded-lg object-cover" />
                                    <div className="flex-grow">
                                        <h4 className="font-bold">{campaign.title}</h4>
                                        <ProgressBar current={campaign.amountCollected} target={campaign.target} />
                                        <p className="text-sm text-gray-500">
                                            <span className="font-bold text-gray-800 dark:text-white">{campaign.amountCollected} ETH</span> raised of {campaign.target} ETH
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto flex-shrink-0">
                                    {isCreatedTab && isOwner && isExpired && !campaign.claimed && (
                                        <Button onClick={() => handleClaim(campaign.id)} disabled={isClaiming === campaign.id} className="w-full">
                                            {isClaiming === campaign.id ? <LoaderCircle className="animate-spin" /> : "Claim Funds"}
                                        </Button>
                                    )}
                                    {isCreatedTab && isOwner && campaign.claimed && (
                                        <div className="flex items-center justify-center text-green-600 font-semibold p-2 border border-green-600 rounded-lg">
                                            <CheckCircle className="mr-2 h-5 w-5"/> Claimed
                                        </div>
                                    )}
                                    {(!isCreatedTab || !isOwner || !isExpired) && !campaign.claimed && (
                                         <Button as={Link} to={`/campaign/${campaign.id}`} variant="outline" size="sm" className="w-full">View</Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        );
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin h-8 w-8 text-blue-500" /></div>;
        }
        if (error) {
            return <div className="text-center text-red-500 p-4">{error}</div>;
        }
        switch (activeTab) {
            case 'created':
                return <CampaignList campaigns={createdCampaigns} emptyMessage="You have not created any campaigns yet." isCreatedTab={true} />;
            case 'donated':
                return <CampaignList campaigns={donatedCampaigns} emptyMessage="You have not donated to any campaigns yet." />;
            default:
                return <OverviewDashboard />;
        }
    };
    
    return (
        <main className="container mx-auto px-4 py-8">
             <Card className="p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img src={currentUser.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover" />
                    <div className="flex-grow text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-4 mb-1">
                            <h2 className="text-2xl font-bold">{currentUser.name}'s Profile</h2>
                            <Button variant="ghost" size="icon" as={Link} to="/settings">
                                <Pencil className="h-5 w-5 text-gray-500" />
                            </Button>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{currentUser.email || 'No email provided'}</p>
                        <p className="text-gray-600 dark:text-gray-300 font-mono text-xs break-all bg-gray-100 dark:bg-gray-800 p-2 rounded">{userAccount || 'Loading wallet address...'}</p>
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