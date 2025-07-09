"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.analyticsRoutes = router;
router.get('/metrics', async (req, res) => {
    try {
        const metrics = {
            totalTasks: 5,
            completedTasks: 1,
            inProgressTasks: 2,
            plannedTasks: 1,
            blockedTasks: 1,
            completionRate: 20,
            averageProgress: 50,
            criticalTasks: 2,
            highPriorityTasks: 2,
            mediumPriorityTasks: 1,
            lowPriorityTasks: 0
        };
        res.json({
            success: true,
            data: metrics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch metrics' }
        });
    }
});
router.get('/charts', async (req, res) => {
    try {
        const charts = {
            priorityDistribution: [
                { name: 'Critical', value: 2, color: '#dc2626' },
                { name: 'High', value: 2, color: '#ea580c' },
                { name: 'Medium', value: 1, color: '#d97706' },
                { name: 'Low', value: 0, color: '#65a30d' }
            ],
            statusDistribution: [
                { name: 'Completed', value: 1, color: '#059669' },
                { name: 'In Progress', value: 2, color: '#2563eb' },
                { name: 'Planned', value: 1, color: '#7c3aed' },
                { name: 'Blocked', value: 1, color: '#dc2626' }
            ],
            managerPerformance: [
                { name: 'APIManager', tasks: 3, completed: 1, inProgress: 2 },
                { name: 'IntegrationManager', tasks: 2, completed: 1, inProgress: 0 },
                { name: 'SystemMasterManager', tasks: 0, completed: 0, inProgress: 0 }
            ]
        };
        res.json({
            success: true,
            data: charts
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch chart data' }
        });
    }
});
router.get('/reports', async (req, res) => {
    try {
        const reports = {
            weekly: {
                tasksCompleted: 1,
                tasksStarted: 2,
                averageProgress: 50
            },
            monthly: {
                tasksCompleted: 3,
                tasksStarted: 5,
                averageProgress: 60
            }
        };
        res.json({
            success: true,
            data: reports
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch reports' }
        });
    }
});
//# sourceMappingURL=analytics.js.map