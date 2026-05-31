// import { createContext, useContext, useEffect, useState } from 'react';

// const ThemeContext = createContext();

// export function ThemeProvider({ children }) {
//   const [dark, setDark] = useState(() => {
//     const saved = localStorage.getItem('crps-theme');
//     return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
//   });

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', dark);
//     localStorage.setItem('crps-theme', dark ? 'dark' : 'light');
//   }, [dark]);

//   return (
//     <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export const useTheme = () => useContext(ThemeContext);
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check local storage or default to light mode
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const toggle = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};