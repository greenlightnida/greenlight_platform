// Core Types
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface User extends BaseEntity {
  email: string
  name: string
  domain: string
  groups: string[]
  permissions: string[]
}

export interface GoogleUser {
  email: string
  name: string
  picture?: string
  domain: string
  groups: string[]
}

// Service Types
export interface ServiceResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  metadata?: Record<string, unknown>
}

export interface PaginatedResponse<T> extends ServiceResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Component Types
export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: unknown
  stack?: string
}

// Configuration Types
export interface AppConfig {
  environment: 'development' | 'production' | 'test'
  port: number
  database: {
    url: string
    type: 'postgres' | 'mysql' | 'sqlite'
  }
  auth: {
    jwtSecret: string
    google: {
      clientId: string
      clientSecret: string
    }
  }
  services: {
    github: {
      token: string
      owner: string
      repo: string
    }
    supabase: {
      url: string
      anonKey: string
    }
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Event Types
export interface EventEmitter {
  on(event: string, listener: (...args: unknown[]) => void): this
  off(event: string, listener: (...args: unknown[]) => void): this
  emit(event: string, ...args: unknown[]): boolean
}

// Logger Types
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  context?: Record<string, unknown>
  error?: Error
}

// API Types
export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  headers?: Record<string, string>
  body?: unknown
  params?: Record<string, string>
}

export interface ApiResponse<T = unknown> {
  status: number
  data: T
  headers: Record<string, string>
  error?: string
}

// Database Types
export interface DatabaseConnection {
  connect(): Promise<void>
  disconnect(): Promise<void>
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>
  transaction<T>(fn: (connection: DatabaseConnection) => Promise<T>): Promise<T>
}

// Validation Types
export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  value?: unknown
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// File Types
export interface FileInfo {
  name: string
  path: string
  size: number
  type: string
  lastModified: Date
}

export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

// Top Bins types removed - these belong in the Top_Bins/top-bins workspace

// Player and Coaching Types
export interface Player extends BaseEntity {
  name: string
  email: string
  position: string
  team: string
  stats: Record<string, unknown>
  progress: PlayerProgress
}

export interface PlayerProgress {
  id: string
  playerId: string
  category: string
  score: number
  date: Date
  notes?: string
  technical: number
  tactical: number
  physical: number
  mental: number
}

export interface CampCohort extends BaseEntity {
  name: string
  startDate: Date
  endDate: Date
  players: Player[]
  coaches: User[]
  status: 'active' | 'completed' | 'cancelled'
}

// Import and Context Types
export interface ImportContext {
  id?: string
  name?: string
  importType: ImportType
  entryPoint: EntryPoint
  sourceCoach?: string
  sourceProgram?: string
  marketingCampaign?: string
  notes?: string
  data?: Record<string, unknown>
}

export type ImportType = 'csv' | 'json' | 'api' | 'manual' | 'coach_recruitment' | 'company_program' | 'manual_entry' | 'bulk_import';
export type EntryPoint = 'file' | 'url' | 'database' | 'form' | 'coach_referral' | 'marketing_campaign' | 'direct_registration' | 'partner_program' | 'internal_development';

// Note: Photo and Media types are defined in the Top Bins workspace
// See: platforms/greenlight-platform/media/MediaLibrary/types.ts