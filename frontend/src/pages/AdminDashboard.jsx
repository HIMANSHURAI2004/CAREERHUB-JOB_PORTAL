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

    useEffect(() => {
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

        fetchEntries();
    }, [model, searchTerm, filters]);

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
        }); // Reset filters when model changes
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <Label htmlFor="modelSelect">Select Model</Label>
                <Select onValueChange={handleModelChange} className="w-1/3">
                    <SelectTrigger id="modelSelect" className="w-full">
                        <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="companies">Companies</SelectItem>
                        <SelectItem value="jobs">Jobs</SelectItem>
                        <SelectItem value="resumes">Resumes</SelectItem>
                        <SelectItem value="applications">Applications</SelectItem>
                    </SelectContent>
                </Select>
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {model === 'users' && (
                <div className="mb-4">
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={(value) => setFilters({ ...filters, role: value })} className="w-1/3">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="recruiter">Recruiter</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {model === 'jobs' && (
                <div className="mb-4">
                    <Label htmlFor="salaryMin">Salary Min</Label>
                    <input
                        type="number"
                        name="salaryMin"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                        value={filters.salaryMin}
                        onChange={handleFilterChange}
                    />
                    <Label htmlFor="salaryMax">Salary Max</Label>
                    <input
                        type="number"
                        name="salaryMax"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                        value={filters.salaryMax}
                        onChange={handleFilterChange}
                    />
                    <Label htmlFor="workExperienceMinYears">Work Experience Min Years</Label>
                    <input
                        type="number"
                        name="workExperienceMinYears"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                        value={filters.workExperienceMinYears}
                        onChange={handleFilterChange}
                    />
                    <Label htmlFor="isRemote">Remote</Label>
                    <Select onValueChange={(value) => setFilters({ ...filters, isRemote: value === 'true' })} className="w-1/3">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select remote option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                    </Select>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select onValueChange={(value) => setFilters({ ...filters, employmentType: value })} className="w-1/3">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full-time">Full-Time</SelectItem>
                            <SelectItem value="part-time">Part-Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {model === 'applications' && (
                <div className="mb-4">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => setFilters({ ...filters, status: value })} className="w-1/3">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

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
                                <ul>
                                    {Object.entries(entry).map(([key, value]) => (
                                        !['password', 'refreshToken', '__v', 'createdAt', 'updatedAt'].includes(key) && (
                                            <li key={key} className="py-2">
                                                <span className="font-semibold">{key}:</span>
                                                {Array.isArray(value) ? (
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;











