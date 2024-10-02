import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import profile from '../../assets/profile.jpg';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { FiMenu } from 'react-icons/fi'; // Icon for the hamburger menu
import { IoClose } from 'react-icons/io5'; // Icon for closing the sidebar

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        console.log(response);
        if (response.ok) {
          const userData = await response.json();
          console.log(userData)
          setIsLoggedIn(true);
          setUserData(userData);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserData(null);
        console.log('Failed to fetch user:', error);
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
        navigate('/login');
      } else {
        console.error('Failed to logout:', response.statusText);
      }
    } catch (error) {
      console.log(error)
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center px-6 py-4 bg-blue-600 shadow-lg border-b relative">
        <div className="text-xl font-bold text-white">CAREERHUB</div>

        {/* Hamburger Menu for small screens */}
        <div className="md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiMenu className="text-white text-3xl" />
          </button>
        </div>

        {/* Links for medium and larger screens */}
        <div className="hidden md:flex flex-grow justify-center space-x-6">
          <nav className="space-x-10 ">
            <a href="/" className="text-white hover:text-black">Home</a>
            <a href="user-dashboard" className="text-white hover:text-black">Search</a>
            {isLoggedIn && (
              <>
                {userData?.data?.role !== 'student' && (
                  <a href="post-job" className="text-white hover:text-black">Post a Job</a>
                )}
                {userData?.data?.role !== 'recruiter' && (
                  <a href="add-resume" className="text-white hover:text-black">Add Resume</a>
                )}
              </>
            )}
            <a href="about-us" className="text-white hover:text-black">About us</a>
          </nav>
        </div>

        {/* Authentication buttons */}
        {isLoggedIn ? (
          <div className="hidden md:flex space-x-4">
            {/* User Avatar */}
            {isLoggedIn && userData && (
              <div className="relative ml-3">
                <Menubar className="border-none bg-blue-600 outline-none">
                  <MenubarMenu>
                    <MenubarTrigger className="w-full">
                      <Avatar>
                        <AvatarImage src={userData.image || profile} alt={userData.userName} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </MenubarTrigger>
                    <MenubarContent className="w-[10%] bg-white">
                      <Link to="/profile">
                        <MenubarItem>View Profile</MenubarItem>
                      </Link>
                      {isLoggedIn && (
                        <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
                      )}
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex space-x-4">
            <button onClick={handleViewAllJobs} className="px-4 py-2 bg-black text-white rounded-md">Log In</button>
            <button onClick={handleSignUp} className="px-4 py-2 bg-black text-white rounded-md">Sign Up</button>
          </div>
        )}

        {/* Sidebar for small screens */}
        {isSidebarOpen && (
          <div className="fixed top-0 left-0 w-64 h-full bg-blue-600 shadow-xl z-50 p-6 md:hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="text-xl font-bold text-white">CAREERHUB</div>
              <button onClick={() => setIsSidebarOpen(false)}>
                <IoClose className="text-white text-3xl" />
              </button>
            </div>
            <nav className="space-y-4">
              <a href="/" className="text-white hover:text-black block">Home</a>
              <a href="user-dashboard" className="text-white hover:text-black block">Search</a>
              {isLoggedIn && (
                <>
                  {userData?.data?.role !== 'student' && (
                    <a href="post-job" className="text-white hover:text-black block">Post a Job</a>
                  )}
                  {userData?.data?.role !== 'recruiter' && (
                    <a href="add-resume" className="text-white hover:text-black block">Add Resume</a>
                  )}
                </>
              )}
              <a href="about-us" className="text-white hover:text-black block">About us</a>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full bg-white text-black px-4 py-2 rounded-md mt-4">Logout</button>
              ) : (
                <>
                  <button onClick={handleViewAllJobs} className="w-full bg-black text-white px-4 py-2 rounded-md">Log In</button>
                  <button onClick={handleSignUp} className="w-full bg-black text-white px-4 py-2 rounded-md mt-2">Sign Up</button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}

export default Navbar;
