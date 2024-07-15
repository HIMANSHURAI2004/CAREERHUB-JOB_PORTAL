import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

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
    <div className="bg-gray-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden relative">
        <button
          onClick={handleGoBack}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none absolute top-4 left-4 z-10"
        >
          <BiArrowBack className="text-xl text-gray-600" />
        </button>
        <div className="p-6 pt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{job.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Posted By:</span> {recruiter?.userName}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Date Posted:</span> {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Deadline:</span> {new Date(job.deadline).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Locations:</span> {job.locations.length > 0 ? job.locations.join(', ') : 'Not specified'}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Industry:</span> {job.industry || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-gray-700">
                <span className="font-semibold">Salary:</span> {job.salary || 'Not specified'}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Experience Required:</span> {job.workExperienceMinYears}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Remote:</span> {job.isRemote ? 'Yes' : 'No'}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Employment Type:</span> {job.employmentType}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Company:</span> {company?.companyName || 'Not specifi'}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mb-6">
            <span className="font-semibold">Job Description:</span> {job.description}
          </p>
          {job.skillsRequired.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-700">
                <span className="font-semibold">Skills Required:</span> {job.skillsRequired.join(', ')}
              </p>
            </div>
          )}
          <Button onClick={handleApplyJob}>Apply</Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;












