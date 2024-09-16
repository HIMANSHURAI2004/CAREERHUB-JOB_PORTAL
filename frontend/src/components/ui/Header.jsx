import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import profile from './profile.jpg';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/user/get-user', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    setIsLoggedIn(true);
                    setUserData(userData);
                } else {
                    setIsLoggedIn(false);
                    setUserData(null);
                }
            } catch (error) {
                setIsLoggedIn(false);
                setUserData(null);
                console.error('Failed to fetch user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    const handleViewAllJobs = (e) => {
        e.preventDefault();
        navigate('login');
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        navigate('signup');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/user/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsLoggedIn(false);
                setUserData(null);
                navigate('/login');
            } else {
                console.error('Failed to logout:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <header className="bg-blue-600 shadow-lg border-b">
            <div className="container mx-auto px-4 py-4 flex flex-wrap flex-row items-center justify-between">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white ">CAREER HUB</div>
                <div className="flex-grow flex justify-center space-x-6">
                    <nav className="flex flex-row space-y-0 space-x-6 ">
                        <a href="/" className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white hover:text-black">Home</a>
                        <a href="#" className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white hover:text-black">Explore</a>
                        <a href="user-dashboard" className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white hover:text-black">Search</a>
                        {isLoggedIn && (
                            <>
                                {userData?.data?.role !== "student" && (
                                    <a href="post-job" className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white hover:text-black">Post a Job</a>
                                )}
                                {userData?.data?.role !== "recruiter" && (
                                    <a href="add-resume" className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white hover:text-black">Add Resume</a>
                                )}
                            </>
                        )}
                    </nav>
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    {isLoggedIn ? (
                        <div className="flex items-center">
                            <Menubar className='border-none bg-blue-600 outline-none'>
                                <MenubarMenu>
                                    <MenubarTrigger className='w-full flex items-center'>
                                        <Avatar>
                                            <AvatarImage src={userData.image || profile} alt={userData.userName} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </MenubarTrigger>
                                    <MenubarContent className='w-[10%]'>
                                        <Link to='/profile'>
                                            <MenubarItem>
                                                View Profile
                                            </MenubarItem>
                                        </Link>
                                        <MenubarItem onClick={handleLogout}>
                                            Logout
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        </div>
                    ) : (
                        <div className='flex flex-grow space-x-2'>
                            <button onClick={handleViewAllJobs} className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl px-3 sm:px-4 py-1 sm:py-2 bg-black text-white sm:rounded-sm rounded-md">Log In</button>
                            <button onClick={handleSignUp} className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl px-3 sm:px-4 py-1 sm:py-2 bg-black text-white sm:rounded-sm rounded-md">Sign Up</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;


