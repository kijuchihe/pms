"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
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
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'https://my-pms.vercel.app', // Replace with your actual Vercel frontend domain
        "*"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
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
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
node_cron_1.default.schedule('*/3 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${SERVER_URL}/`);
        console.log(`Server health check at ${new Date().toISOString()}: ${response.status}`);
    }
    catch (error) {
        console.error('Server health check failed:', error);
    }
}));
// Error handling - must be after routes
app.use(error_middleware_1.errorHandler);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
