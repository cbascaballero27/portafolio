import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Verificar el tema guardado en localStorage o la preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = (newTheme) => {
    setIsTransitioning(true);
    const themeToSet = newTheme || (theme === 'dark' ? 'light' : 'dark');
    
    // Agregar clase de transición al body
    document.body.classList.add('theme-transition');
    
    // Cambiar el tema después de un pequeño retraso para permitir la transición
    setTimeout(() => {
      setTheme(themeToSet);
      localStorage.setItem('theme', themeToSet);
      document.documentElement.classList.toggle('dark', themeToSet === 'dark');
      
      // Remover la clase de transición después de que se complete
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
        setIsTransitioning(false);
      }, 300);
    }, 50);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme, isTransitioning }}>
      <div className={`theme-transition ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 