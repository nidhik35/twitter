# Twitter Feed System - System Design

## Architecture Overview

```text
Frontend (React.js)
        |
        v
Backend API (Node.js + Express.js)
        |
        +----------------+
        |                |
        v                v
     Redis           MongoDB
   (Feed Cache)    (Persistent Data)
        |
        v
   Socket.io
(Real-Time Updates)
```

---

## Components

### Frontend Layer

Responsibilities:

* User Registration
* User Login
* Feed Display
* Profile Display
* Search Users
* Follow/Unfollow Actions
* Real-Time Feed Updates

Technology:

* React.js
* Vite
* React Router

---

### Backend Layer

Responsibilities:

* Authentication
* Feed Generation
* User Management
* Search APIs
* Tweet Management

Technology:

* Node.js
* Express.js

---

### Database Layer

Technology:

* MongoDB

Collections:

#### Users

```json
{
  "_id": "...",
  "username": "...",
  "email": "...",
  "followers": [],
  "following": [],
  "tweetsCount": 0
}
```

#### Tweets

```json
{
  "_id": "...",
  "author": "...",
  "content": "...",
  "likes": [],
  "createdAt": "..."
}
```

---

## Redis Caching Strategy

### Feed Cache Key

```text
feed:userId:cursor:limit
```

Example:

```text
feed:123:first:10
```

Purpose:

* Reduce MongoDB Queries
* Faster Feed Loading
* Better Scalability

Cache Duration:

```text
60 seconds
```

---

## Real-Time System

### Socket.io Flow

```text
User Creates Tweet
        |
        v
Backend Saves Tweet
        |
        v
io.emit("newTweet")
        |
        v
Connected Clients Receive Event
        |
        v
Feed Refreshes Automatically
```

Benefits:

* No Page Refresh
* Instant Updates
* Better User Experience

---

## Authentication Flow

```text
Register
    |
    v
Login
    |
    v
JWT Token Generated
    |
    v
Stored in LocalStorage
    |
    v
Protected API Requests
```

---

## Feed Generation Flow

```text
User Opens Home Feed
        |
        v
Check Redis Cache
        |
   Cache Hit?
      / \
    Yes  No
    /      \
Return     Query MongoDB
Cache      |
Result     v
        Store In Redis
             |
             v
        Return Feed
```

---

## Search Flow

```text
User Searches Username
        |
        v
/api/search/users?q=name
        |
        v
MongoDB Regex Search
        |
        v
Matching Users Returned
```

---

## Scalability Improvements

Future Enhancements:

* Notification Service
* Media Upload Support
* Retweet System
* Infinite Scroll
* Hashtag Search
* Distributed Redis
* Load Balancer
* Microservices Architecture

---

## Technologies Used

Frontend:

* React.js
* Vite
* React Router

Backend:

* Node.js
* Express.js

Database:

* MongoDB

Cache:

* Redis

Real-Time:

* Socket.io

Authentication:

* JWT
* bcrypt

Version Control:

* Git
* GitHub
