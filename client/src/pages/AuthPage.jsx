import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Users, Mail, Lock, Heart, Upload, Camera } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleProfilePictureChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleCameraCapture = async () => {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera access is not supported in this browser. Please use the upload option.');
      fileInputRef.current.click(); // Fallback to file input
      return;
    }

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.style.display = 'block';
      videoRef.current.play();

      // Show capture button
      const captureButton = document.createElement('button');
      captureButton.textContent = 'Capture Photo';
      captureButton.className = 'mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg';
      captureButton.onclick = () => {
        // Capture the image from video
        const context = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setProfilePicture(dataUrl);

        // Stop the camera stream
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.style.display = 'none';
        captureButton.remove();
      };
      document.getElementById('camera-container').appendChild(captureButton);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access the camera. Please use the upload option.');
      fileInputRef.current.click(); // Fallback to file input
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (isSignUp && !profilePicture) {
      newErrors.profilePicture = 'Profile picture is required.';
    }
    if (isSignUp && !formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      console.log('Validation successful. Redirecting to dashboard...');
      navigate('/dashboard');
    } else {
      console.log('Validation failed. Please fill all required fields.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-800 dark:text-white">DAAN</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {isSignUp ? 'Join our community to make a difference.' : 'Sign in to continue your journey.'}
          </p>
        </div>

        <Card className="p-8">
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                !isSignUp ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`w-full py-2 rounded-md text-sm font-medium transition-colors ${
                isSignUp ? 'bg-white dark:bg-gray-700 text-blue-600 shadow' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleAuthSubmit} noValidate>
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCameraCapture}>
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePictureChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <input
                        type="file"
                        ref={cameraInputRef}
                        onChange={handleProfilePictureChange}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                      />
                    </div>
                  </div>
                  <div id="camera-container" className="mt-4">
                    <video ref={videoRef} className="w-full hidden" />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  {errors.profilePicture && <p className="text-red-500 text-xs mt-1">{errors.profilePicture}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="John Doe"
                      className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              {!isSignUp && (
                <Link to="#" className="font-medium text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or</span>
              </div>
            </div>

            <Button type="button" variant="outline" size="lg" className="w-full">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Sign in with Google
            </Button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-blue-600 hover:underline">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </Card>
      </div>
    </main>
  );
};

export default AuthPage;