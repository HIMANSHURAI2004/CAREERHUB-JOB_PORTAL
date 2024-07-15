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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react";
function Account() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast()

    async function getUserData() {
        try {
            const response = await fetch("http://localhost:3000/api/v1/user/get-user", {
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
        // console.log(formData);
        try {
            const response = await fetch('http://localhost:3000/api/v1/user/change-password', {
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
                    // action: <ToastAction altText="Try again">Try again</ToastAction>,
                })
            }
            else {
                toast({
                    description: "Password changed successfully .",
                })
            }
            // console.log(response);
        } catch (error) {
            console.error('Error changing password:', error);

        }
    }
    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete('http://localhost:3000/api/v1/user/delete-user', {
                withCredentials: true,
            });
            // console.log(response);

            if (!response?.data?.success) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Account deletion Failed, Please try again.",
                    // action: <ToastAction altText="Try again">Try again</ToastAction>,
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

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-100">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 ">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold text-gray-700 pb-2">Account</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
                    <nav className="grid gap-4 text-sm text-gray-600">
                        <nav className="grid gap-4 text-sm text-gray-600">
                            <Link to="/profile">
                                General
                            </Link>
                            {userRole === "recruiter" ? (
                                <>
                                    <Link to="/company">Company</Link>
                                    <Link to="/user-job">Jobs</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/resume">Resume</Link>
                                    <Link to="/applications">Applications</Link>
                                </>
                            )}
                            <Link to="/account" className="font-semibold text-blue-600">Account</Link>
                        </nav>
                    </nav>
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
            </main>
        </div>
    );
}

export default Account;
