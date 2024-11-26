# Project Management System (PMS)

This is the solution to my hatchdev assignment for a project management system with tasks and other features.

## Features

- **User Authentication**
  - Login/Register functionality
  - JWT-based authentication
  - User profile management

- **Project Management**
  - Create and manage projects
  - Set project priorities and deadlines
  - Track project status
  - Kanban board for task management

- **Team Collaboration**
  - Create and manage teams
  - Add/remove team members
  - Assign roles (Admin, Member, Viewer)
  - Team-specific projects

- **Task Management**
  - Create, update, and delete tasks
  - Drag-and-drop task organization
  - Task priorities and deadlines
  - Task assignments

- **User Interface**
  - Modern, responsive design
  - Dark mode support
  - Interactive dashboard
  - Real-time updates

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Headless UI
- Heroicons
- DND Kit (Drag and Drop)
- Zustand (State Management)
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis (ioredis)# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
- TypeScript
- JWT Authentication

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/kijuchihe/pms.git
cd pms
```

2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Setup environment variables

```bash
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pms
JWT_SECRET=your-secret-key-here
NODE_ENV=development

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=300


# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run the application

```bash
# Run backend (from backend directory)
yarn dev

# Run frontend (from frontend directory)
yarn dev
```

## Project Structure

```txt
pms/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   └── teams/
│   │   └── shared/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── modules/
    │   └── shared/
    └── package.json
```

## Contributing
Feel free to submit issues and enhancement requests.