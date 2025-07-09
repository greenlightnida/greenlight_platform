import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Code, 
  FileText, 
  Settings, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap 
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Import UI components from the correct locations
import { Alert, AlertDescription } from '../../../design-system/components/ui/alert';
import { Badge } from '../../../design-system/components/ui/badge';
import { Button } from '../../../design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../design-system/components/ui/card';
import { Progress } from '../../../design-system/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../design-system/components/ui/tabs';

// Types
interface SystemStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  health: number;
  lastCheck: string;
  description: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  activeConnections: number;
  uptime: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

/**
 *
 */
export default function SystemMaster() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      name: 'Frontend',
      status: 'healthy',
      health: 85,
      lastCheck: '2025-07-08T21:15:00Z',
      description: 'React application running normally'
    },
    {
      name: 'Backend',
      status: 'warning',
      health: 65,
      lastCheck: '2025-07-08T21:15:00Z',
      description: 'API server needs attention'
    },
    {
      name: 'Database',
      status: 'healthy',
      health: 92,
      lastCheck: '2025-07-08T21:15:00Z',
      description: 'Database connections stable'
    },
    {
      name: 'File System',
      status: 'healthy',
      health: 88,
      lastCheck: '2025-07-08T21:15:00Z',
      description: 'File operations normal'
    }
  ]);

  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23,
    activeConnections: 12,
    uptime: '2d 14h 32m'
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'Backend API response time increased',
      timestamp: '2025-07-08T21:10:00Z',
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'System maintenance scheduled',
      timestamp: '2025-07-08T20:30:00Z',
      resolved: false
    }
  ]);

  // const getStatusIcon = () => {}; // Unused function


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SystemMaster</h1>
          <p className="text-muted-foreground">
            System governance and monitoring dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStatus.map((system) => (
              <Card key={system.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {system.name}
                  </CardTitle>
                  {getStatusIcon(system.status)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{system.health}%</div>
                  <p className="text-xs text-muted-foreground">
                    {system.description}
                  </p>
                  <Progress value={system.health} className="mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  System Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CPU Usage</span>
                    <span>{metrics.cpu}%</span>
                  </div>
                  <Progress value={metrics.cpu} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Memory Usage</span>
                    <span>{metrics.memory}%</span>
                  </div>
                  <Progress value={metrics.memory} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Disk Usage</span>
                    <span>{metrics.disk}%</span>
                  </div>
                  <Progress value={metrics.disk} />
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Uptime: {metrics.uptime}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Active Connections: {metrics.activeConnections}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  System Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Firewall Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SSL Certificate</span>
                    <Badge className="bg-green-100 text-green-800">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Access Control</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Real-time system monitoring and performance tracking.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <span>{alert.message}</span>
                    <Badge 
                      variant={alert.type === 'error' ? 'destructive' : 
                              alert.type === 'warning' ? 'secondary' : 'default'}
                    >
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="governance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Governance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                System governance policies and compliance monitoring.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 