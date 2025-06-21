import React, { useState, useEffect, useRef, useCallback } from 'react';
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
                    setVerificationMessage("Webcam access denied.");
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
                setVerificationMessage(data.message);

                if (response.ok && data.verification_status === "Verified") {
                    setIsVerified(true);
                    setShowWebcam(false);

                    setFormData(prev => ({
                        ...prev,
                        fullName: data.extracted_data.name || '',
                        dob: data.extracted_data.dob || '',
                        address: data.extracted_data.address || ''
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

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        if (isSignUp) {
            // SIGNUP FLOW
            try {
                const res = await fetch("http://localhost:3000/api/signup", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formData.fullName,
                        dob: formData.dob,
                        location: formData.address,
                        email: formData.email,
                        password: formData.password,
                        govtImage: docImageBase64,
                        selfieImage: selfieBase64,
                        blockchainAddress: "0x123abc456def789ghi",
                        coordinates: formData.coordinates,
                    }),
                });

                const data = await res.json();
                if (res.ok) {
                    login(data.user || formData); // fallback to local
                    navigate("/dashboard");
                } else {
                    alert("Signup failed: " + data.error);
                }
            } catch (err) {
                console.error("Signup error:", err);
                alert("Signup failed.");
            }

        } else {
            // LOGIN FLOW
            try {
                const res = await fetch("http://localhost:3000/api/login", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    }),
                });

                const data = await res.json();
                if (res.ok) {
                    login(data.user);
                    navigate("/dashboard");
                } else {
                    alert("Login failed: " + data.error);
                }
            } catch (err) {
                console.error("Login error:", err);
                alert("Login failed.");
            }
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-lg">
                {/* Top header */}
                <div className="text-center mb-6">
                    <Heart className="mx-auto h-12 w-12 text-blue-600" />
                    <h2 className="mt-4 text-2xl font-bold">{isSignUp ? 'Create Your Secure Account' : 'Sign In'}</h2>
                </div>

                {/* Step 1 - Verification */}
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

                {/* Step 2 - Auth Form */}
                <form onSubmit={handleAuthSubmit} className={`${isSignUp && !isVerified ? 'opacity-30 pointer-events-none' : ''} space-y-4 mt-4`}>
                    {isSignUp && (
                        <>
                            <label className="block text-sm font-medium">Full Name</label>
                            <input name="fullName" value={formData.fullName} readOnly className="block w-full p-2 border rounded-md bg-gray-100" />
                            <label className="block text-sm font-medium">Date of Birth</label>
                            <input name="dob" value={formData.dob} readOnly className="block w-full p-2 border rounded-md bg-gray-100" />
                            <label className="block text-sm font-medium">Address</label>
                            <textarea name="address" value={formData.address} readOnly className="block w-full p-2 border rounded-md bg-gray-100" />
                        </>
                    )}
                    <label className="block text-sm font-medium">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleFormInputChange} required className="block w-full p-2 border rounded-md" />
                    <label className="block text-sm font-medium">Password</label>
                    <input name="password" type="password" onChange={handleFormInputChange} required className="block w-full p-2 border rounded-md" />
                    <Button type="submit" size="lg" className="w-full" disabled={isSignUp && !isVerified}>
                        {isSignUp ? 'Create Account & Sign In' : 'Sign In'}
                    </Button>
                </form>

                {/* Toggle link */}
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
