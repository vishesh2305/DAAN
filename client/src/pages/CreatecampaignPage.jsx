import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LoaderCircle, Lightbulb, DollarSign, Tag, FileText, ImagePlus, X, Calendar } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Web3 from 'web3';
import { CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS } from '../constants';
import Notification from '../components/common/Notification.jsx';

const CreateCampaignPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        promptText: '',
        description: '',
        fundingGoal: '',
        deadline: '',
        category: 'Health',
        mediaFiles: [],
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (notification.show) {
            const timer = setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification.show]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setFormData(prev => ({ ...prev, mediaFiles: [...prev.mediaFiles, ...files] }));
    };

    const handleRemoveFile = (index) => {
        setFormData(prev => ({
            ...prev,
            mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Campaign title is required.";
        if (!formData.description.trim()) newErrors.description = "Campaign description is required.";
        if (!formData.fundingGoal) newErrors.fundingGoal = "Funding goal is required.";
        if (!formData.deadline) {
            newErrors.deadline = "Campaign deadline is required.";
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const deadlineParts = formData.deadline.split('-').map(Number);
            const selectedDate = new Date(deadlineParts[0], deadlineParts[1] - 1, deadlineParts[2]);
            if (selectedDate < today) {
                newErrors.deadline = "Deadline must be today or a future date.";
            }
        }
        if (formData.mediaFiles.length === 0) newErrors.media = "At least one image or video is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLaunchCampaign = async (event) => {
        event.preventDefault();
        setNotification({ show: false, message: '', type: '' });
        if (!validate()) return;
        setIsLoading(true);
        try {
            const aiResponse = await fetch('http://127.0.0.1:5001/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: formData.description }),
            });
            if (!aiResponse.ok) throw new Error('AI server responded with an error.');
            const aiData = await aiResponse.json();
            if (aiData.prediction !== 'Genuine') {
                setNotification({ show: true, message: `Campaign Flagged: Our AI has doubts about this campaign (${aiData.prediction}). Please revise your description.`, type: 'error' });
                setIsLoading(false);
                return;
            }
            setNotification({ show: true, message: 'AI check passed! Please confirm the transaction in your wallet.', type: 'info' });
        } catch (aiError) {
            console.error("AI prediction failed:", aiError);
            setNotification({ show: true, message: 'Could not connect to the AI analysis server. Please try again later.', type: 'error' });
            setIsLoading(false);
            return;
        }
        try {
            if (!window.ethereum) {
                setNotification({ show: true, message: 'Please install MetaMask to create a campaign!', type: 'error' });
                setIsLoading(false);
                return;
            }
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];
            const contract = new web3.eth.Contract(CROWDFUNDING_ABI, CROWDFUNDING_CONTRACT_ADDRESS);
            const targetInWei = web3.utils.toWei(formData.fundingGoal, 'ether');
            const deadlineParts = formData.deadline.split('-').map(Number);
            const deadlineDate = new Date(deadlineParts[0], deadlineParts[1] - 1, deadlineParts[2]);
            deadlineDate.setHours(23, 59, 59, 999);
            const deadlineInSeconds = Math.floor(deadlineDate.getTime() / 1000);
            await contract.methods.createCampaign(
                userAddress,
                formData.title,
                formData.description,
                targetInWei,
                deadlineInSeconds,
                "YOUR_IMAGE_URL_OR_IPFS_HASH"
            ).send({ from: userAddress });
            setNotification({ show: true, message: 'Campaign created successfully! Redirecting...', type: 'success' });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            console.error("Error creating campaign:", error);
            setNotification({ show: true, message: `Transaction failed: User denied transaction or an error occurred.`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };
    
    const getTodayString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <main className="container mx-auto px-4 py-8 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                {notification.show && (
                    <Notification 
                        message={notification.message} 
                        type={notification.type}
                        onClose={() => setNotification({ show: false, message: '', type: '' })}
                    />
                )}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Start Your Campaign</h1>
                    <p className="text-md text-gray-600 dark:text-gray-300 mt-2">Bring your idea to life with the support of the community.</p>
                </div>
                <Card className="p-6 sm:p-8">
                    <form className="space-y-6" onSubmit={handleLaunchCampaign} noValidate>
                        <div>
                            <h3 className="font-bold text-lg mb-2 flex items-center">
                                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500"/> 1. The Big Idea
                            </h3>
                            <div className='space-y-4'>
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Title</label>
                                    <input type="text" id="title" value={formData.title} onChange={handleChange} placeholder="e.g., Community Garden for our Neighborhood" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"/>
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Briefly describe your campaign's goal.</label>
                                    <textarea id="promptText" rows="3" value={formData.promptText} onChange={handleChange} placeholder="e.g., To build a garden where local families can grow their own fresh vegetables." className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"/>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <div>
                            <h3 className="font-bold text-lg mb-2 flex items-center"><FileText className="h-5 w-5 mr-2 text-blue-500"/> 2. Your Story</h3>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Campaign Description</label>
                                <textarea id="description" rows="12" value={formData.description} onChange={handleChange} placeholder="Tell your story... Why is this project important? Who will it help?" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"/>
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Campaign Media</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50" onClick={() => fileInputRef.current.click()}>
                                    <ImagePlus className="h-10 w-10 mx-auto text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold text-blue-600 dark:text-blue-400">Upload Images & Videos</span></p>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*,video/*" className="hidden"/>
                                </div>
                                {errors.media && <p className="text-red-500 text-xs mt-1">{errors.media}</p>}
                                {formData.mediaFiles.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {formData.mediaFiles.map((file, index) => (
                                            <div key={index} className="relative aspect-square group">
                                                {file.type.startsWith('image/') ? <img src={URL.createObjectURL(file)} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg"/> : <video src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-lg"/>}
                                                <button type="button" onClick={() => handleRemoveFile(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-4 w-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <div>
                            <h3 className="font-bold text-lg mb-2 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-green-500"/> 3. Funding & Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Funding Goal (ETH)</label>
                                    <input type="number" id="fundingGoal" step="0.01" value={formData.fundingGoal} onChange={handleChange} placeholder="e.g., 5" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"/>
                                    {errors.fundingGoal && <p className="text-red-500 text-xs mt-1">{errors.fundingGoal}</p>}
                                </div>
                                <div>
                                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                                    <input type="date" id="deadline" value={formData.deadline} onChange={handleChange} min={getTodayString()} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"/>
                                    {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                    <select id="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                        <option>Health</option>
                                        <option>Education</option>
                                        <option>Environment</option>
                                        <option>Technology</option>
                                        <option>Community</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
                                {isLoading ? <LoaderCircle className="animate-spin" /> : 'Launch Campaign'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </main>
    );
};

export default CreateCampaignPage;