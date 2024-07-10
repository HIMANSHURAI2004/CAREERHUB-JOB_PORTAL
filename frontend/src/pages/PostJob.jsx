import React, { useState } from 'react';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locations: '',
    salary: '',
    deadline: '',
    workExperienceMinYears: 0,
    isRemote: false,
    skillsRequired: '',
    employmentType: 'Full-time',
    industry: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    if (id === 'workExperienceMinYears') {
      const intValue = parseInt(value, 10);
      if (!isNaN(intValue) && intValue >= 0) {
        setFormData({
          ...formData,
          [id]: intValue,
        });
      }
    }else if (id === 'deadline') {
        const selectedDate = new Date(value);
        const currentDate = new Date();
  
        if (selectedDate >= currentDate) {
          setFormData({
            ...formData,
            [id]: value,
          });
        } 
    }else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/job/create-job', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add job');
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to add job');
    }
  };

  return (
    <div className="bg-gray-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 py-4 px-6 bg-gray-200">Post a Job</h2>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="locations" className="block text-gray-700 font-bold mb-2">
              Locations (comma-separated)
            </label>
            <input
              type="text"
              id="locations"
              name="locations"
              value={formData.locations}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="salary" className="block text-gray-700 font-bold mb-2">
              Salary
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="deadline" className="block text-gray-700 font-bold mb-2">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="workExperienceMinYears" className="block text-gray-700 font-bold mb-2">
              Minimum Years of Work Experience
            </label>
            <input
              type="number"
              id="workExperienceMinYears"
              name="workExperienceMinYears"
              value={formData.workExperienceMinYears}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center text-gray-700 font-bold">
              <input
                type="checkbox"
                id="isRemote"
                name="isRemote"
                checked={formData.isRemote}
                onChange={(e) => setFormData({ ...formData, isRemote: e.target.checked })}
                className="mr-2 leading-tight"
              />
              <span>Remote</span>
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="skillsRequired" className="block text-gray-700 font-bold mb-2">
              Skills Required (comma-separated)
            </label>
            <input
              type="text"
              id="skillsRequired"
              name="skillsRequired"
              value={formData.skillsRequired}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="employmentType" className="block text-gray-700 font-bold mb-2">
              Employment Type
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="industry" className="block text-gray-700 font-bold mb-2">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;


