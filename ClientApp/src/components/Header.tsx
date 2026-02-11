import { useAuth } from '../context/AuthContext';
import { useTheme } from '../App';
import {
  Avatar,
  Button,
  Spinner,
  Tooltip,
} from '@fluentui/react-components';
import {
  WeatherMoon24Regular,
  WeatherSunny24Regular,
  PersonAccounts24Regular,
} from '@fluentui/react-icons';

export const Header = () => {
  const { user, loading, login, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
      <div className="max-w-content mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍳</span>
          <h1 className="text-xl font-semibold tracking-tight">Recipe Generator</h1>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip content={isDark ? 'Switch to light mode' : 'Switch to dark mode'} relationship="label">
            <Button
              appearance="subtle"
              icon={isDark ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
              onClick={toggleTheme}
              style={{ color: 'white' }}
            />
          </Tooltip>
          {loading ? (
            <Spinner size="small" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Avatar
                image={{ src: user.avatarUrl }}
                name={user.name || user.login}
                size={32}
              />
              <span className="hidden sm:inline font-medium">{user.name || user.login}</span>
              <Button 
                appearance="secondary" 
                onClick={logout}
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: 'none' }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              appearance="primary"
              icon={<PersonAccounts24Regular />}
              onClick={login}
              style={{ backgroundColor: 'white', color: '#059669' }}
            >
              Login with GitHub
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
