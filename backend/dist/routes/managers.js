"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerRoutes = void 0;
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
exports.managerRoutes = router;
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch managers' }
        });
    }
});
router.get('/:id/tasks', async (req, res) => {
    try {
        const { id } = req.params;
        res.json({
            success: true,
            data: []
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch manager tasks' }
        });
    }
});
router.post('/:id/tasks', async (req, res) => {
    try {
        const { id } = req.params;
        const taskData = req.body;
        res.status(201).json({
            success: true,
            data: { managerId: id, ...taskData }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to submit task to manager' }
        });
    }
});
router.get('/convene-council', async (req, res) => {
    try {
        const endpoints = [
            'http://localhost:3001/api/testing/feedback',
            'http://localhost:3001/api/features/feedback',
            'http://localhost:3001/api/product/feedback'
        ];
        const results = await Promise.allSettled(endpoints.map(url => axios_1.default.get(url).then(r => r.data)));
        const feedback = results.map((result, idx) => {
            if (result.status === 'fulfilled' && typeof result.value === 'object' && result.value !== null) {
                return { source: endpoints[idx], ...result.value };
            }
            else if (result.status === 'fulfilled') {
                return { source: endpoints[idx], value: result.value };
            }
            else {
                return { source: endpoints[idx], error: result.reason?.message || 'Failed to fetch' };
            }
        });
        res.json({ success: true, data: feedback });
    }
    catch (error) {
        res.status(500).json({ success: false, error: { message: 'Failed to convene the council' } });
    }
});
//# sourceMappingURL=managers.js.map