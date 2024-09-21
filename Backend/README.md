## Instructions to run the backend of our web app on your local machine
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