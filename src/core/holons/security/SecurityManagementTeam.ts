import { EventEmitter } from 'events';
import { SecurityHolonManager, SecurityVulnerability, SecurityScan } from './SecurityHolonManager';

export interface SecurityTeamMember {
  id: string;
  name: string;
  role: 'security_analyst' | 'security_engineer' | 'security_architect' | 'compliance_officer' | 'incident_responder';
  expertise: string[];
  availability: 'available' | 'busy' | 'offline';
  currentTasks: string[];
  performanceMetrics: {
    vulnerabilitiesResolved: number;
    incidentsHandled: number;
    responseTime: number;
    accuracy: number;
  };
}

export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  category: 'breach' | 'vulnerability' | 'compliance' | 'configuration' | 'access';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolution?: string | undefined;
  impact: string;
  affectedSystems: string[];
  evidence: string[];
}

export interface SecurityCompliance {
  id: string;
  framework: 'GDPR' | 'SOC2' | 'ISO27001' | 'HIPAA' | 'PCI-DSS';
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable';
  lastAssessment: Date;
  nextAssessment: Date;
  requirements: ComplianceRequirement[];
  score: number;
  gaps: string[];
  remediationPlan: string[];
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'in_progress';
  evidence: string[];
  lastVerified: Date;
  nextReview: Date;
}

export interface SecurityTeamState {
  isInitialized: boolean;
  members: SecurityTeamMember[];
  incidents: SecurityIncident[];
  compliance: SecurityCompliance[];
  performance: {
    totalIncidents: number;
    averageResponseTime: number;
    resolutionRate: number;
    complianceScore: number;
    teamEfficiency: number;
  };
  coordination: {
    activeIncidents: number;
    pendingTasks: number;
    teamAvailability: number;
    communicationStatus: 'optimal' | 'good' | 'degraded' | 'poor';
  };
}

export class SecurityManagementTeam extends EventEmitter {
  private static instance: SecurityManagementTeam;
  private state: SecurityTeamState;
  private securityHolonManager: SecurityHolonManager;

  private constructor() {
    super();
    this.state = this.initializeState();
    this.securityHolonManager = SecurityHolonManager.getInstance();
  }

  public static getInstance(): SecurityManagementTeam {
    if (!SecurityManagementTeam.instance) {
      SecurityManagementTeam.instance = new SecurityManagementTeam();
    }
    return SecurityManagementTeam.instance;
  }

  private initializeState(): SecurityTeamState {
    return {
      isInitialized: false,
      members: this.initializeTeamMembers(),
      incidents: [],
      compliance: this.initializeComplianceFrameworks(),
      performance: {
        totalIncidents: 0,
        averageResponseTime: 0,
        resolutionRate: 0,
        complianceScore: 0,
        teamEfficiency: 0
      },
      coordination: {
        activeIncidents: 0,
        pendingTasks: 0,
        teamAvailability: 0,
        communicationStatus: 'optimal'
      }
    };
  }

  private initializeTeamMembers(): SecurityTeamMember[] {
    return [
      {
        id: 'sec-analyst-001',
        name: 'Alex Chen',
        role: 'security_analyst',
        expertise: ['vulnerability_assessment', 'threat_analysis', 'incident_response'],
        availability: 'available',
        currentTasks: [],
        performanceMetrics: {
          vulnerabilitiesResolved: 45,
          incidentsHandled: 23,
          responseTime: 2.5,
          accuracy: 94
        }
      },
      {
        id: 'sec-engineer-001',
        name: 'Sarah Johnson',
        role: 'security_engineer',
        expertise: ['penetration_testing', 'security_architecture', 'tool_implementation'],
        availability: 'available',
        currentTasks: [],
        performanceMetrics: {
          vulnerabilitiesResolved: 67,
          incidentsHandled: 18,
          responseTime: 1.8,
          accuracy: 97
        }
      },
      {
        id: 'sec-architect-001',
        name: 'Michael Rodriguez',
        role: 'security_architect',
        expertise: ['security_design', 'risk_assessment', 'compliance_frameworks'],
        availability: 'available',
        currentTasks: [],
        performanceMetrics: {
          vulnerabilitiesResolved: 89,
          incidentsHandled: 12,
          responseTime: 3.2,
          accuracy: 96
        }
      },
      {
        id: 'compliance-officer-001',
        name: 'Emily Watson',
        role: 'compliance_officer',
        expertise: ['GDPR', 'SOC2', 'ISO27001', 'audit_management'],
        availability: 'available',
        currentTasks: [],
        performanceMetrics: {
          vulnerabilitiesResolved: 23,
          incidentsHandled: 8,
          responseTime: 4.1,
          accuracy: 98
        }
      },
      {
        id: 'incident-responder-001',
        name: 'David Kim',
        role: 'incident_responder',
        expertise: ['forensics', 'malware_analysis', 'breach_containment'],
        availability: 'available',
        currentTasks: [],
        performanceMetrics: {
          vulnerabilitiesResolved: 34,
          incidentsHandled: 31,
          responseTime: 1.2,
          accuracy: 92
        }
      }
    ];
  }

