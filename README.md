# CAREERHUB Job Portal: Streamlining the Job Application Process

**Job Portal** is a full-featured MERN Stack web application designed to simplify and enhance the job application and recruitment process. This platform enables seamless interaction between applicants and recruiters, making job searching and hiring more efficient. The system provides persistent login sessions, secured REST APIs with JWT token verification, and role-based functionalities.

## Features
### Auth/Security Features 
- **User OTP Validation**: User has to validate while signing up or forgot password to using OTP sent to their email
- **JWT Authentication**: Secure login sessions using JSON Web Tokens.
- **Token-Based Authentiation**:  REST API requests are authenticated using tokens, reducing vulnerabilities.
- **Password Encryption**: User passwords are hashed using Bcrypt for enhanced security
- **Persistent Sessions**: Session persistence ensures users don’t have to log in frequently.
- **Forgot and Change Password** : User can use forgot password feature and change password feature 
  
### Applicant Features
- **Account Management**: Applicants can register for new account, log in to old account, can see details of their account and delete their account.
- **Job Browsing & Fuzzy Search**: Applicants can view available jobs and use advanced filters for fuzzy search.
- **Job Applications**: Apply to jobs with a personalized SOP (Statement of Purpose) and view application statuses.
- **Profile  Management**: Upload profile pictures, update personal details, and upload resumes for applications.
- **Resume Management**: Applicants can create, update and delete their resume.
- **Application Tracking**: Track the status of job applications (interviewing, offered, or rejected).

### Recruiter Features
- **Company Management**: Recruiter's can create, update, delete their company details.
- **Job Management**: Create, update, and delete job listings.
- **Applicant Management**: View and manage job applications, including interviewing, offered, or rejected candidates.
- **Profile & Resume Access**: View applicants' profiles and resumes directly through the portal.
- **Profile Editing**: Recruiters can manage their personal profiles and company details.
  
### Admin Features 
- **Feature Management**: Admin can use and manipulate **"all"** of the above features
- **Admin Dashboard** : Admin can track and keep tabs of **"everything"** using their dashboard
---

## Directory Structure
```
- backend/
    - node_modules/
    - public/
        - temp/
    - src/
        - controllers/
        - db/
        - middlewares/
        - models/
        - routes/
        - utils/
- frontend/
    - assests/
    - node_modules/
    - src/
        - components/
        - hooks/
        - lib/
        - pages/
        - utils/
- README.md
```

## Instructions to run the web app on your local machine
- Install Node JS, MongoDB in yur local machine.
- Start MongoDB server: sudo service mongod start
- Move inside backend directory:
  ```
  cd backend
  ```
- Install dependencies in backend directory:
  ```
  npm i
  ```
  In case of any deprecation :
  ```
  npm audit fix
  ```
- Start express server:
  ```
  npm run dev
  ```
- Backend server will start on port 3000.
- Now go inside frontend directory:
  ```
  cd frontend
  ```
- Install dependencies in frontend directory:
  ```
  npm i
  ```
  In case of any deprecation :
  ```
  npm audit fix
  ```
- Start web app's frontend server:
  ```
  npm run dev
  ```
- Frontend server will start on port 5173.
- Now open the link http://localhost:5173/ and proceed to enjoying the functionalities provided by our app.
  
## Backend
### Dependencies Used
      - Bcrypt
      - Body Parser
      - Cloudinary
      - Cookie-parser
      - Cors
      - Dotenv
      - Express
      - JWT
      - Mongoose
      - Mongoose Aggregate Paginate V2
      - Multer
      - Nodemailer
      - Nodemon
      - React Email
  ### .env config
        PORT = 3000
        MONGODB_URI = 
        CORS_ORIGIN =
        CLOUDINARY_CLOUD_NAME =
        CLOUDINARY_API_KEY =
        CLOUDINARY_API_SECRET =
        ACCESS_TOKEN_SECRET =
        ACCESS_TOKEN_EXPIRY =
        REFRESH_TOKEN_SECRET =
        REFRESH_TOKEN_EXPIRY =
        EMAIL_USER = 
        EMAIL_PASS =
        FRONTEND_URL =http://localhost:5173
  
  ## Frontend
  ### Dependencies Used
      - Radix
      - Axios
      - React
      - React DOM
      - React Hot Toast
      - React Icons
      - React Router DOM
      - Tailwind
  ### .env config
        VITE_BACKEND_URL = 
        
  
