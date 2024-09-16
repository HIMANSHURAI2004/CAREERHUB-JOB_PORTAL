import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function UserResume() {
    const { id } = useParams();
    const [resumeData, setResumeData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchResumeData() {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/user/get-applicant-resume/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch resume data');
                }
                const responseData = await response.json();
                setResumeData(responseData.data);
            } catch (error) {
                console.error('Error fetching resume data:', error);
            }
        }
        fetchResumeData();
    }, []);

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:px-20 sm:px-14 lg:px-36">
                <div className="mx-auto w-full max-w-6xl">
                    <h1 className="lg:text-3xl  text-2xl font-semibold text-gray-700 pt-2">Applicant Resume</h1>
                </div>
                <div className="mx-auto w-full max-w-6xl ">
                    <Card className="shadow-lg w-full ">
                        <CardHeader className="bg-[#294f7c] text-white rounded-t-md">
                            <CardTitle className="lg:text-2xl md:text-2xl text-xl font-semibold">Resume Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {resumeData ? (
                                <div>
                                    <div className="mb-4">
                                        <h2 className="text-xl font-semibold">Personal Details</h2>
                                        <p><strong>Full Name:</strong> {resumeData.personalDetails.fullName}</p>
                                        <p><strong>Email:</strong> {resumeData.personalDetails.email}</p>
                                        <p><strong>Phone:</strong> {resumeData.personalDetails.phone}</p>
                                        <p><strong>LinkedIn:</strong> {resumeData.personalDetails.linkedin}</p>
                                        <p><strong>GitHub:</strong> {resumeData.personalDetails.github}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h2 className="text-xl font-semibold">Skills</h2>
                                        <p>{resumeData.skills.join(', ')}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h2 className="text-xl font-semibold">Work Experience</h2>
                                        {resumeData.workExperience.map((experience, index) => (
                                            <div key={index} className="mb-4">
                                                <p><strong>Job Title:</strong> {experience.jobTitle}</p>
                                                <p><strong>Company:</strong> {experience.company}</p>
                                                <p><strong>Location:</strong> {experience.location}</p>
                                                <p><strong>Start Date:</strong> {new Date(experience.startDate).toLocaleDateString()}</p>
                                                <p><strong>End Date:</strong> {experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'Present'}</p>
                                                <p><strong>Responsibilities:</strong> {experience.responsibilities}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-4">
                                        <h2 className="text-xl font-semibold">Education</h2>
                                        {resumeData.education.map((edu, index) => (
                                            <div key={index} className="mb-4">
                                                <p><strong>Degree:</strong> {edu.degree}</p>
                                                <p><strong>Institution:</strong> {edu.institution}</p>
                                                <p><strong>Location:</strong> {edu.location}</p>
                                                <p><strong>Start Date:</strong> {new Date(edu.start_date).toLocaleDateString()}</p>
                                                <p><strong>End Date:</strong> {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'Present'}</p>
                                                <p><strong>GPA:</strong> {edu.gpa}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-4">
                                        <h2 className="text-xl font-semibold">Projects</h2>
                                        {resumeData.projects.map((project, index) => (
                                            <div key={index} className="mb-4">
                                                <p><strong>Project {index + 1}:</strong> {project}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p>No resume data available.</p>
                            )}
                        <div className="rounded-b-md flex items-center justify-end">
                            <Button className="bg-blue-600 hover:bg-blue-700 px-6" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default UserResume;
