import { useState,useEffect } from 'react';
import { Link,useLocation,useNavigate } from 'react-router-dom';

// Existing categories and jobs data
const categories = [
  { name: "Finance", icon: "💵", postings: "1,720 postings", bgColor: "bg-green-100", iconColor: "text-green-600" },
  { name: "Marketing", icon: "📢", postings: "1,720 postings", bgColor: "bg-pink-100", iconColor: "text-pink-600" },
  { name: "IT Services", icon: "💻", postings: "1,720 postings", bgColor: "bg-blue-100", iconColor: "text-blue-600" },
  { name: "Science", icon: "🔬", postings: "1,720 postings", bgColor: "bg-green-100", iconColor: "text-green-600" },
  { name: "Tech", icon: "🤖", postings: "1,720 postings", bgColor: "bg-purple-100", iconColor: "text-purple-600" },
  { name: "Gastronomy", icon: "🍽", postings: "1,720 postings", bgColor: "bg-yellow-100", iconColor: "text-yellow-600" },
  { name: "Sales", icon: "📈", postings: "1,720 postings", bgColor: "bg-green-100", iconColor: "text-green-600" },
];

// const jobs = [
//   { title: "Junior Designer", company: "AJ Agency", rating: 4.8, time: "1 day ago", jobType: "Full time" },
//   { title: "UX Designer", company: "AJ Agency", rating: 4.8, time: "1 day ago", jobType: "Full time" },
//   { title: "UX Designer", company: "AJ Agency", rating: 4.8, time: "1 day ago", jobType: "Full time" },
//   { title: "Junior Designer", company: "AJ Agency", rating: 4.8, time: "1 day ago", jobType: "Full time" },
//   { title: "UX Designer", company: "AJ Agency", rating: 4.8, time: "1 day ago", jobType: "Full time" },
//   { title: "UX Designer", company: "AJ Agency", rating: 4.8, time: "1 day ago", jobType: "Full time" },
// ];

// New Career Boost Section Data
const articles = [
  {
    title: "The most attractive fields to work in",
    author: "Elena S.",
    readTime: "5 min. read",
    icon: "🖥",
  },
  {
    title: "How to keep your team efficient",
    author: "Harold M.",
    readTime: "8 min. read",
    icon: "👥",
  },
  {
    title: "How to land a job in the tech industry",
    author: "Jessica P.",
    readTime: "3 min. read",
    icon: "😊",
  },
];

const quickLinks = [
  { title: "How to write a good CV", icon: "✍" },
  { title: "Compare your salary", icon: "💼" },
  { title: "Tax calculator", icon: "🧮" },
];

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
  </svg>
);

