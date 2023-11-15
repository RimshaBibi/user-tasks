## User Registeration and Task Mangament

Here, User is registerd and then can add,update,delete and get the tasks.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - [UserRegisteration](#user-registration)
  - [UserAuthentication](#user-authentication)
  - [RefreshToken](#refresh-token)
  - [AddingTask](#adding-task)
  - [GettingAllTasks](#getting-all-tasks)
  - [GettingOneTask](#getting-one-task)
  - [GettingOneUserTask](#getting-one-user-task)
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
### User Registration
- **POST /signup**
  - Description: Register a new user with a unique email.
  - Request Body:
    - `userName` (string, required): User's name.
    - `userEmail` (string, required, format: email): User's email address.
    - `userPassword` (string, required): User's password.
  - Response:
    - 201 (Created): User registration successful.
      - `user_id` (string): Unique user identifier.
      - `name` (string): User's name.
      - `email` (string): User's email.
      - `salt` (string): Salt used for password hashing.
      - `user_password` (string): Hashed password.
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
      - `user_password` (string): Hashed password.
      - `salt` (string): Salt used for password hashing.
    - 404 (Unauthorized): User does not exist.
    - 401 (Unauthorized): Wrong password.
    - 500 (Internal Server Error): Authentication failed due to an internal error.

### REFRESH TOKEN
- **POST /auth/refresh-token**
  - Description: Generating new jwt token from the expire token.
  - Request Body:
    - `token` (string, required): Expire jwt token.
    - `user_id` (string): Unique user identifier.
    - `userEmail` (string, required, format: email): User's email address.
  - Response:
    - 201 (Created): New Jwt token generated successfully.
      - `token` (string): New jwt token.
    - 404 (Not Found): User does not exist.
    - 401 (Unathorized): Invalid token.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Adding Task
- **POST /addTask**
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
    - 404 (Not Found): User does not exist.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Getting All Tasks
- **GET /getAllTasks**
    - Description: Authenticated user retrieve all tasks for all users.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
    - Response:
    - 200 (OK): Successfull retrieval of the tasks.
      - Array of tasks, each with the following properties:
        - `user_id` (string): Unique user identifier.
        - `task_id` (string): Unique task identifier.
        - `title` (string): Title of the task.
        - `description` (string): Description of the task.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Getting One Task 
- **GET /getOneTask/:task_id**
    - Description: Authenticated user retrieve one task by Id.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
     - URL Parameter:
      - `task_id` (string) : Unique task identifier.
    - Response:
    - 200 (OK): Successfull retrieval of the task.
        - `user_id` (string): Unique user identifier.
        - `task_id` (string): Unique task identifier.
        - `title` (string): Title of the task.
        - `description` (string): Description of the task.
    - 401 (Unathorized): Unauthorized user.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Getting One User Task 
- **GET /getUserTasks**
    - Description: Authenticated user retrieve all his task.
    - Request Headers:
      - `authorization` (string) : Authorization token is provided here.
    - Response:
    - 200 (OK): Successfull retrieval of the task.
        - Array of tasks, each with the following properties:
          - `user_id` (string): Unique user identifier.
          - `task_id` (string): Unique task identifier.
          - `title` (string): Title of the task.
          - `description` (string): Description of the task.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Updating Task 
- **PUT /updateTask/:task_id**
    - Description: Authenticated user updating task by Id.
    - URL Parameter:
      - `task_id` (string) : Unique task identifier.
    - Request Body:
      - `title` (string) : Title of the task.
      - `description` (string) : Description of the task.
    - Response:
    - 200 (OK): Successfully updating task.
        - `user_id` (string): Unique user identifier.
        - `task_id` (string): Unique task identifier.
        - `title` (string): Title of the task.
        - `description` (string): Description of the task.
    - 401 (Unathorized): Unauthorized user.
    - 404 (Not Found): No user exist and No task Found.
    - 500 (Internal Server Error): An internal server error occurred while processing the request.

### Deleting Task 
- **DELETE /deleteTask/:task_id**
    - Description: Updating task by Id.
    - URL Parameter:
      - `task_id` (string) : Unique task identifier.
    - Response:
    - 200 (OK): Successfully deleting the task.
       - Response Body: A string indicating the success of the deletion.
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