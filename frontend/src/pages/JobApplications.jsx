import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

function JobApplications() {
  const [applications, setApplications] = useState([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState('');
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  async function fetchJobApplications() {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/v1/application/get-job-applications/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const responseData = await response.json();
      setApplications(responseData.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobApplications();
  }, []);

  const handleStatusChange = async (applicationId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/application/update-application-status/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast({
        title: 'Success',
        description: 'Status updated successfully',
        status: 'success'
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold text-gray-700 pb-2">Job Applications</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {applications.length > 0 ? (
            applications.map((application, index) => (
              <Card key={index} className="shadow-lg transition-transform transform hover:scale-105">
                <div className={`${application.status==='Offered' ? 'bg-green-500':(application.status === 'Rejected' ? 'bg-red-500':'bg-[#294f7c]')} text-white p-3 pl-6 flex rounded-t-lg justify-between`}>
                    <span className="text-xl font-semibold uppercase">Status: </span>
                    <span className="text-bold text-xl uppercase"> {application.status}</span>
                  
                </div>
                <CardContent className="p-3 bg-white pl-7">
                  <div className="flex flex-col gap-2">
                    <p><strong>Applied Date:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                    <p><strong>Applicant Name :</strong> {application.applicant.userName}</p>
                    <p><strong>Applicant Email:</strong> {application.applicant.email}</p>
                    <p><strong>Applicant Contact :</strong> {application.applicant.contactNo}</p>
                  </div>
                </CardContent>
                <div className="rounded-b-md flex justify-end items-center pr-5 pb-3">
                  <Button className='bg-[#294f7c] hover:bg-[#073a7c] m-2 mr-6'>
                    <Link to={`/user-resume/${application.applicant.resume}`} className="text-white">Applicant Resume</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button className='bg-[#294f7c] hover:bg-[#073a7c] m-2' onClick={() => setSelectedApplicationId(application._id)}>Change Status</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Change Application Status</AlertDialogTitle>
                        <AlertDialogDescription>
                          Select the new status for the application.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex flex-col gap-3">
                        <RadioGroup value={status} onValueChange={setStatus}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Applied" id="applied" />
                            <Label htmlFor="applied">Applied</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Interviewing" id="interviewing" />
                            <Label htmlFor="interviewing">Interviewing</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Offered" id="offered" />
                            <Label htmlFor="offered">Offered</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Rejected" id="rejected" />
                            <Label htmlFor="rejected">Rejected</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogAction asChild>
                          <Button onClick={() => handleStatusChange(selectedApplicationId)} className='px-6'>Save</Button>
                        </AlertDialogAction>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-700 col-span-2">No applications found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default JobApplications;
