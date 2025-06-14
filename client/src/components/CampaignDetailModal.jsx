import React, { useState } from 'react';
import { X, Share2, Heart, ShieldCheck, LoaderCircle } from 'lucide-react';
import Web3 from 'web3';
import ProgressBar from './common/ProgressBar';
import Button from './common/Button';
import Card from './common/Card';
import { CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS } from '../constants';

const CampaignDetailModal = ({ campaign, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!campaign) return null;

    const handleContentClick = (e) => e.stopPropagation();

    const handleDonate = async () => {
        const donationAmount = prompt("Enter amount to donate in ETH:", "0.01");

        if (!donationAmount || isNaN(donationAmount) || Number(donationAmount) <= 0) {
            alert("Please enter a valid donation amount.");
            return;
        }

        setIsLoading(true);

        try {
            if (!window.ethereum) {
                alert('Please install MetaMask to donate!');
                setIsLoading(false);
                return;
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];
            const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);

            const amountInWei = web3.utils.toWei(donationAmount, 'ether');

            await contract.methods.donateToCampaign(campaign.id).send({
                from: userAddress,
                value: amountInWei
            });

            alert('Donation successful! Thank you for your contribution.');
            onClose(); // Close the modal after successful donation
            window.location.reload(); // Refresh the page to see updated data

        } catch (error) {
            console.error("Donation failed:", error);
            alert(`Donation failed. Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <Card className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 rounded-lg" onClick={handleContentClick}>
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b dark:border-gray-700 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold">{campaign.title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="h-6 w-6" /></Button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <img src={campaign.image} alt={campaign.title} className="w-full h-80 object-cover rounded-lg mb-4" />
                            <div className="border-t dark:border-gray-700 pt-4">
                                <h3 className="font-bold text-xl mb-2">About Campaign</h3>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{campaign.description}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Card className="!p-4">
                                <ProgressBar value={(campaign.amountCollected / campaign.target) * 100} />
                                <div className="mt-2">
                                    <p className="text-2xl font-bold"> {campaign.amountCollected} ETH </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400"> raised of {campaign.target} ETH goal</p>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    <p><span className="font-bold">{campaign.donators || 0}</span> donators</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Ends on {new Date(campaign.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                <Button size="lg" className="w-full mt-4" onClick={handleDonate} disabled={isLoading}>
                                    {isLoading ? <LoaderCircle className="animate-spin" /> : 'Donate Now'}
                                </Button>
                                <div className="flex justify-between mt-2">
                                    <Button variant="outline" className="flex-1 mr-1"><Heart className="h-4 w-4 mr-2"/> Wishlist</Button>
                                    <Button variant="outline" className="flex-1 ml-1"><Share2 className="h-4 w-4 mr-2"/> Share</Button>
                                </div>
                            </Card>
                            <Card className="!p-4">
                                <h4 className="font-bold mb-2">Organizer</h4>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center font-bold">
                                        {campaign.organizer ? campaign.organizer.charAt(0) : 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{campaign.organizer || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">12 campaigns • India</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-4">View Profile</Button>
                            </Card>
                            <Card className="!p-4">
                                <h4 className="font-bold mb-2">Trust & Safety</h4>
                                <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
                                    <li className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-green-500"/> Identity verified</li>
                                    <li className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-green-500"/> Bank account verified</li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CampaignDetailModal;