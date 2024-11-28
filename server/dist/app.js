"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = require("dotenv");
const database_1 = require("./config/database");
const error_middleware_1 = require("./shared/middleware/error.middleware");
// Routes
const auth_router_1 = __importDefault(require("./modules/auth/auth.router"));
const project_router_1 = __importDefault(require("./modules/projects/project.router"));
const task_router_1 = __importDefault(require("./modules/tasks/task.router"));
const team_router_1 = __importDefault(require("./modules/teams/team.router"));
const users_router_1 = __importDefault(require("./modules/users/users.router"));
// Load environment variables
(0, dotenv_1.config)();
// Create Express app
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.connectDB)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', auth_router_1.default);
app.use('/api/projects', project_router_1.default);
// app.use('/api/projects/:projectId/tasks', taskRouter);
app.use('/api/teams', team_router_1.default);
app.use('/api/tasks', task_router_1.default);
app.use('/api/users', users_router_1.default);
// Error handling - must be after routes
app.use(error_middleware_1.errorHandler);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
