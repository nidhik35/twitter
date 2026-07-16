# Twitter Feed System

## Overview

Twitter Feed System is a full-stack social media application inspired by Twitter/X. It enables users to create accounts, post tweets, follow other users, search profiles, and receive real-time feed updates. The application uses Redis caching for faster feed retrieval and Socket.io for live tweet updates.

---

## Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes

### Tweet Management

* Create Tweets
* View Feed
* User Tweet History
* Feed Pagination

### Social Features

* User Profiles
* Follow Users
* Unfollow Users
* Followers & Following Counts

### Search

* Search Users by Username
* View User Profiles from Search Results

### Real-Time Updates

* Live Tweet Updates using Socket.io
* Automatic Feed Refresh

### Performance Optimization

* Redis Feed Caching
* MongoDB Indexing

---

## Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Cache

* Redis

### Real-Time Communication

* Socket.io

### Authentication

* JWT (JSON Web Token)
* bcrypt

---

## Project Structure

```text
twitter-feed-system
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── services
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── server.js
│
├── README.md
└── SYSTEM_DESIGN.md
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Tweets

```http
POST /api/tweets
GET /api/tweets/feed
GET /api/tweets/:id
DELETE /api/tweets/:id
```

### Users

```http
GET /api/users/:id
GET /api/users/:id/tweets
POST /api/users/follow/:id
POST /api/users/unfollow/:id
GET /api/users/:id/follow-status
```

### Search

```http
GET /api/search/users?q=
GET /api/search/tweets?q=
```

---

## Key Implementations

### Redis Feed Cache

User feeds are cached in Redis to reduce database load and improve response times.

### Socket.io Real-Time Updates

When a user posts a tweet, all connected clients receive updates instantly without refreshing the page.

### JWT Authentication

Secure authentication is implemented using JSON Web Tokens and protected middleware.

### Cursor-Based Pagination

Feed retrieval supports scalable pagination for large datasets.

---

## Future Enhancements

* Notifications
* Direct Messaging
* Media Uploads
* Retweets
* Hashtag Search
* User Verification System
* Infinite Scroll Feed

---

## Author

Nidhi K

Information Science & Engineering

CGPA: 8.99
