import React, { useEffect, useState } from 'react';
import { Card, CardContent} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
    </svg>
);

function AdminDashboard() {
    const [model, setModel] = useState('users');
    const [entries, setEntries] = useState([]);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        role: '',
        salaryMin: '',
        salaryMax: '',
        workExperienceMinYears: '',
        isRemote: '',
        employmentType: '',
        status: '',
    });

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/v1/user/admin-dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ modelName: model, search: searchTerm, filters }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch entries');
            }

            const responseData = await response.json();
            setEntries(responseData.data);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to fetch entries');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchCount = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/v1/user/count-entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ modelName: model}),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch count');
            }

            const responseData = await response.json();
            setCount(responseData.data);
        } catch (error) {
            setErrorMessage(error.message || 'Failed to fetch count');
        } finally {
            setIsLoading(false);
        }
    };
      

    useEffect(() => {
        fetchEntries();
    }, [model, searchTerm, filters]);

    useEffect(() => {
        fetchCount();
    }, [model]);

    const handleModelChange = (value) => {
        setModel(value);
        setFilters({
            role: '',
            salaryMin: '',
            salaryMax: '',
            workExperienceMinYears: '',
            isRemote: '',
            employmentType: '',
            status: '',
        }); 
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = (name === 'salaryMin' || name === 'workExperienceMinYears')
            ? Math.max(0, parseInt(value, 10))
            : (name === 'salaryMax') 
            ? (Math.min(parseInt(value, 10),Number.MAX_SAFE_INTEGER))
            : name === 'isRemote'
            ? value === true
            : value;
        setFilters({ ...filters, [name]: parsedValue });
    };

    const handleDelete = async (entryId) => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/v1/user/admin-delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    modelName: model,
                    entryId,
                }),
                credentials: 'include',
            });

            console.log(response)

            if (!response.ok) {
                throw new Error('Failed to delete entry');
            }

            setEntries(entries.filter(entry => entry._id !== entryId));
        } catch (error) {
            setErrorMessage('Failed to delete entry');
        }finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        fetchEntries();
        setFilters({
            role: '',
            salaryMin: '',
            salaryMax: '',
            workExperienceMinYears: '',
            isRemote: '',
            employmentType: '',
            status: '',
        });
    };


    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <Label htmlFor="modelSelect"></Label>
                <Select onValueChange={handleModelChange} className="w-1/3">
                    <SelectTrigger id="modelSelect" className="w-1/3">
                        <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="companies">Companies</SelectItem>
                        <SelectItem value="jobs">Jobs</SelectItem>
                        <SelectItem value="resumes">Resumes</SelectItem>
                        <SelectItem value="applications">Applications</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {model === 'users' && (
                <div className="mb-4">
                    <Label htmlFor="role"></Label>
                    <Select onValueChange={(value) => setFilters({ ...filters, role: value })} className="w-1/3">
                        <SelectTrigger className="w-1/3">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="recruiter">Recruiter</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {model === 'jobs' && (
                <div className="mb-4">
                    <Label htmlFor="salaryMin"></Label>
                    <input
                        type="number"
                        name="salaryMin"
                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                        value={filters.salaryMin}
                        onChange={handleFilterChange}
                        placeholder='Min Salary'
                    />
                    <Label htmlFor="salaryMax"></Label>
                    <input
                        type="number"
                        name="salaryMax"
                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                        value={ filters.salaryMax}
                        onChange={handleFilterChange}
                        placeholder='Max Salary'
                    />
                    <Label htmlFor="workExperienceMinYears"></Label>
                    <input
                        type="number"
                        name="workExperienceMinYears"
                        className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                        value={filters.workExperienceMinYears}
                        onChange={handleFilterChange}
                        placeholder='Min Experience ( Years )'
                    />
                    <Label htmlFor="isRemote"></Label>
                    <Select onValueChange={(value) => setFilters({ ...filters, isRemote: value == 'true' })} className="w-1/3">
                        <SelectTrigger className="w-1/3">
                            <SelectValue placeholder="Select remote option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='true' >Yes</SelectItem>
                            <SelectItem value='false'>All</SelectItem>
                        </SelectContent>
                    </Select>
                    <Label htmlFor="employmentType"></Label>
                    <Select onValueChange={(value) => setFilters({ ...filters, employmentType: value })} className="w-1/3">
                        <SelectTrigger className="w-1/3">
                            <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Full-time">Full-Time</SelectItem>
                            <SelectItem value="Part-time">Part-Time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {model === 'applications' && (
                <div className="mb-4">
                    <Label htmlFor="status"></Label>
                    <Select onValueChange={(value) => setFilters({ ...filters, status: value })} className="w-1/3">
                        <SelectTrigger className="w-1/3">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Applied">Applied</SelectItem>
                            <SelectItem value="Interviewing">Interviewing</SelectItem>
                            <SelectItem value="Offered">Offered</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="flex justify-end items-center mb-4">
                <div className="text-md font-semibold mr-4">
                    <span className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                        {count}
                    </span>
                </div>
                <button 
                    onClick={handleReset} 
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                    Reset
                </button>
            </div>


            {isLoading ? (
                <div className="flex justify-center items-center mt-4">
                    <Spinner />
                </div>
            ) : errorMessage ? (
                <div className="text-red-500 text-center mt-4">{errorMessage}</div>
            ) : entries.length === 0 ? (
                <div className="text-center mt-4">No entries found.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {entries.map((entry, index) => (
                        <Card key={index}>
                            <CardContent>
                                <div className="flex justify-between items-start">
                                <ul className="w-full">
                                    {Object.entries(entry).map(([key, value]) => (
                                        !['password', 'refreshToken', '__v', 'createdAt', 'updatedAt', 'workExperience', 'education'].includes(key) && (
                                            <li key={key} className="py-2">
                                                <span className="font-semibold">{key}:</span>
                                                {typeof value === 'boolean' ? (
                                                    value ? 'True' : 'False'
                                                ) : Array.isArray(value) ? (
                                                    <ul className="list-disc pl-4">
                                                        {value.map((item, index) => (
                                                            <li key={index}>
                                                                {typeof item === 'object' ? JSON.stringify(item) : item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : typeof value === 'object' ? (
                                                    <ul className="list-disc pl-4">
                                                        {Object.entries(value).map(([subKey, subValue]) => (
                                                            <li key={subKey}>
                                                                <span className="font-semibold">{subKey}:</span> {subValue}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    value
                                                )}
                                            </li>
                                        )
                                    ))}
                                </ul>

                                    <button
                                        onClick={() => handleDelete(entry._id)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;











