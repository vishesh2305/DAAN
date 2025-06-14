import React from 'react';
// Changed DollarSign to Bitcoin
import { X, Lightbulb, FileText, Bitcoin, Image as ImageIcon } from 'lucide-react';
import Button from './common/Button';

const CreateCampaignModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Prevent modal from closing when clicking inside
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fade-in-down"
        onClick={handleContentClick}
      >
        <div className="p-6 sm:p-8 border-b dark:border-gray-700 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Start Your Campaign</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Bring your idea to life with the support of the community.</p>
        </div>

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <form className="p-6 sm:p-8 space-y-8">
          {/* Section 1: The Big Idea */}
          <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700">
            <h2 className="font-bold text-xl flex items-center text-yellow-500">
              <Lightbulb className="h-6 w-6 mr-2" />
              1. The Big Idea
            </h2>
            <div>
              <label htmlFor="campaignTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Title</label>
              <input 
                type="text" 
                id="campaignTitle"
                placeholder="e.g., Community Garden for our Neighborhood"
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="campaignGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Briefly describe your campaign's goal.</label>
              <textarea 
                id="campaignGoal" 
                rows="3"
                placeholder="e.g., To build a garden where local families can grow their own fresh vegetables and connect with each other."
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          
          {/* Section 2: Your Story */}
          <div className="space-y-4">
            <h2 className="font-bold text-xl flex items-center text-gray-700 dark:text-gray-300">
                <FileText className="h-6 w-6 mr-2" />
                2. Your Story
            </h2>
            <div>
              <label htmlFor="campaignDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Description</label>
              <textarea 
                id="campaignDescription" 
                rows="6"
                placeholder="Tell your story... Why is this project important? Who will it help?"
                className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Media</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-900 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Upload Images & Videos</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Section 3: Funding */}
          <div className="space-y-4">
            <h2 className="font-bold text-xl flex items-center text-green-500">
                <Bitcoin className="h-6 w-6 mr-2" />
                3. Funding
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Funding Goal (₿)</label>
                    <input 
                        type="number" 
                        id="fundingGoal"
                        placeholder="5000"
                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select id="category" className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500">
                        <option>Health</option>
                        <option>Education</option>
                        <option>Environment</option>
                        <option>Technology</option>
                        <option>Community</option>
                    </select>
                </div>
            </div>
          </div>
          
          <div className="pt-6 border-t dark:border-gray-700 flex justify-end">
            <Button size="lg" type="submit">
                Launch Campaign
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignModal;