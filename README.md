
# Social-Network

## Description

Social-Network is a simple social networking platform developed by Joan266 using the MERN stack, featuring a layout inspired by Twitter. 
It enables users to connect, share posts, follow other users, and engage in discussions through comments and likes.

## Installation

### Client

1.- Navigate to the `client` folder..

2.- Install dependencies:

    npm install
    
3.- Start the client:

    npm run start

### Server

1.- Navigate to the `server` folder.

2.- Install dependencies:

    npm install

## Setup

1.- Create .env files in both the client and server folders to hide sensitive information:

  - **client/.env:** Set `REACT_APP_API_URL` to the server's URL.
  - **server/.env:** Set `MONGODB_URL`, `PORT`, and `SECRET_KEY`.

2.- Seed the database with demo users:

    node seed.js

3.- Start the server:

    npm run dev

## Main Features

- **User Authentication:** Users can sign up, log in, and log out securely.
- **Search Service:** Users can search for other users or posts.
- **Followers Functionality:** Users can follow/unfollow other users.
- **Post Usage:** Users can create, edit, and delete posts.
- **Public & Private Settings:** Users can set their posts to be public or private.
- **Commenting System:** Users can comment on posts.
- **Like System:** Users can like posts.

