import React, { useState } from 'react';
import jobImage from './authbgimage.png';
import logo from "./careerhublogo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import '../App.css';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleSubmit = async (e) => {
        setErrorMessage("");
        setIsLoading(true);
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/login', formData, {
                withCredentials: true,
            });

            console.log(response)
            
            if (response.data.statusCode >= 400) {
                throw new Error(response.data?.message || 'Failed to Login');
            }
            if (response.data.data.user.role === "admin"){
                navigate('/admin/dashboard')
            }else {
                navigate('/user-dashboard');
            }
        } catch (error) {
            setErrorMessage(error.response.data.message || 'Failed to Login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full h-screen py-12 px-4 sm:px-6 lg:px-20 bg-blue-200 flex items-center justify-center'>
            <div className='w-full max-w-5xl flex flex-col lg:flex-row bg-white shadow-2xl overflow-hidden max-h-[95%]'>
                <div className='w-full lg:w-[60%] flex justify-center py-6 px-6'>
                    <div className="w-full max-w-md flex flex-col gap-y-4 items-center justify-center">
                        <img src={logo} alt="Career Hub Logo" className='w-24 h-6 mx-auto' />
                        <Card className="border-none outline-none w-full">
                            <CardHeader>
                                <CardTitle className="font-bold text-xl lg:text-3xl md:text-2xl text-center lg:text-start md:text-start">
                                    Welcome Back!
                                </CardTitle>
                                <CardDescription className="text-slate-600 text-center lg:text-start md:text-start text-sm">
                                    Login to get Amazing Job offers and Internships for you
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-y-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email" className="font-semibold">
                                                    Email <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email address"
                                                    required
                                                />
                                            </div>
                                            <div className="grid">
                                                <Label htmlFor="password" className="font-semibold pb-2">
                                                    Password <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Enter Password"
                                                    required
                                                />
                                                <div className="text-end my-1">
                                                    <Link to='/forgot-password' className="text-xs text-blue-600 font-medium">
                                                        Forgot Password?
                                                    </Link>
                                                </div>
                                                {errorMessage && (
                                                    <div className="text-red-500 text-sm">{errorMessage}</div>
                                                )}
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-900" disabled={isLoading}>
                                            {isLoading ? (
                                                <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
                                                </svg>
                                            ) : (
                                                'Login'
                                            )}
                                        </Button>
                                    </form>
                                    <div className="text-center text-sm">
                                        Don't have an account?{' '}
                                        <Link to="/signup" className="text-blue-600 font-medium">
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className='w-full lg:w-[40%] hidden lg:block'>
                    <img src={jobImage} alt="Job Image" className='w-full h-full object-cover' />
                </div>
            </div>
        </div>
    );
}

export default Login;

