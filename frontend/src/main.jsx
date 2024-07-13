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
import JobDetails from './pages/JobDetails';
import AdminDashboard from './pages/AdminDashboard';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />}>
        <Route path='' element={<Home />} />
        <Route path='add-resume' element={<AddResume />} />
        <Route path='post-job' element={<PostJob />} />
        <Route path='job/:id' element={<JobDetails />} />
        <Route path='admin-dashboard' element={<AdminDashboard />} />
      </Route>
      <Route path='/signup' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);



