import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import company from "../../assests/company.png";
import TypingEffect from "@/components/TypingEffect";
import bg from "../../assests/footer.png";
import { IoIosSearch } from "react-icons/io";
// Existing categories and jobs data
const categories = [
  {
    name: "Finance",
    icon: "💵",
    postings: "1,720 postings",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    name: "Marketing",
    icon: "📢",
    postings: "1,720 postings",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    name: "IT Services",
    icon: "💻",
    postings: "1,720 postings",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    name: "Data Science",
    icon: "🔬",
    postings: "1,720 postings",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    name: "Tech",
    icon: "🤖",
    postings: "1,720 postings",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    name: "Design",
    icon: "🍽",
    postings: "1,720 postings",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    name: "Sales",
    icon: "📈",
    postings: "1,720 postings",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
];

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-blue-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"
    ></path>
  </svg>
);

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/job/get-jobs`,
        {
          method: "GET",
          body: JSON.stringify(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const responseData = await response.json();
      const jobsData = Array.isArray(responseData.data)
        ? responseData.data.slice(0, 6)
        : [];
      setJobs(jobsData);
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch jobs");
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
        const response = await fetch(
          "http://localhost:3000/api/v1/user/get-user",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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
        console.error("Failed to fetch user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`user-dashboard?search=${searchTerm.trim() || ``}`);
  };

  const handleViewAllJobs = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate("user-dashboard");
    } else {
      navigate("login");
    }
  };

  return (
    <div className=" bg-gray-50 w-full">
      {/* Hero Section */}
      <div className="text-center bg-gray-50 mt-40 px-4 mb-40 w-full ">
        <div className="w-full text-black font-bold">
          <TypingEffect />
        </div>
        <p className="text-gray-500 mt-6">
          Work with the best companies, hire the experienced professionals
        </p>

        {/* Search Bar */}
        <div className="flex justify-center mt-10 space-x-2 rounded-full border border-gray-200  shadow-xl px-4 py-3 w-[800px] mx-auto">
          <IoIosSearch  className="text-2xl text-gray-500 my-auto"/>
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-1  w-[700px] bg-gray-50 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-slate-600 rounded-3xl text-white "
          >
            Search
          </button>
        </div>

        {/* <a href="#" className="text-blue-600 hover:underline mt-4 block">Advanced search</a> */}
      </div>
      <div>
        <div className="text-3xl font-bold text-center pt-28 pb-4">
          Top Opportunities with Leading Companies
        </div>
      <div className="h-[1.5px] bg-slate-700  w-3/4 mx-auto mb-20"></div>
        <main className="relative h-40 flex flex-col justify-center py-20  bg-gray-50 overflow-hidden">
          <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-14">
            <div className="text-center">
              <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <ul className=" flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                  <li>
                    <img src={company} alt="company" className="h-24" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Categories Section */}
      <div className=" mx-auto py-24 px-4 w-[80%] mt-10 ">
        <h2 className="text-3xl font-bold text-center mb-4">
          Most popular categories
        </h2>
      <div className="h-[1.5px] bg-slate-700 mx-auto mb-20 w-full"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
          {categories.map((category, index) => (
            <div
              key={index}
              className="border rounded-lg p-10 flex flex-col items-center justify-center"
            >
              <div className={`p-6 rounded-full ${category.bgColor} mb-4`}>
                <span className={`text-3xl ${category.iconColor}`}>
                  {category.icon}
                </span>
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
            <button
              onClick={handleViewAllJobs}
              className="bg-white text-blue-600 mt-4 py-2 px-4 rounded-md font-semibold"
            >
              View all →
            </button>
          </div>
        </div>
      </div>


      {/* Career Boost Section */}
      <div className=" md:pt-32 py-24">
        <h1 className="md:text-3xl text-3xl  text-center text-semibold text-gray-900 ">
          How <span className="font-bold text-blue-600">CAREER HUB</span> works
        </h1>
      <div className="h-[1.5px] bg-slate-700  w-3/4 mx-auto mt-2"></div>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-12 md:py-32 py-12 text-center md:w-10/12 w-11/12 mx-auto ">
          <div>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="magnifying-glass"
              className="svg-inline--fa fa-magnifying-glass text-xl h-[60px] w-[60px] mx-auto text-pink-500 mb-6"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
              ></path>
            </svg>
            <div className="text-gray-900 text-md tracking-wide pb-2 uppercase font-semibold ">
              Step 1:
            </div>
            <h1 className="text-3xl text-gray-900 pb-3 font-semibold">
              Create account
            </h1>
            <p className="text-xl font-light">
              Create a user account for Applicants or recruiters.
            </p>
          </div>

          <div>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="hand-peace"
              className="svg-inline--fa fa-hand-peace text-xl h-[60px] w-[60px] mx-auto mb-6 text-indigo-600"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M224 0c17.7 0 32 14.3 32 32V240H192V32c0-17.7 14.3-32 32-32zm96 160c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32zm64 64c0-17.7 14.3-32 32-32s32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V224zM93.3 51.2L175.9 240H106.1L34.7 76.8C27.6 60.6 35 41.8 51.2 34.7s35.1 .3 42.1 16.5zm27 221.3l-.2-.5h69.9H216c22.1 0 40 17.9 40 40s-17.9 40-40 40H160c-8.8 0-16 7.2-16 16s7.2 16 16 16h56c39.8 0 72-32.2 72-72l0-.6c9.4 5.4 20.3 8.6 32 8.6c13.2 0 25.4-4 35.6-10.8c8.7 24.9 32.5 42.8 60.4 42.8c11.7 0 22.6-3.1 32-8.6V352c0 88.4-71.6 160-160 160H226.3c-42.4 0-83.1-16.9-113.1-46.9l-11.6-11.6C77.5 429.5 64 396.9 64 363V336c0-32.7 24.6-59.7 56.3-63.5z"
              ></path>
            </svg>
            <div className="text-gray-900 text-md tracking-wide pb-2 uppercase font-semibold">
              Step 2:
            </div>
            <h1 className="text-3xl text-gray-900 pb-3  font-semibold">
              Log in
            </h1>
            <p className="text-xl font-light">
              Log in with the account you've created.
            </p>
          </div>

          <div>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="money-bill-wave"
              className="svg-inline--fa fa-money-bill-wave text-xl h-[60px] w-[60px] mx-auto mb-6 text-green-500"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path
                fill="currentColor"
                d="M0 112.5V422.3c0 18 10.1 35 27 41.3c87 32.5 174 10.3 261-11.9c79.8-20.3 159.6-40.7 239.3-18.9c23 6.3 48.7-9.5 48.7-33.4V89.7c0-18-10.1-35-27-41.3C462 15.9 375 38.1 288 60.3C208.2 80.6 128.4 100.9 48.7 79.1C25.6 72.8 0 88.6 0 112.5zM288 352c-44.2 0-80-43-80-96s35.8-96 80-96s80 43 80 96s-35.8 96-80 96zM64 352c35.3 0 64 28.7 64 64H64V352zm64-208c0 35.3-28.7 64-64 64V144h64zM512 304v64H448c0-35.3 28.7-64 64-64zM448 96h64v64c-35.3 0-64-28.7-64-64z"
              ></path>
            </svg>
            <div className="text-gray-900 text-md tracking-wide pb-2 uppercase font-semibold">
              Step 3:
            </div>
            <h1 className="text-3xl  text-gray-900 pb-3 font-semibold">
              Let the experience begin
            </h1>
            <p className="text-xl font-light">
              Create a job posting or find the job you desire.
            </p>
          </div>
        </div>
      </div>
      {/* Get Your Jobs Section */}
      <div
        style={{ "--image-url": `url(${bg})` }}
        className="bg-[image:var(--image-url)] w-full pb-10"
      >
        <div className="max-w-screen-lg mx-auto py-16 w-[80%] px-4  p-x-20">
          <h2 className="text-4xl text-white font-bold text-center mb-6">
            Get your Jobs
          </h2>
          <p className="text-center text-gray-50 mb-8">
            Find your dream job anywhere in the world remotely part time and
            full time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-sm border flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  {/* <p className="text-gray-500">{job.time}</p> */}
                  <p className="text-gray-500">{job.companyName}</p>
                  <div className="flex justify-between mt-2">
                    <p className="text-gray-500">
                      {job.isRemote ? "Remote" : "Onsite"}
                    </p>
                    <p className="text-gray-500">{job.salary}</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-gray-500">Industry :</p>
                    <p className="text-gray-500">{job.industry}</p>
                  </div>
                </div>
                <button className="mt-4 py-2 px-4 bg-slate-50 border-2 border-blue-300 hover:bg-slate-700 hover:text-white hover:border-none rounded-md">
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
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={handleViewAllJobs}
            className="bg- border hover:bg-slate-700 border-white text-white py-2 px-12 rounded-md font-semibold"
          >
            View all
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#252525] text-white py-8 ">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">CAREERHUB</div>
            <nav className="space-x-6">
              <a href="#" className="hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:underline">
                Terms
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
