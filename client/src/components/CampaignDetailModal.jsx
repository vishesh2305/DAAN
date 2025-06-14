import React, { useState } from 'react';
import { X, Share2, Heart, ShieldCheck, MessageCircle, ImageIcon } from 'lucide-react';
import ProgressBar from './common/ProgressBar';
import Button from './common/Button';
import Card from './common/Card';

// --- Placeholder Data ---
// In a real application, this data would come from your props (e.g., campaign.updates, campaign.comments)
const placeholderUpdates = [
    {
        id: 1,
        date: 'June 10, 2025',
        text: 'First batch of textbooks and supplies have been purchased! Thanks to your amazing support, we are one step closer to our goal. See the happy faces and the supplies below!',
        images: [
            'https://placehold.co/600x400/a3e635/ffffff?text=Supplies+1',
            'https://placehold.co/600x400/38bdf8/ffffff?text=Student+Group',
            'https://placehold.co/600x400/f87171/ffffff?text=Classroom',
        ]
    },
    {
        id: 2,
        date: 'May 28, 2025',
        text: 'We are officially halfway to our funding goal! The team is incredibly motivated. Here is a picture from our planning session.',
        images: [
            'https://placehold.co/600x400/fbbf24/ffffff?text=Team+Meeting'
        ]
    }
];

const placeholderComments = [
    {
        id: 1,
        user: { name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example YouTube embed URL
        comment: 'This is such an inspiring project! So happy to contribute. Shared a little video message to the team!'
    },
    {
        id: 2,
        user: { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
        videoUrl: 'https://www.youtube.com/embed/h7_DTxxo_iI', // Example YouTube embed URL
        comment: 'Fantastic initiative. My kids made this short video to show their support for the students you are helping.'
    }
];
// --- End of Placeholder Data ---


const CampaignDetailModal = ({ campaign, onClose }) => {
    const [activeTab, setActiveTab] = useState('Story');

    const handleModalContentClick = (e) => e.stopPropagation();

    const backers = 156;
    const daysLeft = 45;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Updates':
                return <UpdatesSection />;
            case 'Comments':
                return <CommentsSection />;
            case 'Story':
            default:
                return <StorySection />;
        }
    };

    const StorySection = () => (
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <p>{campaign.description}</p>
            <p>This campaign represents more than just fundraising - it's about creating lasting change in our community. Every contribution, no matter the size, brings us closer to our goal and helps make a real difference in the lives of those we serve.</p>
            <p>Our team has been working tirelessly to ensure that every Bitcoin raised goes directly toward the cause. We believe in complete transparency and will provide regular updates on how funds are being used.</p>
        </div>
    );

    const UpdatesSection = () => (
        <div className="space-y-8">
            {placeholderUpdates.map(update => (
                <div key={update.id} className="p-4 border rounded-lg dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{update.date}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{update.text}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {update.images.map((img, index) => (
                            <img key={index} src={img} alt={`update-${update.id}-img-${index}`} className="rounded-md object-cover w-full h-full aspect-video" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const CommentsSection = () => (
        <div className="space-y-6">
            {placeholderComments.map(comment => (
                <div key={comment.id} className="p-4 border rounded-lg dark:border-gray-700 flex flex-col sm:flex-row gap-4">
                    <img src={comment.user.avatar} alt={comment.user.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                        <p className="font-semibold">{comment.user.name}</p>
                        <p className="text-gray-700 dark:text-gray-300 my-2">{comment.comment}</p>
                        <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden">
                            <iframe
                                className="w-full h-full"
                                src={comment.videoUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );


    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <Card 
                className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-2xl m-4 relative animate-scale-in"
                onClick={handleModalContentClick}
            >
                <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
                    {/* Action buttons... */}
                    <Button variant="outline" size="icon" className="bg-white/20 hover:bg-white/40 backdrop-blur-md border-none text-white rounded-full"><Share2 className="h-5 w-5" /></Button>
                    <Button variant="outline" size="icon" className="bg-white/20 hover:bg-white/40 backdrop-blur-md border-none text-white rounded-full"><Heart className="h-5 w-5" /></Button>
                    <Button variant="outline" size="icon" onClick={onClose} className="bg-white/20 hover:bg-white/40 backdrop-blur-md border-none text-white rounded-full"><X className="h-5 w-5" /></Button>
                </div>

                <div className="overflow-y-auto max-h-[90vh]">
                    {/* --- Image and Header Section --- */}
                    <div className="relative h-64 md:h-80 w-full">
                        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">{campaign.category}</span>
                            <h1 className="text-2xl md:text-3xl font-bold mt-2">{campaign.title}</h1>
                            <p className="text-sm opacity-90 mt-1">by {campaign.organizer} • India</p>
                        </div>
                    </div>

                    {/* --- Main Content Section --- */}
                    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column */}
                        <div className="lg:col-span-2">
                            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                                <button onClick={() => setActiveTab('Story')} className={`py-2 px-4 font-semibold flex items-center gap-2 ${activeTab === 'Story' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>Story</button>
                                <button onClick={() => setActiveTab('Updates')} className={`py-2 px-4 font-semibold flex items-center gap-2 ${activeTab === 'Updates' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}><ImageIcon className="h-4 w-4"/>Updates</button>
                                <button onClick={() => setActiveTab('Comments')} className={`py-2 px-4 font-semibold flex items-center gap-2 ${activeTab === 'Comments' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}><MessageCircle className="h-4 w-4"/>Videos</button>
                            </div>
                            {renderTabContent()}
                        </div>

                        {/* Right Column (Sidebar) */}
                        <div className="lg:col-span-1 space-y-6">
                            <div>
                                <ProgressBar raised={campaign.raised} goal={campaign.goal} />
                                <div className="mt-2">
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">₿{campaign.raised.toLocaleString()}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">raised of ₿{campaign.goal.toLocaleString()} goal</span>
                                </div>
                                <div className="flex justify-between items-center text-center mt-4 border-t border-b dark:border-gray-700 py-3">
                                    <div>
                                        <p className="text-xl font-bold">{backers}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">funders</p>
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{daysLeft}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">days left</p>
                                    </div>
                                </div>
                            </div>
                            
                            <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600">Fund This Project</Button>

                            <Card className="!p-4">
                                <h4 className="font-bold mb-3">Campaign Organizer</h4>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center font-bold">
                                        {campaign.organizer.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{campaign.organizer}</p>
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