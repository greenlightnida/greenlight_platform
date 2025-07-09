# Greenlight Home Portal - Requirements & Specifications

## 1. Core Purpose
Build a unified dashboard for Greenlight's consulting team to:
- Access their toolkit
- View portfolio snapshot
- Manage work collaborations
- Track people and entities

## 2. Main Navigation Structure

### 2.1 Dashboard (Home)
- Revenue overview
- Active work summary
- Recent activity feed
- Quick actions

### 2.2 Portfolio
- Revenue tracking
- Client portfolio
- Investment portfolio/accelerator

### 2.3 Work Hub
- Client Services (direct client work)
- Client Productions (content/events for clients)
- The Lab (revenue-generating products)
- Internal Tools (client-specific tools)

### 2.4 People & Entities
- Clients (paying customers)
- Community Members (investment portfolio contacts)
- Team members

### 2.5 Toolkit
- Consulting resources
- Templates
- Tools

## 3. Detailed Requirements

### 3.1 Dashboard Requirements
**Must Have:**
- Total revenue: current month, quarter, year
- Revenue breakdown by source (Client Services, Client Productions, The Lab)
- Active work count across all categories
- Top 5 clients by revenue
- Lab product performance snapshot
- Recent activity timeline (last 7 days)
- Quick add buttons for new work items

**Should Have:**
- Revenue trend charts by category
- Upcoming deadlines across all work types
- Team availability status
- Lab backlog priorities
- Client tool usage metrics

### 3.2 Portfolio Section
**Revenue Tracking:**
- Monthly recurring revenue (MRR)
- One-time project revenue
- Revenue by client
- Revenue by work type
- Forecasted revenue

**Client Portfolio:**
- Active clients list
- Client health scores
- Contract status
- Payment status
- Next touchpoint dates

**Investment Portfolio:**
- Startup companies
- Investment amounts
- Company stages
- Key contacts per company
- Portfolio performance metrics

### 3.3 Work Hub Requirements

**Client Services (Direct Client Work):**
- Service type (consulting, strategy, implementation)
- Client assignment
- Status (Scoping, Active, Review, Complete)
- Budget vs. actual
- Timeline and milestones
- Assigned team members
- Deliverables checklist
- Billable hours tracking

**Client Productions (Content/Events for Clients):**
- Production type (content, events, campaigns, marketing)
- Client assignment
- Status and timeline
- Creative assets
- Performance metrics
- Team assignments
- Client approval stages

**The Lab (Revenue-Generating Products):**
- Product name and description
- Development stage
- Target market
- Revenue model
- Current revenue/users
- Intelligent backlog items
- Roadmap priorities
- Market validation data
- Go-to-market strategy

**Internal Tools (Client-Specific Tools):**
- Tool name (e.g., "Elevate")
- Client assignment (e.g., Top Bins - Matt & Brian)
- Tool type (CRM, recruitment intelligence, etc.)
- Development status
- Usage metrics
- Feature requests
- Maintenance schedule
- Client feedback

### 3.4 People & Entities
**Clients:**
- Company information
- Primary contacts
- Contract details
- Payment history
- Project history
- Communication log

**Community Members:**
- Individual profiles
- Company affiliation
- Investment stage
- Interaction history
- Interests/expertise
- Contact preferences

**Team Members:**
- Role and permissions
- Current workload
- Availability
- Skills/expertise
- Performance metrics

### 3.5 Toolkit Requirements
**Consulting Resources:**
- Methodology guides
- Industry frameworks
- Best practices
- Case studies

**Templates:**
- Proposal templates
- Contract templates
- Presentation templates
- Report templates

**Tools:**
- Financial calculators
- Project planning tools
- Communication templates
- Assessment frameworks

## 4. Technical Specifications

### 4.1 User Interface
- Clean, minimal design
- Mobile-responsive
- Dark/light mode toggle
- Customizable dashboard widgets
- Search functionality across all sections

### 4.2 Data Management
- Real-time updates
- Data export capabilities
- Integration with existing tools
- Backup and recovery
- Role-based access control

### 4.3 Performance
- Load time under 3 seconds
- Support for 50+ concurrent users
- 99.9% uptime
- Secure data transmission

## 5. User Permissions

### 5.1 Admin Level
- Full access to all sections
- User management
- System configuration
- Data export/import

### 5.2 Senior Consultant
- Full portfolio access
- Work hub management
- People management
- Toolkit access

### 5.3 Consultant
- Assigned work items
- Client contacts (assigned)
- Limited portfolio view
- Toolkit access

### 5.4 Analyst
- Read-only portfolio access
- Assigned work items
- Basic people access
- Toolkit access

## 6. Key Features

### 6.1 Dashboard Widgets
- Revenue counter
- Active work tracker
- Client health monitor
- Team workload visualizer
- Recent activity feed
- Quick actions panel

### 6.2 Smart Notifications
- Payment reminders
- Project deadlines
- Client touchpoint alerts
- Team availability changes
- New opportunities

### 6.3 Reporting
- Monthly portfolio reports
- Client performance reports
- Team productivity reports
- Revenue forecasting
- Custom report builder

## 7. Integration Requirements

### 7.1 Financial Systems
- Accounting software integration
- Payment processing
- Invoice generation
- Expense tracking

### 7.2 Communication
- Email integration
- Calendar synchronization
- Video conferencing links
- Document sharing

### 7.3 Project Management
- Task tracking
- Time logging
- File management
- Collaboration tools

## 8. Data Structure

### 8.1 Core Entities
- **Client**: Company, contacts, contracts, projects
- **Community Member**: Individual, company, investment details
- **Work Item**: Type (project/product/production), status, team, timeline
- **Revenue**: Amount, source, date, type
- **Team Member**: Profile, role, assignments, availability

### 8.2 Relationships
- Clients → Projects (1:many)
- Community Members → Companies (many:1)
- Work Items → Team Members (many:many)
- Revenue → Clients/Work Items (many:1)

## 9. Success Metrics

### 9.1 Usage Metrics
- Daily active users
- Time spent per session
- Feature adoption rates
- Mobile usage percentage

### 9.2 Business Metrics
- Revenue tracking accuracy
- Client satisfaction scores
- Project completion rates
- Team utilization rates

## 10. Implementation Priority

### Phase 1 (MVP)
- Basic dashboard
- Revenue tracking
- Simple work hub
- Client management
- User authentication

### Phase 2
- Advanced analytics
- Integration capabilities
- Mobile optimization
- Advanced reporting

### Phase 3
- AI insights
- Automation features
- Advanced customization
- API development

## 11. Naming Conventions

### 11.1 Work Categories

**Client Services**: Direct consulting, strategy, and implementation work for clients
- Billable engagements
- Scope-defined projects
- Ongoing retainers
- Advisory services

**Client Productions**: Creative and content work delivered to clients
- Marketing campaigns
- Content creation
- Events and experiences
- Brand development
- Always tied to a specific client

**The Lab**: Revenue-generating products developed and sold externally
- Market-facing products
- Subscription services
- Software solutions
- Managed by intelligent backlog
- Independent revenue streams

**Internal Tools**: Custom solutions built for specific clients
- Client-specific CRM systems (e.g., "Elevate" for Top Bins)
- Recruitment intelligence platforms
- Custom dashboards
- Proprietary tools branded for individual clients
- Not for external sale

### 11.2 People Categories
- **Clients**: Paying customers and their representatives
- **Community Members**: Investment portfolio contacts and stakeholders
- **Team Members**: Internal Greenlight staff