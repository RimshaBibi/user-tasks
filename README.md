## User Registeration and Task Mangament

Here, User is registerd and then can add,update,delete and get the tasks.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - [AdminRegisteration](#admin-registration)
  - [AdminAuthentication](#admin-authentication)
  - [AdminRefreshToken](#admin-refresh-token)
  - [UpdateStatus](#updating-user-status)
  - [DeleteUser](#deleting-user)
  - [UserRegisteration](#user-registration)
  - [UserAuthentication](#user-authentication)
  - [RefreshToken](#refresh-token)
  - [AddingTask](#adding-task)
  - [UploadingFile](#uploading-file)
  - [GettingFile](#getting-file)
  - [DeletingFile](#deleting-file)
  - [GettingAllTasks](#getting-all-tasks)
  - [GettingOneTask](#getting-one-task)
  - [GettingMyTask](#getting-my-task)
  - [GettingUserTask](#getting-user-tasks)
  - [UpdatingTask](#updating-task)
  - [DeletingTask](#deleting-task)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Getting Started

### Prerequisites
Before you begin, ensure you have the following dependencies installed:

- [Node.js](https://nodejs.org/) (with npm)
- [PostgreSQL](https://www.postgresql.org/) (for the database)

1. Clone the repository:

   ```sh
   git clone https://github.com/RimshaBibi/user-tasks.git
   cd typescript

2. Install Node.js dependencies:
   ```sh
   npm install

3. Create a PostgreSQL database and configure the connection in your .env file. Set the following environment variables:

   ```sh
   mailPassword=you_mail_password
   dbUser=your_db_user
   dbPassword=your_db_password
   host=your_db_host
4. Run the TypeScript build process and start the server:

   ```sh
   npm run start

## Endpoints

### Admin Registration
- **POST /adminSignup**
  - Description: Register admin with a unique email.
  - Request Body:
    - `userName` (string, required): Admin's name.
    - `userEmail` (string, required, format: email): Admin's email address.
    - `userPassword` (string, required): Admin's password.
  - Response:
    - 201 (Created): Admin registration successful.
      - `user_id` (string): Unique admin identifier.
      - `name` (string): Admin's name.
      - `email` (string): Admin's email.
      - `token` (string): Admin's token.
      - `status` (string): Status of account active.
      - `createddate` (string): Date when account created.
      - `role` (string): Role for admin is admin.
    - 409 (Conflict): User with the provided email already exists.
    - 500 (Internal Server Error): Registration failed due to an internal error.

### Admin Authentication
- **POST /adminSignin**
  - Description: Authenticate admin.
  - Request Body:
    - `userEmail` (string, required, format: email): Admin's email address.
    - `userPassword` (string, required): Admin's password.
  - Response:
    - 200 (OK): Admin authentication successful.
      - `user_id` (string): Unique admin identifier.
      - `email` (string): Admin's email.
      - `token` (string): Admin's token.
    - 404 (Unauthorized): User does not exist.
    - 401 (Unauthorized): Wrong password.
    - 500 (Internal Server Error): Authentication failed due to an internal error.

### Admin Refresh Token
- **POST /auth/admin-refresh-token**
  - Description: Generating new jwt token from the expire token.
  - Request Body:
    - `token` (string, required): Expire jwt token.
  - Response:
    - 201 (Created): New Jwt token generated successfully.
      - `token` (string): New jwt token.
    - 200 (OK): Token is not expired yet.
    - 404 (Not Found): Admin does not exist.
    - 401 (Unathorized): Invalid token.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Updating User Status
- **PUT /admin/:id**
    - Description: Authenticated user updating task by Id.
    - URL Parameter:
      - `id` (string) : Unique user identifier.
    - Request Body:
      - `status` (string) : Status of the user.
    - Response:
    - 200 (OK): Successfully updating user's status.
        - `message` (string): User's status updated successfully.
    - 400 (Unathorized): User id is required.   
    - 401 (Unathorized): Unauthorized user.
    - 404 (Not Found): No admin exist and No user exist.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Deleting User
- **DELETE /admin/:id**
    - Description: Deleting user by Id.
    - URL Parameter:
      - `id` (string) : Unique task identifier.
    - Response:
    - 200 (OK): Successfully deleting the user.
       - Response Body: A string indicating the success of the deletion.
    - 400 (Unathorized): User id is required.  
    - 401 (Unathorized): Unauthorized user.
    - 404 (Not Found): No admin exist and No user exist.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### User Registration
- **POST /signup**
  - Description: Register a new user with a unique email.
  - Request Body:
    - `userName` (string, required): User's name.
    - `userEmail` (string, required, format: email): User's email address.
    - `userPassword` (string, required): User's password.
  - Response:
    - 201 (Created): User registration successful.
      - `user_id` (string): Unique admin identifier.
      - `name` (string): User's name.
      - `email` (string): User's email.
      - `token` (string): User's token.
      - `status` (string): Status of account initially pending-approval.
      - `createddate` (string): Date when account created.
      - `role` (string): Role for user is user.
    - 409 (Conflict): User with the provided email already exists.
    - 500 (Internal Server Error): Registration failed due to an internal error.

### User Authentication
- **POST /signin**
  - Description: Authenticate a user.
  - Request Body:
    - `userEmail` (string, required, format: email): User's email address.
    - `userPassword` (string, required): User's password.
  - Response:
    - 200 (OK): User authentication successful.
      - `user_id` (string): Unique user identifier.
      - `email` (string): User's email.
      - `token` (string): User's token.
    - 404 (Unauthorized): User does not exist.
    - 401 (Unauthorized): Wrong password.
    - 500 (Internal Server Error): Authentication failed due to an internal error.

### Refresh Token
- **POST /auth/refresh-token**
  - Description: Generating new jwt token from the expire token.
  - Request Body:
    - `token` (string, required): Expire jwt token.
  - Response:
    - 201 (Created): New Jwt token generated successfully.
      - `token` (string): New jwt token.
    - 200 (OK): Token is not expired yet.
    - 404 (Not Found): User does not exist.
    - 401 (Unathorized): Invalid token.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Adding Task
- **POST /tasks**
    - Description: Adding a task by the authenticated user.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
    - Request Body:
      - `task_id` (string) : Unique task identifier.
      - `title` (string) : Title of the task.
      - `description` (string) : Description of the task.
      - `user_id` (string) : Unique user identifier.
    - Response:
    - 201 (Created): Task added successfully.
      - `user_id` (string): Unique user identifier.
      - `task_id` (string): Unique task identifier.
      - `title` (string): Title of the task.
      - `description` (string): Description of the task.
      - `createddate` (string): Date when the task created.
    - 404 (Not Found): User does not exist.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Uploading File
- **POST /upload/:id**
    - Description: Uploading task file by the authenticated user.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
    - URL Parameter:
      - `id` (string) : Unique task identifier.
    - Request Body:
      - `file` (file) : File as a form data with filedname `file`.
    - Response:
    - 201 (Created): File uploaded successfully.
      - `Message` (string): File uploaded successfully `filename`.
    - 401 (Unathorized): Unauthorized user.
    - 400 (Invalid Request): No file is uploaded.
    - 404 (Not Found): User does not exist and no task found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Getting File
- **GET /get_file/:id**
    - Description: Retreiving task file by the authenticated user.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
    - URL Parameter:
      - `id` (string) : Unique task identifier.
    - Response:
    - 200 (OK): Successful deletion of the file.
      - `File` (file): File received from database.
      - `Content-Type` (string): `file_type` received from database .
      - `Content-Disposition` (string): `attachment, filename` received from database.
    - 400 (Invalid request): Task id is required.
    - 401 (Unathorized): Unauthorized user.
    - 404 (Not Found): User does not exist and no task found and no file found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Deleting File
- **PUT /delete_file/:id**
    - Description: Deleting task's file by the authenticated user.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
    - URL Parameter:
      - `id` (string) : Unique task identifier.
    - Response:
    - 200 (OK): Successfully deleting the task's file.
       - Response Body: A string indicating the success of the deletion of task's files.
    - 400 (Invalid request): Task id is required.
    - 401 (Unathorized): Unauthorized user.
    - 404 (Not Found): User does not exist and no task found and no file found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.


### Getting All Tasks
- **GET /tasks**
    - Description: Authenticated user retrieve all tasks for all users.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
    - Request Query:
      - `page` (number) : Number of the page.
      - `size` (number) : Number of the data shown.
    - Response:
    - 200 (OK): Successful retrieval of the tasks.
      - Array of tasks, each with the following properties:
        - `user_id` (string): Unique user identifier.
        - `task_id` (string): Unique task identifier.
        - `title` (string): Title of the task.
        - `description` (string): Description of the task.
        - `filename` (string): File name of the task.
        - `file_type` (string): File type of the task.
        - `createddate` (string): Date when task is created.
        - `updateddate` (string): Date when task is updated.
    - 400 (Invalid Request): Page and size are not available and page and size are not number.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Getting One Task 
- **GET /tasks/:id**
    - Description: Authenticated user retrieve one task by Id.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
     - URL Parameter:
      - `id` (string) : Unique task identifier.
    - Response:
    - 200 (OK): Successful retrieval of the task.
        - `user_id` (string): Unique user identifier.
        - `task_id` (string): Unique task identifier.
        - `title` (string): Title of the task.
        - `description` (string): Description of the task.
        - `createddate` (string): Date when task is created.
        - `updateddate` (string): Date when task is updated.
    - 400 (Invalid request): Task id is required.
    - 401 (Unathorized): Unauthorized user.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Getting My Task 
- **GET /tasks/my-tasks**
    - Description: Authenticated user retrieve all his task.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
    - Request Query:
      - `page` (number) : Number of the page by default 1.
      - `size` (number) : Number of the data shown by default 3.
    - Response:
    - 200 (OK): Successful retrieval of the tasks.
        - Array of tasks, each with the following properties:
          - `user_id` (string): Unique user identifier.
          - `task_id` (string): Unique task identifier.
          - `title` (string): Title of the task.
          - `description` (string): Description of the task.
          - `filename` (string): File name of the task.
          - `file_type` (string): File type of the task.
          - `createddate` (string): Date when task is created.
          - `updateddate` (string): Date when task is updated.
    - 400 (Invalid Request):  Page and size are not number.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Getting User Tasks
- **GET /tasks/user**
    - Description: Authenticated user retrieve the other user tasks.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
      - Request Query:
      - `userId` (string) : Tasks related to this userId.
      - `page` (number) : Number of the page by default 1.
      - `size` (number) : Number of the data shown by default 3.
   - 200 (OK): Successful retrieval of the tasks.
        - Array of tasks, each with the following properties:
          - `user_id` (string): Unique user identifier.
          - `task_id` (string): Unique task identifier.
          - `title` (string): Title of the task.
          - `description` (string): Description of the task.
          - `filename` (string): File name of the task.
          - `file_type` (string): File type of the task.
          - `createddate` (string): Date when task is created.
          - `updateddate` (string): Date when task is updated.
    - 400 (Invalid Request):  Page and size are not number.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Updating Task 
- **PUT /tasks/:id**
    - Description: Authenticated user updating task by Id.
    - URL Parameter:
      - `id` (string) : Unique task identifier.
    - Request Body:
      - `title` (string) : Title of the task.
      - `description` (string) : Description of the task.
    - Response:
    - 200 (OK): Successfully updating task.
        - `user_id` (string): Unique user identifier.
        - `task_id` (string): Unique task identifier.
        - `title` (string): Title of the task.
        - `description` (string): Description of the task.
        - `updateddate` (string): Date when task updated.
    - 400 (Unathorized): Task id is required.   
    - 401 (Unathorized): Unauthorized user.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Deleting Task 
- **DELETE /tasks/:id**
    - Description: Deleting task by Id.
    - URL Parameter:
      - `id` (string) : Unique task identifier.
    - Response:
    - 200 (OK): Successfully deleting the task.
       - Response Body: A string indicating the success of the deletion.
    - 400 (Unathorized): Task id is required.  
    - 401 (Unathorized): Unauthorized user.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.


    
### Contributing
Contributions are welcome! Please follow these guidelines:

- Fork the repository.
- Create your feature branch: 
    ```sh
    git checkout -b <your_branch_name>
- Commit your changes: 
   ```sh
  git commit -m 'New feature added'
- Push to the branch: 
   ```sh
   git push origin <your_branch_name>
- Open a pull request.

### License
This project is licensed under the [MIT License](LICENSE).

### Contact
For questions or support, contact [Rimsha Bibi on LinkedIn](https://www.linkedin.com/in/rimsha-bibi-443745204 "LinkedIn ID").