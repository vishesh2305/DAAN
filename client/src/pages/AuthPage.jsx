import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LoaderCircle, Lock, Heart, User, Calendar, Home, Mail, Camera } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../contexts/UserProvider';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUser();

    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        address: '',
        email: '',
        password: ''
    });

    const [docImage, setDocImage] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showWebcam, setShowWebcam] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('Please upload an Aadhar Card to begin.');

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        if (location.state?.isSignUp !== undefined) {
            setIsSignUp(location.state.isSignUp);
        }
    }, [location.state]);

    const stopWebcam = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        const startWebcam = async () => {
            if (showWebcam && navigator.mediaDevices?.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Error accessing webcam:", err);
                    setVerificationMessage("Webcam access denied.");
                    setShowWebcam(false);
                }
            }
        };
        startWebcam();
        return () => stopWebcam();
    }, [showWebcam, stopWebcam]);

    const handleDocImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setDocImage(file);
            setShowWebcam(true);
            setVerificationMessage('Document selected. Position your face and click Verify.');

            // Convert to binary and log
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const uint8Array = new Uint8Array(arrayBuffer);
                console.log("📄 Document Image (Binary):", uint8Array);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVerification = async () => {
        if (!docImage || !videoRef.current?.srcObject?.active || videoRef.current.videoWidth === 0) {
            alert("Please upload a document and ensure the camera is ready.");
            return;
        }

        setIsVerifying(true);
        setVerificationMessage("Analyzing ID and face... Please hold still.");

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) {
                setIsVerifying(false);
                setVerificationMessage("Failed to capture face. Try again.");
                return;
            }

            // Convert selfie blob to binary and log
            const selfieBuffer = await blob.arrayBuffer();
            const selfieBinary = new Uint8Array(selfieBuffer);
            console.log("📸 Selfie Image (Binary):", selfieBinary);

            const apiFormData = new FormData();
            apiFormData.append('document', docImage);
            apiFormData.append('live_face', blob, 'live_face.jpg');

            try {
                const response = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: apiFormData,
                });

                const data = await response.json();
                setVerificationMessage(data.message);
                console.log("✅ Backend Response:", data);

                if (response.ok && data.verification_status === "Verified") {
                    setIsVerified(true);
                    setShowWebcam(false);

                    // Log extracted values
                    console.log("📌 Extracted Name:", data.extracted_data?.name);
                    console.log("📌 Extracted DOB:", data.extracted_data?.dob);
                    console.log("📌 Extracted Address:", data.extracted_data?.address);

                    setFormData(prev => ({
                        ...prev,
                        fullName: data.extracted_data.name || 'Could not read name',
                        dob: data.extracted_data.dob || 'Could not read DOB',
                        address: data.extracted_data.address || 'Could not read address',
                    }));
                }
            } catch (error) {
                console.error("Verification API Error:", error);
                setVerificationMessage("Verification failed. Server might be offline.");
            } finally {
                setIsVerifying(false);
            }
        }, 'image/jpeg');
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        console.log("🚀 Submitting Registration Form:", formData);
        login(formData);
        navigate('/dashboard');
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-lg">
                <div className="text-center mb-6">
                    <Heart className="mx-auto h-12 w-12 text-blue-600" />
                    <h2 className="mt-4 text-2xl font-bold">{isSignUp ? 'Create Your Secure Account' : 'Sign In'}</h2>
                </div>

                {!isVerified && isSignUp && (
                    <div className="mb-6 p-4 border rounded-lg dark:border-gray-700">
                        <h3 className="font-semibold flex items-center mb-2">
                            <ShieldCheck className="h-5 w-5 mr-2 text-blue-500" />
                            Step 1: Identity & Face Verification
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="doc-upload" className="block text-sm font-medium">Upload Aadhaar Card Image</label>
                                <input id="doc-upload" type="file" accept="image/*" onChange={handleDocImageChange} className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            {showWebcam && (
                                <>
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-md border bg-gray-200" />
                                    <canvas ref={canvasRef} className="hidden"></canvas>
                                </>
                            )}
                            <Button onClick={handleVerification} disabled={!docImage || isVerifying} className="w-full">
                                {isVerifying ? <LoaderCircle className="animate-spin" /> : <><Camera className="mr-2 h-4 w-4" />Verify Identity</>}
                            </Button>
                            <p className="text-sm text-center min-h-[20px]">{verificationMessage}</p>
                        </div>
                    </div>
                )}

                {isVerified && isSignUp && (
                    <div className="p-4 text-center bg-green-100 dark:bg-green-900/50 rounded-lg mb-4">
                        <ShieldCheck className="h-8 w-8 mx-auto text-green-600" />
                        <p className="font-semibold mt-2 text-green-800 dark:text-green-200">Verification Successful!</p>
                        <p className="text-sm text-green-700 dark:text-green-300">Please confirm your details and set a password.</p>
                    </div>
                )}

                <div className={`${isSignUp && !isVerified ? 'opacity-30 pointer-events-none' : ''}`}>
                    <h3 className="font-semibold flex items-center mb-2">
                        <Lock className="h-5 w-5 mr-2 text-blue-500" />
                        {isSignUp ? 'Step 2: Confirm & Secure Your Account' : 'Login to your account'}
                    </h3>
                    <form onSubmit={handleAuthSubmit} className="space-y-4 mt-4">
                        {isSignUp && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium"><User className="text-gray-400 w-4 h-4" />Full Name</label>
                                    <input id="fullName" name="fullName" value={formData.fullName} readOnly className="block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="dob" className="flex items-center gap-2 text-sm font-medium"><Calendar className="text-gray-400 w-4 h-4" />Date of Birth</label>
                                    <input id="dob" name="dob" value={formData.dob} readOnly className="block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium"><Home className="text-gray-400 w-4 h-4" />Address</label>
                                    <textarea id="address" name="address" value={formData.address} readOnly className="block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-800 cursor-not-allowed" rows="3" />
                                </div>
                            </>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium"><Mail className="text-gray-400 w-4 h-4" />Email Address</label>
                            <input id="email" name="email" type="email" required onChange={handleFormInputChange} value={formData.email} placeholder="you@example.com" className="mt-1 block w-full p-2 border rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Password</label>
                            <input id="password" name="password" type="password" required placeholder="••••••••" className="mt-1 block w-full p-2 border rounded-md" />
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={isSignUp && !isVerified}>
                            {isSignUp ? 'Create Account & Sign In' : 'Sign In'}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button onClick={() => {
                        setIsSignUp(!isSignUp);
                        setIsVerified(false);
                        setShowWebcam(false);
                        setDocImage(null);
                        setVerificationMessage('Please upload an ID to begin.');
                    }} className="font-medium text-blue-600 hover:underline">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </Card>
        </main>
    );
};

export default AuthPage;
