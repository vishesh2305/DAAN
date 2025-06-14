import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Plus, Users, Target } from 'lucide-react';
import Button from '../components/common/Button';

const IndexPage = () => {
  return (
    <main className="animate-fade-in">
        {/* Hero Section */}
        <section className="bg-gray-50 dark:bg-gray-900 text-center py-20 lg:py-32">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-4">
                    Get <span className="text-yellow-500">Help</span> Do <span className="text-yellow-500">Help</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                    Join thousands of creators, dreamers, and changemakers who are funding their passions and making a positive impact in the world.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button as={Link} to="/auth" size="lg">
                        Start Your Campaign <ArrowRight className="ml-2 h-5 w-5"/>
                    </Button>
                    <Button as={Link} to="/dashboard" size="lg" variant="outline">
                       <Play className="mr-2 h-5 w-5"/> Explore Campaigns
                    </Button>
                </div>
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <div>
                        <p className="text-3xl font-bold text-yellow-500">₿2.4M</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Raised</p>
                    </div>
                     <div>
                        <p className="text-3xl font-bold text-yellow-500">1,200+</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Active Campaigns</p>
                    </div>
                     <div>
                        <p className="text-3xl font-bold text-yellow-500">850+</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Success Stories</p>
                    </div>
                     <div>
                        <p className="text-3xl font-bold text-yellow-500">15,000+</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Global Supporters</p>
                    </div>
                </div>
            </div>
        </section>

        {/* How it works */}
        <section className="py-20">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">How It Works</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Fundraising made simple and effective in 3 easy steps.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6">
                        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
                           <Plus className="h-8 w-8 text-blue-600 dark:text-blue-300"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">1. Start your Campaign</h3>
                        <p className="text-gray-500 dark:text-gray-400">Describe your project, set a funding goal, and tell your story.</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
                           <Users className="h-8 w-8 text-blue-600 dark:text-blue-300"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">2. Share with friends</h3>
                        <p className="text-gray-500 dark:text-gray-400">Reach out to your network and community to gain support.</p>
                    </div>
                    <div className="text-center p-6">
                        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
                           <Target className="h-8 w-8 text-blue-600 dark:text-blue-300"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">3. Reach your goal</h3>
                        <p className="text-gray-500 dark:text-gray-400">Receive funds and bring your project to life.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
  );
};

export default IndexPage;
