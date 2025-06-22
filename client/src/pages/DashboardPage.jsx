import React, { useState, useEffect } from 'react';
import { Search, Grid3X3, List, Shield, LoaderCircle, Users, Calendar, Target } from 'lucide-react'; // Added more icons
import Web3 from 'web3';
import { CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS } from '../constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
import CampaignDetailModal from '../components/CampaignDetailModal';

const DashboardPage = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // This logic remains the same
    useEffect(() => {
        const getCampaigns = async () => {
            try {
                const web3 = new Web3(window.ethereum);
                const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);
                const fetchedCampaigns = await contract.methods.getCampaigns().call();
                
                // We'll also fetch donator counts here
                const formattedCampaigns = await Promise.all(fetchedCampaigns.map(async (campaign, index) => {
                    const donatorsData = await contract.methods.getDonators(index).call();
                    const donatorsCount = donatorsData[0].length;
                    
                    return {
                        id: index,
                        owner: campaign.owner,
                        title: campaign.title,
                        description: campaign.description,
                        target: web3.utils.fromWei(campaign.target.toString(), 'ether'),
                        deadline: Number(campaign.deadline) * 1000, 
                        amountCollected: web3.utils.fromWei(campaign.amountCollected.toString(), 'ether'),
                        image: campaign.image || 'https://placehold.co/600x400/94a3b8/ffffff?text=Daan',
                        donators: donatorsCount,
                        claimed: campaign.claimed,
                        verified: true, // Assuming verification logic exists elsewhere
                    };
                }));
    
                setCampaigns(formattedCampaigns.reverse());
            } catch (err) {
                console.error("Error fetching campaigns:", err);
                setError("Failed to fetch campaigns. Please make sure your wallet is connected.");
            } finally {
                setIsLoading(false);
            }
        };

        if(window.ethereum) {
            getCampaigns();
        } else {
            setError("Please install MetaMask to view campaigns.");
            setIsLoading(false);
        }
    }, []);

    const handleCampaignClick = (campaign) => {
        setSelectedCampaign(campaign);
    };

    const handleCloseModal = () => {
        setSelectedCampaign(null);
    };

    // ✅ --- UI IMPROVEMENT: Revamped CampaignCard Component ---
    const CampaignCard = ({ campaign, viewMode }) => {
        const isExpired = Date.now() > campaign.deadline;
        const daysLeft = isExpired ? 0 : Math.ceil((new Date(campaign.deadline) - Date.now()) / (1000 * 60 * 60 * 24));

        return (
            <Card className={`overflow-hidden transition-shadow hover:shadow-xl flex flex-col h-full ${campaign.claimed ? 'grayscale' : ''}`}>
                <div className="relative h-48">
                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover"/>
                    <div className="absolute top-2 right-2">
                        {campaign.claimed ? (
                             <div className="flex items-center bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Ended
                            </div>
                        ) : campaign.verified && (
                            <div className="flex items-center bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full">
                                <Shield className="h-3 w-3 mr-1"/> Verified
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow mb-4">{`${campaign.description.substring(0, 100)}...`}</p>
                    
                    <div className="mt-auto">
                        <ProgressBar current={campaign.amountCollected} target={campaign.target} />
                        
                        {/* ✅ NEW: Stats grid for better UI */}
                        <div className="grid grid-cols-3 gap-4 text-center mt-3">
                            <div>
                                <p className="font-bold text-sm text-gray-800 dark:text-white">{parseFloat(campaign.amountCollected).toFixed(2)} ETH</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Raised</p>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-800 dark:text-white">{campaign.donators}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Donators</p>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-800 dark:text-white">{daysLeft}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Days Left</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };


    return (
        <>
            <main className="container mx-auto px-4 py-8">
                {/* Search and view mode controls */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex-grow max-w-md">
                        <div className="pl-4"> <Search className="h-5 w-5 text-gray-500" /> </div>
                        <input type="text" placeholder="Search campaigns..." className="bg-transparent p-2 focus:outline-none w-full"/>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}> <Grid3X3 className="h-5 w-5"/> </Button>
                        <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}> <List className="h-5 w-5"/> </Button>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-64"> <LoaderCircle className="h-12 w-12 animate-spin text-blue-600" /> </div>
                ) : error ? (
                    <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg"> <p>{error}</p> </div>
                ) : (
                    // ✅ UPDATED: The 'list' view is now handled by the card's internal flex properties for better consistency
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {campaigns.map(campaign => (
                            <div key={campaign.id} onClick={() => handleCampaignClick(campaign)} className="cursor-pointer">
                                <CampaignCard campaign={campaign} />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {selectedCampaign && ( <CampaignDetailModal campaign={selectedCampaign} onClose={handleCloseModal} /> )}
        </>
    );
};

export default DashboardPage;