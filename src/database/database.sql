CREATE DATABASE userdatabase;

CREATE TYPE user_status AS ENUM ( 'pending-approval', 'active' , 'blocked');
CREATE TYPE user_role AS ENUM ( 'user', 'admin');

CREATE TABLE users(
     user_id UUID PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255),
     user_password VARCHAR(255),
     salt VARCHAR(255),
     status user_status,
     role user_role,
     createdDate DATE,
     updatedDate DATE
);


CREATE TYPE file_type_enum as ENUM ('application/pdf', 'image/png','image/jpeg', 'image/webp');

CREATE TABLE tasks(
     task_id UUID PRIMARY KEY,
     title VARCHAR(255),
     description VARCHAR(255),
     user_id UUID REFERENCES usertable(user_id),
     file BYTEA,
     filename VARCHAR(255),
     file_path VARCHAR(255),
     file_type file_type_enum,
     createdDate DATE,
     updatedDate DATE 
);
