import express from 'express';

import { TestingHolonManager } from '../core/holons/testing/TestingHolonManager';

const router = express.Router();

// Get Testing Holon state
router.get('/holon-state', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    const state = testingHolon.getState();
    
    res.json({
      success: true,
      data: state
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get testing holon state' }
    });
  }
});

// Start test suite
router.post('/start-suite', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    
    // Ensure holon is initialized
    if (!testingHolon.getState().isInitialized) {
      await testingHolon.initialize();
    }
    
    // Start test suite in background
    testingHolon.runGlobalTestSuite().catch((error: Error) => {
      console.error('Test suite execution failed:', error);
    });
    
    res.json({
      success: true,
      message: 'Test suite started successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to start test suite' }
    });
  }
});

// Toggle self-healing
router.post('/toggle-self-healing', async (req, res) => {
  try {
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: { message: 'enabled parameter must be a boolean' }
      });
    }
    
    const testingHolon = TestingHolonManager.getInstance();
    const state = testingHolon.getState();
    
    // Update self-healing state (in a real implementation, this would be a method on the holon)
    // For now, we'll just return the current state
    return res.json({
      success: true,
      message: `Self-healing ${enabled ? 'enabled' : 'disabled'}`,
      data: { autoRecoveryEnabled: enabled }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to toggle self-healing' }
    });
  }
});

// Get test history
router.get('/test-history', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    const history = testingHolon.getTestHistory();
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get test history' }
    });
  }
});

// Get performance metrics
router.get('/performance-metrics', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    const metrics = testingHolon.getPerformanceMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get performance metrics' }
    });
  }
});

// Get cost metrics
router.get('/cost-metrics', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    const metrics = testingHolon.getCostMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get cost metrics' }
    });
  }
});

// Get predictive analysis
router.get('/predictive-analysis', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    const analysis = testingHolon.getPredictiveAnalysis();
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get predictive analysis' }
    });
  }
});

// Get CI/CD integration status
router.get('/cicd-integration', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    const cicdIntegration = testingHolon.getCicdIntegration();
    
    res.json({
      success: true,
      data: cicdIntegration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get CI/CD integration status' }
    });
  }
});

// Integrate with Features Holon
router.post('/integrate-features', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    await testingHolon.integrateWithFeaturesHolon();
    
    res.json({
      success: true,
      message: 'Successfully integrated with Features Holon'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to integrate with Features Holon' }
    });
  }
});

// Enforce professional standards
router.post('/enforce-standards', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    await testingHolon.enforceProfessionalStandards();
    
    res.json({
      success: true,
      message: 'Successfully enforced professional standards'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to enforce professional standards' }
    });
  }
});

// Initialize Testing Holon
router.post('/initialize', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    await testingHolon.initialize();
    
    res.json({
      success: true,
      message: 'Testing Holon initialized successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to initialize Testing Holon' }
    });
  }
});

// Shutdown Testing Holon
router.post('/shutdown', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    await testingHolon.shutdown();
    
    res.json({
      success: true,
      message: 'Testing Holon shut down successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to shutdown Testing Holon' }
    });
  }
});

// Get Testing Holon activity log
router.get('/activity-log', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
    const log = testingHolon.getActivityLog();
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to get activity log' } });
  }
});

// Get Testing Holon feedback
router.get('/feedback', async (req, res) => {
  try {
    const testingHolon = TestingHolonManager.getInstance();
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get feedback' }
    });
  }
});

export { router as testingRoutes }; 