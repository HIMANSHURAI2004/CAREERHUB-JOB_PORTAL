import React, { useState } from 'react';
import axios from 'axios';
import logo from "./careerhublogo.png";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import '../App.css';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        setErrorMessage('');
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/forgot-password', { email });
            setOtpToken(response.data.otpToken);
            setStep(2);
        } catch (error) {
            console.error("Error sending OTP:", error);
            setErrorMessage(error.response?.data.message || 'Email does not exist');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setErrorMessage('');
        setIsLoading(true);
        try {
            await axios.post('http://localhost:3000/api/v1/user/verify-otp', { email, otp, otpToken });
            setStep(3);
        } catch (error) {
            console.error("Error verifying OTP:", error);
            if (error.response.data.message === 'jwt expired'){
                setErrorMessage('OTP expired. Please sign in again')
                setTimeout(()=>{
                    setOTP('')
                    setStep(1)
                },2000)
            }else{
                setErrorMessage(error.response?.data.message || 'Invalid OTP. Please enter latest OTP');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setErrorMessage('');
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/reset-password', { newPassword }, {
                headers: { Authorization: `Bearer ${otpToken}` }
            });
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error("Error resetting password:", error);
            if (error.response?.data.message === 'jwt expired') {
                setErrorMessage('OTP expired. Please try again.');
                setTimeout(() => {
                    setOTP('');
                    setStep(1);
                }, 2000);
            } else {
                setErrorMessage(error.response?.data.message || 'Error resetting password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className='w-full h-screen py-12 px-4 sm:px-6 lg:px-20 bg-blue-200 flex items-center justify-center'>
            <div className='w-1/2 md:p-16 max-w-5xl flex flex-col lg:flex-row bg-white shadow-2xl overflow-hidden max-h-[95%]'>
                <div className='w-full lg:w-[100%] flex justify-center py-6 px-6'>
                    <div className="w-full max-w-md flex flex-col gap-y-3 items-center justify-center">
                        <img src={logo} alt="Career Hub Logo" className='w-24 h-6 mx-auto' />
                            <Card className="border-none outline-none w-full">
                                <CardHeader>
                                    <CardTitle className="font-bold text-xl lg:text-3xl md:text-2xl text-center lg:text-start md:text-start">
                                        {step === 1 && "Forgot Password"}
                                        {step === 2 && "Verify OTP"}
                                        {step === 3 && "Reset Password"}
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 text-center lg:text-start md:text-start text-sm sm:mb-4">
                                        {step === 1 && "Enter your email to receive an OTP."}
                                        {step === 2 && "Enter the OTP sent to your email."}
                                        {step === 3 && "Enter your old and new password."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {step === 1 && (
                                        <>
                                            <Label htmlFor="email" className="font-semibold">
                                                Email <span className="text-red-500">*</span>
                                            </Label>
                                            <div className='mt-2'>
                                                <Input
                                                    id="email"
                                                    placeholder="Enter you email address here"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            {errorMessage && (
                                                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
                                            )}
                                            <Button onClick={handleForgotPassword} className="mt-4 w-full  bg-blue-600 hover:bg-blue-800" disabled={isLoading}>
                                                {isLoading ? 
                                                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
                                                    </svg>
                                                 : 'Send OTP'}
                                            </Button>
                                            <div className="text-center text-sm">
                                                Back to login ?{' '}
                                                <Link to="/login" className="font-semibold text-blue-600">
                                                    Sign in
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                    {step === 2 && (
                                        <>

                                            <Label htmlFor="otp" className="font-semibold">
                                                OTP <span className="text-red-500">*</span>
                                            </Label>
                                            <div className='mt-2'>
                                            <Input
                                                id="otp"
                                                    placeholder="Enter OTP here"
                                                    value={otp}
                                                    onChange={(e) => setOTP(e.target.value)}
                                                />
                                            </div>
                                            {errorMessage && (
                                                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
                                            )}
                                            <Button onClick={handleVerifyOTP} className="mt-4 w-full  bg-blue-600 hover:bg-blue-800"disabled={isLoading}>
                                                {isLoading ? 
                                                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
                                                    </svg>
                                                : 'Verify OTP'}
                                            </Button>
                                            <div className="text-center text-sm">
                                                Back to login ?{' '}
                                                <Link to="/login" className="font-semibold text-blue-600">
                                                    Sign in
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                    {step === 3 && (
                                        <>
                                            <div className='mt-1'>
                                                <Label htmlFor="newPassword" className="font-semibold">
                                                        New Password <span className="text-red-500">*</span>
                                                </Label>
                                            </div>
                                            <div className='mt-2'>
                                                <Input
                                                id="newPassword"
                                                    placeholder="Enter your new password here"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-4 w-4 text-blue-500"
                                                    onChange={togglePasswordVisibility}
                                                    checked={showPassword}
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Show Password</span>
                                            </div>
                                            <div className="mt-4">
                                            {errorMessage && (
                                                <div className="text-red-500 text-sm mt-4">{errorMessage}</div>
                                            )}
                                            <Button onClick={handleResetPassword} className="mt-2 w-full  bg-blue-600 hover:bg-blue-800" disabled={isLoading}>
                                                {isLoading ? 
                                                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
                                                    </svg>
                                                 : 'Reset Password'}
                                            </Button>
                                            <div className="text-center text-sm">
                                                Back to login ?{' '}
                                                <Link to="/login" className="font-semibold text-blue-600">
                                                    Sign in
                                                </Link>
                                            </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default ForgotPassword;