function Home() {

  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {

      const response = await fetch(`http://localhost:3000/api/v1/job/get-jobs`, {
        method: 'GET',
        body: JSON.stringify(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const responseData = await response.json();
      const jobsData = Array.isArray(responseData.data) ? responseData.data.slice(0, 6) : [];
      setJobs(jobsData);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
                // console.log('User data:', userData);
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

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`user-dashboard?search=${(searchTerm.trim() || ``)}`);
  };

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
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="text-xl font-bold">CAREER HUB</div>
        <div className="flex flex-grow justify-center space-x-6">
          <nav className="space-x-6">
            <a href="" className="text-gray-600 hover:text-black">Home</a>
            <a href="#" className="text-gray-600 hover:text-black">Explore</a>
            {
              isLoggedIn && (
                <>
                  {userData?.data?.role !== "student" && (
                      <a href="post-job" className="text-gray-600 hover:text-black">Post a Job</a>
                  )}
                  {userData?.data?.role !== "recruiter" && (
                      <a href="add-resume" className="text-gray-600 hover:text-black">Add Resume</a>
                  )}
              </>
              )
            }
            {/* <a href="post-job" className="text-gray-600 hover:text-black">Post a Job</a> */}
            <a href="user-dashboard" className="text-gray-600 hover:text-black">Search</a>
          </nav>
        </div>
        {
          isLoggedIn ? (
            <div className="flex space-x-4" >
              <button onClick={handleLogout} className="px-4 py-2 bg-black text-white rounded-md">Log Out</button>
            </div>
          ) : (
            <div className="flex space-x-4" >
              <button onClick={handleViewAllJobs} className="px-4 py-2 bg-black text-white rounded-md">Log In</button>
              <button onClick={handleSignUp} className="px-4 py-2 bg-black text-white rounded-md">Sign Up</button>
            </div>
          )
        }

      </header>

      {/* Hero Section */}
      <div className="text-center  mt-40 px-4 mb-40 " >
        <h1 className="text-5xl font-bold text-gray-800">
          Over <span className="text-blue-600">5,000 jobs</span> are waiting for you
        </h1>
        <p className="text-gray-500 mt-6">Work with the best companies, hire the experienced professionals</p>

        {/* Search Bar */}
        <div className="flex justify-center mt-10 space-x-2">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-96"
          />
          {/* <input
            type="text"
            placeholder="Enter location"
            className="px-4 py-2 border border-gray-300 rounded-md w-52"
          /> */}
          <button onClick={handleSearch} className="px-6 py-2 bg-black text-white rounded-md">Search</button>
        </div>

        {/* <a href="#" className="text-blue-600 hover:underline mt-4 block">Advanced search</a> */}
      </div>

      {/* Categories Section */}
      <div className="max-w-screen-lg mx-auto py-24 px-4 w-[100%]">
        <h2 className="text-3xl font-bold text-center mb-14">Most popular categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
          {categories.map((category, index) => (
            <div key={index} className="border rounded-lg p-10 flex flex-col items-center justify-center">
            <div className={`p-6 rounded-full ${category.bgColor} mb-4`}>
              <span className={`text-3xl ${category.iconColor}`}>{category.icon}</span>
            </div>
            <h3 className="font-semibold text-xl">{category.name}</h3>
            <p className="text-gray-500">{category.postings}</p>
          </div>
          
          ))}

          {/* Special category card */}
          <div className="bg-blue-600 text-white rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="text-2xl font-bold">+10K jobs</div>
              <div className="text-lg mt-2">Available now!</div>
            </div>
            <button onClick={handleViewAllJobs} className="bg-white text-blue-600 mt-4 py-2 px-4 rounded-md font-semibold">
              View all →
            </button>
          </div>
        </div>
      </div>

      {/* Career Boost Section */}
      <div className="max-w-screen-lg mx-auto py-32 px-10">
        <h2 className="text-3xl font-bold text-center mb-14">Boost your careers</h2>
        {/* Main Article Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div key={index} className="border rounded-lg py-20 px-10 bg-white shadow-sm flex flex-col justify-between">
              <div className="text-7xl font-bold text-gray-300 mb-6 text-center">{article.icon}</div>
              <div>
                <h3 className="text-lg font-semibold w-full mb-2">{article.title}</h3>
                <p className="text-gray-500">by {article.author}, {article.readTime}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="flex justify-around mt-10">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center space-x-8 text-blue-600 hover:underline bg-gray-100 px-6 py-2 rounded-lg shadow-sm"
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Get Your Jobs Section */}
      <div className="max-w-screen-lg mx-auto py-16 px-4 bg-[#F4F9FF] p-x-20">
        <h2 className="text-4xl font-bold text-center mb-6">Get your Jobs</h2>
        <p className="text-center text-gray-500 mb-8">
          Find your dream job anywhere in the world remotely part time and full time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                {/* <p className="text-gray-500">{job.time}</p> */}
                <p className="text-gray-500">{job.companyName}</p>
                <p className="text-gray-500">{job.isRemote ? 'Remote' : 'Onsite'}</p>
                <p className="text-gray-500">{job.salary}</p>
              </div>
              <button className="mt-4 py-2 px-4 bg-slate-700 text-white rounded-md">
                {job.employmentType}
              </button>
            </div>
          ))}
        {loading && (
          <div className="col-span-full flex justify-center items-center h-40">
            <Spinner />
          </div>
        )}
        </div>
        <div className="flex justify-center mt-8">
          <button onClick={handleViewAllJobs} className="bg-blue-600 text-white py-2 px-12 rounded-md font-semibold">
            View all
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-6">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">CAREERHUB</div>
            <nav className="space-x-6">
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="about-us" className="hover:underline">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;