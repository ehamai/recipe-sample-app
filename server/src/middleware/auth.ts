import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { Request, Response, NextFunction } from 'express';
import { getCredentials, isConfigured } from '../data/credentials.js';

// User type stored in session
export interface User {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  accessToken: string;
}

// Extend Express User type for Passport
declare global {
  namespace Express {
    interface User {
      id: string;
      login: string;
      name: string;
      avatarUrl: string;
      accessToken: string;
    }
  }
}

// Extend Express Session to include user
declare module 'express-session' {
  interface SessionData {
    user?: User;
    accessToken?: string;
  }
}

// Configure Passport GitHub OAuth Strategy
export function configurePassport(): void {
  const credentials = getCredentials();
  const callbackURL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/callback';

  if (!isConfigured()) {
    console.warn('Warning: GitHub OAuth credentials not configured. Visit the app to set them up.');
    return; // Don't configure passport without credentials
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID: credentials.clientId || '',
        clientSecret: credentials.clientSecret || '',
        callbackURL: callbackURL,
      },
      (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: Error | null, user?: User) => void
      ) => {
        // Create user object with access token for Copilot API calls
        const user: User = {
          id: profile.id,
          login: profile.username || profile.displayName || '',
          name: profile.displayName || profile.username || '',
          avatarUrl: profile.photos?.[0]?.value || '',
          accessToken: accessToken,
        };
        return done(null, user);
      }
    )
  );

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
  });
}

// Reconfigure Passport after credentials are set at runtime
export function reconfigurePassport(): void {
  // Unregister existing strategy if any
  try {
    passport.unuse('github');
  } catch {
    // Strategy may not exist yet
  }
  
  // Configure with new credentials
  configurePassport();
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.user) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Get access token from session for Copilot API calls
export function getAccessToken(req: Request): string | undefined {
  return req.session?.user?.accessToken;
}
