import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
    CircleUser,
    Menu,
    Package2,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom';
const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293-1.293a1 1 0 010-1.414L6 13.291V17zm8-1.383a1 1 0 00-1.414 0L12 15.586 10.707 14.293a1 1 0 00-1.414 0L6 17.586V20h8v-3.383z"></path>
    </svg>
);

function AdminDashboardSearch() {
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
    const navigate = useNavigate();

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/v1/user/admin-dashboard`, {
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
            const response = await fetch(`http://localhost:3000/api/v1/user/count-entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ modelName: model }),
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
                ? (Math.min(parseInt(value, 10), Number.MAX_SAFE_INTEGER))
                : name === 'isRemote'
                    ? value === true
                    : value;
        setFilters({ ...filters, [name]: parsedValue });
    };

    const handleDelete = async (entryId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/v1/user/admin-delete`, {
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


            if (!response.ok) {
                throw new Error('Failed to delete entry');
            }

            setEntries(entries.filter(entry => entry._id !== entryId));
        } catch (error) {
            setErrorMessage('Failed to delete entry');
        } finally {
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

    const handleLogout = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/user/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            navigate('/login')
          } else {
            console.error('Failed to logout:', response.statusText);
          }
        } catch (error) {
          console.error('Failed to logout:', error);
        }
      };

    return (
        <div>
            <header className="sticky top-0 flex h-16 items-center gap-4 bg-background px-4 md:px-6 border-b-2 bg-blue-700 text-white border-blue-600">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ">
                    <Link
                        to="#"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Link
                        to="/admin/dashboard"
                        className=" transition-colors hover:text-foreground"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/dashboard/search"
                        className=" transition-colors text-foreground"
                    >
                        Search
                    </Link>
                    <Link
                        to="/admin/dashboard/users"
                        className=" transition-colors hover:text-foreground"
                    >
                        Users
                    </Link>
                    <Link
                        to="/admin/dashboard/jobs"
                        className=" transition-colors hover:text-foreground"
                    >
                        Jobs
                    </Link>
                    <Link
                        to="/admin/dashboard/applications"
                        className=" hover:text-foreground"
                    >
                        Applications
                    </Link>
                    <Link
                        to="#"
                        className=" transition-colors hover:text-foreground"
                    >
                        Analytics
                    </Link>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium ">
                            <Link
                                to="#"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link to="/" className="hover:text-foreground">
                                Dashboard
                            </Link>
                            <Link
                                to="/admin/dashbaord/search"
                                className=" text-foreground"
                            >
                                Search
                            </Link>
                            <Link
                                to="/admin/dashboard/users"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Users
                            </Link>
                            <Link
                                to="/admin/dashboard/jobs"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Jobs
                            </Link>
                            <Link
                                to="/admin/dashboard/applications"
                                className=" hover:text-foreground"
                            >
                                Applications
                            </Link>
                            <Link
                                to="#"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Analytics
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <div className="relative ml-auto flex-1 sm:flex-initial">

                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                <Link to='/admin/account'>Account</Link>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-4 mb-4 w-full gap-x-2 px-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className=" px-4 py-2 border border-gray-300 rounded-md focus:outline-none col-span-2"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className='col-span-1 '>
                        <Label htmlFor="modelSelect"></Label>
                        <Select onValueChange={handleModelChange} className="">
                            <SelectTrigger id="modelSelect" className="">
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
                        <div className="col-span-1 ">
                            <Label htmlFor="role"></Label>
                            <Select onValueChange={(value) => setFilters({ ...filters, role: value })} className="w-full">
                                <SelectTrigger className="w-full">
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

                    {model === 'applications' && (
                            <div className="col-span-1">
                                <Label htmlFor="status"></Label>
                                <Select onValueChange={(value) => setFilters({ ...filters, status: value })} >
                                    <SelectTrigger className="w-full">
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
                </div>


                {model === 'jobs' && (
                    <div className="flex flex-wrap mb-4">
                        <div className="w-1/3 px-2">
                            <Label htmlFor="salaryMin"></Label>
                            <input
                                type="number"
                                name="salaryMin"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                value={filters.salaryMin}
                                onChange={handleFilterChange}
                                placeholder='Min Salary'
                            />
                        </div>
                        <div className="w-1/3 px-2">
                            <Label htmlFor="salaryMax"></Label>
                            <input
                                type="number"
                                name="salaryMax"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                value={filters.salaryMax}
                                onChange={handleFilterChange}
                                placeholder='Max Salary'
                            />
                        </div>
                        <div className="w-1/3 px-2">
                            <Label htmlFor="workExperienceMinYears"></Label>
                            <input
                                type="number"
                                name="workExperienceMinYears"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                                value={filters.workExperienceMinYears}
                                onChange={handleFilterChange}
                                placeholder='Min Experience (Years)'
                            />
                        </div>
                        <div className='w-full flex mt-4'>

                            <div className="w-1/3 px-2">
                                <Label htmlFor="isRemote"></Label>
                                <Select onValueChange={(value) => setFilters({ ...filters, isRemote: value === 'true' })} className="w-full">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select remote option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='true'>Yes</SelectItem>
                                        <SelectItem value='false'>All</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-1/3 px-2">
                                <Label htmlFor="employmentType"></Label>
                                <Select onValueChange={(value) => setFilters({ ...filters, employmentType: value })} className="w-full">
                                    <SelectTrigger className="w-full">
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
                        </div>
                    </div>
                )}


                <div className="flex justify-end items-center mb-4">

                    <button
                        onClick={handleReset}
                        className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
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
                            <Card key={index} className=' shadow-md p-2'>
                                <CardContent>
                                    <div className="flex justify-between items-start">
                                        <ul className="w-full pt-2">
                                            {Object.entries(entry).map(([key, value]) => (
                                                !['password', 'refreshToken', '__v', 'createdAt', 'updatedAt', 'workExperience', 'education'].includes(key) && (
                                                    <li key={key} className="py-1">
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
                                            className="text-red-500 hover:text-red-700 font-bold text-2xl"
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
        </div>
    );
}

export default AdminDashboardSearch;

