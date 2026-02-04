import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  TabList,
  Tab,
} from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { SavedRecipesPage } from './pages/SavedRecipesPage';

// Custom theme with very rounded corners (16px)
const roundedLightTheme: Theme = {
  ...webLightTheme,
  borderRadiusNone: '0',
  borderRadiusSmall: '8px',
  borderRadiusMedium: '16px',
  borderRadiusLarge: '16px',
  borderRadiusXLarge: '20px',
  borderRadiusCircular: '9999px',
};

const roundedDarkTheme: Theme = {
  ...webDarkTheme,
  borderRadiusNone: '0',
  borderRadiusSmall: '8px',
  borderRadiusMedium: '16px',
  borderRadiusLarge: '16px',
  borderRadiusXLarge: '20px',
  borderRadiusCircular: '9999px',
};

// Theme context
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname === '/saved' ? 'saved' : 'home';

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-content mx-auto px-4 py-2">
        <TabList
          selectedValue={currentTab}
          onTabSelect={(_, data) => {
            navigate(data.value === 'saved' ? '/saved' : '/');
          }}
        >
          <Tab value="home">Home</Tab>
          <Tab value="saved">Saved Recipes</Tab>
        </TabList>
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-pattern">
      <Header />
      <Navigation />
      <div className="max-w-content mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/saved" element={<SavedRecipesPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <FluentProvider theme={isDark ? roundedDarkTheme : roundedLightTheme}>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </FluentProvider>
    </ThemeContext.Provider>
  );
}

export default App;
