import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import profile from './profile.jpg';

import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";

function CompanyDetails() {
    const [companyDetails, setCompanyDetails] = useState(null);
    const [editData, setEditData] = useState({
        companyName: "",
        address: "",
        website: "",
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function getCompanyDetails() {
        try {
            const response = await fetch("http://localhost:3000/api/v1/job/get-company-details", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Error fetching Company data");
            }
            const { data } = await response.json();
            setCompanyDetails(data);
            setEditData({
                companyName: data?.companyName,
                address: data?.address,
                website: data?.website,
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching company data:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getCompanyDetails();
    }, []);

    async function handleUpdateDetails(e) {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/v1/user/update-company-details", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(editData),
            });
            if (!response.ok) {
                throw new Error("Error updating Company data");
            }
            const data = await response.json();
            setCompanyDetails(data?.data);
        } catch (error) {
            console.error("Error updating company details:", error);
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-100 ">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold text-gray-700 pb-2">Company</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
                    <nav className="grid gap-4 text-sm text-gray-600">
                        <Link to="/profile">General</Link>
                        <Link to="/company" className="font-semibold text-blue-600">Company</Link>
                        <Link to="/user-job">Jobs</Link>
                        <Link to="/account">Account</Link>
                    </nav>
                    <div className="grid gap-6">
                        <Card className="border rounded-lg shadow-lg">
                            <CardHeader className="bg-[#294f7c] text-white p-5 pl-6 flex rounded-t-lg">
                                <CardTitle className="text-2xl font-semibold">Company Details</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row md:items-start md:space-x-6 mt-4">
                                {loading ? (
                                    <div className="flex justify-center items-center w-full h-64">
                                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                                    </div>
                                ) : (
                                    <div className="mt-4 md:mt-0 md:flex-1">
                                        {companyDetails && (
                                            <div className="space-y-4">
                                                <p className="flex justify-between">
                                                    <span className="font-medium">Company Name</span>
                                                    <span>{companyDetails.companyName}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="font-medium">Address</span>
                                                    <span>{companyDetails.address}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="font-medium">Website</span>
                                                    <span>{companyDetails.website}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="bg-[#294f7c] text-white px-4 rounded-lg">Update Details</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Update Company Details</DialogTitle>
                                            <DialogDescription>Update your Company details. Click save when you're done.</DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <form onSubmit={handleUpdateDetails} className="flex flex-col gap-4">
                                                <div className="flex items-center">
                                                    <Label htmlFor="companyName" className="font-medium w-1/2">Company Name:</Label>
                                                    <Input id="companyName" type="text" value={editData.companyName} onChange={(e) => setEditData({ ...editData, companyName: e.target.value })} placeholder="Company Name" />
                                                </div>
                                                <div className="flex items-center">
                                                    <Label htmlFor="address" className="font-medium w-1/2">Address:</Label>
                                                    <Input id="address" type="text" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} placeholder="Address" />
                                                </div>
                                                <div className="flex items-center">
                                                    <Label htmlFor="website" className="font-medium w-1/2">Website:</Label>
                                                    <Input id="website" type="text" value={editData.website} onChange={(e) => setEditData({ ...editData, website: e.target.value })} placeholder="Website" />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Save changes</Button>
                                                </DialogFooter>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CompanyDetails;
