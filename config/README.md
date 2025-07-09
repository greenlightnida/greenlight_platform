# 🔧 Configuration Management

## Professional Configuration Structure

This directory contains all configuration files for the Greenlight Platform, organized in a professional, secure manner.

## 📁 Directory Structure

```
config/
├── environments/           # Environment-specific configurations
│   ├── development.env     # Development environment variables
│   └── production.env      # Production environment variables
├── google-workspace/       # Google Workspace SSO configuration
│   └── oauth-config.json   # OAuth 2.0 and Admin SDK settings
├── security/              # Security policies and configurations
│   └── auth-policies.json  # Authentication and authorization policies
└── README.md              # This documentation file
```

## 🔐 Security Considerations

### **Sensitive Files (Gitignored)**
The following files contain sensitive information and are excluded from version control:

- `config/environments/*.env` - Environment variables with secrets
- `config/google-workspace/oauth-config.json` - OAuth credentials
- `config/security/auth-policies.json` - Security policies
- `*.json.key` - Service account keys
- `fine-elf-460516-g0-f6ddf6c8be67.json` - Google service account key

### **Safe Files (Version Controlled)**
These files contain non-sensitive configuration and are tracked:

- `config/README.md` - Documentation
- Template files with placeholder values

## 🚀 Environment Configuration

### **Development Environment**
File: `config/environments/development.env`

Contains development-specific settings:
- OAuth 2.0 credentials for testing
- Local database URLs
- Debug logging enabled
- Development ports and settings

### **Production Environment**
File: `config/environments/production.env`

Contains production settings with placeholders:
- Production OAuth credentials (to be filled)
- Production database URLs
- Security settings
- SSL certificate paths

## 🔑 Google Workspace Configuration

### **OAuth 2.0 Settings**
- Client ID and Secret
- Redirect URIs
- Hosted domain restrictions
- Required scopes

### **Admin SDK Settings**
- Service account email
- Key file path
- Admin API scopes

### **Platform Integration**
- Wiki Holon URL
- System Governance URL
- Product Platforms URL

### **User Groups**
- Admin group mapping
- Developer group mapping
- User group mapping

## 🛡️ Security Policies

### **Authentication Policies**
- Session management settings
- Password policies
- Multi-factor authentication
- Cookie security

### **Authorization Policies**
- Role-based access control
- Group-to-role mapping
- Permission definitions

### **Security Headers**
- HSTS configuration
- Content Security Policy
- X-Frame-Options
- Rate limiting settings

## 📋 Configuration Loading

The system uses a professional `ConfigManager` class that:

1. **Loads environment-specific files** based on `NODE_ENV`
2. **Validates configuration** on startup
3. **Provides type-safe access** to all settings
4. **Supports hot-reloading** for development
5. **Handles sensitive data** securely

### **Usage Example**
```typescript
import { configManager, getOAuthConfig } from './config/ConfigManager';

// Get OAuth configuration
const oauthConfig = getOAuthConfig();

// Validate configuration
if (!configManager.validate()) {
  throw new Error('Invalid configuration');
}
```

## 🔄 Environment Variable Override

Configuration can be overridden with environment variables:

```bash
# Override OAuth settings
export GOOGLE_OAUTH_CLIENT_ID=your-client-id
export GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

# Override Admin settings
export GOOGLE_ADMIN_EMAIL=your-admin-email
export GOOGLE_ADMIN_KEY_PATH=./your-key-file.json

# Override platform URLs
export WIKI_HOLON_URL=https://your-wiki-url
export SYSTEM_GOVERNANCE_URL=https://your-governance-url
export PRODUCT_PLATFORMS_URL=https://your-platforms-url
```

## 🚀 Deployment

### **Development Setup**
1. Copy `config/environments/development.env` to your working directory
2. Fill in your development credentials
3. Ensure service account key file is in the correct location

### **Production Setup**
1. Copy `config/environments/production.env` to your production server
2. Replace all placeholder values with production credentials
3. Set up SSL certificates and update paths
4. Configure monitoring and analytics

### **Security Checklist**
- [ ] All sensitive files are gitignored
- [ ] Environment variables are properly set
- [ ] Service account keys are secure
- [ ] SSL certificates are configured
- [ ] Security headers are enabled
- [ ] Rate limiting is configured
- [ ] Audit logging is enabled

## 📊 Configuration Validation

The `ConfigManager` validates:

- Required OAuth credentials
- Service account key file existence
- Valid URLs and domains
- Security policy consistency
- Environment-specific requirements

## 🔧 Troubleshooting

### **Common Issues**

1. **Configuration not found**
   - Check file paths in `config/` directory
   - Verify environment variable `NODE_ENV`

2. **Service account key not found**
   - Ensure key file exists at specified path
   - Check file permissions

3. **OAuth validation failed**
   - Verify client ID and secret
   - Check redirect URI configuration
   - Ensure hosted domain is correct

### **Debug Mode**
Enable debug logging by setting:
```bash
export LOG_LEVEL=debug
```

## 📚 Related Documentation

- [Google Workspace SSO Implementation](../GOOGLE_WORKSPACE_SSO_COMPLETION_SUMMARY.md)
- [System Architecture](../docs/architecture/SYSTEM_ARCHITECTURE.md)
- [Security Guidelines](../docs/security/SECURITY_GUIDELINES.md) 