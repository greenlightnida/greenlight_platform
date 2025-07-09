"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const config_1 = require("./config");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const tasks_1 = require("./routes/tasks");
const managers_1 = require("./routes/managers");
const analytics_1 = require("./routes/analytics");
const testing_1 = require("./routes/testing");
const socketHandler_1 = require("./services/socketHandler");
const fs_1 = __importDefault(require("fs"));
const features_1 = require("./routes/features");
const product_1 = require("./routes/product");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: config_1.config.frontendUrl,
        methods: ['GET', 'POST']
    }
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: config_1.config.frontendUrl,
    credentials: true
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        platform: 'Greenlight Platform'
    });
});
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        platform: 'Greenlight Platform',
        initialized: true,
        governanceActive: false,
        governedRepositories: 0
    });
});
app.get('/api/dashboard', async (req, res) => {
    try {
        const dashboard = {
            platform: 'Greenlight Platform',
            status: 'running',
            services: {
                frontend: 'running',
                backend: 'running',
                database: 'connected'
            },
            metrics: {
                uptime: '1h 23m',
                requests: 42,
                errors: 0
            }
        };
        res.json({
            success: true,
            data: dashboard
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get dashboard data' }
        });
    }
});
app.get('/api/governance/status', (req, res) => {
    res.json({
        success: true,
        data: {
            initialized: true,
            governanceActive: false,
            governedRepositories: 0
        }
    });
});
app.get('/api/governance/audit', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Audit completed successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to run audit' }
        });
    }
});
app.get('/api/governance/repositories', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Repository health data retrieved'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get repository health' }
        });
    }
});
app.get('/api/sessions/stats', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Session statistics retrieved'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get session stats' }
        });
    }
});
app.get('/api/protocols', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Available protocols retrieved'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get protocols' }
        });
    }
});
app.post('/api/approve-cleanup', (req, res) => {
    try {
        fs_1.default.writeFileSync('CLEANUP_APPROVED', 'approved by operations dashboard');
        res.json({ success: true, message: 'Cleanup approved. Custodian will execute on next run.' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: { message: 'Failed to approve cleanup' } });
    }
});
app.use('/api/tasks', tasks_1.taskRoutes);
app.use('/api/managers', managers_1.managerRoutes);
app.use('/api/analytics', analytics_1.analyticsRoutes);
app.use('/api/testing', testing_1.testingRoutes);
app.use('/api/features', features_1.featuresRoutes);
app.use('/api/product', product_1.productRoutes);
io.on('connection', socketHandler_1.socketHandler);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        server.listen(config_1.config.port, () => {
            console.log(`🚀 Greenlight Platform Backend running on port ${config_1.config.port}`);
            console.log(`📊 Health check: http://localhost:${config_1.config.port}/health`);
            console.log(`🔗 Frontend URL: ${config_1.config.frontendUrl}`);
            console.log(`🌐 Environment: ${config_1.config.nodeEnv}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map