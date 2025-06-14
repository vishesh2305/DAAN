import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Users, Mail, Lock, Heart, Upload, Camera, ShieldCheck, AlertTriangle, LoaderCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../contexts/UserProvider'; // Assuming you have this for login state management

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const navigate = useNavigate();
    const { login } = useUser(); // Let's use a login function from context

    // State for the form
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [errors, setErrors] = useState({});

    // State for Face Verification
    const [docImage, setDocImage] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('Please upload an ID and start verification.');
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Function to start the webcam
    const startWebcam = useCallback(async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            setVerificationMessage("Webcam access denied. Please allow camera access to proceed.");
        }
    }, []);

    // Function to stop the webcam
    const stopWebcam = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);
    
    // Cleanup webcam on component unmount
    React.useEffect(() => {
        return () => stopWebcam();
    }, [stopWebcam]);

    const handleDocImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setDocImage(file);
            // Start webcam as soon as a document is selected
            startWebcam();
        }
    };

    // This function captures a frame from the video, sends it with the doc to the backend
    const handleVerification = async () => {
        if (!docImage) {
            alert("Please upload your document first.");
            return;
        }
        if (!videoRef.current || !videoRef.current.srcObject) {
            alert("Webcam is not active. Please allow camera access.");
            return;
        }

        setIsVerifying(true);
        setVerificationMessage("Verifying... Please follow any on-screen instructions.");

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('document', docImage);
            formData.append('live_face', blob, 'live_face.jpg');

            try {
                const response = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                setVerificationMessage(data.message);

                if (data.message.includes("Verified!")) {
                    setIsVerified(true);
                    stopWebcam(); // Turn off webcam on success
                } else {
                    // Allow user to try again
                }
            } catch (error) {
                console.error("Verification API error:", error);
                setVerificationMessage("Verification service is offline. Please try again later.");
            } finally {
                setIsVerifying(false);
            }
        }, 'image/jpeg');
    };
    
    const handleAuthSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would handle actual sign up/in here
        console.log("Form submitted", formData);
        login(); // Update global auth state
        navigate('/dashboard');
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-6">
                    <Heart className="mx-auto h-12 w-12 text-blue-600" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                        {isSignUp ? 'Create Your Account' : 'Sign In'}
                    </h2>
                </div>

                {/* --- FACE VERIFICATION SECTION --- */}
                {!isVerified && (
                    <div className="mb-6 p-4 border rounded-lg dark:border-gray-700">
                        <h3 className="font-semibold flex items-center mb-2">
                            <ShieldCheck className="h-5 w-5 mr-2 text-blue-500" />
                            Step 1: Identity Verification
                        </h3>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="doc-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload ID Document</label>
                                <input id="doc-upload" type="file" accept="image/*" onChange={handleDocImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            
                            {videoRef.current?.srcObject && (
                                <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-md" />
                            )}

                            <Button onClick={handleVerification} disabled={!docImage || isVerifying} className="w-full">
                                {isVerifying ? <LoaderCircle className="animate-spin" /> : "Start Verification"}
                            </Button>
                            
                            <p className="text-sm text-center text-gray-500 dark:text-gray-300 min-h-[20px]">
                                {verificationMessage}
                            </p>
                        </div>
                    </div>
                )}
                
                {/* --- SIGNUP/LOGIN FORM --- */}
                <div className={`${!isVerified ? 'opacity-30 pointer-events-none' : ''}`}>
                     <h3 className="font-semibold flex items-center mb-2">
                        <Lock className="h-5 w-5 mr-2 text-blue-500" />
                        Step 2: Account Details
                    </h3>
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                        {isSignUp && (
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
                                <input id="fullName" name="fullName" type="text" required className="mt-1 block w-full p-2 border rounded-md" />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Email address</label>
                            <input id="email" name="email" type="email" required className="mt-1 block w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">Password</label>
                            <input id="password" name="password" type="password" required className="mt-1 block w-full p-2 border rounded-md" />
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={!isVerified}>
                            {isSignUp ? 'Create Account & Sign In' : 'Sign In'}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-blue-600 hover:underline">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </Card>
        </main>
    );
};

export default AuthPage;