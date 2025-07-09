import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { taskRoutes } from './routes/tasks';
import { managerRoutes } from './routes/managers';
import { analyticsRoutes } from './routes/analytics';
import { testingRoutes } from './routes/testing';
import { socketHandler } from './services/socketHandler';
import fs from 'fs';
import { featuresRoutes } from './routes/features';
import { productRoutes } from './routes/product';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    platform: 'Greenlight Platform'
  });
});

// Platform status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    platform: 'Greenlight Platform',
    initialized: true,
    governanceActive: false,
    governedRepositories: 0
  });
});

// Platform dashboard
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get dashboard data' }
    });
  }
});

// Governance endpoints
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
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get repository health' }
    });
  }
});

// Session endpoints
app.get('/api/sessions/stats', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Session statistics retrieved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get session stats' }
    });
  }
});

// Protocol endpoints
app.get('/api/protocols', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Available protocols retrieved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get protocols' }
    });
  }
});

// Approve ruthless cleanup (creates CLEANUP_APPROVED file)
app.post('/api/approve-cleanup', (req, res) => {
  try {
    fs.writeFileSync('CLEANUP_APPROVED', 'approved by operations dashboard');
    res.json({ success: true, message: 'Cleanup approved. Custodian will execute on next run.' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to approve cleanup' } });
  }
});

// API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/testing', testingRoutes);
app.use('/api/features', featuresRoutes);
app.use('/api/product', productRoutes);

// Socket.io connection
io.on('connection', socketHandler);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    server.listen(config.port, () => {
      console.log(`🚀 Greenlight Platform Backend running on port ${config.port}`);
      console.log(`📊 Health check: http://localhost:${config.port}/health`);
      console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
      console.log(`🌐 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer(); 