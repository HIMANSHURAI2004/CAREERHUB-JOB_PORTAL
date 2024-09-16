import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FiEdit } from "react-icons/fi";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FiLock } from "react-icons/fi";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
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
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
function AdminAccount() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast()

    
    async function getUserData() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/get-user`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            setUserRole(data?.data.role);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData();
    }, []);
    const handleChangePassword = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData['oldPassword'] = oldPassword;
        formData['newPassword'] = newPassword;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/change-password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            })

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Password change Failed, Please try again.",
                })
            }
            else {
                toast({
                    description: "Password changed successfully .",
                })
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    }
    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/delete-user`, {
                withCredentials: true,
            });

            if (!response?.data?.success) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Account deletion Failed, Please try again.",
                })
            }
            else {
                toast({
                    description: "Account deleted successfully .",
                })
            }
            navigate('/login');
        } catch (error) {
            console.error('Error deleting Account:', error);
        }
    }

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
    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-100">
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
            <div className="mx-auto grid w-full justify-start p-4 sm:px-6 gap-2">
                <h1 className="sm:text-3xl text-2xl font-semibold text-gray-700 pb-2">Admin Account</h1>
            </div>
            <div className=" lg:mx-16 md:mx-10 sm:mx-6 mx-2">

                <div className="grid gap-6">
                    <Card className="border rounded-lg shadow-lg">
                        <CardContent className='flex items-center justify-between p-6'>
                            <h1 className="font-semibold ">
                                Change Password
                            </h1>
                            <Dialog className=''>
                                <DialogTrigger className=" hover:bg-blue-100 rounded-md"><FiEdit className="text-blue-600 text-xl" /></DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className='flex flex-col gap-4'>
                                            <span className="bg-blue-50 w-fit rounded-full p-3"><FiLock className="text-blue-500 text-2xl" /></span>
                                            <p className="text-2xl font-semibold">Change Password</p>
                                        </DialogTitle>
                                        <DialogDescription>
                                            To change your password, please fill in the fields below.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleChangePassword}>

                                        <div className="grid gap-4 py-4">
                                            <div className="flex flex-col gap-3">
                                                <Label htmlFor="oldPassword" className="">
                                                    Old Password
                                                </Label>
                                                <Input
                                                    type="password"
                                                    id="oldPassword"
                                                    placeholder="Current Password"
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    value={oldPassword}
                                                    className=""
                                                />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <Label htmlFor="newPassword" className="">
                                                    New Password
                                                </Label>
                                                <Input
                                                    type="password"
                                                    id="newPassword"
                                                    placeholder="New Password"
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    value={newPassword}
                                                    className=""
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" className='bg-blue-600'>Save changes</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                        </CardContent>
                    </Card>
                    <Card className="border rounded-lg shadow-lg">
                        <CardContent >
                            <h1 className="text-2xl font-semibold text-red-500 p-2 py-4">
                                Delete Account
                            </h1>
                            <p className="text-left text-gray-700 px-2">Permanently Remove your Personal Account and all of its contents from the CAREERHUB. This action is not reversible, so please continue with caution.  </p>
                        </CardContent>
                        <div className="text-end pb-3 pr-7">
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button className='text-white bg-red-600 hover:bg-red-800'>Delete Account</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete your account? This action is not reversible.
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogAction className='bg-red-600 hover:bg-red-900'>
                                            <Button className='bg-red-600 hover:bg-red-900' onClick={handleDeleteAccount}>Delete Account</Button>
                                        </AlertDialogAction>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default AdminAccount;
