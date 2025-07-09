"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featuresRoutes = void 0;
const express_1 = require("express");
const FeaturesHolon_1 = require("../../src/core/holons/features/FeaturesHolon");
const router = (0, express_1.Router)();
exports.featuresRoutes = router;
router.get('/performance-metrics', async (req, res) => {
    try {
        const featuresHolon = FeaturesHolon_1.FeaturesHolon.getInstance();
        const metrics = featuresHolon.getPerformanceMetrics();
        res.json({
            success: true,
            data: metrics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get performance metrics' }
        });
    }
});
router.get('/state', async (req, res) => {
    try {
        const featuresHolon = FeaturesHolon_1.FeaturesHolon.getInstance();
        const state = featuresHolon.getState();
        res.json({
            success: true,
            data: state
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get state' }
        });
    }
});
router.get('/feedback', async (req, res) => {
    try {
        const featuresHolon = FeaturesHolon_1.FeaturesHolon.getInstance();
        const feedback = {
            missingRequirements: [
                'Advanced component dependency tracking',
                'Automated feature impact analysis',
                'Cross-platform compatibility testing'
            ],
            supportNeeds: [
                'Enhanced design system integration',
                'Performance optimization tools',
                'Automated quality gates'
            ],
            timestamp: new Date().toISOString()
        };
        res.json({
            success: true,
            data: feedback
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get feedback' }
        });
    }
});
//# sourceMappingURL=features.js.map