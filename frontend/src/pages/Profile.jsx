import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import profile from './profile.jpg';
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const { toast } = useToast();
  const [editData, setEditData] = useState({
    userName: "",
    contactNo: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function getUserData() {
    try {
      const response = await fetch("http://localhost:3000/api/v1/user/get-user", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setUserData(data?.data);
      setImage(data?.data?.image);
      setEditData({
        userName: data?.data?.userName,
        contactNo: data?.data?.contactNo,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);
  
  
  const handleImageUpload = async (e) => {
    e.preventDefault();

    // Ensure an image is selected
    if (!image) {
      console.error("No image selected");
      return;
    }
    const formData = new FormData();
    formData.append("image", image); // Append the selected image to FormData
    
    try {
      const response = await fetch("http://localhost:3000/api/v1/user/update-image", {
        method: "PATCH",
        credentials: "include",
        body: formData, // Send formData
      });

      const result = await response.json();
      // console.log(result);

      if (result.success) {
        setUserData({ ...userData, image: result.data.image });
        getUserData();
        toast({
          title: 'Success',
          description: 'Image updated successfully',
          status: 'success'
        });
      } else {
        console.error("Error uploading image:", result.message);
        toast({
          title: 'Error',
          description: 'Error uploading image:',
          status: 'Error'
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
  };
  
  async function handleUpdateDetails(e) {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/v1/user/update-user",
        editData,
        {
          withCredentials: true,
        }
      );
      setUserData(response.data.data);
      toast({
        title: 'Success',
        description: 'Details updated successfully',
        status: 'success'
      });
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
      {loading ? (
        <div className="flex justify-center items-center w-full h-64">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold text-gray-700 pb-2">Profile</h1>
            <div className="h-[1.5px] bg-slate-700  w-full   lg:mb-5" ></div>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
            <nav className="grid gap-4 text-sm text-gray-600 ">
              <Link to="/profile" className="font-semibold text-blue-600">
                General
              </Link>
              {userData?.role === "recruiter" ? (
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
              <Link to="/account">Account</Link>
            </nav>
            <div className="grid gap-6 ">
              <Card className="border rounded-lg shadow-lg">
                <CardHeader className="bg-[#294f7c] text-white p-5 pl-6 flex rounded-t-lg">
                  <CardTitle className="text-2xl font-semibold text-white">
                    User Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row md:items-start md:space-x-6 py-6 gap-x-5 px-10">
                  <div className="md:flex-shrink-0 ">
                    <img
                      src={userData.image === "" ? profile : userData.image}
                      alt="User Profile"
                      className="w-44 h-44 rounded-full mx-auto md:mx-0"
                    />
                  </div>
                  <div className="mt-4 md:mt-0 md:flex-1 ">
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Username:</span>{" "}
                        {userData.userName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {userData.email}
                      </p>
                      <p>
                        <span className="font-medium">Contact No:</span>{" "}
                        {userData.contactNo}
                      </p>
                      <p>
                        <span className="font-medium">Role:</span>{" "}
                        {userData.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-4 pt-4 flex flex-col gap-4 md:flex-row md:justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                        {image ? "Change Image" : "Upload Image"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Profile Avatar</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile image. Click save when
                          you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <form
                          onSubmit={handleImageUpload}
                          className="flex flex-col gap-4"
                        >
                          <Input
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                          />
                          <DialogFooter>
                            <Button type="submit">Upload</Button>
                            <DialogClose>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setImage(null);
                                }}
                              >
                                Cancel
                              </Button>

                            </DialogClose>
                          </DialogFooter>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 text-white py-2 px-4 rounded-lg">
                        Update Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Update User Details</DialogTitle>
                        <DialogDescription>
                          Update your account details. Click save when you're
                          done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <form
                          onSubmit={handleUpdateDetails}
                          className="flex flex-col gap-4"
                        >
                          <div className="flex items-center">
                            <label
                              htmlFor="userName"
                              className="font-medium w-1/2"
                            >
                              Username:
                            </label>
                            <Input
                              id="userName"
                              type="text"
                              value={editData.userName}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  userName: e.target.value,
                                })
                              }
                              placeholder="Username"
                            />
                          </div>
                          <div className="flex items-center">
                            <Label
                              htmlFor="contactNo"
                              className="font-medium w-1/2"
                            >
                              Contact No.:
                            </Label>
                            <Input
                              id="contactNo"
                              type="text"
                              value={editData.contactNo}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  contactNo: e.target.value,
                                })
                              }
                              placeholder="Contact No."
                            />
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
      )}
    </div>
  );
}

export default Profile;
