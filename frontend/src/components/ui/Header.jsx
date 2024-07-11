import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../pages/career-hub-logo-white.png';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const location = useLocation();
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
                    console.log('User data:', userData);
                } else {
                    setIsLoggedIn(false);
                    setUserData(null);
                    console.log('User is not logged in');
                }
            } catch (error) {
                setIsLoggedIn(false);
                setUserData(null);
                console.error('Failed to fetch user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

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
                console.log('User logged out successfully');
                navigate('/login')
            } else {
                console.error('Failed to logout:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-blue-600">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex-shrink-0">
                            <img className="h-8 w-auto" src={logo} alt="Career Hub" />
                        </div>
                        <div className="hidden sm:block">
                            <div className="flex space-x-4">
                                <Link
                                    to={isLoggedIn ? '/' : '/login'}
                                    className={`rounded-md px-3 py-2 text-sm font-medium text-white ${isActive('/') ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
                                >
                                    {isLoggedIn ? 'Home' : 'Login'}
                                </Link>
                                {isLoggedIn ? (
                                    <>
                                        {userData?.data?.role !== "student" && (
                                            <Link
                                                to="/post-job"
                                                className={`rounded-md px-3 py-2 text-sm font-medium text-white ${isActive('/post-job') ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
                                            >
                                                Post Job
                                            </Link>
                                        )}
                                        {userData?.data?.role !== "recruiter" && (
                                            <Link
                                                to="/add-resume"
                                                className={`rounded-md px-3 py-2 text-sm font-medium text-white ${isActive('/add-resume') ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
                                            >
                                                Add Resume
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/signup"
                                        className={`rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 ${isActive('/signup') ? 'bg-gray-900' : ''}`}
                                    >
                                        Sign Up
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    {isLoggedIn && userData && (
                        <div className="relative ml-3">
                            <button
                                type="button"
                                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                id="user-menu-button"
                                aria-expanded="false"
                                aria-haspopup="true"
                            >
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src={userData.image}
                                    alt={userData.userName}
                                />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

