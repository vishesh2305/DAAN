import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Sparkles, LoaderCircle, Lightbulb, DollarSign, Tag, FileText, ImagePlus, X } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';

const CreateCampaignPage = () => {
  // --- Start of State Management Section ---
  const [formData, setFormData] = useState({
    title: '',
    promptText: '',
    description: '',
    fundingGoal: '',
    category: 'Health',
    mediaFiles: [],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); // Initialize navigate for redirection
  const fileInputRef = useRef(null);
  // --- End of State Management Section ---

  // --- Start of Handlers Section ---
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
  // --- End of Handlers Section ---

  // --- Validation and Submission Logic ---
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Campaign title is required.";
    if (!formData.description.trim()) newErrors.description = "Campaign description is required.";
    if (!formData.fundingGoal) newErrors.fundingGoal = "Funding goal is required.";
    if (formData.mediaFiles.length === 0) newErrors.media = "At least one image or video is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLaunchCampaign = (event) => {
    event.preventDefault();
    if (validate()) {
      console.log("Form is valid. Submitting and redirecting...");
      // In a real app, you would submit formData to your backend here.
      navigate('/dashboard');
    } else {
      console.log("Form is invalid. Please check the errors.");
    }
  };
  // --- End of Validation and Submission Logic ---

  // AI Generation function (no changes)
  const handleGenerateDescription = async () => { /* ... existing code ... */ };

  return (
    <main className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Start Your Campaign</h1>
          <p className="text-md text-gray-600 dark:text-gray-300 mt-2">Bring your idea to life with the support of the community.</p>
        </div>

        <Card className="p-6 sm:p-8">
          {/* Add onSubmit handler to the form */}
          <form className="space-y-6" onSubmit={handleLaunchCampaign} noValidate>
            {/* Step 1: Core Idea */}
            <div>
              <h3 className="font-bold text-lg mb-2 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-500"/> 1. The Big Idea
              </h3>
              <div className='space-y-4'>
                  <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign Title</label>
                      <input
                          type="text"
                          id="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g., Community Garden for our Neighborhood"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      />
                      {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>
                  <div>
                      <label htmlFor="promptText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Briefly describe your campaign's goal.
                      </label>
                      <textarea
                          id="promptText"
                          rows="3"
                          value={formData.promptText}
                          onChange={handleChange}
                          placeholder="e.g., To build a garden where local families can grow their own fresh vegetables and connect with each other."
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      />
                  </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {/* Step 2: The Story */}
            <div>
                 <h3 className="font-bold text-lg mb-2 flex items-center">
                   <FileText className="h-5 w-5 mr-2 text-blue-500"/> 2. Your Story
               </h3>
                 <div>
                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Campaign Description
                   </label>
                   <textarea
                       id="description"
                       rows="12"
                       value={formData.description}
                       onChange={handleChange}
                       placeholder="Tell your story... Why is this project important? Who will it help?"
                       className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                   />
                   {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                 </div>
                 
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Media
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <ImagePlus className="h-10 w-10 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">Upload Images & Videos</span>
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                    />
                  </div>
                  {errors.media && <p className="text-red-500 text-xs mt-1">{errors.media}</p>}
                  {formData.mediaFiles.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.mediaFiles.map((file, index) => (
                        <div key={index} className="relative aspect-square group">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview ${index}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            
            {/* Step 3: Funding */}
            <div>
                 <h3 className="font-bold text-lg mb-2 flex items-center">
                   <DollarSign className="h-5 w-5 mr-2 text-green-500"/> 3. Funding
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                       <label htmlFor="fundingGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Funding Goal ($)</label>
                       <input
                           type="number"
                           id="fundingGoal"
                           value={formData.fundingGoal}
                           onChange={handleChange}
                           placeholder="5000"
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                       />
                       {errors.fundingGoal && <p className="text-red-500 text-xs mt-1">{errors.fundingGoal}</p>}
                   </div>
                   <div>
                       <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                       <select
                           id="category"
                           value={formData.category}
                           onChange={handleChange}
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                       >
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
                 <Button type="submit" size="lg" className="w-full sm:w-auto">
                   Launch Campaign
                 </Button>
            </div>

          </form>
        </Card>
      </div>
    </main>
  );
};

export default CreateCampaignPage;