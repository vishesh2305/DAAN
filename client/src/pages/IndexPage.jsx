import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Plus, Users, Target, ShieldCheck, Wallet, Zap, BrainCircuit, Paintbrush, HeartHandshake, HelpingHand, Quote } from 'lucide-react';
import Button from '../components/common/Button';
import landing_video from "../assets/videos/landing_background.mp4"
import secure_authentication_image from "../assets/images/secure_authentication_landingpage.png"
import secure_transaction_image from "../assets/images/blockchain_landingpage.png"
import increasing_fund_image from "../assets/images/increasing_funds_landingPage.png"
const IndexPage = () => {
    return (
        <main className="animate-fade-in">
            {/* --- Hero Section (UPDATED with Background Video) --- */}
            {/* MODIFICATION: The section is now 'relative' to act as a container for the absolute positioned video */}
            <section className="relative flex items-center justify-center text-center py-20 lg:py-32 overflow-hidden">

                {/* Background Video and Overlay */}
                <div className="absolute top-0 left-0 w-full h-full z-0">
                    {/* The Video Element */}
                    <video
                        src={landing_video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        // STYLE: The video covers the entire container, is blurred, and has a negative z-index
                        className="absolute top-0 left-0 w-full h-full object-cover filter blur-sm"
                    >
                    </video>
                    {/* The Overlay for text readability */}
                    <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
                </div>

                {/* MODIFICATION: The content container is now 'relative' to sit on top of the video */}
                <div className="relative z-10 container mx-auto px-4">
                    {/* MODIFICATION: Text colors are changed to white for better contrast */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        The Future of Crowdfunding: <br /> <span className="text-yellow-400">Secure, Smart</span> & <span className="text-yellow-400">Transparent</span>
                    </h1>
                    <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-8">
                        Leverage the power of Web3 with Aadhaar-verified identities, secure MetaMask transactions, and an automated investment bot that grows your funds on the Aave protocol.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {/* MODIFICATION: The primary button is now styled to stand out on a dark background */}
<Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center">
  Start Your Campaign <ArrowRight className="ml-2 h-5 w-5" />
</Link>
<Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center">
  Explore Campaigns <ArrowRight className="ml-2 h-5 w-5" />
</Link>

                    </div>
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <div>
                            <p className="text-3xl font-bold text-yellow-400">₿2.4M</p>
                            <p className="text-sm text-gray-300">Total Raised</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-yellow-400">1,200+</p>
                            <p className="text-sm text-gray-300">Active Campaigns</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-yellow-400">850+</p>
                            <p className="text-sm text-gray-300">Success Stories</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-yellow-400">15,000+</p>
                            <p className="text-sm text-gray-300">Global Supporters</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- How it works (No Changes) --- */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">A New Era of Fundraising</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Our process is built on trust and transparency from day one.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
                                <Plus className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Verify & Create</h3>
                            <p className="text-gray-500 dark:text-gray-400">Secure your identity in minutes with our Face Recognition and Aadhaar OCR scan to create a trusted campaign.</p>
                        </div>
                        <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
                                <Users className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. Share & Collect Funds</h3>
                            <p className="text-gray-500 dark:text-gray-400">Share your story and receive contributions directly and securely to your MetaMask wallet.</p>
                        </div>
                        <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mx-auto mb-4">
                                <Target className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">3. Watch It Grow & Succeed</h3>
                            <p className="text-gray-500 dark:text-gray-400">As funds arrive, our bot puts them to work, earning interest to help you exceed your goal.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Features Section (No Changes) --- */}
            <section className="bg-gray-50 dark:bg-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Why We're Different</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Harnessing blockchain technology for unparalleled security and growth.</p>
                    </div>
                    <div className="space-y-16">
                        {/* Feature 1 */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <img src={secure_authentication_image} alt="Abstract security graphic" className="rounded-lg shadow-lg" />
                            <div>
                                <div className="inline-flex items-center justify-center h-12 w-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mb-4">
                                    <ShieldCheck className="h-7 w-7 text-yellow-600 dark:text-yellow-300" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Aadhaar Verified Identity</h3>
                                <p className="text-gray-500 dark:text-gray-400">We eliminate fraud and build donor confidence by verifying every campaign creator with government-issued ID using advanced Face Recognition and OCR technology. This ensures every project is run by a real, accountable person.</p>
                            </div>
                        </div>
                        {/* Feature 2 */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="lg:order-last">
                                <img src={secure_transaction_image} alt="Abstract wallet and transaction graphic" className="rounded-lg shadow-lg" />
                            </div>
                            <div>
                                <div className="inline-flex items-center justify-center h-12 w-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mb-4">
                                    <Wallet className="h-7 w-7 text-yellow-600 dark:text-yellow-300" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Secure MetaMask Wallet</h3>
                                <p className="text-gray-500 dark:text-gray-400">Connect your own MetaMask wallet for truly decentralized, peer-to-peer transactions. You have full custody and control over your funds at all times, without the risk of a central point of failure.</p>
                            </div>
                        </div>
                        {/* Feature 3 */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <img src={increasing_fund_image} alt="Abstract graphic showing growth" className="rounded-lg shadow-lg" />
                            <div>
                                <div className="inline-flex items-center justify-center h-12 w-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mb-4">
                                    <Zap className="h-7 w-7 text-yellow-600 dark:text-yellow-300" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Automated Fund Growth</h3>
                                <p className="text-gray-500 dark:text-gray-400">Don't let your funds sit idle. Our unique investing bot automatically deposits your collected funds into the battle-tested Aave lending protocol, allowing your campaign total to grow by earning interest even before you reach your goal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Fundraising Categories (No Changes) --- */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Fundraising for Every Dream</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Our platform is a launchpad for a diverse range of ideas and causes.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <BrainCircuit className="h-10 w-10 text-blue-600 dark:text-blue-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Tech & Innovation</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Launch your next Web3 app, open-source project, or hardware gadget.</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <Paintbrush className="h-10 w-10 text-blue-600 dark:text-blue-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Creative Projects</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Fund your film, music album, book, or digital art collection.</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <HeartHandshake className="h-10 w-10 text-blue-600 dark:text-blue-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Community Initiatives</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Raise funds for local meetups, public amenities, or community gardens.</p>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                            <HelpingHand className="h-10 w-10 text-blue-600 dark:text-blue-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Social Causes</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Support charitable activities, disaster relief, and nonprofit organizations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Testimonials (No Changes) --- */}
            <section className="bg-gray-50 dark:bg-gray-900 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Trusted by Creators</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">See what our users are saying about their experience.</p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Testimonial 1 */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <Quote className="h-8 w-8 text-yellow-500 mb-4" />
                            <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"The Aadhaar verification gave my backers immediate confidence. And watching the total grow with the Aave integration was just magical!"</p>
                            <div className="flex items-center">
                                <img src="https://i.pravatar.cc/48?u=1" alt="Priya Sharma" className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">Priya Sharma</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Creator of 'Tech for Tomorrow'</p>
                                </div>
                            </div>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <Quote className="h-8 w-8 text-yellow-500 mb-4" />
                            <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"Finally, a platform that understands Web3. Having full control over my funds with MetaMask was non-negotiable for me. This platform delivers."</p>
                            <div className="flex items-center">
                                <img src="https://i.pravatar.cc/48?u=2" alt="Rohan Das" className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">Rohan Das</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Open-Source Developer</p>
                                </div>
                            </div>
                        </div>
                        {/* Testimonial 3 */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                            <Quote className="h-8 w-8 text-yellow-500 mb-4" />
                            <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"The process was so much simpler than I expected. From creating the campaign to seeing the funds come in, everything was seamless and secure."</p>
                            <div className="flex items-center">
                                <img src="https://i.pravatar.cc/48?u=3" alt="Anjali Mehta" className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">Anjali Mehta</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Filmmaker</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ Section (No Changes) --- */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Have questions? We have answers.</p>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">How is my data handled during Aadhaar verification?</h3>
                            <p className="text-gray-500 dark:text-gray-400">Your privacy is paramount. We use a secure, encrypted process for verification. The facial recognition and OCR scans happen on your device, and we only confirm the 'valid' or 'invalid' status without storing your personal Aadhaar data on our servers.</p>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="font-semibold text-lg mb-2">How does the investing bot work? Is it risky?</h3>
                            <p className="text-gray-500 dark:text-gray-400">Our bot automatically lends the collected funds on Aave, a highly reputable and audited decentralized finance protocol. This generates interest, similar to a savings account. While all investments carry some risk, Aave is one of the most established protocols in the space, minimizing potential risks.</p>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="font-semibold text-lg mb-2">Why use MetaMask? Can't I use a regular bank account?</h3>
                            <p className="text-gray-500 dark:text-gray-400">MetaMask gives you direct ownership and control of your funds on the blockchain. This eliminates intermediaries, reduces fees, and enables instant, transparent transactions globally, which is not possible with traditional banking systems.</p>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="font-semibold text-lg mb-2">Can I stop the investment bot and withdraw my funds?</h3>
                            <p className="text-gray-500 dark:text-gray-400">Yes. As the campaign creator, you retain full control. You can initiate a withdrawal at any time, which will pull your funds from the Aave protocol directly into your connected MetaMask wallet.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Final CTA (No Changes) --- */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Ready to Bring Your Idea to Life?</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                        Join a new generation of creators and backers building the future on a foundation of trust and innovation.
                    </p>
<Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center">
  Create Your Campaign Now <ArrowRight className="ml-2 h-5 w-5" />
</Link>
                </div>
            </section>
        </main>
    );
};

export default IndexPage;