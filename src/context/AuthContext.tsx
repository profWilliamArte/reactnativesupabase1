import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, AuthUser, getUserProfile } from '../services/AuthService';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    user: AuthUser | null;
    loginError: string | null;
    loginLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // 1. Cargar sesión inicial
        const initializeAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const profile = await getUserProfile(session.access_token);
                if (profile) {
                    setUser(profile);
                    setIsAuthenticated(true);
                }
            }
            setLoaded(true);
        };

        initializeAuth();

        // 2. Escuchar cambios de estado en tiempo real
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const profile = await getUserProfile(session.access_token);
                setUser(profile);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const doLogin = async (email: string, password: string): Promise<boolean> => {
        setLoginLoading(true);
        setLoginError(null);
        try {
            const loggedUser = await login({ email, password });
            setUser(loggedUser);
            setIsAuthenticated(true);
            setLoginLoading(false);
            return true;
        } catch (e: any) {
            setLoginError(e.message || 'Error de conexión. Intenta de nuevo.');
            setLoginLoading(false);
            return false;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setUser(null);
        setLoginError(null);
    };

    if (!loaded) return null;

    return (
        <AuthContext.Provider value={{ isAuthenticated, login: doLogin, logout, user, loginError, loginLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
