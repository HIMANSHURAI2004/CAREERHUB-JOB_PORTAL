import { Button } from "@/components/ui/button";
import { useState } from 'react';
import jobImage from '../../assets/authbgimage.png';
import logo from "../../assets/careerhublogo.png";
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
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
        setErrorMessage('');
        setIsLoading(true);

        if (formData.password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response1 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/preRegisterValidation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email : formData.email,
                    password : formData.password,
                    userName : formData.userName,
                    contactNo : formData.contactNo,
                    role : formData.role
                }),
            });

            if (!response1.ok) {
                const errorData = await response1.json();
                throw new Error(errorData.message || 'Failed to register user');
            }
            // const responseData = await response1.json();
        } catch (error) {
            setErrorMessage(error.message || 'Failed to register user');
            setIsLoading(false)
            return;
        }

            try {
                const response2 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/sendRegisterOTP`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                     body: JSON.stringify({ email: formData.email }),
                });
                if (!response2.ok) {
                    const errorData = await response2.json();
                    throw new Error(errorData.message || 'Failed to register user');
                }
                const responseData = await response2.json();
                setOtpToken(responseData.data);
                setIsLoading(false)
                setStep(2);
            } catch (error) {
                setErrorMessage(error.message || 'Failed to register user');
                setIsLoading(false)
                return;
            }

    };

    const handleVerifyOTP = async (e) => {
        setErrorMessage('');
        setIsLoading(true);
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('userName', formData.userName);
            formDataToSend.append('contactNo', formData.contactNo);
            formDataToSend.append('role', formData.role);
            formDataToSend.append('companyName', formData.companyName);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('website', formData.website);
            formDataToSend.append('otp', otp);
            formDataToSend.append('otpToken', otpToken);
            formDataToSend.append('image', formData.image);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/register`, {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to verify OTP');
            }
            alert("Registration successful");
            navigate('/login');
        } catch (error) {
            setIsLoading(false);
            setErrorMessage(error.message || 'Failed to verify OTP');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prev => !prev);
    };


return (
    <div className='w-full min-h-screen flex items-center py-6 px-4 sm:px-6 lg:px-28 bg-blue-200'>
        <div className='min-w-full flex flex-col lg:flex-row bg-white shadow-2xl overflow-hidden max-w-screen-lg mx-auto'>
            <div className='lg:w-[60%] flex justify-center py-4'>
                <div className='w-full md:w-[80%] lg:max-w-lg flex flex-col px-6 items-center justify-center'>
                    <img src={logo} alt='' className='w-24 h-6 mx-auto' />
                    <div className='my-4'>
                        <h2 className='font-bold text-xl lg:text-3xl md:text-2xl text-center lg:text-start md:text-start'>
                            Create your Account
                        </h2>
                        <p className='text-slate-700 text-sm'>
                            Join us today and take the first step towards your next great
                            opportunity.
                        </p>
                    </div>
                    {step === 1 && (
                        <form onSubmit={handleSubmit} className='grid gap-4'>
                            <div className='grid gap-2'>
                                <Label htmlFor='userName'>
                                    Username <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='userName'
                                    type='text'
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder='John'
                                    required
                                />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='email'>
                                    Email <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='email'
                                    type='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder='m@example.com'
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='password'>
                                        Password <span className='text-red-500'>*</span>
                                    </Label>
                                    <div className='relative'>
                                        <Input
                                            id='password'
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type='button'
                                            className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-600'
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
                                        </button>
                                    </div>
                                </div>
                                <div className='grid gap-2'>
                                    <Label htmlFor='confirmPassword'>
                                        Confirm Password{' '}
                                        <span className='text-red-500'>*</span>
                                    </Label>
                                    <div className='relative'>
                                        <Input
                                            id='confirmPassword'
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type='button'
                                            className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-600'
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {showConfirmPassword ? <RiEyeOffFill /> : <RiEyeFill />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='contactNo'>
                                    Contact No. <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='contactNo'
                                    type='tel'
                                    value={formData.contactNo}
                                    onChange={handleChange}
                                    placeholder='XXXXXXXXXX'
                                    required
                                />
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='role'>
                                        Role <span className='text-red-500'>*</span>
                                    </Label>
                                    <Select onValueChange={handleRoleChange}>
                                        <SelectTrigger className=''>
                                            <SelectValue placeholder='Student' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value='student'>Student</SelectItem>
                                                <SelectItem value='recruiter'>Recruiter</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='grid w-full items-center gap-1.5'>
                                    <Label htmlFor='image'>Image</Label>
                                    <Input id='image' type='file' onChange={handleChange} />
                                </div>
                            </div>
                            {formData.role === 'recruiter' && (
                                <>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='companyName'>
                                            Company Name{' '}
                                            <span className='text-red-500'>*</span>
                                        </Label>
                                        <Input
                                            id='companyName'
                                            type='text'
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder='Company Name'
                                            required
                                        />
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='address'>
                                            Address <span className='text-red-500'>*</span>
                                        </Label>
                                        <Input
                                            id='address'
                                            type='text'
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder='Address'
                                            required
                                        />
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='website'>Website</Label>
                                        <Input
                                            id='website'
                                            type='url'
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder='https://example.com'
                                        />
                                    </div>
                                </>
                            )}
                            {errorMessage && (
                                <p className='text-red-500 text-sm text-center col-span-2'>
                                    {errorMessage}
                                </p>
                            )}
                            <Button type='submit' className="mt-4 w-full  bg-blue-600 hover:bg-blue-800">
                                {isLoading ? 
                                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
                                    </svg>
                                : 'Sign Up'}
                            </Button>
                        </form>
                    )}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className='grid gap-4'>
                            <div className='grid gap-2'>
                                <Label htmlFor='otp'>
                                    OTP <span className='text-red-500'>*</span>
                                </Label>
                                <Input
                                    id='otp'
                                    type='text'
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder='Enter OTP'
                                    required
                                />
                            </div>
                            {errorMessage && (
                                <p className='text-red-500 text-sm text-center'>
                                    {errorMessage}
                                </p>
                            )}
                            <Button type='submit' className="mt-4 w-full  bg-blue-600 hover:bg-blue-800">
                                {isLoading ? 
                                    <svg className="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
                                    </svg>
                                : 'Verify OTP'}
                            </Button>
                        </form>
                    )}
                    <div className='my-4 text-center'>
                        <p className='text-sm'>
                            Already have an account?{' '}
                            <Link to='/login' className='text-blue-600'>
                                Log In
                            </Link>
                        </p>
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
