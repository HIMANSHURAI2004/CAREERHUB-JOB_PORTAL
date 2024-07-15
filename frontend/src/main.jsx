import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './index.css';
import Layout from './Layout';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import AddResume from './pages/AddResume';
import PostJob from './pages/PostJob';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Resume from './components/Resume';
import Account from './components/Account';
import Applications from './components/Applications';
import { Toaster } from "@/components/ui/toaster"
import JobDetails from './pages/JobDetails';
import AdminDashboard from './pages/AdminDashboard';
import CompanyDetails from './components/CompanyDetails';
import UserJobs from './components/UserJobs';
import JobApplications from './pages/JobApplications';
import UserResume from './pages/UserResume';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />}>
        <Route path='' element={<Home />} />
        <Route path='add-resume' element={<AddResume />} />
        <Route path='post-job' element={<PostJob />} />
        <Route path='profile' element={<Profile />} />
        <Route path="resume" element={<Resume />} />
        <Route path="account" element={<Account />} />
        <Route path="applications" element={<Applications />} />
        <Route path='job/:id' element={<JobDetails />} />
        <Route path='/company' element={<CompanyDetails />} />
        <Route path='/user-job' element={<UserJobs />} />
        <Route path='/job-applications/:id' element={<JobApplications/>} />
        <Route path='/user-resume/:id' element={<UserResume/>} />
        <Route path='admin-dashboard' element={<AdminDashboard />} />
      </Route>
      
      <Route path='/signup' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/admin/dashboard' element={<Dashboard/>} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);



