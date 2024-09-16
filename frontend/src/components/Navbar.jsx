import  { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import profile from '../../assets/profile.jpg'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/get-user`, {
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            setIsLoggedIn(false);
            setUserData(null);
            navigate('/login')
        } else {
            console.error('Failed to logout:', response.statusText);
        }
    } catch (error) {
        console.error('Failed to logout:', error);
    }
};
  return (
    <div>
        <header className="flex justify-between items-center px-6 py-4 bg-blue-600  shadow-lg border-b ">
        <div className="text-xl font-bold text-white">CAREER HUB</div>
        <div className="flex flex-grow justify-center space-x-6">
          <nav className="space-x-10 ">
            <a href="/" className="text-white hover:text-black">Home</a>
            <a href="user-dashboard" className="text-white hover:text-black">Search</a>
            {
              isLoggedIn && (
                <>
                  {userData?.data?.role !== "student" && (
                      <a href="post-job" className="text-white hover:text-black">Post a Job</a>
                  )}
                  {userData?.data?.role !== "recruiter" && (
                      <a href="add-resume" className="text-white hover:text-black">Add Resume</a>
                  )}
              </>
              )
            }
            <a href="about-us" className="text-white hover:text-black">About us</a>
          </nav>
        </div>
        {
          isLoggedIn ? (
            <div className="flex space-x-4" >
            </div>
          ) : (
            <div className="flex space-x-4" >
              <button onClick={handleViewAllJobs} className="px-4 py-2 bg-black text-white rounded-md">Log In</button>
              <button onClick={handleSignUp} className="px-4 py-2 bg-black text-white rounded-md">Sign Up</button>
            </div>
          )
        }
        {isLoggedIn && userData && (
                        <div className="relative ml-3">
                            <Menubar className='border-none bg-blue-600 outline-none'>
                                <MenubarMenu className=''>
                                    <MenubarTrigger className='w-full '>
                                        <Avatar>
                                            <AvatarImage src={userData.image || profile} alt={userData.userName} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        
                                    </MenubarTrigger>
                                    <MenubarContent className='w-[10%] bg-white'>
                                        <Link to='/profile'>
                                            <MenubarItem className>
                                                View Profile
                                            </MenubarItem>
                                        </Link>

                                        {
                                            isLoggedIn && (
                                                <MenubarItem onClick={handleLogout}>
                                                    Logout
                                                </MenubarItem>

                                            )
                                        }
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        </div>
                    )}

      </header>
    </div>
  )
}

export default Navbar