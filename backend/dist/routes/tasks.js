"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.taskRoutes = router;
router.get('/', async (req, res) => {
    try {
        const tasks = [
            {
                id: 'task-1',
                title: 'Implement API Authentication',
                description: 'Add OAuth2 authentication to all API endpoints',
                type: 'epic',
                priority: 'critical',
                status: 'in-progress',
                progress: 75,
                effort: 40,
                businessValue: 90,
                technicalUrgency: 95,
                userImpact: 85,
                manager: 'APIManager',
                category: 'security',
                startDate: new Date('2025-01-01'),
                estimatedCompletion: new Date('2025-01-15'),
                dependencies: [],
                tags: ['security', 'authentication', 'api']
            },
            {
                id: 'task-2',
                title: 'Database Performance Optimization',
                description: 'Optimize database queries and add indexing',
                type: 'story',
                priority: 'high',
                status: 'planned',
                progress: 0,
                effort: 24,
                businessValue: 80,
                technicalUrgency: 85,
                userImpact: 70,
                manager: 'IntegrationManager',
                category: 'performance',
                startDate: new Date('2025-01-10'),
                estimatedCompletion: new Date('2025-01-20'),
                dependencies: ['task-1'],
                tags: ['database', 'performance', 'optimization']
            }
        ];
        res.json({
            success: true,
            data: tasks
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch tasks' }
        });
    }
});
router.post('/', async (req, res) => {
    try {
        const taskData = req.body;
        const newTask = {
            id: `task-${Date.now()}`,
            ...taskData,
            createdAt: new Date()
        };
        res.status(201).json({
            success: true,
            data: newTask
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to create task' }
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        res.json({
            success: true,
            data: { id, title: 'Sample Task' }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch task' }
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        res.json({
            success: true,
            data: { id, ...updateData }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update task' }
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to delete task' }
        });
    }
});
router.patch('/:id/progress', async (req, res) => {
    try {
        const { id } = req.params;
        const { progress, status } = req.body;
        res.json({
            success: true,
            data: { id, progress, status }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to update progress' }
        });
    }
});
//# sourceMappingURL=tasks.js.map