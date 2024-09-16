import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import axios from "axios";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";

function UserJobs() {
    const [jobs, setJobs] = useState([]);
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [editingJobId, setEditingJobId] = useState(null);
    const [editingJob, setEditingJob] = useState({});
    const navigate = useNavigate();

    async function fetchUserJobs() {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/v1/job/get-recruiter-jobs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Jobs');
            }
            const responseData = await response.json();
            setJobs(responseData.data);
        } catch (error) {
            console.error('Error fetching Jobs:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserJobs();
    }, []);

    const handleDeleteJob = async (id) => {
        try {
            setLoading(true);
            const response = await axios.delete(`http://localhost:3000/api/v1/job/delete-job/${id}`, {
                withCredentials: true,
            });
            if (!response?.data?.success) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Job deletion Failed, Please try again.",
                });
            } else {
                toast({
                    description: "Job deleted successfully.",
                });
                fetchUserJobs(); 
            }
        } catch (error) {
            console.error('Error deleting Job:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditJob = (job) => {
        setEditingJobId(job._id);
        setEditingJob(job);
    };

    const handleCancelEdit = () => {
        setEditingJobId(null);
        setEditingJob({});
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditingJob({
            ...editingJob,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleUpdateJob = async (e) => {
        
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/v1/job/update-job/${editingJobId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(editingJob),
            })
            if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Job update Failed, Please try again.",
                });
                throw new Error('Failed to update Job');
            } 
            else {
                const responseData = await response.json();
                
                toast({
                    description: "Job updated successfully.",
                });

                console.log(responseData);
                fetchUserJobs(); 
                setEditingJobId(null);
                setEditingJob({});
            }
        } catch (error) {
            console.error('Error updating Job:', error);
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold text-gray-700 pb-2">Posted Jobs</h1>
                    <div className="h-[1.5px] bg-slate-700  w-full   lg:mb-5" ></div>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
                    <nav className="grid gap-4 text-sm text-gray-600 ">
                        <Link to="/profile" className="hover:text-blue-600">
                            General
                        </Link>
                        <Link to="/company" className="hover:text-blue-600">Company</Link>
                        <Link to="/user-job" className="text-blue-600 hover:text-blue-600">Jobs</Link>
                        <Link to="/account" className="hover:text-blue-600">Account</Link>
                    </nav>
                    <div className="grid gap-6">
                        <div className="mx-auto grid grid- w-full max-w-6xl items-start gap-10">
                            {jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <Card key={job._id} className="shadow-lg transition-transform transform hover:scale-105 ">
                                        {editingJobId === job._id ? (
                                            <form onSubmit={handleUpdateJob}>
                                                <div className="bg-[#294f7c] text-white p-3 pl-6 flex rounded-t-lg justify-between items-center">
                                                    <div className="w-[50%] flex items-center gap-x-4">
                                                        <Label className="font-medium">Job Title : </Label>
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            value={editingJob.title}
                                                            onChange={handleChange}
                                                            className="bg-white text-black p-2 rounded w-[70%]"
                                                        />
                                                    </div>
                                                    <p className="">Created on: {new Date(job.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <CardContent className="p-3 bg-white pl-7 m-3">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex flex-col gap-y-1">
                                                            <label className="font-medium ">Deadline:</label>
                                                            <input
                                                                type="date"
                                                                name="deadline"
                                                                value={new Date(editingJob.deadline).toISOString().substr(0, 10)}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-y-1">
                                                            <label className="font-medium ">Locations:</label>
                                                            <input
                                                                type="text"
                                                                name="locations"
                                                                value={editingJob.locations}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-y-1">
                                                            <label className="font-medium ">{editingJob.employmentType === 'Internship' ? 'Stipend' : 'Salary'}:</label>
                                                            <input
                                                                type="text"
                                                                name="salary"
                                                                value={editingJob.salary}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-y-1">
                                                            <label className="font-medium ">Description:</label>
                                                            <textarea
                                                                name="description"
                                                                value={editingJob.description}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-y-1">
                                                            <label className="font-medium ">Skills Required:</label>
                                                            <input
                                                                type="text"
                                                                name="skillsRequired"
                                                                value={editingJob.skillsRequired}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-y-1">
                                                            <label className="font-medium ">Employment Type:</label>
                                                            <input
                                                                type="text"
                                                                name="employmentType"
                                                                value={editingJob.employmentType}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-y-1">
                                                            <label className="font-medium ">Minimum work experience:</label>
                                                            <input
                                                                type="number"
                                                                name="workExperienceMinYears"
                                                                value={editingJob.workExperienceMinYears}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-x-2 my-1 ">
                                                            <label className="pr-2 font-medium">Remote:</label>
                                                            <input
                                                                type="checkbox"
                                                                name="isRemote"
                                                                checked={editingJob.isRemote}
                                                                onChange={handleChange}
                                                                className="w-4 h-4"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-y-1">
                                                            <label className="font-medium ">Industry:</label>
                                                            <input
                                                                type="text"
                                                                name="industry"
                                                                value={editingJob.industry}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg"
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <div className="flex justify-end items-center pr-5 my-3">
                                                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 px-5 mr-2">
                                                        Save
                                                    </Button>
                                                    <Button type="button" className="bg-gray-300 text-gray-700 hover:bg-gray-400 " onClick={handleCancelEdit}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <div className="bg-[#294f7c] text-white p-3 pl-6 flex rounded-t-lg justify-between">
                                                    <h2>{job.title}</h2>
                                                    <h2>Created on: {new Date(job.createdAt).toLocaleDateString()}</h2>
                                                </div>
                                                <CardContent className="p-3 bg-white pl-7">
                                                    <div className="flex flex-col gap-2">
                                                        <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                                                        <p><strong>Locations:</strong> {job.locations.join(', ')}</p>
                                                        <p><strong>{job.employmentType === 'Internship' ? 'Stipend' : 'Salary'}:</strong> {job.salary}</p>
                                                        <p><strong>Description:</strong> {job.description}</p>
                                                        <p><strong>Skills Required:</strong> {job.skillsRequired.join(', ')}</p>
                                                        <p><strong>Employment Type:</strong> {job.employmentType}</p>
                                                        <p><strong>Minimum work experience:</strong> {job.workExperienceMinYears} year</p>
                                                        <p><strong>Remote:</strong> {job.isRemote ? 'Yes' : 'No'}</p>
                                                        <p><strong>Industry:</strong> {job.industry}</p>
                                                    </div>
                                                </CardContent>
                                                <div className="rounded-b-md flex justify-end items-center sm:gap-x-3 md:gap-x-5 lg:gap-x-5 mr-2 gap-x-2">
                                                    <Button className="bg-[#294f7c] hover:bg-[#073a7c] my-3">
                                                        <Link to={`/job-applications/${job._id}`} className="text-white hover:">View Applications</Link>
                                                    </Button>
                                                    <Button className="bg-[#294f7c] text-white hover:bg-[#073a7c]" onClick={() => handleEditJob(job)}>Update</Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger>
                                                            <Button className="text-white bg-red-600 hover:bg-red-800 lg:mr-2">Delete</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete job</AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this job? This action is not reversible.
                                                            </AlertDialogDescription>
                                                            <AlertDialogFooter>
                                                                <AlertDialogAction className="bg-red-600 hover:bg-red-900">
                                                                    <Button className="bg-red-600 hover:bg-red-900" onClick={() => handleDeleteJob(job?._id)}>Delete</Button>
                                                                </AlertDialogAction>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </>
                                        )}
                                    </Card>
                                ))
                            ) : (
                                <div className="flex items-center justify-center border-red-500 p-4">
                                    <p className="text-gray-700">No Jobs found.</p>
                                    <div className="relative">
                                        <Link to="/post-job">
                                            <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                                Post Job
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UserJobs;
