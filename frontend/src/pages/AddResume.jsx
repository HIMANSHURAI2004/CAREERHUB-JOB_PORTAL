import React, { useState } from 'react';
import logo from './careerhublogo.png';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function AddResume() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        skills: [],
        workExperience: [],
        education: [],
        projects: [],
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
            workExperience: [...formData.workExperience, {
                jobTitle: '',
                company: '',
                location: '',
                startDate: Date.now(),
                endDate: Date.now(),
                responsibilities: '',
            }],
        });
    };

    const handleAddEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, {
                degree: '',
                institution: '',
                location: '',
                start_date: Date.now(),
                end_date: Date.now(),
                gpa: 0,
            }],
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

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

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
            const accessToken = getCookie('accessToken'); // Retrieve access token from cookies
    
            const response = await fetch('http://localhost:3000/api/v1/user/add-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add resume');
            }
    
            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to add resume');
        }
    };

    return (
        <div className='w-full min-h-screen flex items-center py-6 px-4 sm:px-6 lg:px-28 bg-blue-200'>
            <div className='min-w-full flex flex-col lg:flex-row bg-white shadow-2xl overflow-hidden max-w-screen-lg mx-auto'>
                <div className='lg:w-full flex justify-center py-4'>
                    <div className='w-full md:w-[80%] lg:max-w-lg flex flex-col px-6 items-center justify-center'>
                        <img src={logo} alt='' className='w-24 h-6 mx-auto' />
                        <div className='my-4'>
                            <h2 className='font-bold text-xl lg:text-3xl md:text-2xl text-center lg:text-start md:text-start'>
                                Create your Resume
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-4 sm:flex-row sm:flex-wrap lg:flex-row lg:flex-wrap'>
                            <div className='w-full sm:w-1/2 lg:w-1/3'>
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
                                />
                            </div>
                            <div className='w-full sm:w-1/2 lg:w-1/3'>
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
                                />
                            </div>
                            <div className='w-full sm:w-1/2 lg:w-1/3'>
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
                                />
                            </div>
                            <div className='w-full sm:w-1/2 lg:w-1/3'>
                                <Label htmlFor='linkedin'>LinkedIn</Label>
                                <Input
                                    id='linkedin'
                                    type='text'
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder='https://linkedin.com/in/yourprofile'
                                />
                            </div>
                            <div className='w-full sm:w-1/2 lg:w-1/3'>
                                <Label htmlFor='github'>GitHub</Label>
                                <Input
                                    id='github'
                                    type='text'
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder='https://github.com/yourprofile'
                                />
                            </div>
                            <div className='w-full'>
                                <Label htmlFor='skills'>Skills</Label>
                                <Input
                                    id='skills'
                                    type='text'
                                    value={formData.skills.join(', ')}
                                    onChange={handleSkillsChange}
                                    placeholder='JavaScript, React, Node.js'
                                />
                            </div>
                            <div className='w-full flex justify-center'>
                                <Button type='button' onClick={handleAddExperience}>
                                    Add Work Experience
                                </Button>
                            </div>
                            {formData.workExperience.map((exp, index) => (
                                <div key={`workExperience-${index}`} className='w-full flex gap-4'>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`jobTitle-${index}`}>Job Title</Label>
                                        <Input
                                            id={`jobTitle-${index}`}
                                            type='text'
                                            value={exp.jobTitle}
                                            onChange={(e) => handleWorkExperienceChange(index, 'jobTitle', e.target.value)}
                                            placeholder='Job Title'
                                        />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`company-${index}`}>Company</Label>
                                        <Input
                                            id={`company-${index}`}
                                            type='text'
                                            value={exp.company}
                                            onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                                            placeholder='Company'
                                        />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`location-${index}`}>Location</Label>
                                        <Input
                                            id={`location-${index}`}
                                            type='text'
                                            value={exp.location}
                                            onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
                                            placeholder='Location'
                                        />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                                        <Input
                                            id={`startDate-${index}`}
                                            type='date'
                                            value={exp.startDate}
                                            onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`endDate-${index}`}>End Date</Label>
                                        <Input
                                            id={`endDate-${index}`}
                                            type='date'
                                            value={exp.endDate}
                                            onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Label htmlFor={`responsibilities-${index}`}>Responsibilities</Label>
                                        <Input
                                            id={`responsibilities-${index}`}
                                            type='text'
                                            value={exp.responsibilities}
                                            onChange={(e) => handleWorkExperienceChange(index, 'responsibilities', e.target.value)}
                                            placeholder='Responsibilities'
                                        />
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <Button type='button' onClick={() => handleRemoveExperience(index)} className='text-red-500'>
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className='w-full flex justify-center'>
                                <Button type='button' onClick={handleAddEducation}>
                                    Add Education
                                </Button>
                            </div>
                            {formData.education.map((edu, index) => (
                                <div key={`education-${index}`} className='w-full flex gap-4'>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`degree-${index}`}>Degree</Label>
                                        <Input
                                            id={`degree-${index}`}
                                            type='text'
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                            placeholder='Degree'
                                        />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`institution-${index}`}>Institution</Label>
                                        <Input
                                            id={`institution-${index}`}
                                            type='text'
                                            value={edu.institution}
                                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                            placeholder='Institution'
                                        />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`location-${index}`}>Location</Label>
                                        <Input
                                            id={`location-${index}`}
                                            type='text'
                                            value={edu.location}
                                            onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                                            placeholder='Location'
                                        />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`start_date-${index}`}>Start Date</Label>
                                        <Input
                                            id={`start_date-${index}`}
                                            type='date'
                                            value={edu.start_date}
                                            onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`end_date-${index}`}>End Date</Label>
                                        <Input
                                            id={`end_date-${index}`}
                                            type='date'
                                            value={edu.end_date}
                                            onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full sm:w-1/2'>
                                        <Label htmlFor={`gpa-${index}`}>GPA</Label>
                                        <Input
                                            id={`gpa-${index}`}
                                            type='number'
                                            value={edu.gpa}
                                            onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                                            step='0.01'
                                            placeholder='GPA'
                                        />
                                    </div>
                                    <div className='w-full flex justify-end'>
                                        <Button type='button' onClick={() => handleRemoveEducation(index)} className='text-red-500'>
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className='w-full flex justify-center'>
                                <Button type='button' onClick={handleAddProject}>
                                    Add Project
                                </Button>
                            </div>
                            {formData.projects.map((project, index) => (
                                <div key={`projects-${index}`} className='w-full flex gap-4'>
                                        <Label htmlFor={`project-${index}`}>Project {index + 1}</Label>
                                        <Input
                                            id={`project-${index}`}
                                            type='text'
                                            value={project}
                                            onChange={(e) => handleProjectsChange(index, e.target.value)}
                                            placeholder={`Project ${index + 1}`}
                                        />
                                    <div className='w-full flex '>
                                        <Button type='button' onClick={() => handleRemoveProject(index)} className='text-red-500'>
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {errorMessage && (
                                <p className='text-red-500 text-sm lg:text-base w-full'>{errorMessage}</p>
                            )}
                            <div className='w-full flex justify-center'>
                                <Button type='submit' className='w-full lg:w-1/2'>
                                    Create Resume
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddResume;



