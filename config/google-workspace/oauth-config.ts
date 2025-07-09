// oauth-config.ts
export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'https://greenlight.live/auth/google/callback',
  scopes: [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ],
  hostedDomain: 'greenlight.live', // Restrict to your domain
  accessType: 'offline',
  prompt: 'consent'
};

export const GOOGLE_ADMIN_CONFIG = {
  adminEmail: process.env.GOOGLE_ADMIN_EMAIL,
  serviceAccountKeyPath: process.env.GOOGLE_ADMIN_KEY_PATH,
  domain: 'greenlight.live',
  userGroups: {
    admins: 'greenlight-admins@greenlight.live',
    developers: 'greenlight-developers@greenlight.live',
    users: 'greenlight-users@greenlight.live'
  }
};

export const PLATFORM_URLS = {
  wikiHolon: 'https://wiki.greenlight.live',
  systemGovernance: 'https://greenlight.live',
  productPlatforms: 'https://www.topbinsid.com'
};