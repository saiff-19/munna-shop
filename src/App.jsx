import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    };
    
    // Also listen to system preference changes if no saved theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        window.dispatchEvent(new Event('theme-changed'));
      }
    };

    window.addEventListener('theme-changed', handleThemeChange);
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newIsDark = document.documentElement.getAttribute('data-theme') !== 'dark';
    const newTheme = newIsDark ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('theme-changed'));
  };

  return { isDark, toggleTheme };
}

function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Initial sync in case the script in index.html set it before React hydrated
    window.dispatchEvent(new Event('theme-changed'));
  }, []);

  return (
    <>
      {user ? <Dashboard /> : <Auth />}
    </>
  );
}

export default App;
