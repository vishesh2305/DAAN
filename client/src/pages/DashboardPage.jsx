import React, { useState, useEffect } from 'react';
import { Search, Grid3X3, List, Shield, LoaderCircle } from 'lucide-react';
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

  const getCampaigns = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);
      const fetchedCampaigns = await contract.methods.getCampaigns().call();
      
      const formattedCampaigns = fetchedCampaigns.map((campaign, index) => ({
        id: index,
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: web3.utils.fromWei(campaign.target.toString(), 'ether'),
        // *** FIX: Keep the deadline as a raw timestamp (in milliseconds) ***
        deadline: Number(campaign.deadline) * 1000, 
        amountCollected: web3.utils.fromWei(campaign.amountCollected.toString(), 'ether'),
        image: campaign.image || 'https://placehold.co/600x400/94a3b8/ffffff?text=Daan',
        // --- Added placeholder data to match modal ---
        organizer: 'Verified Organizer',
        donators: Number(campaign.donators.length),
        claimed: campaign.claimed,
        verified: true,
      }));

      setCampaigns(formattedCampaigns.reverse());
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Failed to fetch campaigns. Please make sure your wallet is connected.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  const CampaignCard = ({ campaign, viewMode }) => (
    <Card className={`overflow-hidden transition-shadow hover:shadow-xl ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'sm:w-1/3' : 'h-48'}`}>
            <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover"/>
            <div className="absolute top-2 right-2">
                 {campaign.verified && (
                    <div className="flex items-center bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full">
                       <Shield className="h-3 w-3 mr-1"/> Verified
                    </div>
                )}
            </div>
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                <h3 className="font-bold text-lg">{campaign.title}</h3>
            </div>
        </div>
        <div className={`p-4 flex flex-col flex-grow ${viewMode === 'list' ? 'sm:w-2/3' : ''}`}>
             <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">{viewMode === 'grid' ? `${campaign.description.substring(0, 100)}...` : campaign.description}</p>
             <div className="mt-4">
                 <ProgressBar value={(campaign.amountCollected / campaign.target) * 100} />
                <div className="flex justify-between items-center text-sm mt-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">{campaign.amountCollected} ETH</span>
                    <span className="text-gray-500 dark:text-gray-400">raised of {campaign.target} ETH</span>
                </div>
                 <div className="flex justify-between items-center text-xs mt-2 text-gray-500 dark:text-gray-400">
                    <span>by {`${campaign.owner.substring(0, 6)}...${campaign.owner.substring(38)}`}</span>
                    {/* *** FIX: Format the date here for display *** */}
                    <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                 </div>
             </div>
        </div>
    </Card>
  );

  return (
    <>
      <main className="container mx-auto px-4 py-8">
          {/* Search and view mode controls remain the same */}
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
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {campaigns.map(campaign => (
                    <div key={campaign.id} onClick={() => handleCampaignClick(campaign)} className="cursor-pointer">
                      <CampaignCard campaign={campaign} viewMode={viewMode} />
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