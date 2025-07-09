import fs from 'fs'
import path from 'path'

interface Config {
  port: number
  nodeEnv: string
  database: {
    url: string
    host: string
    port: number
    name: string
    user: string
    password: string
  }
  auth: {
    secret: string
    googleClientId: string
    googleClientSecret: string
  }
  api: {
    baseUrl: string
    corsOrigin: string
  }
}

export class ConfigManager {
  private config: Config = {
    port: 3000,
    nodeEnv: 'development',
    database: {
      url: '',
      host: 'localhost',
      port: 5432,
      name: 'greenlight',
      user: '',
      password: ''
    },
    auth: {
      secret: 'default-secret',
      googleClientId: '',
      googleClientSecret: ''
    },
    api: {
      baseUrl: 'http://localhost:3000',
      corsOrigin: '*'
    }
  }

  constructor() {
    this.loadConfig()
  }

  getConfig(): Config {
    return { ...this.config }
  }

  get<T extends keyof Config>(key: T): Config[T] {
    return this.config[key]
  }

  set<T extends keyof Config>(key: T, value: Config[T]): void {
    this.config[key] = value
  }

  private loadConfig(): void {
    try {
      // Load from environment variables first
      this.config = {
        ...this.config,
        ...this.loadFromEnv()
      }

      // Load from config files
      const configFiles = this.getConfigFiles()
      for (const file of configFiles) {
        const fileConfig = this.loadFromFile(file)
        if (fileConfig) {
          this.config = { ...this.config, ...fileConfig }
        }
      }

      // Validate configuration
      this.validateConfig()
    } catch (error) {
      console.error('Error loading configuration:', error)
      throw new Error('Failed to load configuration')
    }
  }

  private loadFromEnv(): Partial<Config> {
    return {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      nodeEnv: process.env.NODE_ENV ?? 'development',
      database: {
        url: process.env.DATABASE_URL || '',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        name: process.env.DB_NAME || 'greenlight',
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || ''
      },
      auth: {
        secret: process.env.AUTH_SECRET || 'default-secret',
        googleClientId: process.env.GOOGLE_CLIENT_ID || '',
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
      },
      api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
        corsOrigin: process.env.CORS_ORIGIN || '*'
      }
    }
  }

  private parseEnvFile(content: string): Record<string, string> {
    const envVars: Record<string, string> = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key] = valueParts.join('=');
        }
      }
    }
    
    return envVars;
  }

  private getConfigFiles(): string[] {
    const configDir = path.join(process.cwd(), 'config', 'environments');
    if (!fs.existsSync(configDir)) {
      return [];
    }
    return fs.readdirSync(configDir).filter(file => file.endsWith('.env'));
  }

  private loadFromFile(filePath: string): Partial<Config> | null {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const envVars = this.parseEnvFile(content);

    const config: Partial<Config> = {};
    // Initialize database with default values
    config.database = {
      url: '',
      host: 'localhost',
      port: 5432,
      name: 'greenlight',
      user: '',
      password: ''
    };
    
    // Initialize auth with default values
    config.auth = {
      secret: 'default-secret',
      googleClientId: '',
      googleClientSecret: ''
    };
    
    // Initialize api with default values
    config.api = {
      baseUrl: 'http://localhost:3000',
      corsOrigin: '*'
    };
    
    for (const key in envVars) {
      if (key.startsWith('PORT')) {
        config.port = envVars[key] ? parseInt(envVars[key], 10) : 3000;
      } else if (key.startsWith('NODE_ENV')) {
        config.nodeEnv = envVars[key] ?? 'development';
      } else if (key.startsWith('DATABASE_URL')) {
        config.database.url = envVars[key] ?? '';
      } else if (key.startsWith('DB_HOST')) {
        config.database.host = envVars[key] ?? 'localhost';
      } else if (key.startsWith('DB_PORT')) {
        config.database.port = envVars[key] ? parseInt(envVars[key], 10) : 5432;
      } else if (key.startsWith('DB_NAME')) {
        config.database.name = envVars[key] ?? 'greenlight';
      } else if (key.startsWith('DB_USER')) {
        config.database.user = envVars[key] ?? '';
      } else if (key.startsWith('DB_PASSWORD')) {
        config.database.password = envVars[key] ?? '';
      } else if (key.startsWith('AUTH_SECRET')) {
        config.auth.secret = envVars[key] ?? '';
      } else if (key.startsWith('GOOGLE_CLIENT_ID')) {
        config.auth.googleClientId = envVars[key] ?? '';
      } else if (key.startsWith('GOOGLE_CLIENT_SECRET')) {
        config.auth.googleClientSecret = envVars[key] ?? '';
      } else if (key.startsWith('API_BASE_URL')) {
        config.api.baseUrl = envVars[key] ?? '';
      } else if (key.startsWith('CORS_ORIGIN')) {
        config.api.corsOrigin = envVars[key] ?? '';
      }
    }
    return config;
  }

  private validateConfig(): void {
    // This is a placeholder for actual validation logic
    // In a real application, you would use a library like zod or joi
    console.log('Configuration validated.');
  }
}
