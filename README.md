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

### client
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Headless UI
- Heroicons
- DND Kit (Drag and Drop)
- Zustand (State Management)
- Axios

### server
- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis (ioredis)
- TypeScript
- JWT

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/kijuchihe/pms.git
cd pms
```

2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Setup environment variables

```bash
# server (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pms
JWT_SECRET=your-secret-key-here
NODE_ENV=development

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TTL=300


# client (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run the application

```bash
# Run server (from server directory)
yarn dev

# Run client (from client directory)
yarn dev
```

## Project Structure

```txt
pms/
├── server/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   └── teams/
│   │   └── shared/
│   └── package.json
└── client/
    ├── src/
    │   ├── app/
    │   ├── modules/
    │   └── shared/
    └── package.json
```

## Contributing
Feel free to submit issues and enhancement requests.