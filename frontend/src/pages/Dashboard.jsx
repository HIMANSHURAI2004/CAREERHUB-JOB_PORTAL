import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  CircleUser,
  Menu,
  Package2,
  Users,
} from "lucide-react"
import { Building2 } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NotebookPen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { BriefcaseBusiness } from 'lucide-react';
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const [countData, setCountData] = useState(
    {
      usersCount: 0,
      jobsCount: 0,
      applicationsCount: 0,
      companiesCount: 0,
    }
  );

  const [userEntries, setUserEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobEntries, setJobEntries] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const getDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/get-all-counts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch count');
      }

      const responseData = await response.json();
      setCountData(responseData.data);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch count');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
    getUserData();
    getJobsData();
  }, []);

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/admin-dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelName: 'users' }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const responseData = await response.json();
      setUserEntries(responseData.data);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  };

  const getJobsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/admin-dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelName: 'jobs' }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const responseData = await response.json();
      setJobEntries(responseData.data);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
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
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 bg-background px-4 md:px-6 border-b-2 bg-blue-700 text-white border-blue-600 z-10">
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
            className=" transition-colors text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/dashboard/search"
            className=" transition-colors hover:text-foreground"
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
              <Link to="/" className="text-foreground">
                Dashboard
              </Link>
              <Link
                to="/admin/dashbaord/search"
                className="text-muted-foreground hover:text-foreground"
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
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countData.usersCount}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Posted Jobs
              </CardTitle>
              <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countData.jobsCount}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <NotebookPen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countData.applicationsCount}</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countData.companiesCount}</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card
            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>
                  A list of the most recent jobs posted by recuiters
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1 bg-blue-600 hover:bg-blue-800">
                <Link to="/admin/dashboard/jobs">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden xl:table-column">
                      title
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Created At
                    </TableHead>

                    <TableHead className="text-right">ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobEntries.map((entry) => (
                    jobEntries.length > 0 && (
                      <TableRow key={entry._id}>
                        <TableCell>
                          <div className="font-medium">{entry.title}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {new Date(entry.createdAt).toLocaleString()}
                          </div>
                        </TableCell>


                        <TableCell className="text-right">{entry._id}</TableCell>
                      </TableRow>
                    )
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              {userEntries.map((entry) =>
                entry.role !== 'admin' &&
                (
                  <div key={entry._id} className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src={entry.image} alt="Avatar" />
                      <AvatarFallback className='uppercase'>{entry.userName.split(' ')[0].slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {entry.userName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.email}
                      </p>
                    </div>
                    <div className="ml-auto text-xs uppercase">{entry.role}</div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Dashboard;
