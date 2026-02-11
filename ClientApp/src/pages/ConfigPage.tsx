import { useState } from 'react';
import {
  Card,
  Title1,
  Body1,
  Input,
  Button,
  Spinner,
  MessageBar,
  MessageBarBody,
  Label,
  Link,
} from '@fluentui/react-components';
import { Settings24Regular } from '@fluentui/react-icons';
import axios from 'axios';

export function ConfigPage() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientId.trim() || !clientSecret.trim()) {
      setError('Both Client ID and Client Secret are required');
      return;
    }

    setSaving(true);
    try {
      await axios.post('/api/config/credentials', {
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
      });
      window.location.reload();
    } catch (err) {
      setError('Failed to save credentials. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl" style={{ padding: '32px' }}>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Settings24Regular className="text-emerald-600" />
            </div>
            <Title1>First-time setup</Title1>
          </div>
          <Body1 className="text-gray-500">Configure GitHub OAuth to enable login functionality.</Body1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <MessageBar intent="error">
              <MessageBarBody>{error}</MessageBarBody>
            </MessageBar>
          )}

          <div className="space-y-2">
            <Label htmlFor="clientId" required style={{ fontWeight: 600 }}>
              GitHub Client ID
            </Label>
            <Input
              id="clientId"
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Ov23li..."
              style={{ width: '100%' }}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSecret" required style={{ fontWeight: 600 }}>
              GitHub Client Secret
            </Label>
            <Input
              id="clientSecret"
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="Enter your client secret"
              style={{ width: '100%' }}
              disabled={saving}
            />
          </div>

          <Button
            type="submit"
            appearance="primary"
            size="large"
            disabled={saving}
            style={{ 
              width: '100%', 
              backgroundColor: '#059669', 
              borderColor: '#059669',
              marginTop: '8px'
            }}
          >
            {saving ? <Spinner size="tiny" /> : 'Save & Continue'}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-200">
          <Body1 className="text-gray-500 text-sm leading-relaxed">
            Create a GitHub OAuth App at{' '}
            <Link
              href="https://github.com/settings/developers"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Developer Settings
            </Link>
            {' '}and set the callback URL to:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
              http://localhost:3000/api/auth/callback
            </code>
          </Body1>
        </div>
      </Card>
    </div>
  );
}
