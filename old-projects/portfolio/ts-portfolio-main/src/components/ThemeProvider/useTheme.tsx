import { useContext } from 'react';
import { ThemeContext } from '.';

interface ThemeCtx {
  [key: string]: string;
}

export function useTheme() {
  const currentTheme: ThemeCtx = useContext(ThemeContext);
  return currentTheme;
}
