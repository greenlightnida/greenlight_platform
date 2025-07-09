import { Router } from 'express';
import axios from 'axios';

const router = Router();

// GET /api/managers - Get all managers
router.get('/', async (req, res) => {
  try {
    const managers = [
      {
        id: 'manager-1',
        name: 'APIManager',
        type: 'APIManager',
        status: 'active',
        tasks: 3,
        completedTasks: 1,
        inProgressTasks: 2
      },
      {
        id: 'manager-2',
        name: 'IntegrationManager',
        type: 'IntegrationManager',
        status: 'active',
        tasks: 2,
        completedTasks: 1,
        inProgressTasks: 0
      },
      {
        id: 'manager-3',
        name: 'SystemMasterManager',
        type: 'SystemMasterManager',
        status: 'active',
        tasks: 0,
        completedTasks: 0,
        inProgressTasks: 0
      }
    ];

    res.json({
      success: true,
      data: managers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch managers' }
    });
  }
});

// GET /api/managers/:id/tasks - Get tasks by manager
router.get('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement database query
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch manager tasks' }
    });
  }
});

// POST /api/managers/:id/tasks - Submit task to manager
router.post('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = req.body;
    // TODO: Implement task submission
    res.status(201).json({
      success: true,
      data: { managerId: id, ...taskData }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to submit task to manager' }
    });
  }
});

// Convene the council: aggregate feedback from all managers and holons
router.get('/convene-council', async (req, res) => {
  try {
    // List of feedback endpoints for holons and managers
    const endpoints = [
      'http://localhost:3001/api/testing/feedback',
      'http://localhost:3001/api/features/feedback',
      'http://localhost:3001/api/product/feedback'
      // Add more manager/holon feedback endpoints as needed
    ];
    const results = await Promise.allSettled(
      endpoints.map(url => axios.get(url).then(r => r.data))
    );
    const feedback = results.map((result, idx) => {
      if (result.status === 'fulfilled' && typeof result.value === 'object' && result.value !== null) {
        return { source: endpoints[idx], ...result.value };
      } else if (result.status === 'fulfilled') {
        return { source: endpoints[idx], value: result.value };
      } else {
        return { source: endpoints[idx], error: result.reason?.message || 'Failed to fetch' };
      }
    });
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to convene the council' } });
  }
});

export { router as managerRoutes }; 