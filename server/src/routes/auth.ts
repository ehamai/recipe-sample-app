import { Router, Request, Response } from 'express';
import passport, { AuthenticateOptions } from 'passport';
import { User } from '../middleware/auth.js';

const router = Router();

// Extend AuthenticateOptions to include callbackURL (supported by passport-github2)
interface GitHubAuthenticateOptions extends AuthenticateOptions {
  callbackURL?: string;
  scope?: string[];
}

// Helper to get the base URL from the request
function getBaseUrl(req: Request): string {
  // Use X-Forwarded headers if behind a proxy (common in production)
  const protocol = req.get('X-Forwarded-Proto') || req.protocol;
  const host = req.get('X-Forwarded-Host') || req.get('Host');
  return `${protocol}://${host}`;
}

// GET /api/auth/login - Initiate GitHub OAuth flow
router.get('/login', (req: Request, res: Response, next) => {
  const returnUrl = req.query.returnUrl as string || '/';
  
  // Store return URL in session for redirect after auth
  req.session.returnUrl = returnUrl;
  
  // Dynamically determine callback URL from the request
  const callbackURL = `${getBaseUrl(req)}/api/auth/callback`;
  
  const options: GitHubAuthenticateOptions = {
    scope: ['user:email'],
    callbackURL: callbackURL,
  };
  
  passport.authenticate('github', options)(req, res, next);
});

// GET /api/auth/callback - GitHub OAuth callback
router.get(
  '/callback',
  (req: Request, res: Response, next) => {
    // Use the same dynamic callback URL for consistency
    const callbackURL = `${getBaseUrl(req)}/api/auth/callback`;
    const options: GitHubAuthenticateOptions = {
      failureRedirect: '/login?error=auth_failed',
      callbackURL: callbackURL,
    };
    passport.authenticate('github', options)(req, res, next);
  },
  (req: Request, res: Response) => {
    // Store user in session
    if (req.user) {
      req.session.user = req.user as User;
    }
    
    // Redirect to stored return URL or home
    let returnUrl = req.session.returnUrl || '/';
    delete req.session.returnUrl;
    
    // In development, redirect to Vite dev server
    if (process.env.NODE_ENV !== 'production' && returnUrl.startsWith('/')) {
      returnUrl = `http://localhost:5173${returnUrl}`;
    }
    
    res.redirect(returnUrl);
  }
);

// GET /api/auth/user - Get current user info
router.get('/user', (req: Request, res: Response) => {
  if (!req.session?.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = req.session.user;
  
  // Return user info matching .NET API response format
  res.json({
    id: user.id,
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
  });
});

// POST /api/auth/logout - Log out user
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ error: 'Logout failed' });
      return;
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// Extend session type for returnUrl
declare module 'express-session' {
  interface SessionData {
    returnUrl?: string;
  }
}

export default router;
