import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { SavedRecipesPage } from './pages/SavedRecipesPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex gap-6 py-3">
                <Link to="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
                  Home
                </Link>
                <Link to="/saved" className="text-emerald-600 hover:text-emerald-800 font-medium">
                  Saved Recipes
                </Link>
              </div>
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/saved" element={<SavedRecipesPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
