// google-auth-service.ts
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

// @ts-ignore
import { GOOGLE_OAUTH_CONFIG } from '../../config/google-workspace/oauth-config';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  domain: string;
  groups: string[];
}

export class GoogleAuthService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new OAuth2Client(
      GOOGLE_OAUTH_CONFIG.clientId,
      GOOGLE_OAUTH_CONFIG.clientSecret,
      GOOGLE_OAUTH_CONFIG.redirectUri
    );
  }

  async authenticateUser(token: string): Promise<GoogleUser> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_OAUTH_CONFIG.clientId
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      // Verify domain
      if (payload.hd !== GOOGLE_OAUTH_CONFIG.hostedDomain) {
        throw new Error('Unauthorized domain');
      }

      // Get user groups
      if (!payload.email) throw new Error('Missing email in Google payload');
      if (!payload.name) throw new Error('Missing name in Google payload');
      if (!payload.hd) throw new Error('Missing domain in Google payload');
      const groups = await this.getUserGroups(payload.email);

      const user: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        domain: payload.hd,
        groups: groups
      };
      if (payload.picture) {
        user.picture = payload.picture;
      }
      return user;
    } catch (error) {
      console.error('Google authentication failed:', error);
      throw new Error('Authentication failed');
    }
  }

  private async getUserGroups(email: string): Promise<string[]> {
    try {
      // Use Google Admin SDK to get user groups
      const admin = google.admin({ version: 'directory_v1' });
      const response: any = await admin.groups.list({
        userKey: email,
        auth: this.oauth2Client as any
      });
      
      return response.data.groups?.map((g: any) => g.email) || [];
    } catch (error) {
      console.error('Failed to get user groups:', error);
      return [];
    }
  }

  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: GOOGLE_OAUTH_CONFIG.accessType,
      scope: GOOGLE_OAUTH_CONFIG.scopes,
      prompt: GOOGLE_OAUTH_CONFIG.prompt,
      hd: GOOGLE_OAUTH_CONFIG.hostedDomain
    });
  }
}