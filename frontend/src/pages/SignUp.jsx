import { Button } from "@/components/ui/button";
import { useState } from 'react';
import jobImage from './authbgimage.png';
import logo from "./careerhublogo.png"
import { useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        contactNo: '',
        image: '',
        role: 'student',
        companyName: '',
        address: '',
        website: '',
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { id, value, files } = e.target;
        if (id === 'image') {
            setFormData({
                ...formData,
                image: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [id]: value,
            });
        }
    };

    const handleRoleChange = (value) => {
        setFormData({
            ...formData,
            role: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await fetch('http://localhost:3000/api/v1/user/register', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register user');
            }

            navigate('/login');
            const responseData = await response.json();
            // Handle success, redirect user or show success message
            console.log(responseData);
        } catch (error) {
            // Handle error, show error message
            setErrorMessage(error.message || 'Failed to register user');
        }
    };

    return (
        <div className='w-full min-h-screen flex items-center py-6 px-4 sm:px-6 lg:px-28 bg-blue-200'>
            <div className='min-w-full flex flex-col  lg:flex-row bg-white shadow-2xl overflow-hidden max-w-screen-lg mx-auto '>
                <div className='lg:w-[60%] flex justify-center py-4'>
                    <div className="w-full  md:w-[80%] lg:max-w-lg flex flex-col px-6 items-center justify-center">
                        <img src={logo} alt="" className="w-24 h-6 mx-auto"/>
                        <div className="my-4">
                            <h2 className="font-bold text-xl lg:text-3xl md:text-2xl text-center lg:text-start md:text-start">Create your Account</h2>
                            <p className="text-slate-700 text-sm ">Join us today and take the first step towards your next great opportunity.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="userName">Username <span className="text-red-500">*</span></Label>
                                <Input
                                    id="userName"
                                    type="text"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="contactNo">Contact No. <span className="text-red-500">*</span></Label>
                                <Input
                                    id="contactNo"
                                    type="tel"
                                    value={formData.contactNo}
                                    onChange={handleChange}
                                    placeholder="XXXXXXXXXX"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                                    <Select onValueChange={handleRoleChange}>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="student">Student</SelectItem>
                                                <SelectItem value="recruiter">Recruiter</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="image">Image</Label>
                                    <Input id="image" type="file" onChange={handleChange} />
                                </div>
                            </div>
                            {formData.role === 'recruiter' && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="companyName"
                                            type="text"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="Company Name"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Address"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                </>
                            )}
                            {errorMessage && (
                                <div className="text-red-500 text-sm">{errorMessage}</div>
                            )}
                            <Button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-800">
                                Create Account
                            </Button>
                        </form>
                        <div className="text-center text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-600">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='lg:w-[40%] hidden lg:block '>
                    <img src={jobImage} alt="img" className='w-full h-full object-cover' />
                </div>
            </div>
        </div>
    );
}

export default SignUp;
