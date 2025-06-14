import React, { useState } from 'react';
import { Search, Grid3X3, List, Shield } from 'lucide-react';
import { mockData } from '../data/mockData';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProgressBar from '../components/common/ProgressBar';
// Import the new modal component
import CampaignDetailModal from '../components/CampaignDetailModal';

const DashboardPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  // State to manage the selected campaign for the modal
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const CampaignCard = ({ campaign, viewMode }) => (
    <Card className={`overflow-hidden transition-shadow hover:shadow-xl ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'sm:w-1/3' : 'h-48'}`}>
            <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover"/>
            <div className="absolute top-2 right-2 flex flex-col space-y-2">
                 {campaign.verified && (
                    <div className="flex items-center bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full">
                       <Shield className="h-3 w-3 mr-1"/> Verified
                    </div>
                )}
            </div>
             <div className="absolute top-2 left-2 flex flex-col space-y-2">
                <div className={`text-xs font-bold px-2 py-1 rounded-full text-white ₿{campaign.category === 'Health' ? 'bg-red-500' : campaign.category === 'Education' ? 'bg-blue-500' : campaign.category === 'Environment' ? 'bg-green-500' : 'bg-purple-500'}`}>
                    {campaign.category}
                </div>
            </div>
        </div>
        <div className={`p-4 flex flex-col flex-grow ${viewMode === 'list' ? 'sm:w-2/3' : ''}`}>
            <h3 className="font-bold text-lg mb-1">{campaign.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by {campaign.organizer}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">{campaign.description}</p>
            <div>
                <ProgressBar raised={campaign.raised} goal={campaign.goal} />
                <div className="flex justify-between items-center text-sm mt-2">
                    <p className="font-bold text-blue-600 dark:text-blue-400">₿{campaign.raised.toLocaleString()}</p>
                    <p className="text-gray-500 dark:text-gray-400">of ₿{campaign.goal.toLocaleString()}</p>
                </div>
            </div>
        </div>
    </Card>
  );

  // Handlers to open and close the modal
  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8 animate-fade-in">
          <div className="text-left mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Active Campaigns</h1>
              <p className="text-md text-gray-600 dark:text-gray-300 mt-1">Discover and support meaningful causes that matter to you</p>
          </div>
          
          {/* <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200">
                  Welcome back, <span className="font-semibold capitalize">{mockData.user.name}</span>! Ready to make a difference today?
              </p>
          </div> */}

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
               <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg w-full sm:w-auto">
                  <div className="pl-3">
                      <Search className="h-5 w-5 text-gray-500" />
                  </div>
                  <input type="text" placeholder="Search campaigns..." className="bg-transparent p-2 focus:outline-none w-full"/>
              </div>
              <div className="flex items-center space-x-2">
                  <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}>
                      <Grid3X3 className="h-5 w-5"/>
                  </Button>
                  <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
                      <List className="h-5 w-5"/>
                  </Button>
              </div>
          </div>

          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {mockData.campaigns.map(campaign => (
                  // Wrap the card in a clickable div
                  <div key={campaign.id} onClick={() => handleCampaignClick(campaign)} className="cursor-pointer">
                    <CampaignCard campaign={campaign} viewMode={viewMode} />
                  </div>
              ))}
          </div>
      </main>

      {/* Conditionally render the modal */}
      {selectedCampaign && (
        <CampaignDetailModal 
          campaign={selectedCampaign}
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
};

export default DashboardPage;