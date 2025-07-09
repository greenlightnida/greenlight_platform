"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const TestingHolonManager_1 = require("../core/holons/testing/TestingHolonManager");
const router = express_1.default.Router();
exports.testingRoutes = router;
router.get('/holon-state', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        const state = testingHolon.getState();
        res.json({
            success: true,
            data: state
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get testing holon state' }
        });
    }
});
router.post('/start-suite', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        if (!testingHolon.getState().isInitialized) {
            await testingHolon.initialize();
        }
        testingHolon.runGlobalTestSuite().catch((error) => {
            console.error('Test suite execution failed:', error);
        });
        res.json({
            success: true,
            message: 'Test suite started successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to start test suite' }
        });
    }
});
router.post('/toggle-self-healing', async (req, res) => {
    try {
        const { enabled } = req.body;
        if (typeof enabled !== 'boolean') {
            return res.status(400).json({
                success: false,
                error: { message: 'enabled parameter must be a boolean' }
            });
        }
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        const state = testingHolon.getState();
        return res.json({
            success: true,
            message: `Self-healing ${enabled ? 'enabled' : 'disabled'}`,
            data: { autoRecoveryEnabled: enabled }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: { message: 'Failed to toggle self-healing' }
        });
    }
});
router.get('/test-history', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        const history = testingHolon.getTestHistory();
        res.json({
            success: true,
            data: history
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get test history' }
        });
    }
});
router.get('/performance-metrics', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        const metrics = testingHolon.getPerformanceMetrics();
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
router.get('/cost-metrics', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        const metrics = testingHolon.getCostMetrics();
        res.json({
            success: true,
            data: metrics
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get cost metrics' }
        });
    }
});
router.get('/predictive-analysis', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        const analysis = testingHolon.getPredictiveAnalysis();
        res.json({
            success: true,
            data: analysis
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get predictive analysis' }
        });
    }
});
router.get('/cicd-integration', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        const cicdIntegration = testingHolon.getCicdIntegration();
        res.json({
            success: true,
            data: cicdIntegration
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to get CI/CD integration status' }
        });
    }
});
router.post('/integrate-features', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        await testingHolon.integrateWithFeaturesHolon();
        res.json({
            success: true,
            message: 'Successfully integrated with Features Holon'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to integrate with Features Holon' }
        });
    }
});
router.post('/enforce-standards', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        await testingHolon.enforceProfessionalStandards();
        res.json({
            success: true,
            message: 'Successfully enforced professional standards'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to enforce professional standards' }
        });
    }
});
router.post('/initialize', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        await testingHolon.initialize();
        res.json({
            success: true,
            message: 'Testing Holon initialized successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to initialize Testing Holon' }
        });
    }
});
router.post('/shutdown', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        await testingHolon.shutdown();
        res.json({
            success: true,
            message: 'Testing Holon shut down successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to shutdown Testing Holon' }
        });
    }
});
router.get('/activity-log', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        const log = testingHolon.getActivityLog();
        res.json({ success: true, data: log });
    }
    catch (error) {
        res.status(500).json({ success: false, error: { message: 'Failed to get activity log' } });
    }
});
router.get('/feedback', async (req, res) => {
    try {
        const testingHolon = TestingHolonManager_1.TestingHolonManager.getInstance();
        const feedback = {
            missingRequirements: [
                'Enhanced error reporting for failed tests',
                'Integration with external monitoring tools',
                'Real-time test result streaming'
            ],
            supportNeeds: [
                'Additional test environment resources',
                'Performance testing infrastructure',
                'Automated test data management'
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
//# sourceMappingURL=testing.js.map