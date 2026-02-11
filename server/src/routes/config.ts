import { Router } from 'express';
import { getCredentials, setCredentials, isConfigured } from '../data/credentials.js';
import { reconfigurePassport } from '../middleware/auth.js';

const router = Router();

// GET /api/config/status - Check if GitHub OAuth is configured
router.get('/status', (req, res) => {
  res.json({ configured: isConfigured() });
});

// POST /api/config/credentials - Set GitHub OAuth credentials
router.post('/credentials', (req, res) => {
  const { clientId, clientSecret } = req.body;

  if (!clientId || !clientSecret) {
    return res.status(400).json({ error: 'Both clientId and clientSecret are required' });
  }

  // Store credentials in memory
  setCredentials(clientId, clientSecret);

  // Reconfigure Passport with new credentials
  reconfigurePassport();

  console.log('GitHub OAuth credentials configured successfully');
  res.json({ success: true, configured: true });
});

export default router;
