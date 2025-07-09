# Environment Configuration Guide

## Overview
This document provides guidance for setting up environment variables for the Greenlight Platform.

## Required Environment Variables

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `DB_HOST`: Database host (optional, can be in DATABASE_URL)
- `DB_PORT`: Database port (optional, can be in DATABASE_URL)
- `DB_NAME`: Database name (optional, can be in DATABASE_URL)
- `DB_USER`: Database username (optional, can be in DATABASE_URL)
- `DB_PASSWORD`: Database password (optional, can be in DATABASE_URL)

### Authentication
- `JWT_SECRET`: Secret key for JWT token signing
- `SESSION_SECRET`: Secret key for session management
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### Application Settings
- `NODE_ENV`: Environment (development, production, test)
- `PORT`: Server port number
- `FRONTEND_URL`: Frontend application URL
- `API_URL`: Backend API URL

### External Services
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SENTRY_DSN`: Sentry error tracking DSN

### Monitoring and Logging
- `LOG_LEVEL`: Logging level (debug, info, warn, error)
- `SENTRY_ENVIRONMENT`: Sentry environment name

## Setup Instructions

1. Copy `.env.example` to `.env.local`
2. Fill in your specific values
3. Never commit `.env.local` to version control
4. Use `.env.development` for development environment
5. Use `.env.production` for production environment

## Security Notes

- Keep all secrets secure and never commit them to version control
- Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Rotate secrets regularly in production
- Use environment-specific configurations

## Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure DATABASE_URL is correct and database is running
2. **Authentication**: Verify Google OAuth credentials are valid
3. **Port Conflicts**: Check if PORT is available
4. **Environment Variables**: Ensure all required variables are set

### Validation:
Run the health check script to validate your environment setup:
```bash
npm run health:check
```
