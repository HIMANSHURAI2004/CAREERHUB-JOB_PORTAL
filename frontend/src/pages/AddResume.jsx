import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea"
import { ImCross } from "react-icons/im";

function AddResume() {
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState('personalDetails');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        skills: [],
        workExperience: [{ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: '' }],
        education: [{ degree: '', institution: '', location: '', start_date: '', end_date: '', gpa: '' }],
        projects: [''],
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleSkillsChange = (e) => {
        const skills = e.target.value.split(',').map(skill => skill.trim());
        setFormData({
            ...formData,
            skills,
        });
    };

    const handleWorkExperienceChange = (index, field, value) => {
        const updatedWorkExperience = [...formData.workExperience];
        updatedWorkExperience[index][field] = value;
        setFormData({
            ...formData,
            workExperience: updatedWorkExperience,
        });
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...formData.education];
        updatedEducation[index][field] = value;
        setFormData({
            ...formData,
            education: updatedEducation,
        });
    };

    const handleProjectsChange = (index, value) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index] = value;
        setFormData({
            ...formData,
            projects: updatedProjects,
        });
    };

    const handleAddExperience = () => {
        setFormData({
            ...formData,
            workExperience: [...formData.workExperience, { jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: '' }],
        });
    };

    const handleAddEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { degree: '', institution: '', location: '', start_date: '', end_date: '', gpa: '' }],
        });
    };

    const handleAddProject = () => {
        setFormData({
            ...formData,
            projects: [...formData.projects, ''],
        });
    };

    const handleRemoveExperience = (index) => {
        const updatedWorkExperience = [...formData.workExperience];
        updatedWorkExperience.splice(index, 1);
        setFormData({
            ...formData,
            workExperience: updatedWorkExperience,
        });
    };

    const handleRemoveEducation = (index) => {
        const updatedEducation = [...formData.education];
        updatedEducation.splice(index, 1);
        setFormData({
            ...formData,
            education: updatedEducation,
        });
    };

    const handleRemoveProject = (index) => {
        const updatedProjects = [...formData.projects];
        updatedProjects.splice(index, 1);
        setFormData({
            ...formData,
            projects: updatedProjects,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
    
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/add-resume`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add resume');
            }
            navigate('/resume');
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to add resume');
        }
    };

    const handleNextSection = () => {
        if (currentSection === 'personalDetails') {
            setCurrentSection('workExperience');
        } else if (currentSection === 'workExperience') {
            setCurrentSection('education');
        } else if (currentSection === 'education') {
            setCurrentSection('projects');
        } else if (currentSection === 'projects') {
            // Do not submit automatically here
        }

        setErrorMessage("")
    };


    const handlePreviousSection = () => {
        const sections = ['personalDetails', 'workExperience', 'education', 'projects'];
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex > 0) {
            setCurrentSection(sections[currentIndex - 1]);
        }
        setErrorMessage("")
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100 py-6'>
            <div className='bg-white rounded-lg shadow-md w-full max-w-4xl flex flex-col lg:flex-col'>
                <h2 className='text-xl font-semibold py-2 rounded-t-lg bg-[#294f7c] text-white text-center md:text-2xl lg:text-2xl'>Create your Resume</h2>

                <div className=' p-8 rounded-lg shadow-md w-full max-w-4xl flex flex-col lg:flex-row'>
                    <div className='lg:w-1/4 lg:pr-8 mb-6 lg:mb-0 '>
                        <nav className='space-y-4'>
                            <button
                                className={`block w-full text-left p-2 rounded-lg ${currentSection === 'personalDetails' ? 'bg-gray-300' : 'bg-gray-100'}`}
                                onClick={() => setCurrentSection('personalDetails')}
                            >
                                Personal Details<span className='text-red-500 text-lg'>*</span>
                            </button>
                            <button
                                className={`block w-full text-left p-2 rounded-lg ${currentSection === 'workExperience' ? 'bg-gray-300' : 'bg-gray-100'}`}
                                onClick={() => setCurrentSection('workExperience')}
                            >
                                Work Experience
                            </button>
                            <button
                                className={`block w-full text-left p-2 rounded-lg ${currentSection === 'education' ? 'bg-gray-300' : 'bg-gray-100'}`}
                                onClick={() => setCurrentSection('education')}
                            >
                                Education
                            </button>
                            <button
                                className={`block w-full text-left p-2 rounded-lg ${currentSection === 'projects' ? 'bg-gray-300' : 'bg-gray-100'}`}
                                onClick={() => setCurrentSection('projects')}
                            >
                                Projects
                            </button>
                        </nav>
                    </div>
                    <div className='lg:w-3/4'>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {currentSection === 'personalDetails' && (
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    <h3 className='text-lg font-semibold'>Personal Details</h3>
                                    <div className='col-span-3 grid grid-cols-2 gap-4'>
                                        <div className='col-span-2 lg:col-span-1 md:col-span-1'>
                                            <Label htmlFor='fullName'>
                                                Full Name <span className='text-red-500'>*</span>
                                            </Label>
                                            <Input
                                                id='fullName'
                                                type='text'
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder='John Doe'
                                                required
                                                className='mt-1'
                                            />
                                        </div>
                                        <div className='col-span-2 lg:col-span-1 md:col-span-1 '>
                                            <Label htmlFor='email'>
                                                Email <span className='text-red-500'>*</span>
                                            </Label>
                                            <Input
                                                id='email'
                                                type='email'
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder='example@example.com'
                                                required
                                                className='mt-1'
                                            />
                                        </div>
                                    </div>
                                    <div className=' lg:col-span-1 md:col-span-1 col-span-3'>
                                        <Label htmlFor='phone'>
                                            Phone <span className='text-red-500'>*</span>
                                        </Label>
                                        <Input
                                            id='phone'
                                            type='tel'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder='XXXXXXXXXX'
                                            required
                                            className='mt-1'
                                        />
                                    </div>
                                    <div className='lg:col-span-1 md:col-span-1 col-span-3'>
                                        <Label htmlFor='linkedin'>LinkedIn</Label>
                                        <Input
                                            id='linkedin'
                                            type='text'
                                            value={formData.linkedin}
                                            onChange={handleChange}
                                            placeholder='https://linkedin.com/in/yourprofile'
                                            className='mt-1'
                                        />
                                    </div>
                                    <div className='lg:col-span-1 md:col-span-1 col-span-3'>
                                        <Label htmlFor='github'>GitHub</Label>
                                        <Input
                                            id='github'
                                            type='text'
                                            value={formData.github}
                                            onChange={handleChange}
                                            placeholder='https://github.com/yourprofile'
                                            className='mt-1'
                                        />
                                    </div>
                                    <div className='col-span-3'>
                                        <Label htmlFor='skills'>Skills (comma separated)</Label>
                                        <Input
                                            id='skills'
                                            type='text'
                                            value={formData.skills.join(', ')}
                                            onChange={handleSkillsChange}
                                            placeholder='JavaScript, React, Node.js'
                                            className='mt-1'
                                        />
                                    </div>
                                </div>
                            )}

                            {currentSection === 'workExperience' && (
                                <div className='space-y-4'>
                                    <div className='flex justify-between items-center flex-wrap gap-y-2'>
                                        <h3 className='text-lg font-semibold '>Work Experience</h3>
                                        <Button type='button' onClick={handleAddExperience} className="bg-blue-600">
                                            Add Work Experience
                                        </Button>
                                    </div>
                                    {formData.workExperience.map((exp, index) => (
                                        <div key={`workExperience-${index}`} className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <Label htmlFor={`Work experience-${index}`} className="text-xl">Work Experience {index + 1}</Label>
                                                <div className='flex items-center justify-center'>
                                                    {index > 0 && (
                                                        <Button type='button' onClick={() => handleRemoveExperience(index)} className='text-red-500 rounded-full hover:bg-red-200 bg-white'>
                                                            <ImCross />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`jobTitle-${index}`}>Job Title</Label>
                                                    <Input
                                                        id={`jobTitle-${index}`}
                                                        type='text'
                                                        value={exp.jobTitle}
                                                        onChange={(e) => handleWorkExperienceChange(index, 'jobTitle', e.target.value)}
                                                        placeholder='Job Title'
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`company-${index}`}>Company</Label>
                                                    <Input
                                                        id={`company-${index}`}
                                                        type='text'
                                                        value={exp.company}
                                                        onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                                                        placeholder='Company'
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`location-${index}`}>Location</Label>
                                                    <Input
                                                        id={`location-${index}`}
                                                        type='text'
                                                        value={exp.location}
                                                        onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
                                                        placeholder='Location'
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                                                    <Input
                                                        id={`startDate-${index}`}
                                                        type='date'
                                                        value={exp.startDate}
                                                        onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`endDate-${index}`}>End Date</Label>
                                                    <Input
                                                        id={`endDate-${index}`}
                                                        type='date'
                                                        value={exp.endDate}
                                                        onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1 sm:col-span-2'>
                                                    <Label htmlFor={`responsibilities-${index}`}>Responsibilities</Label>
                                                    <Input
                                                        id={`responsibilities-${index}`}
                                                        type='text'
                                                        value={exp.responsibilities}
                                                        onChange={(e) => handleWorkExperienceChange(index, 'responsibilities', e.target.value)}
                                                        placeholder='Responsibilities'
                                                        className='mt-1'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentSection === 'education' && (
                                <div className='space-y-4'>
                                    <div className='flex justify-between items-center'>
                                        <h3 className='text-lg font-semibold'>Education</h3>
                                        <Button type='button' onClick={handleAddEducation} className='bg-blue-600'>
                                            Add Education
                                        </Button>
                                    </div>
                                    {formData.education.map((edu, index) => (
                                        <div key={`education-${index}`} className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <Label htmlFor={`Education Details-${index}`} className="text-xl">Educational Details {index + 1}</Label>
                                                <div className='flex items-center justify-center'>
                                                    {index > 0 && (
                                                        <Button type='button' onClick={() => handleRemoveEducation(index)} className='text-red-500 rounded-full bg-white hover:text-red-700 hover:bg-white '>
                                                            <ImCross />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`degree-${index}`}>Degree</Label>
                                                    <Input
                                                        id={`degree-${index}`}
                                                        type='text'
                                                        value={edu.degree}
                                                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                        placeholder='Degree'
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`institution-${index}`}>Institution</Label>
                                                    <Input
                                                        id={`institution-${index}`}
                                                        type='text'
                                                        value={edu.institution}
                                                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                                        placeholder='Institution'
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`location-${index}`}>Location</Label>
                                                    <Input
                                                        id={`location-${index}`}
                                                        type='text'
                                                        value={edu.location}
                                                        onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                                                        placeholder='Location'
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`start_date-${index}`}>Start Date</Label>
                                                    <Input
                                                        id={`start_date-${index}`}
                                                        type='date'
                                                        value={edu.start_date}
                                                        onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`end_date-${index}`}>End Date</Label>
                                                    <Input
                                                        id={`end_date-${index}`}
                                                        type='date'
                                                        value={edu.end_date}
                                                        onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                                                        className='mt-1'
                                                    />
                                                </div>
                                                <div className='col-span-1'>
                                                    <Label htmlFor={`gpa-${index}`}>GPA</Label>
                                                    <Input
                                                        id={`gpa-${index}`}
                                                        type='number'
                                                        value={edu.gpa}
                                                        onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                                                        step='0.01'
                                                        placeholder='GPA'
                                                        className='mt-1'
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentSection === 'projects' && (
                                <div className='space-y-4'>
                                    <div className='flex justify-between items-center'>
                                        <h3 className='text-lg font-semibold'>Projects</h3>
                                        <Button type='button' onClick={handleAddProject} className='bg-blue-600'>
                                            Add Project
                                        </Button>
                                    </div>
                                    {formData.projects.map((project, index) => (
                                        <div key={`projects-${index}`} className='space-y-4'>

                                            <div className='grid grid-cols-1'>
                                                <div className='flex items-center justify-between'>
                                                    <Label htmlFor={`project-${index}`} className='text-base pb-1'>Project {index + 1}</Label>
                                                    <div className='flex items-center justify-center'>
                                                        {index > 0 && (
                                                            <Button type='button' onClick={() => handleRemoveProject(index)} className='text-red-500 rounded-full text-sm bg-white hover:text-red-700 hover:bg-white '>
                                                                <ImCross />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <Textarea
                                                    id={`project-${index}`}
                                                    type='text'
                                                    value={project}
                                                    onChange={(e) => handleProjectsChange(index, e.target.value)}
                                                    placeholder={`Project Details ${index + 1}`}
                                                    className='mt-1'
                                                />
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}

                            {errorMessage && (
                                <p className='text-red-500 text-sm lg:text-base w-full text-center'>{errorMessage}</p>
                            )}

                            <div className='flex justify-end'>
                                {currentSection !== 'personalDetails' && (
                                    <Button type='button' onClick={handlePreviousSection} className='w-full lg:w-1/4 mr-2 bg-blue-600'>
                                        Previous
                                    </Button>
                                )}
                                {currentSection !== 'projects' && (
                                    <Button type='button' onClick={handleNextSection} className='w-full lg:w-1/4 ml-2 bg-blue-600'>
                                        Next
                                    </Button>
                                )}
                                {currentSection === 'projects' && (
                                    <Button type='submit' className='w-full lg:w-1/4 ml-2 bg-blue-600'>
                                        Submit
                                    </Button>)
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddResume;
