import { EventEmitter } from 'events';

export interface TelemetryEvent {
  id: string;
  type: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export interface TelemetryMetric {
  name: string;
  value: number;
  tags?: string[];
  timestamp: Date;
}

export interface DataTelemetryState {
  events: TelemetryEvent[];
  metrics: TelemetryMetric[];
  lastEvent?: TelemetryEvent;
  lastMetric?: TelemetryMetric;
  streaming: boolean;
}

export class DataTelemetryManager extends EventEmitter {
  private state: DataTelemetryState;

  constructor() {
    super();
    this.state = {
      events: [],
      metrics: [],
      streaming: false
    };
  }

  public startStreaming(): void {
    this.state.streaming = true;
    this.emit('streamingStarted');
  }

  public stopStreaming(): void {
    this.state.streaming = false;
    this.emit('streamingStopped');
  }

  public recordEvent(type: string, payload: Record<string, unknown>): void {
    const event: TelemetryEvent = {
      id: Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9),
      type,
      timestamp: new Date(),
      payload
    };
    this.state.events.push(event);
    this.state.lastEvent = event;
    this.emit('telemetryEvent', event);
  }

  public recordMetric(name: string, value: number, tags?: string[]): void {
    const metric: TelemetryMetric = {
      name,
      value,
      tags,
      timestamp: new Date()
    };
    this.state.metrics.push(metric);
    this.state.lastMetric = metric;
    this.emit('telemetryMetric', metric);
  }

  public getEvents(): TelemetryEvent[] {
    return this.state.events;
  }

  public getMetrics(): TelemetryMetric[] {
    return this.state.metrics;
  }

  public getState(): DataTelemetryState {
    return this.state;
  }

  public clear(): void {
    this.state.events = [];
    this.state.metrics = [];
    this.state.lastEvent = undefined;
    this.state.lastMetric = undefined;
    this.emit('cleared');
  }

  public async healthCheck(): Promise<any> {
    return {
      streaming: this.state.streaming,
      totalEvents: this.state.events.length,
      totalMetrics: this.state.metrics.length,
      lastEvent: this.state.lastEvent,
      lastMetric: this.state.lastMetric,
      timestamp: new Date().toISOString()
    };
  }
} 