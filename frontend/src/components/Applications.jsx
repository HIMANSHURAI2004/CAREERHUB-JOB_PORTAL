import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

function Applications() {
    const [applications, setApplications] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchApplications() {
            try {
                const response = await fetch('http://localhost:3000/api/v1/application/get-user-applications', {
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
                console.log(responseData.data);
                setApplications(responseData.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        }
        fetchApplications();
    }, []);

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold text-gray-700">My Applications</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
                    <nav className="grid gap-4 text-sm text-gray-600">
                        <Link to="/profile" className="hover:text-blue-600">
                            General
                        </Link>
                        <Link to="/resume" className="hover:text-blue-600">Resume</Link>
                        <Link to="/account" className="hover:text-blue-600">Account</Link>
                        <Link to="/applications" className="font-semibold text-blue-600">Applications</Link>
                    </nav>
                    <div className="grid gap-6">
                        <div className="mx-auto grid grid-cols-2 w-full max-w-6xl items-start gap-6">
                            {applications.length > 0 ? (
                                applications.map((application, index) => (
                                    <Card key={index} className="shadow-lg transition-transform transform hover:scale-105 grid col-span-1">
                                        <div className="bg-[#294f7c] text-white p-3 pl-6 flex rounded-t-lg">
                                            <h2 className="text-xl font-semibold">Status : <span className=" text-bold text-xl uppercase"> {application.status}</span></h2>
                                            
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
                                            <Button className='bg-[#294f7c] hover:bg-[#073a7c] m-2 mr-6'>
                                                <Link to={`/get-job/${application.job._id}`} className="text-white hover:">View Job</Link>
                                            </Button>
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
