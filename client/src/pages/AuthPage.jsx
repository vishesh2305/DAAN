import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LoaderCircle, Lock, Heart, User, Calendar, Home, Mail, Camera, AlertTriangle, Info } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useUser } from '../contexts/UserProvider';

// A small helper component for styled inputs with icons
const InputGroup = ({ icon, children }) => (
    <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400 dark:text-gray-500">
            {icon}
        </span>
        {React.cloneElement(children, { className: `${children.props.className} pl-10` })}
    </div>
);

// A helper to render the verification message with appropriate icon and color
const VerificationStatus = ({ message, isVerifying, isVerified }) => {
    let Icon = Info;
    let colorClass = 'text-gray-500 dark:text-gray-400';

    if (isVerifying) {
        Icon = () => <LoaderCircle className="animate-spin h-5 w-5" />;
        colorClass = 'text-blue-600 dark:text-blue-400';
    } else if (isVerified) {
        Icon = ShieldCheck;
        colorClass = 'text-green-600 dark:text-green-400';
    } else if (message.toLowerCase().includes('failed') || message.toLowerCase().includes('error') || message.toLowerCase().includes('denied')) {
        Icon = AlertTriangle;
        colorClass = 'text-red-600 dark:text-red-400';
    }

    return (
        <div className={`flex items-center justify-center gap-2 text-sm p-2 rounded-md bg-gray-50 dark:bg-gray-800/50 min-h-[40px] ${colorClass}`}>
            <Icon className="h-5 w-5" />
            <p>{message}</p>
        </div>
    );
};


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
        password: '',
        coordinates: { lat: null, lng: null }
    });

    const [docImage, setDocImage] = useState(null);
    const [docImageBase64, setDocImageBase64] = useState(null);
    const [selfieBase64, setSelfieBase64] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showWebcam, setShowWebcam] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState('Please upload an Aadhar Card to begin.');

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // Fetch coordinates from IP
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    coordinates: {
                        lat: data.latitude,
                        lng: data.longitude
                    }
                }));
            } catch (err) {
                console.error("📡 Location fetch failed:", err);
            }
        };
        fetchLocation();
    }, []);

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
                    console.error("Webcam error:", err);
                    setVerificationMessage("Webcam access denied. Please enable camera permissions.");
                    setShowWebcam(false);
                }
            }
        };
        startWebcam();
        return () => stopWebcam();
    }, [showWebcam, stopWebcam]);

    const handleDocImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setDocImage(file);
            setShowWebcam(true);
            setVerificationMessage('Document selected. Position your face and click Verify.');

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setDocImageBase64(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVerification = async () => {
        if (!docImage || !videoRef.current?.srcObject?.active || videoRef.current.videoWidth === 0) {
            setVerificationMessage("Camera not ready. Please wait a moment and try again.");
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
                setVerificationMessage("Failed to capture face. Please try again.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setSelfieBase64(base64String);
            };
            reader.readAsDataURL(blob);

            const apiFormData = new FormData();
            apiFormData.append('document', docImage);
            apiFormData.append('live_face', blob, 'live_face.jpg');

            try {
                const response = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: apiFormData,
                });

                const data = await response.json();

                if (response.ok && data.verification_status === "Verified") {
                    setVerificationMessage(data.message || "Verification successful!");
                    setIsVerified(true);
                    setShowWebcam(false);
                    stopWebcam();
                    setFormData(prev => ({
                        ...prev,
                        fullName: data.extracted_data.name || '',
                        dob: data.extracted_data.dob || '',
                        address: data.extracted_data.address || ''
                    }));
                } else {
                    setVerificationMessage(data.message || "Verification failed. The face may not match the ID.");
                    setIsVerified(false);
                }
            } catch (error) {
                console.error("Verification API Error:", error);
                setVerificationMessage("Verification failed. The server might be offline.");
            } finally {
                setIsVerifying(false);
            }
        }, 'image/jpeg');
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        const apiEndpoint = isSignUp ? "http://localhost:3000/api/signup" : "http://localhost:3000/api/login";
        const isLogin = !isSignUp;

        const bodyPayload = isLogin ? {
            email: formData.email,
            password: formData.password
        } : {
            name: formData.fullName,
            dob: formData.dob,
            location: formData.address,
            email: formData.email,
            password: formData.password,
            govtImage: docImageBase64,
            selfieImage: selfieBase64,
            blockchainAddress: "0x123abc456def789ghi", // Replace with actual address
            coordinates: formData.coordinates,
        };

        try {
            const res = await fetch(apiEndpoint, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyPayload),
            });

            const data = await res.json();
            if (res.ok) {
                login(data.user || formData);
                navigate("/dashboard");
            } else {
                alert(`${isLogin ? 'Login' : 'Signup'} failed: ${data.error}`);
            }
        } catch (err) {
            console.error(`${isLogin ? 'Login' : 'Signup'} error:`, err);
            alert(`${isLogin ? 'Login' : 'Signup'} failed due to a network error.`);
        }
    };
    
    const resetAuthState = (targetIsSignUp) => {
        setIsSignUp(targetIsSignUp);
        setIsVerified(false);
        setShowWebcam(false);
        setDocImage(null);
        setDocImageBase64(null);
        setSelfieBase64(null);
        setVerificationMessage('Please upload an Aadhar Card to begin.');
        setFormData({ ...formData, email: '', password: '' });
        stopWebcam();
    };


    const renderVerificationStep = () => (
        <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold text-center text-lg flex items-center justify-center gap-2">
                <ShieldCheck className="h-6 w-6 text-blue-500" />
                Step 1: Identity & Face Verification
            </h3>

            <div>
                <label htmlFor="doc-upload" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Upload Aadhaar Card</label>
                <label htmlFor="doc-upload" className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            {docImage ? <span className="font-semibold">{docImage.name}</span> : <span><span className="font-semibold">Click to upload</span> or drag and drop</span>}
                        </p>
                    </div>
                    <input id="doc-upload" type="file" accept="image/*" onChange={handleDocImageChange} className="opacity-0 w-0 h-0" />
                </label>
            </div>
            
            {showWebcam && (
                <div className="space-y-2 animate-fade-in">
                     <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">Live Selfie Preview</p>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg border-2 dark:border-gray-700 aspect-video object-cover bg-gray-200 dark:bg-gray-800" />
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            )}

            <Button onClick={handleVerification} disabled={!docImage || isVerifying || !showWebcam} className="w-full !mt-6">
                {isVerifying ? (
                    <>
                        <LoaderCircle className="animate-spin mr-2 h-5 w-5" /> Verifying...
                    </>
                ) : (
                    <>
                        <Camera className="mr-2 h-5 w-5" /> Verify Identity
                    </>
                )}
            </Button>
            
            <VerificationStatus message={verificationMessage} isVerifying={isVerifying} isVerified={isVerified} />
        </div>
    );

    const renderAuthForm = () => (
        <form onSubmit={handleAuthSubmit} className="space-y-4 animate-fade-in">
            {isSignUp && (
                 <div className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-3">
                    <h3 className="font-semibold text-center text-lg flex items-center justify-center gap-2 mb-3">
                         <User className="h-6 w-6 text-green-500" />
                         Step 2: Complete Your Profile
                    </h3>
                    <div className="text-sm">
                        <label className="font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                        <p className="p-2 rounded-md bg-white dark:bg-gray-700/50 mt-1">{formData.fullName || 'N/A'}</p>
                    </div>
                     <div className="text-sm">
                        <label className="font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                        <p className="p-2 rounded-md bg-white dark:bg-gray-700/50 mt-1">{formData.dob || 'N/A'}</p>
                    </div>
                      <div className="text-sm">
                        <label className="font-medium text-gray-500 dark:text-gray-400">Address</label>
                        <p className="p-2 rounded-md bg-white dark:bg-gray-700/50 mt-1">{formData.address || 'N/A'}</p>
                    </div>
                 </div>
            )}

            <InputGroup icon={<Mail size={18} />}>
                <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleFormInputChange} required className="block w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500" />
            </InputGroup>

            <InputGroup icon={<Lock size={18} />}>
                <input name="password" type="password" placeholder="Password" onChange={handleFormInputChange} required className="block w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500" />
            </InputGroup>

            <Button type="submit" size="lg" className="w-full !mt-6" disabled={isSignUp && !isVerified}>
                {isSignUp ? 'Create Account & Sign In' : 'Sign In'}
            </Button>
        </form>
    );

    return (
        <main className="min-h-screen  flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <Card className=" p-4 w-full max-w-md shadow-xl transition-all duration-500 ease-in-out">
                <div className="text-center mb-8">
                    <Heart className="mx-auto h-12 w-12 text-blue-600" />
                    <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{isSignUp ? 'Create Your Secure Account' : 'Welcome Back'}</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {isSignUp ? 'Verify your identity to get started.' : 'Sign in to access your account.'}
                    </p>
                </div>

                {isSignUp ? (
                    isVerified ? renderAuthForm() : renderVerificationStep()
                ) : (
                    renderAuthForm()
                )}

                <p className="text-center text-sm text-gray-500 mt-8">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => resetAuthState(!isSignUp)} className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </Card>
        </main>
    );
};

export default AuthPage;