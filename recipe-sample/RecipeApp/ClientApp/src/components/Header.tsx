import { useAuth } from '../context/AuthContext';

export function Header() {
  const { user, loading, login, logout } = useAuth();

  return (
    <header className="bg-emerald-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🍳 Recipe Generator</h1>
        <div>
          {loading ? (
            <span className="text-emerald-200">Loading...</span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span>{user.name || user.login}</span>
              <button
                onClick={logout}
                className="bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded font-semibold"
            >
              Login with GitHub
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
