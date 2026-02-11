import { Button } from '@fluentui/react-components';
import { PersonAccounts24Regular } from '@fluentui/react-icons';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🍳</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Recipe Generator</h1>
        <p className="text-gray-600 mb-8">
          Create delicious recipes from ingredients you have on hand, powered by AI.
        </p>
        <Button
          appearance="primary"
          size="large"
          icon={<PersonAccounts24Regular />}
          onClick={login}
          style={{ 
            backgroundColor: '#059669', 
            borderColor: '#059669',
            padding: '12px 32px',
            fontSize: '16px'
          }}
        >
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}
