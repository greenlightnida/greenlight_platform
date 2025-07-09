# Greenlight Platform Implementation Plan

## Phase 1: Foundation Setup (Months 1-3)

### Step 1: Development Environment Setup
**Duration:** 1 week

#### 1.1 Create GitHub Repository
- **Action:** Create new GitHub repository
- **Link:** https://github.com/new
- **Settings:** Enable GitHub Actions, branch protection rules
- **Required:** Set up `.gitignore` for Node.js projects

#### 1.2 Initialize Next.js Project
```bash
npx create-next-app@latest greenlight-platform --typescript --tailwind --eslint --app
cd greenlight-platform
```
- **Documentation:** https://nextjs.org/docs/getting-started/installation
- **Config:** Enable App Router, TypeScript, Tailwind CSS

#### 1.3 Set Up Supabase Backend
- **Action:** Create Supabase project
- **Link:** https://supabase.com/dashboard
- **Required Info:**
  - Database URL: `postgresql://[user]:[password]@[host]:[port]/[dbname]`
  - API URL: `https://[project-id].supabase.co`
  - Anon Key: Found in project settings
  - Service Role Key: Found in project settings

#### 1.4 Install Core Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-ui-react
npm install zustand framer-motion d3 @types/d3
npm install lucide-react recharts
npm install @headlessui/react @heroicons/react
```

### Step 2: Database Schema Design
**Duration:** 2 weeks

#### 2.1 Create Core Tables
**Supabase SQL Editor:** https://supabase.com/dashboard/project/[project-id]/sql

```sql
-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'entity',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entities table (up to 150 limit)
CREATE TABLE public.entities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  owner_id UUID REFERENCES public.users(id),
  status TEXT DEFAULT 'active',
  revenue_target DECIMAL(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue tracking table
CREATE TABLE public.revenue_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES public.entities(id),
  amount DECIMAL(12,2) NOT NULL,
  source TEXT NOT NULL,
  date DATE NOT NULL,
  mercury_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  entity_id UUID REFERENCES public.entities(id),
  status TEXT DEFAULT 'planning',
  budget DECIMAL(12,2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2.2 Set Up Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Entities visible to owners" ON public.entities
  FOR SELECT USING (auth.uid() = owner_id);
```

### Step 3: Authentication System
**Duration:** 1 week

#### 3.1 Set Up Supabase Auth
**Documentation:** https://supabase.com/docs/guides/auth/quickstarts/nextjs

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 3.2 Create Auth Components
- **Login Page:** `/app/login/page.tsx`
- **Sign Up Page:** `/app/signup/page.tsx`
- **Auth Middleware:** `/middleware.ts`
- **Auth Hook:** `/hooks/useAuth.ts`

### Step 4: Core Dashboard Framework
**Duration:** 2 weeks

#### 4.1 Create Dashboard Layout
```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-64">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
```

#### 4.2 Set Up State Management
```typescript
// store/useStore.ts
import { create } from 'zustand'

interface Store {
  user: User | null
  entities: Entity[]
  selectedEntity: Entity | null
  setUser: (user: User) => void
  setEntities: (entities: Entity[]) => void
  setSelectedEntity: (entity: Entity) => void
}

export const useStore = create<Store>((set) => ({
  user: null,
  entities: [],
  selectedEntity: null,
  setUser: (user) => set({ user }),
  setEntities: (entities) => set({ entities }),
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),
}))
```

## Phase 2: Core Features (Months 4-6)

### Step 5: Revenue Optimization Engine
**Duration:** 3 weeks

#### 5.1 Mercury API Integration
**Mercury API Documentation:** https://docs.mercury.com/

```typescript
// lib/mercury.ts
const MERCURY_API_URL = 'https://api.mercury.com/api/v1'

export async function getMercuryTransactions(accountId: string) {
  const response = await fetch(`${MERCURY_API_URL}/accounts/${accountId}/transactions`, {
    headers: {
      'Authorization': `Bearer ${process.env.MERCURY_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })
  return response.json()
}
```

**Required Endpoints:**
- `GET /accounts` - List all accounts
- `GET /accounts/{id}/transactions` - Get account transactions
- `GET /accounts/{id}/balance` - Get account balance
- `POST /payments` - Create payment
- `GET /payments/{id}` - Get payment details

#### 5.2 Real-Time Revenue Dashboard
```typescript
// components/RevenueDashboard.tsx
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function RevenueDashboard() {
  const [revenueData, setRevenueData] = useState([])
  
  useEffect(() => {
    // Subscribe to real-time revenue updates
    const subscription = supabase
      .channel('revenue-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'revenue_records' },
        (payload) => {
          // Update revenue data
          fetchRevenueData()
        }
      )
      .subscribe()
    
    return () => subscription.unsubscribe()
  }, [])
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
      <LineChart width={800} height={400} data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
      </LineChart>
    </div>
  )
}
```

### Step 6: People Infrastructure System
**Duration:** 3 weeks

#### 6.1 Entity Management System
```typescript
// pages/api/entities.ts
import { supabase } from '@/lib/supabase'

export default async function handler(req, res) {
  const { method } = req
  
  switch (method) {
    case 'GET':
      const { data: entities } = await supabase
        .from('entities')
        .select('*')
        .limit(150) // Enforce 150 entity limit
      res.status(200).json(entities)
      break
      
    case 'POST':
      // Check entity count before creating
      const { count } = await supabase
        .from('entities')
        .select('*', { count: 'exact', head: true })
      
      if (count >= 150) {
        return res.status(400).json({ error: 'Entity limit reached' })
      }
      
      const { data: newEntity } = await supabase
        .from('entities')
        .insert([req.body])
        .select()
      
      res.status(201).json(newEntity)
      break
  }
}
```

#### 6.2 Entity Onboarding Workflow
```typescript
// components/EntityOnboarding.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'

const OnboardingSteps = [
  'Basic Information',
  'Legal Structure',
  'Performance Goals',
  'Integration Setup'
]

export default function EntityOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [entityData, setEntityData] = useState({})
  const router = useRouter()
  
  const handleNext = () => {
    if (currentStep < OnboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      createEntity(entityData)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {OnboardingSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                index <= currentStep ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
              }`}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Step content */}
      <div className="bg-white rounded-lg shadow p-6">
        {renderStepContent(currentStep, entityData, setEntityData)}
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {currentStep === OnboardingSteps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  )
}
```

### Step 7: Product Development Pipeline
**Duration:** 2 weeks

#### 7.1 Project Management System
```typescript
// components/ProjectPipeline.tsx
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const ProjectStatuses = ['Backlog', 'Planning', 'In Progress', 'Testing', 'Deployed']

export default function ProjectPipeline() {
  const [projects, setProjects] = useState({})
  
  const handleDragEnd = (result) => {
    if (!result.destination) return
    
    const { source, destination } = result
    
    // Update project status in database
    updateProjectStatus(result.draggableId, destination.droppableId)
  }
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 overflow-x-auto p-4">
        {ProjectStatuses.map(status => (
          <div key={status} className="flex-shrink-0 w-72">
            <h3 className="font-semibold text-gray-700 mb-3">{status}</h3>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 rounded-lg p-3 min-h-[200px]"
                >
                  {projects[status]?.map((project, index) => (
                    <Draggable key={project.id} draggableId={project.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded-lg p-3 mb-2 shadow-sm"
                        >
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-gray-600">{project.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
```

## Phase 3: Advanced Features (Months 7-9)

### Step 8: Advanced Visualizations
**Duration:** 4 weeks

#### 8.1 D3.js Integration
```typescript
// components/visualizations/RevenueFlowChart.tsx
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function RevenueFlowChart({ data }) {
  const svgRef = useRef(null)
  
  useEffect(() => {
    if (!data) return
    
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    
    const width = 800
    const height = 400
    const margin = { top: 20, right: 30, bottom: 40, left: 40 }
    
    // Create Sankey diagram
    const sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
    
    const graph = sankey(data)
    
    // Draw links
    svg.append('g')
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('fill', 'none')
    
    // Draw nodes
    svg.append('g')
      .selectAll('rect')
      .data(graph.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#000')
    
  }, [data])
  
  return <svg ref={svgRef} width={800} height={400} />
}
```

#### 8.2 Interactive Data Exploration
```typescript
// components/visualizations/InteractiveChart.tsx
import { useState, useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function InteractiveChart({ data }) {
  const [filters, setFilters] = useState({
    dateRange: [new Date('2024-01-01'), new Date('2024-12-31')],
    entityTypes: ['all'],
    revenueRange: [0, 1000000]
  })
  
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const date = new Date(item.date)
      return date >= filters.dateRange[0] && 
             date <= filters.dateRange[1] &&
             item.revenue >= filters.revenueRange[0] &&
             item.revenue <= filters.revenueRange[1]
    })
  }, [data, filters])
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4 flex space-x-4">
        <DateRangePicker 
          value={filters.dateRange} 
          onChange={(range) => setFilters({...filters, dateRange: range})}
        />
        <RangeSlider
          label="Revenue Range"
          value={filters.revenueRange}
          onChange={(range) => setFilters({...filters, revenueRange: range})}
          min={0}
          max={1000000}
        />
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart data={filteredData}>
          <XAxis dataKey="investment" />
          <YAxis dataKey="revenue" />
          <ZAxis dataKey="entities" range={[60, 400]} />
          <Tooltip />
          <Scatter fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
```

### Step 9: AI Integration
**Duration:** 3 weeks

#### 9.1 Predictive Analytics
```typescript
// lib/analytics.ts
export async function generateRevenueForcast(entityId: string, months: number) {
  const historicalData = await getRevenueHistory(entityId)
  
  // Simple linear regression for forecasting
  const forecast = calculateLinearTrend(historicalData, months)
  
  return {
    predictions: forecast,
    confidence: calculateConfidenceInterval(historicalData),
    insights: generateInsights(historicalData, forecast)
  }
}

function calculateLinearTrend(data: any[], months: number) {
  // Implementation of linear regression
  const n = data.length
  const sumX = data.reduce((sum, item, index) => sum + index, 0)
  const sumY = data.reduce((sum, item) => sum + item.revenue, 0)
  const sumXY = data.reduce((sum, item, index) => sum + (index * item.revenue), 0)
  const sumXX = data.reduce((sum, item, index) => sum + (index * index), 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  return Array.from({ length: months }, (_, i) => ({
    month: i + n,
    predictedRevenue: slope * (i + n) + intercept
  }))
}
```

#### 9.2 Anomaly Detection
```typescript
// lib/anomalyDetection.ts
export function detectAnomalies(data: any[], threshold: number = 2) {
  const values = data.map(item => item.value)
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const stdDev = Math.sqrt(
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  )
  
  return data.filter(item => {
    const zScore = Math.abs(item.value - mean) / stdDev
    return zScore > threshold
  }).map(item => ({
    ...item,
    anomalyScore: Math.abs(item.value - mean) / stdDev,
    severity: Math.abs(item.value - mean) / stdDev > 3 ? 'high' : 'medium'
  }))
}

// Real-time anomaly monitoring
export function setupAnomalyMonitoring() {
  supabase
    .channel('anomaly-detection')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'revenue_records' },
      async (payload) => {
        const recentData = await getRecentData(payload.new.entity_id)
        const anomalies = detectAnomalies(recentData)
        
        if (anomalies.length > 0) {
          await sendAnomalyAlert(anomalies)
        }
      }
    )
    .subscribe()
}
```

### Step 10: Client Infrastructure (Top Bins Example)
**Duration:** 2 weeks

#### 10.1 Elevate CRM System
```typescript
// components/TopBins/ElevateCRM.tsx
export default function ElevateCRM() {
  const [players, setPlayers] = useState([])
  const [events, setEvents] = useState([])
  const [recruitmentPipeline, setRecruitmentPipeline] = useState([])
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Player Database</h2>
        <PlayerDatabase 
          players={players} 
          onPlayerUpdate={handlePlayerUpdate}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recruitment Pipeline</h2>
        <RecruitmentPipeline 
          pipeline={recruitmentPipeline}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Event Management</h2>
        <EventManagement 
          events={events}
          onEventCreate={handleEventCreate}
        />
      </div>
    </div>
  )
}
```

## Phase 4: Scale & Optimize (Months 10-12)

### Step 11: Performance Optimization
**Duration:** 3 weeks

#### 11.1 Database Optimization
```sql
-- Create indexes for better query performance
CREATE INDEX idx_revenue_records_entity_date ON revenue_records(entity_id, date);
CREATE INDEX idx_projects_entity_status ON projects(entity_id, status);
CREATE INDEX idx_entities_owner_status ON entities(owner_id, status);

-- Create materialized view for dashboard aggregations
CREATE MATERIALIZED VIEW entity_revenue_summary AS
SELECT 
    e.id,
    e.name,
    COUNT(rr.id) as transaction_count,
    SUM(rr.amount) as total_revenue,
    AVG(rr.amount) as avg_transaction,
    MAX(rr.date) as last_transaction_date
FROM entities e
LEFT JOIN revenue_records rr ON e.id = rr.entity_id
GROUP BY e.id, e.name;

-- Set up automatic refresh
SELECT cron.schedule('refresh-revenue-summary', '0 */6 * * *', 'REFRESH MATERIALIZED VIEW entity_revenue_summary;');
```

#### 11.2 Caching Strategy
```typescript
// lib/cache.ts
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedData<T>(key: string, fetcher: () => Promise<T>, ttl: number = 3600): Promise<T> {
  const cached = await redis.get(key)
  
  if (cached) {
    return JSON.parse(cached)
  }
  
  const data = await fetcher()
  await redis.setex(key, ttl, JSON.stringify(data))
  
  return data
}

// Usage example
export async function getEntityRevenue(entityId: string) {
  return getCachedData(
    `entity-revenue-${entityId}`,
    () => fetchEntityRevenueFromDB(entityId),
    1800 // 30 minutes
  )
}
```

### Step 12: Security Implementation
**Duration:** 2 weeks

#### 12.1 Enhanced Authentication
```typescript
// lib/auth.ts
import { supabase } from './supabase'

export async function setupMFA(userId: string) {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp'
  })
  
  return { data, error }
}

export async function verifyMFA(factorId: string, code: string) {
  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    code
  })
  
  return { data, error }
}
```

#### 12.2 Security Monitoring
```typescript
// lib/security.ts
export async function logSecurityEvent(event: SecurityEvent) {
  await supabase.from('security_logs').insert({
    event_type: event.type,
    user_id: event.userId,
    ip_address: event.ipAddress,
    user_agent: event.userAgent,
    details: event.details,
    severity: event.severity
  })
  
  // Send alert for high severity events
  if (event.severity === 'high') {
    await sendSecurityAlert(event)
  }
}

// Monitor for suspicious activities
export function setupSecurityMonitoring() {
  supabase
    .channel('security-monitoring')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'security_logs' },
      async (payload) => {
        await analyzeSecurityEvent(payload.new)
      }
    )
    .subscribe()
}
```

### Step 13: Deployment & Monitoring
**Duration:** 2 weeks

#### 13.1 Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "MERCURY_API_KEY": "@mercury-api-key"
  },
  "functions": {
    "pages/api/**/*": {
      "runtime": "nodejs18.x"
    }
  }
}
```

#### 13.2 Monitoring Setup
```typescript
// lib/monitoring.ts
export function setupMonitoring() {
  // Error tracking
  window.addEventListener('error', (event) => {
    logError({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    })
  })
  
  // Performance monitoring
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'navigation') {
        logPerformance({
          type: 'page-load',
          duration: entry.duration,
          path: window.location.pathname
        })
      }
    })
  }).observe({ entryTypes: ['navigation'] })
}
```

## Key Resources & Documentation

### Development Documentation
- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **D3.js:** https://d3js.org/
- **Recharts:** https://recharts.org/en-US/

### API Documentation
- **Mercury API:** https://docs.mercury.com/
- **Supabase API:** https://supabase.com/docs/reference/javascript/
- **Vercel API:** https://vercel.com/docs/rest-api

### Tools & Services
- **GitHub Actions:** https://docs.github.com/en/actions
- **Vercel Deployment:** https://vercel.com/docs
- **Supabase Console:** https://supabase.com/dashboard
- **Linear (UI Reference):** https://linear.app/

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MERCURY_API_KEY=your_mercury_api_key
REDIS_URL=your_redis_connection_string
```

This plan provides atomic, step-by-step instructions with all necessary technical details, endpoints, and documentation links needed for successful implementation.