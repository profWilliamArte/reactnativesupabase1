import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lightTheme, darkTheme } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
type ThemeType = typeof lightTheme;
interface ThemeContextType {
    theme: ThemeType;
    isDark: boolean;
    toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(false);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        loadTheme();
    }, []);
    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme === 'dark') setIsDark(true);
        } catch (e) {
            console.error('Error loading theme:', e);
        } finally {
            setLoaded(true);
        }
    };
    const toggleTheme = async () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        try {
            await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (e) {
            console.error('Error saving theme:', e);
        }
    };
    const theme = isDark ? darkTheme : lightTheme;
    if (!loaded) return null;
    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useAppTheme must be used within a ThemeProvider');
    return context;
};