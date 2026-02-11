import passport from 'passport';
import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { Request, Response, NextFunction } from 'express';

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
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const callbackURL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/callback';

  if (!clientId || !clientSecret) {
    console.warn('Warning: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not set');
  }

  passport.use(
    new GitHubStrategy(
      {
        clientID: clientId || '',
        clientSecret: clientSecret || '',
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
