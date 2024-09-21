import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Link } from "react-router-dom";

function Resume() {
    const [resumeData, setResumeData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        personalDetails: {
            fullName: '',
            email: '',
            phone: '',
            linkedin: '',
            github: '',
        },
        skills: [],
        workExperience: [
            {
                jobTitle: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                responsibilities: '',
            },
        ],
        education: [
            {
                degree: '',
                institution: '',
                location: '',
                start_date: '',
                end_date: '',
                gpa: '',
            },
        ],
        projects: [''],
    });
    
    async function fetchResumeData() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-resume`, {
                withCredentials: true,
            });
            setResumeData(response.data.data);
            setEditData(response.data.data); 
        } catch (error) {
            console.error('Error fetching resume data:', error);
        }
    }
    useEffect(() => {
        fetchResumeData();
    }, []);

    function cleanEditData(data) {
        const cleanedData = {
            ...data,
            workExperience: data.workExperience.map(({ _id, ...rest }) => rest),
            education: data.education.map(({ _id, ...rest }) => rest),
        };
        return cleanedData;
    }

    async function handleUpdateResume(e) {
        e.preventDefault();
        const cleanedData = cleanEditData(editData);

        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/user/update-resume`, cleanedData, {
                withCredentials: true,
            });

            setResumeData(response.data.data);
            setIsEditing(false); 
        } catch (error) {
            console.error('Error updating resume details:', error);
        }
    }

    async function handleDeleteResume() {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/delete-resume`, {
                withCredentials: true,
            });
            setResumeData(null); 
            fetchResumeData();
        } catch (error) {
            console.error('Error deleting resume:', error);
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 ">
                <div className="mx-auto grid w-full max-w-6xl gap-2 ">
                    <h1 className="text-3xl font-semibold text-gray-700 mb-2">Resume</h1>
                    <div className="h-[1.5px] bg-slate-700  w-full   lg:mb-5" ></div>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] ">
                    <nav className="grid gap-4 text-sm text-gray-600 ">
                        <Link to="/profile">
                            General
                        </Link>
                        <Link to="/resume" className="font-semibold text-blue-600">Resume</Link>
                        <Link to="/applications">Applications</Link>
                        <Link to="/account">Account</Link>
                    </nav>
                    
                    <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
                        <div className="grid gap-6">
                            <Card className="shadow-lg">
                                <CardHeader className="bg-[#294f7c] text-white rounded-t-md">
                                    <CardTitle className="text-2xl font-semibold">Resume Details</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {resumeData ? (
                                        isEditing ? (
                                            <form onSubmit={handleUpdateResume}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                                        <Input
                                                            type="text"
                                                            value={editData.personalDetails.fullName}
                                                            onChange={(e) => setEditData({ ...editData, personalDetails: { ...editData.personalDetails, fullName: e.target.value } })}
                                                            className="mt-1 block w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                                        <Input
                                                            type="email"
                                                            value={editData.personalDetails.email}
                                                            onChange={(e) => setEditData({ ...editData, personalDetails: { ...editData.personalDetails, email: e.target.value } })}
                                                            className="mt-1 block w-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                        <Input
                                                            type="text"
                                                            value={editData.personalDetails.phone}
                                                            onChange={(e) => setEditData({ ...editData, personalDetails: { ...editData.personalDetails, phone: e.target.value } })}
                                                            className="mt-1 block w-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                                                        <Input
                                                            type="text"
                                                            value={editData.personalDetails.linkedin}
                                                            onChange={(e) => setEditData({ ...editData, personalDetails: { ...editData.personalDetails, linkedin: e.target.value } })}
                                                            className="mt-1 block w-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">GitHub</label>
                                                        <Input
                                                            type="text"
                                                            value={editData.personalDetails.github}
                                                            onChange={(e) => setEditData({ ...editData, personalDetails: { ...editData.personalDetails, github: e.target.value } })}
                                                            className="mt-1 block w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <h2 className="text-xl font-semibold mt-4 mb-2">Skills</h2>
                                                <div className="mb-4">
                                                    <Input
                                                        type="text"
                                                        value={editData.skills.join(', ')}
                                                        onChange={(e) => setEditData({ ...editData, skills: e.target.value.split(', ') })}
                                                        className="mt-1 block w-full"
                                                    />
                                                </div>

                                                <h2 className="text-xl font-semibold mt-4 mb-2">Work Experience</h2>
                                                {editData.workExperience.map((experience, index) => (
                                                    <div key={index} className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                                        <Input
                                                            type="text"
                                                            value={experience.jobTitle}
                                                            onChange={(e) => {
                                                                const updatedWorkExperience = [...editData.workExperience];
                                                                updatedWorkExperience[index].jobTitle = e.target.value;
                                                                setEditData({ ...editData, workExperience: updatedWorkExperience });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">Company</label>
                                                        <Input
                                                            type="text"
                                                            value={experience.company}
                                                            onChange={(e) => {
                                                                const updatedWorkExperience = [...editData.workExperience];
                                                                updatedWorkExperience[index].company = e.target.value;
                                                                setEditData({ ...editData, workExperience: updatedWorkExperience });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">Location</label>
                                                        <Input
                                                            type="text"
                                                            value={experience.location}
                                                            onChange={(e) => {
                                                                const updatedWorkExperience = [...editData.workExperience];
                                                                updatedWorkExperience[index].location = e.target.value;
                                                                setEditData({ ...editData, workExperience: updatedWorkExperience });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">Start Date</label>
                                                        <Input
                                                            type="date"
                                                            value={new Date(experience.startDate).toISOString().substr(0, 10)}
                                                            onChange={(e) => {
                                                                const updatedWorkExperience = [...editData.workExperience];
                                                                updatedWorkExperience[index].startDate = new Date(e.target.value);
                                                                setEditData({ ...editData, workExperience: updatedWorkExperience });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">End Date</label>
                                                        <Input
                                                            type="date"
                                                            value={experience.endDate ? new Date(experience.endDate).toISOString().substr(0, 10) : ''}
                                                            onChange={(e) => {
                                                                const updatedWorkExperience = [...editData.workExperience];
                                                                updatedWorkExperience[index].endDate = new Date(e.target.value);
                                                                setEditData({ ...editData, workExperience: updatedWorkExperience });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">Responsibilities</label>
                                                        <Input
                                                            type="text"
                                                            value={experience.responsibilities}
                                                            onChange={(e) => {
                                                                const updatedWorkExperience = [...editData.workExperience];
                                                                updatedWorkExperience[index].responsibilities = e.target.value;
                                                                setEditData({ ...editData, workExperience: updatedWorkExperience });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                    </div>
                                                ))}

                                                <h2 className="text-xl font-semibold mt-4 mb-2">Education</h2>
                                                {editData.education.map((edu, index) => (
                                                    <div key={index} className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Degree</label>
                                                        <Input
                                                            type="text"
                                                            value={edu.degree}
                                                            onChange={(e) => {
                                                                const updatedEducation = [...editData.education];
                                                                updatedEducation[index].degree = e.target.value;
                                                                setEditData({ ...editData, education: updatedEducation });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">Institution</label>
                                                        <Input
                                                            type="text"
                                                            value={edu.institution}
                                                            onChange={(e) => {
                                                                const updatedEducation = [...editData.education];
                                                                updatedEducation[index].institution = e.target.value;
                                                                setEditData({ ...editData, education: updatedEducation });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">Location</label>
                                                        <Input
                                                            type="text"
                                                            value={edu.location}
                                                            onChange={(e) => {
                                                                const updatedEducation = [...editData.education];
                                                                updatedEducation[index].location = e.target.value;
                                                                setEditData({ ...editData, education: updatedEducation });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">Start Date</label>
                                                        <Input
                                                            type="date"
                                                            value={new Date(edu.start_date).toISOString().substr(0, 10)}
                                                            onChange={(e) => {
                                                                const updatedEducation = [...editData.education];
                                                                updatedEducation[index].start_date = new Date(e.target.value);
                                                                setEditData({ ...editData, education: updatedEducation });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">End Date</label>
                                                        <Input
                                                            type="date"
                                                            value={edu.end_date ? new Date(edu.end_date).toISOString().substr(0, 10) : ''}
                                                            onChange={(e) => {
                                                                const updatedEducation = [...editData.education];
                                                                updatedEducation[index].end_date = new Date(e.target.value);
                                                                setEditData({ ...editData, education: updatedEducation });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                        <label className="block text-sm font-medium text-gray-700 mt-2">GPA</label>
                                                        <Input
                                                            type="text"
                                                            value={edu.gpa}
                                                            onChange={(e) => {
                                                                const updatedEducation = [...editData.education];
                                                                updatedEducation[index].gpa = e.target.value;
                                                                setEditData({ ...editData, education: updatedEducation });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                    </div>
                                                ))}

                                                <h2 className="text-xl font-semibold mt-4 mb-2">Projects</h2>
                                                {editData.projects.map((project, index) => (
                                                    <div key={index} className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700">Project {index + 1}</label>
                                                        <Input
                                                            type="text"
                                                            value={project}
                                                            onChange={(e) => {
                                                                const updatedProjects = [...editData.projects];
                                                                updatedProjects[index] = e.target.value;
                                                                setEditData({ ...editData, projects: updatedProjects });
                                                            }}
                                                            className="mt-1 block w-full"
                                                        />
                                                    </div>
                                                ))}

                                                <div className="flex justify-end gap-2 mt-4">
                                                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                                                        Save Changes
                                                    </Button>
                                                    <Button type="button" onClick={() => setIsEditing(false)} className="bg-gray-600 text-white hover:bg-gray-700">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div>
                                                <div className="mb-4">
                                                    <h2 className="text-lg font-bold underline mt-2 mb-1 text-slate-700">Personal Details</h2>

                                                    <p><strong>Full Name:</strong> {resumeData.personalDetails.fullName}</p>
                                                    <p><strong>Email:</strong> {resumeData.personalDetails.email}</p>
                                                    <p><strong>Phone:</strong> {resumeData.personalDetails.phone}</p>
                                                    <p><strong>LinkedIn:</strong> {resumeData.personalDetails.linkedin}</p>
                                                    <p><strong>GitHub:</strong> {resumeData.personalDetails.github}</p>
                                                </div>

                                                <div className="mb-4">
                                                    <h2 className="text-lg font-bold underline mt-2 mb-1 text-slate-700">Skills</h2>
                                                    <p>{resumeData.skills.join(', ')}</p>
                                                </div>

                                                <div className="mb-4">
                                                    <h2 className="text-lg font-bold underline mt-2 mb-1 text-slate-700">Work Experience</h2>
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
                                                    <h2 className="text-lg font-bold underline mt-2 mb-1 text-slate-700">Education</h2>
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
                                                    <h2 className="text-lg font-bold underline mt-2 mb-1 text-slate-700">Projects</h2>
                                                    {resumeData.projects.map((project, index) => (
                                                        <div key={index} className="mb-4">
                                                            <p><strong>Project {index + 1}:</strong> {project}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <p>No resume data available.</p>
                                    )}
                                </CardContent>
                                <CardFooter className="bg-gray-50 rounded-b-md justify-end">
                                    {
                                        resumeData ? (isEditing ? null :
                                            <div className="flex justify-end gap-4 mt-4 ">
                                                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white hover:bg-blue-700">
                                                    Edit Resume
                                                </Button>
                                                <Button onClick={handleDeleteResume} className="bg-red-600 text-white hover:bg-red-700">
                                                    Delete Resume
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <Link
                                                    Link to='/add-resume'>
                                                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                                        Add Resume
                                                    </Button>
                                                </Link>
                                            </div>
                                        )
                                    }
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Resume;