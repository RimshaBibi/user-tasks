CREATE DATABASE userdatabase;

CREATE TABLE usertable(
     user_id UUID PRIMARY KEY,
     name VARCHAR(255),
     email VARCHAR(255),
     user_password VARCHAR(255),
     salt VARCHAR(255)
);


CREATE TABLE usertasks(
     task_id UUID PRIMARY KEY,
     title VARCHAR(255),
     description VARCHAR(255),
     user_id UUID REFERENCES usertable(user_id)   
);
