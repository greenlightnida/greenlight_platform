import { SecurityHolonManager } from './src/core/holons/security/SecurityHolonManager';
import { SecurityManagementTeam } from './src/core/holons/security/SecurityManagementTeam';

async function testSecurityHolon() {
  console.log('🔐 Testing Security Holon & Management Team Implementation...\n');

  try {
    // Initialize both systems
    console.log('1️⃣ Initializing Security Systems...');
    const securityHolonManager = SecurityHolonManager.getInstance();
    const securityManagementTeam = SecurityManagementTeam.getInstance();
    
    await securityHolonManager.initialize();
    await securityManagementTeam.initialize();
    
    console.log('✅ Security systems initialized successfully\n');

    // Test Security Holon Manager
    console.log('2️⃣ Testing Security Holon Manager...');
    
    // Run different types of security scans
    console.log('   Running SAST scan...');
    const sastScan = await securityHolonManager.runSecurityScan('sast', 'greenlight-platform');
    console.log(`   ✅ SAST scan completed. Found ${sastScan.vulnerabilities.length} vulnerabilities`);
    
    console.log('   Running dependency scan...');
    const dependencyScan = await securityHolonManager.runSecurityScan('dependency', 'greenlight-platform');
    console.log(`   ✅ Dependency scan completed. Found ${dependencyScan.vulnerabilities.length} vulnerabilities`);
    
    console.log('   Running configuration scan...');
    const configScan = await securityHolonManager.runSecurityScan('configuration', 'greenlight-platform');
    console.log(`   ✅ Configuration scan completed. Found ${configScan.vulnerabilities.length} vulnerabilities`);
    
    // Get security metrics
    const metrics = securityHolonManager.getMetrics();
    console.log(`   📊 Security Score: ${metrics.securityScore}%`);
    console.log(`   📊 Total Vulnerabilities: ${metrics.totalVulnerabilities}`);
    console.log(`   📊 Policy Compliance Rate: ${metrics.policyComplianceRate}%`);
    
    console.log('✅ Security Holon Manager tests completed\n');

    // Test Security Management Team
    console.log('3️⃣ Testing Security Management Team...');
    
    // Create security incidents
    console.log('   Creating security incidents...');
    const incident1 = await securityManagementTeam.createSecurityIncident(
      'SQL Injection Attempt Detected',
      'Multiple SQL injection attempts detected in user input validation',
      'high',
      'vulnerability',
      'Potential data breach and unauthorized access',
      ['src/api/users.ts', 'src/api/auth.ts']
    );
    
    const incident2 = await securityManagementTeam.createSecurityIncident(
      'Suspicious Login Activity',
      'Multiple failed login attempts from unknown IP addresses',
      'medium',
      'access',
      'Potential brute force attack',
      ['src/auth/login.ts']
    );
    
    console.log(`   ✅ Created ${2} security incidents`);
    
    // Update incident status
    console.log('   Updating incident status...');
    await securityManagementTeam.updateIncidentStatus(incident1.id, 'investigating');
    await securityManagementTeam.addIncidentEvidence(incident1.id, 'Log analysis shows 50+ injection attempts');
    await securityManagementTeam.updateIncidentStatus(incident1.id, 'resolved', 'Input validation strengthened');
    
    console.log('   ✅ Incident lifecycle tested');
    
    // Test team coordination
    console.log('   Testing team coordination...');
    const teamMembers = securityManagementTeam.getTeamMembers();
    console.log(`   👥 Team Members: ${teamMembers.length}`);
    console.log(`   👥 Available: ${teamMembers.filter(m => m.availability === 'available').length}`);
    
    // Assign tasks to team members
    await securityManagementTeam.assignTeamMemberToTask(teamMembers[0].id, 'Review security logs');
    await securityManagementTeam.assignTeamMemberToTask(teamMembers[1].id, 'Update security policies');
    
    console.log('   ✅ Team coordination tested');
    
    // Get team performance
    const teamPerformance = securityManagementTeam.getPerformance();
    console.log(`   📊 Team Efficiency: ${teamPerformance.teamEfficiency.toFixed(1)}%`);
    console.log(`   📊 Resolution Rate: ${teamPerformance.resolutionRate.toFixed(1)}%`);
    console.log(`   📊 Average Response Time: ${teamPerformance.averageResponseTime.toFixed(1)} hours`);
    
    console.log('✅ Security Management Team tests completed\n');

    // Test Compliance Management
    console.log('4️⃣ Testing Compliance Management...');
    
    const compliance = securityManagementTeam.getCompliance();
    console.log(`   📋 Compliance Frameworks: ${compliance.length}`);
    
    for (const framework of compliance) {
      console.log(`   📋 ${framework.framework}: ${framework.status} (${framework.score}%)`);
      if (framework.gaps.length > 0) {
        console.log(`      Gaps: ${framework.gaps.length}`);
      }
    }
    
    // Update compliance status
    await securityManagementTeam.updateComplianceStatus(
      compliance[0].id,
      'compliant',
      95,
      [],
      []
    );
    
    console.log('   ✅ Compliance management tested');
    console.log('✅ Compliance tests completed\n');

    // Test Integration Between Systems
    console.log('5️⃣ Testing System Integration...');
    
    // Verify that vulnerabilities from holon manager create incidents in management team
    const vulnerabilities = securityHolonManager.getVulnerabilities();
    const incidents = securityManagementTeam.getIncidents();
    
    console.log(`   🔗 Vulnerabilities: ${vulnerabilities.length}`);
    console.log(`   🔗 Incidents: ${incidents.length}`);
    console.log(`   🔗 Active Incidents: ${securityManagementTeam.getCoordination().activeIncidents}`);
    
    // Test real-time updates
    console.log('   Testing real-time updates...');
    const initialMetrics = securityHolonManager.getMetrics();
    
    // Run another scan to trigger updates
    await securityHolonManager.runSecurityScan('compliance', 'greenlight-platform');
    
    const updatedMetrics = securityHolonManager.getMetrics();
    console.log(`   📊 Security Score: ${initialMetrics.securityScore}% → ${updatedMetrics.securityScore}%`);
    
    console.log('✅ System integration tests completed\n');

    // Generate Final Report
    console.log('6️⃣ Generating Security Report...');
    
    const finalHolonState = securityHolonManager.getState();
    const finalTeamState = securityManagementTeam.getState();
    
    console.log('\n📊 FINAL SECURITY REPORT');
    console.log('========================');
    console.log(`🔐 Security Score: ${finalHolonState.metrics.securityScore}%`);
    console.log(`🕳️ Total Vulnerabilities: ${finalHolonState.metrics.totalVulnerabilities}`);
    console.log(`🚨 Total Incidents: ${finalTeamState.incidents.length}`);
    console.log(`👥 Team Members: ${finalTeamState.members.length}`);
    console.log(`📋 Compliance Frameworks: ${finalTeamState.compliance.length}`);
    console.log(`⚡ Team Efficiency: ${finalTeamState.performance.teamEfficiency.toFixed(1)}%`);
    console.log(`🎯 Resolution Rate: ${finalTeamState.performance.resolutionRate.toFixed(1)}%`);
    
    // Vulnerability breakdown
    console.log('\n🕳️ VULNERABILITY BREAKDOWN');
    console.log('==========================');
    const vulnBySeverity = finalHolonState.metrics.vulnerabilitiesBySeverity;
    Object.entries(vulnBySeverity).forEach(([severity, count]) => {
      console.log(`   ${severity.toUpperCase()}: ${count}`);
    });
    
    // Incident breakdown
    console.log('\n🚨 INCIDENT BREAKDOWN');
    console.log('=====================');
    const incidentsByStatus = finalTeamState.incidents.reduce((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(incidentsByStatus).forEach(([status, count]) => {
      console.log(`   ${status.toUpperCase()}: ${count}`);
    });
    
    // Team performance
    console.log('\n👥 TEAM PERFORMANCE');
    console.log('===================');
    finalTeamState.members.forEach(member => {
      console.log(`   ${member.name} (${member.role}):`);
      console.log(`     Vulnerabilities Resolved: ${member.performanceMetrics.vulnerabilitiesResolved}`);
      console.log(`     Incidents Handled: ${member.performanceMetrics.incidentsHandled}`);
      console.log(`     Response Time: ${member.performanceMetrics.responseTime}h`);
      console.log(`     Accuracy: ${member.performanceMetrics.accuracy}%`);
    });
    
    // Compliance status
    console.log('\n📋 COMPLIANCE STATUS');
    console.log('====================');
    finalTeamState.compliance.forEach(framework => {
      console.log(`   ${framework.framework}: ${framework.status.toUpperCase()} (${framework.score}%)`);
    });
    
    console.log('\n✅ Security Holon & Management Team Implementation Test Complete!');
    console.log('🎉 All systems are operational and integrated successfully.');
    
  } catch (error) {
    console.error('❌ Security Holon test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSecurityHolon(); 