"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const ProductHolon_1 = require("../../src/core/holons/product/ProductHolon");
const router = (0, express_1.Router)();
exports.productRoutes = router;
router.get('/performance-metrics', async (req, res) => {
    try {
        const productHolon = ProductHolon_1.ProductHolon.getInstance();
        const metrics = productHolon.getPerformanceMetrics();
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
        const productHolon = ProductHolon_1.ProductHolon.getInstance();
        const state = productHolon.getState();
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
        const productHolon = ProductHolon_1.ProductHolon.getInstance();
        const feedback = {
            missingRequirements: [
                'Advanced stakeholder collaboration tools',
                'Automated requirement validation',
                'Real-time progress tracking'
            ],
            supportNeeds: [
                'Enhanced requirement prioritization',
                'Stakeholder communication tools',
                'Automated compliance reporting'
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
//# sourceMappingURL=product.js.map