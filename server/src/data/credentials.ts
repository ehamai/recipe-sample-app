// In-memory credential store for GitHub OAuth
// Values are lazily initialized from environment variables on first access

interface Credentials {
  clientId: string | null;
  clientSecret: string | null;
}

const credentials: Credentials = {
  clientId: null,
  clientSecret: null,
};

let initialized = false;

function ensureInitialized(): void {
  if (!initialized) {
    credentials.clientId = process.env.GITHUB_CLIENT_ID || null;
    credentials.clientSecret = process.env.GITHUB_CLIENT_SECRET || null;
    initialized = true;
  }
}

export function getCredentials(): Credentials {
  ensureInitialized();
  return { ...credentials };
}

export function setCredentials(clientId: string, clientSecret: string): void {
  credentials.clientId = clientId;
  credentials.clientSecret = clientSecret;
  initialized = true;
}

export function isConfigured(): boolean {
  ensureInitialized();
  return !!(credentials.clientId && credentials.clientSecret);
}