  private initializeComplianceFrameworks(): SecurityCompliance[] {
    return [
      {
        id: 'gdpr-compliance',
        framework: 'GDPR',
        status: 'in_progress',
        lastAssessment: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        nextAssessment: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        requirements: [
          {
            id: 'gdpr-001',
            title: 'Data Protection by Design',
            description: 'Implement data protection measures from the start of system design',
            status: 'compliant',
            evidence: ['Privacy impact assessments completed', 'Data minimization implemented'],
            lastVerified: new Date(),
            nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'gdpr-002',
            title: 'User Consent Management',
            description: 'Properly manage and track user consent for data processing',
            status: 'in_progress',
            evidence: ['Consent management system implemented'],
            lastVerified: new Date(),
            nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        ],
        score: 75,
        gaps: ['Consent withdrawal mechanism needs improvement'],
        remediationPlan: ['Implement automated consent withdrawal', 'Add consent audit trail']
      },
      {
        id: 'soc2-compliance',
        framework: 'SOC2',
        status: 'compliant',
        lastAssessment: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        nextAssessment: new Date(Date.now() + 345 * 24 * 60 * 60 * 1000), // 345 days from now
        requirements: [
          {
            id: 'soc2-001',
            title: 'Access Control',
            description: 'Implement and maintain effective access controls',
            status: 'compliant',
            evidence: ['Role-based access control implemented', 'Access reviews conducted quarterly'],
            lastVerified: new Date(),
            nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          }
        ],
        score: 92,
        gaps: [],
        remediationPlan: []
      }
    ];
  }

  public async initialize(): Promise<void> {
    try {
      console.log('👥 Initializing Security Management Team...');
      
      // Initialize security holon manager if not already done
      if (!this.securityHolonManager.isInitialized()) {
        await this.securityHolonManager.initialize();
      }
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize team coordination
      await this.initializeTeamCoordination();
      
      // Calculate initial performance metrics
      this.updatePerformanceMetrics();
      
      this.state.isInitialized = true;
      this.emit('initialized');
      
      console.log('✅ Security Management Team initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Security Management Team:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    // Listen for security events from the holon manager
    this.securityHolonManager.on('vulnerability-detected', this.handleVulnerabilityDetected.bind(this));
    this.securityHolonManager.on('scan-completed', this.handleScanCompleted.bind(this));
    this.securityHolonManager.on('security-alert', this.handleSecurityAlert.bind(this));
    
    // Emit team events
    this.on('incident-created', (incident: SecurityIncident) => {
      console.log(`🚨 Security incident created: ${incident.title}`);
    });
    
    this.on('incident-resolved', (incident: SecurityIncident) => {
      console.log(`✅ Security incident resolved: ${incident.title}`);
    });
  }

  private async initializeTeamCoordination(): Promise<void> {
    console.log('🤝 Initializing team coordination...');
    
    // Update team availability
    this.updateTeamAvailability();
    
    // Assign pending tasks
    await this.assignPendingTasks();
    
    console.log('✅ Team coordination initialized');
  }

  private updateTeamAvailability(): void {
    const availableMembers = this.state.members.filter(member => member.availability === 'available');
    this.state.coordination.teamAvailability = (availableMembers.length / this.state.members.length) * 100;
  }

  private async assignPendingTasks(): Promise<void> {
    // Assign tasks based on member expertise and availability
    for (const member of this.state.members) {
      if (member.availability === 'available' && member.currentTasks.length < 3) {
        const task = await this.findSuitableTask(member);
        if (task) {
          member.currentTasks.push(task);
        }
      }
    }
  }

  private async findSuitableTask(member: SecurityTeamMember): Promise<string | null> {
    // Find tasks that match member expertise
    const pendingIncidents = this.state.incidents.filter(i => i.status === 'open' && !i.assignedTo);
    
    for (const incident of pendingIncidents) {
      if (this.memberCanHandleIncident(member, incident)) {
        return `Handle incident: ${incident.title}`;
      }
    }
    
    return null;
  }

  private memberCanHandleIncident(member: SecurityTeamMember, incident: SecurityIncident): boolean {
    // Check if member has expertise to handle the incident
    switch (incident.category) {
      case 'vulnerability':
        return member.expertise.includes('vulnerability_assessment') || member.expertise.includes('penetration_testing');
      case 'breach':
        return member.expertise.includes('incident_response') || member.expertise.includes('forensics');
      case 'compliance':
        return member.expertise.includes('GDPR') || member.expertise.includes('SOC2') || member.expertise.includes('ISO27001');
      default:
        return true;
    }
  }

  // Public API Methods

  public async createSecurityIncident(
    title: string,
    description: string,
    severity: SecurityIncident['severity'],
    category: SecurityIncident['category'],
    impact: string,
    affectedSystems: string[]
  ): Promise<SecurityIncident> {
    console.log(`🚨 Creating security incident: ${title}`);
    
    const incident: SecurityIncident = {
      id: `incident-${Date.now()}`,
      title,
      description,
      severity,
      status: 'open',
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
      impact,
      affectedSystems,
      evidence: []
    };
    
    this.state.incidents.push(incident);
    this.state.coordination.activeIncidents++;
    
    // Auto-assign to appropriate team member
    await this.assignIncidentToTeamMember(incident);
    
    this.updatePerformanceMetrics();
    this.emit('incident-created', incident);
    
    console.log(`✅ Security incident created: ${incident.id}`);
    return incident;
  }

  private async assignIncidentToTeamMember(incident: SecurityIncident): Promise<void> {
    const availableMembers = this.state.members.filter(member => 
      member.availability === 'available' && 
      member.currentTasks.length < 3 &&
      this.memberCanHandleIncident(member, incident)
    );
    
    if (availableMembers.length > 0) {
      // Assign to member with best performance metrics
      const bestMember = availableMembers.reduce((best, current) => 
        current.performanceMetrics.responseTime < best.performanceMetrics.responseTime ? current : best
      );
      
      incident.assignedTo = bestMember.id;
      bestMember.currentTasks.push(`Handle incident: ${incident.title}`);
      
      console.log(`👤 Assigned incident ${incident.id} to ${bestMember.name}`);
    }
  }

  public async updateIncidentStatus(
    incidentId: string,
    status: SecurityIncident['status'],
    resolution?: string
  ): Promise<void> {
    console.log(`📝 Updating incident status: ${incidentId} -> ${status}`);
    
    const incident = this.state.incidents.find(i => i.id === incidentId);
    if (!incident) {
      throw new Error(`Incident not found: ${incidentId}`);
    }
    
    incident.status = status;
    incident.updatedAt = new Date();
    
    if (status === 'resolved' || status === 'closed') {
      incident.resolvedAt = new Date();
      incident.resolution = resolution || undefined;
      this.state.coordination.activeIncidents--;
      
      // Update team member performance
      if (incident.assignedTo) {
        const member = this.state.members.find(m => m.id === incident.assignedTo);
        if (member) {
          member.performanceMetrics.incidentsHandled++;
          member.currentTasks = member.currentTasks.filter(task => !task.includes(incident.title));
        }
      }
      
      this.emit('incident-resolved', incident);
    }
    
    this.updatePerformanceMetrics();
    console.log(`✅ Incident status updated: ${incidentId}`);
  }

  public async addIncidentEvidence(incidentId: string, evidence: string): Promise<void> {
    const incident = this.state.incidents.find(i => i.id === incidentId);
    if (!incident) {
      throw new Error(`Incident not found: ${incidentId}`);
    }
    
    incident.evidence.push(evidence);
    incident.updatedAt = new Date();
    
    console.log(`📋 Evidence added to incident: ${incidentId}`);
  }

  public async updateComplianceStatus(
    complianceId: string,
    status: SecurityCompliance['status'],
    score: number,
    gaps: string[],
    remediationPlan: string[]
  ): Promise<void> {
    console.log(`📊 Updating compliance status: ${complianceId}`);
    
    const compliance = this.state.compliance.find(c => c.id === complianceId);
    if (!compliance) {
      throw new Error(`Compliance framework not found: ${complianceId}`);
    }
    
    compliance.status = status;
    compliance.score = score;
    compliance.gaps = gaps;
    compliance.remediationPlan = remediationPlan;
    
    this.updatePerformanceMetrics();
    console.log(`✅ Compliance status updated: ${complianceId}`);
  }

  public async assignTeamMemberToTask(memberId: string, task: string): Promise<void> {
    const member = this.state.members.find(m => m.id === memberId);
    if (!member) {
      throw new Error(`Team member not found: ${memberId}`);
    }
    
    if (member.availability !== 'available') {
      throw new Error(`Team member ${member.name} is not available`);
    }
    
    member.currentTasks.push(task);
    this.state.coordination.pendingTasks++;
    
    console.log(`👤 Assigned task to ${member.name}: ${task}`);
  }

  public async updateMemberAvailability(memberId: string, availability: SecurityTeamMember['availability']): Promise<void> {
    const member = this.state.members.find(m => m.id === memberId);
    if (!member) {
      throw new Error(`Team member not found: ${memberId}`);
    }
    
    member.availability = availability;
    this.updateTeamAvailability();
    
    console.log(`👤 Updated ${member.name} availability to: ${availability}`);
  }

  // Event Handlers

  private handleVulnerabilityDetected(vulnerability: SecurityVulnerability): void {
    console.log(`🔍 Vulnerability detected: ${vulnerability.title}`);
    
    // Create incident for critical/high vulnerabilities
    if (vulnerability.severity === 'critical' || vulnerability.severity === 'high') {
      this.createSecurityIncident(
        `Vulnerability: ${vulnerability.title}`,
        vulnerability.description,
        vulnerability.severity === 'critical' ? 'critical' : 'high',
        'vulnerability',
        `Security vulnerability in ${vulnerability.location}`,
        [vulnerability.location]
      );
    }
  }

  private handleScanCompleted(scan: SecurityScan): void {
    console.log(`✅ Security scan completed: ${scan.type}`);
    
    // Update team performance metrics
    this.updatePerformanceMetrics();
  }

  private handleSecurityAlert(alert: any): void {
    console.log(`🚨 Security alert received: ${alert.type}`);
    
    // Create incident for security alerts
    this.createSecurityIncident(
      `Security Alert: ${alert.type}`,
      alert.message || 'Security alert triggered',
      alert.severity || 'medium',
      'breach',
      'Security alert requires investigation',
      alert.affectedSystems || []
    );
  }

  private updatePerformanceMetrics(): void {
    const incidents = this.state.incidents;
    const members = this.state.members;
    
    this.state.performance = {
      totalIncidents: incidents.length,
      averageResponseTime: this.calculateAverageResponseTime(),
      resolutionRate: this.calculateResolutionRate(),
      complianceScore: this.calculateComplianceScore(),
      teamEfficiency: this.calculateTeamEfficiency()
    };
    
    this.state.coordination.pendingTasks = this.calculatePendingTasks();
  }

  private calculateAverageResponseTime(): number {
    const resolvedIncidents = this.state.incidents.filter(i => i.resolvedAt);
    if (resolvedIncidents.length === 0) return 0;
    
    const totalTime = resolvedIncidents.reduce((sum, incident) => {
      return sum + (incident.resolvedAt!.getTime() - incident.createdAt.getTime());
    }, 0);
    
    return totalTime / resolvedIncidents.length / (1000 * 60 * 60); // Convert to hours
  }

  private calculateResolutionRate(): number {
    const totalIncidents = this.state.incidents.length;
    const resolvedIncidents = this.state.incidents.filter(i => i.status === 'resolved' || i.status === 'closed');
    
    return totalIncidents > 0 ? (resolvedIncidents.length / totalIncidents) * 100 : 0;
  }

  private calculateComplianceScore(): number {
    const complianceFrameworks = this.state.compliance;
    if (complianceFrameworks.length === 0) return 0;
    
    const totalScore = complianceFrameworks.reduce((sum, framework) => sum + framework.score, 0);
    return totalScore / complianceFrameworks.length;
  }

  private calculateTeamEfficiency(): number {
    const members = this.state.members;
    if (members.length === 0) return 0;
    
    const totalEfficiency = members.reduce((sum, member) => {
      const efficiency = (member.performanceMetrics.accuracy + 
                         (100 - member.performanceMetrics.responseTime * 10)) / 2;
      return sum + Math.max(0, efficiency);
    }, 0);
    
    return totalEfficiency / members.length;
  }

  private calculatePendingTasks(): number {
    return this.state.members.reduce((sum, member) => sum + member.currentTasks.length, 0);
  }

  // Public Getters

  public getState(): SecurityTeamState {
    return { ...this.state };
  }

  public getTeamMembers(): SecurityTeamMember[] {
    return [...this.state.members];
  }

  public getIncidents(): SecurityIncident[] {
    return [...this.state.incidents];
  }

  public getCompliance(): SecurityCompliance[] {
    return [...this.state.compliance];
  }

  public getPerformance(): SecurityTeamState['performance'] {
    return { ...this.state.performance };
  }

  public getCoordination(): SecurityTeamState['coordination'] {
    return { ...this.state.coordination };
  }

  public isInitialized(): boolean {
    return this.state.isInitialized;
  }
} 