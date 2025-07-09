// Add Features Holon test to the end-of-chat protocol
async function runFeaturesHolonTest() {
  console.log('🧪 Running Features Holon test for session close...');
  try {
    const { execSync } = require('child_process');
    execSync('npm test', { stdio: 'inherit' });
    console.log('✅ Features Holon test passed');
    return true;
  } catch (error) {
    console.error('❌ Features Holon test failed:', error.message);
    return false;
  }
}

// Add the Features Holon test to the main protocol execution
async function executeProtocol() {
  // ... existing protocol steps ...
  
  // Run Features Holon test
  
  // ... rest of protocol ...
} 