import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

export const ThemeModeContext = createContext({
    mode: 'light',
    toggleTheme: () => {},
});

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);
    const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    return (
        <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeModeContext.Provider>
    );
}

export function useThemeMode() {
    return useContext(ThemeModeContext);
}
import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff9800',
            light: '#ffc947',
            dark: '#c66900',
            contrastText: '#000',
        },
        secondary: {
            main: '#ffb74d',
            light: '#ffe97d',
            dark: '#c88719',
            contrastText: '#000',
        },
        background: {
            default: '#1a1a1a',
            paper: '#232323',
        },
        text: {
            primary: '#f59d19ff',
            secondary: '#ff9800',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                }
            }
        }
    }
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#ff9800',
            light: '#ffc947',
            dark: '#c66900', 
            contrastText: '#fff',
        },
        secondary: {
            main: '#ffb74d',
            light: '#ffe97d',
            dark: '#c88719',
            contrastText: '#fff',
        },
        background: {
            default: '#fff8f0',
            paper: '#fff',
        },
        text: {
            primary: '#ff9800',
            secondary: '#f59d19ff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                }
            }
        }
    }
});