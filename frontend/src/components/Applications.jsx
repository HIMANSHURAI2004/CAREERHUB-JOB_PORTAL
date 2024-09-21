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
} from "@/components/ui/alert-dialog"
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";


function Applications() {
    const [applications, setApplications] = useState([]);
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

    async function fetchApplications() {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/application/get-user-applications`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }
            const responseData = await response.json();
            setApplications(responseData.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchApplications();
    }, []);

    const handleDeleteApplication = async (id) => {
        try {
            setLoading(true);
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/application/delete-application/${id}`, {
                withCredentials: true,
            });
            if (!response?.data?.success) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Application deletion Failed, Please try again.",
                })
            }
            else {
                toast({
                    description: "Application deleted successfully .",
                })
                fetchApplications();
                setApplications(applications.filter(application => application._id !== id));
            }
        } catch (error) {
            console.error('Error deleting Application:', error);
        } finally {
            setLoading(false);
        }
    }

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
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 ">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold text-gray-700 pb-2">My Applications</h1>
                    <div className="h-[1.5px] bg-slate-700  w-full   lg:mb-5" ></div>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
                    <nav className="grid gap-4 text-sm text-gray-600">
                        <Link to="/profile" className="hover:text-blue-600">
                            General
                        </Link>
                        <Link to="/resume" className="hover:text-blue-600">Resume</Link>
                        <Link to="/applications" className="font-semibold text-blue-600">Applications</Link>
                        <Link to="/account" className="hover:text-blue-600">Account</Link>
                    </nav>
                    <div className="grid gap-6">
                        <div className="mx-auto grid grid-cols-1 w-full max-w-6xl items-start gap-6 lg:grid-cols-2">
                            {applications.length > 0 ? (
                                applications.map((application, index) => (
                                    <Card key={index} className="shadow-lg transition-transform transform hover:scale-105 grid col-span-1">
                                        <div className={`${application.status === 'Offered' ? 'bg-green-500' : (application.status === 'Rejected' ? 'bg-red-500' : 'bg-[#294f7c]')} text-white p-3 pl-6 flex rounded-t-lg justify-between`}>
                                            <span className="text-xl font-semibold uppercase">Status: </span>
                                            <span className="text-bold text-xl uppercase"> {application.status}</span>

                                        </div>
                                        <CardContent className="p-3 bg-white pl-7">
                                            <div className="flex flex-col gap-2">
                                                <p><strong>Applied Date:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                                                <p><strong>Job Title:</strong> {application.job.title}</p>
                                                <p><strong>Employment Type:</strong> {application.job.employmentType}</p>
                                                <p><strong>Locations:</strong> {application.job.locations.join(', ')}</p>
                                            </div>
                                        </CardContent>
                                        <div className=" rounded-b-md flex justify-end items-center ">
                                            <Button className='bg-[#294f7c] hover:bg-[#073a7c] m-2 mr-4'>
                                                <Link to={`/job/${application.job._id}`} className="text-white hover:">View Job</Link>
                                            </Button>
                                            {
                                                application.status !== 'Offered'  && (

                                                <AlertDialog>
                                                    <AlertDialogTrigger>
                                                        <Button className='text-white bg-red-600 hover:bg-red-800 mr-4'>Delete</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Application</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete your Application for this job? This action is not reversible.
                                                        </AlertDialogDescription>
                                                        <AlertDialogFooter>
                                                            <AlertDialogAction className='bg-red-600 hover:bg-red-900'>
                                                                <Button className='bg-red-600 hover:bg-red-900' onClick={() => handleDeleteApplication(application?._id)}>Delete</Button>
                                                            </AlertDialogAction>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                )
                                            }

                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-gray-700">No applications found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Applications;
