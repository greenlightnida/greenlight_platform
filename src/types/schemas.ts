import { z } from 'zod'

// Base schemas
export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  name: z.string().min(1),
  domain: z.string().min(1),
  groups: z.array(z.string()),
  permissions: z.array(z.string())
})

export const GoogleUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  picture: z.string().url().optional(),
  domain: z.string().min(1),
  groups: z.array(z.string())
})

// Service schemas
export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    metadata: z.record(z.any()).optional()
  })

  ServiceResponseSchema(z.array(dataSchema)).extend({
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0)
    })
  })

// Component schemas
export const ComponentPropsSchema = z.object({
  className: z.string().optional(),
  children: z.any().optional()
})

export const ButtonPropsSchema = ComponentPropsSchema.extend({
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  disabled: z.boolean().optional(),
  onClick: z.function().optional()
})

// Form schemas
export const FormFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'email', 'password', 'number', 'select', 'textarea']),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional()
  }).optional()
})

// Error schemas
export const AppErrorSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.unknown().optional(),
  stack: z.string().optional()
})

// Configuration schemas
export const AppConfigSchema = z.object({
  environment: z.enum(['development', 'production', 'test']),
  port: z.number().int().min(1).max(65535),
  database: z.object({
    url: z.string().url(),
    type: z.enum(['postgres', 'mysql', 'sqlite'])
  }),
  auth: z.object({
    jwtSecret: z.string().min(1),
    google: z.object({
      clientId: z.string().min(1),
      clientSecret: z.string().min(1)
    })
  }),
  services: z.object({
    github: z.object({
      token: z.string().min(1),
      owner: z.string().min(1),
      repo: z.string().min(1)
    }),
    supabase: z.object({
      url: z.string().url(),
      anonKey: z.string().min(1)
    })
  })
})

// API schemas
export const ApiRequestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
  params: z.record(z.string()).optional()
})

  z.object({
    status: z.number().int().min(100).max(599),
    data: dataSchema,
    headers: z.record(z.string()),
    error: z.string().optional()
  })

// Validation schemas
export const ValidationRuleSchema = z.object({
  type: z.enum(['required', 'email', 'min', 'max', 'pattern', 'custom']),
  value: z.any().optional(),
  message: z.string().min(1)
})

export const ValidationResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(z.string())
})

// File schemas
export const FileInfoSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  size: z.number().int().min(0),
  type: z.string().min(1),
  lastModified: z.date()
})

export const FileUploadSchema = z.object({
  file: z.instanceof(File),
  progress: z.number().min(0).max(100),
  status: z.enum(['pending', 'uploading', 'completed', 'error']),
  error: z.string().optional()
})

// Environment schemas
export const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().optional(),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(1).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GITHUB_TOKEN: z.string().min(1).optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional()
})

// Import meta env schema
export const ImportMetaEnvSchema = z.object({
  VITE_GITHUB_OWNER: z.string().min(1),
  VITE_GITHUB_REPO: z.string().min(1),
  VITE_GITHUB_TOKEN: z.string().min(1),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1),
  VITE_GOOGLE_CLIENT_SECRET: z.string().min(1),
  PROD: z.boolean(),
  DEV: z.boolean()
})

// Export all schemas
export const schemas = {
  BaseEntity: BaseEntitySchema,
  User: UserSchema,
  GoogleUser: GoogleUserSchema,
  ComponentProps: ComponentPropsSchema,
  ButtonProps: ButtonPropsSchema,
  FormField: FormFieldSchema,
  AppError: AppErrorSchema,
  AppConfig: AppConfigSchema,
  ApiRequest: ApiRequestSchema,
  ValidationRule: ValidationRuleSchema,
  ValidationResult: ValidationResultSchema,
  FileInfo: FileInfoSchema,
  FileUpload: FileUploadSchema,
  Environment: EnvironmentSchema,
  ImportMetaEnv: ImportMetaEnvSchema
} as const

// Helper functions
  success,
  data,
  error: undefined,
  metadata: undefined
})

  success: false,
  data: undefined,
  error,
  metadata
})

// Type inference helpers
export type InferSchema<T extends z.ZodTypeAny> = z.infer<T>
export type User = InferSchema<typeof UserSchema>
export type GoogleUser = InferSchema<typeof GoogleUserSchema>
export type AppConfig = InferSchema<typeof AppConfigSchema>
export type AppError = InferSchema<typeof AppErrorSchema> 