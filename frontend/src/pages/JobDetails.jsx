import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import { IoIosArrowBack } from "react-icons/io";
const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [company, setCompany] = useState(null);
  const { toast } = useToast()

  useEffect(() => {
    const fetchJobAndRecruiter = async () => {
      try {
        const jobResponse = await fetch(`http://localhost:3000/api/v1/job/get-job/${id}`);
        if (!jobResponse.ok) {
          throw new Error('Job not found');
        }
        const jobData = await jobResponse.json();
        setJob(jobData.data);

        const recruiterResponse = await fetch(`http://localhost:3000/api/v1/user/get-user-from-id/${jobData.data.postedBy}`);
        if (!recruiterResponse.ok) {
          throw new Error('Recruiter not found');
        }
        const recruiterData = await recruiterResponse.json();
        setRecruiter(recruiterData.data);

        const companyResponse = await fetch(`http://localhost:3000/api/v1/job/get-company-details-by-id/${jobData.data.company}`);
        if (!companyResponse.ok) {
          throw new Error('Company not found');
        }
        const companyData = await companyResponse.json();
        setCompany(companyData.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching job, recruiter, or company:', error);
        setError('Failed to fetch job, recruiter, or company details');
        setLoading(false);
      }
    };

    fetchJobAndRecruiter();
  }, [id]);

  const handleApplyJob = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/application/create-application/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to apply for job",
        })
        throw new Error('Failed to apply for job');
      } else {
        toast({
          description: "Application submitted successfully",
        })
        navigate('/applications');
      }
    } catch (error) {
      console.error('Failed to apply for job:', error);
      setError('Failed to apply for job');

    }
  }
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Job not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-3 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <div
          onClick={handleGoBack}
          className="p-2 z-10 flex items-center text-lg"
        >
          <IoIosArrowBack className="text-xl text-gray-600"/>
          <span className='cursor-pointer text-base text-blue-600'>Show Similar Jobs</span>
        </div>
      </div>
      <div className=" mx-auto bg-white shadow-md  overflow-hidden ">
        <div className="p-6 ">
          <div className='flex flex-col gap-y-4'>
            <h2 className=" text-2xl md:text-3xl font-bold text-gray-800 ">{job.title}</h2>
            <div className='mb-4'>
              <p className="font-semibold text-lg text-indigo-600">
                {company?.companyName || 'Not specified'}
              </p>
              <p className={`text-gray-500 ${job.locations.length > 0 ? 'block' : 'hidden'}`}>
                Multiple Locations, India
              </p>

            </div>
            <div className='mb-12'>
              <Button onClick={handleApplyJob} className='bg-blue-700 px-6 rounded-none  hover:bg-blue-900 '>Apply</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 py-4">
            <p className="font-semibold">
              <span className="text-gray-500 font-normal">Date Posted: </span> {new Date(job.createdAt).toLocaleDateString()}
            </p>
            <p className="font-semibold">
              <span className="text-gray-500 font-normal">Posted By: </span> {recruiter?.userName}
            </p>
            <p className="font-semibold">
              <span className="text-gray-500 font-normal">Locations: </span> {job.locations.length > 0 ? job.locations.join(', ') : 'Not specified'}
            </p>
            <p className="font-semibold">
              <span className="text-gray-500 font-normal">Deadline: </span>{new Date(job.deadline).toLocaleDateString()}
            </p>
            <p className="font-semibold">
              <span className="text-gray-500 font-normal">Employment Type: </span> {job.employmentType}
            </p>
            <p className="font-semibold">
              <span className="text-gray-500 font-normal">Industry: </span> {job.industry || 'Not specified'}
            </p>
            <p className="font-semibold">
              <span className="text-gray-500 font-normal">Salary: </span> {job.salary || 'Not specified'}
            </p>
            <p className="font-semibold">
              <span className="text-gray-500 font-normal">Work Experience: </span> {job.workExperienceMinYears}
            </p>
            <p className="font-semibold">
              <span className="text-gray-500 font-normal">Remote: </span> {job.isRemote ? 'Yes' : 'No'}
            </p>

          </div>
          <div className='h-0.5 bg-gray-200 w-full my-16 rounded-full'></div>
          <div className="mb-10">
            <h3 className="mb-6 text-lg font-semibold">Job Description</h3>
            <p className='px-6'>{job.description}</p>
          </div>
          {job.skillsRequired.length > 0 && (
            <div className="mb-10">
              <h3 className="mb-6 text-lg font-semibold">Skills Required</h3>
              <div className='flex flex-wrap '>
                {
                  job.skillsRequired.map((skill) => (
                    <span className="bg-gray-50  px-4 py-1.5 rounded-full mr-2">{skill}</span>
                  ))
                }
              </div>

            </div>
          )}
          <div className='mb-4'>
            <Button onClick={handleApplyJob} className='bg-blue-700 px-6 rounded-none  hover:bg-blue-900 '>Apply</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;












