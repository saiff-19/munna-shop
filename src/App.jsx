import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    return document.body.getAttribute('data-theme') === 'dark';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return { isDark, toggleTheme };
}

function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Check local storage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else if (savedTheme === 'light') {
      document.body.removeAttribute('data-theme');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.setAttribute('data-theme', 'dark');
    }
  }, []);

  return (
    <>
      {user ? <Dashboard /> : <Auth />}
    </>
  );
}

export default App;
