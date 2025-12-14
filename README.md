# Instagram Clone

A full-stack Instagram clone I built using React and Node.js. It has all the basic features like user authentication, posts, likes, comments, follow system, and notifications.

## What I Built

### Features

**1. User Authentication**
- Sign up and login
- JWT tokens for authentication
- Password hashing with bcrypt
- Protected routes so you need to be logged in

**2. User Profiles**
- View user profiles with follower/following counts
- Discover page to find other users
- Follow/unfollow users
- See who follows who

**3. Posts**
- Create posts with image URL and caption
- Feed shows posts from people you follow (plus your own posts)
- View individual posts
- See all posts by a specific user
- Like and unlike posts
- Comment on posts

**4. Follow System**
- Follow other users
- Unfollow users
- See followers and following lists
- Relationships are properly maintained on both sides

**5. Feed**
- Shows posts from users you follow
- Also includes your own posts
- Sorted by newest first
- Shows a message if your feed is empty

**6. Notifications**
- Get notified when:
  - Someone follows you
  - Someone likes your post
  - Someone comments on your post
- Badge shows unread count in navbar
- Can mark notifications as read
- Full notifications page

**7. UI Design**
- Instagram-style login/signup page
- Phone mockup on the left side of login page
- Responsive design
- Instagram color scheme
- Smooth animations

## Tech Stack

**Frontend:**
- React 18
- React Router for navigation
- Axios for API calls
- Vite for building
- Plain CSS

**Backend:**
- Node.js with Express
- MongoDB for database
- Mongoose for database operations
- JWT for authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
You'll need:
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Go to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend folder:
```env
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_key_here
PORT=5000
```

Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string. It should look something like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/insta?retryWrites=true&w=majority
```

4. (Optional) Initialize the database:
```bash
npm run init-db
```
This creates a test user so the database shows up in MongoDB Compass.

5. Start the server:
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and go to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the dev server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173` (or another port if that's taken)

## Project Structure

```
Instagram_clone/
├── backend/
│   ├── middleware/auth.js          # JWT auth middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── notifications.js
│   ├── scripts/initDatabase.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   ├── Discover.jsx
│   │   │   ├── Notifications.jsx
│   │   │   └── SharedNavBar.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── Instagram_Clone_API.postman_collection.json
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Users
- `GET /api/users` - Get all users (for discover page)
- `GET /api/users/:userId` - Get user profile
- `POST /api/users/follow/:userId` - Follow someone
- `POST /api/users/unfollow/:userId` - Unfollow someone

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get your feed
- `GET /api/posts/:postId` - Get single post
- `GET /api/posts/user/:userId` - Get user's posts
- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/unlike` - Unlike a post
- `POST /api/posts/:postId/comment` - Add comment

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

For more details, check the Postman collection file or POSTMAN_COLLECTION_README.md

## Authentication

Most endpoints need authentication. Add the token to the header:
```
Authorization: Bearer <your_token>
```

Tokens last 7 days.

## Database Models

**User:**
- username, email, password
- followers array
- following array

**Post:**
- user reference
- imageUrl, caption
- likes array
- comments array

**Notification:**
- user (who gets notified)
- type (follow, like, comment)
- fromUser (who triggered it)
- post (if it's a like/comment)
- read status

## Testing

I included a Postman collection file (`Instagram_Clone_API.postman_collection.json`) that you can import to test all the endpoints. Check POSTMAN_COLLECTION_README.md for how to use it.

## Common Issues

**Backend won't start:**
- Make sure MongoDB connection string is correct in `.env`
- Check if port 5000 is already in use
- Make sure your IP is whitelisted in MongoDB Atlas

**Frontend can't connect:**
- Make sure backend is running on port 5000
- Check browser console for errors

**Can't see database in MongoDB Compass:**
- The database only shows up after you create some data
- Run `npm run init-db` in backend folder to create a test user

## Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Environment Variables

Backend needs a `.env` file with:
```
MONGO_URI=your_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Frontend doesn't need any env variables - it uses the proxy in vite.config.js.

## Scripts

**Backend:**
- `npm start` - Run server
- `npm run dev` - Run with nodemon (auto-restart)
- `npm run init-db` - Initialize database

**Frontend:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Notes

- The login page has a phone mockup on the left side (like Instagram)
- Feed shows posts from people you follow plus your own posts
- Notifications update every 30 seconds in the navbar
- All usernames are clickable and take you to profiles
- The discover page lets you find and follow other users

That's pretty much it! If you have questions or find bugs, feel free to open an issue.
