import { supabase } from '../lib/supabase';

export interface AuthUser {
    id: string; // En Supabase el ID es un UUID (string)
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    token: string;
}

export interface LoginCredentials {
    email: string; // Cambiamos username por email para Supabase
    password: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
    });

    if (error) {
        throw new Error(error.message === 'Invalid login credentials' 
            ? 'Correo o contraseña incorrectos' 
            : error.message);
    }

    const { user, session } = data;

    return {
        id: user.id,
        username: user.email?.split('@')[0] || 'usuario',
        firstName: 'Usuario',
        lastName: 'Supabase',
        email: user.email || '',
        image: 'https://via.placeholder.com/150',
        token: session?.access_token || '',
    };
};

export const getUserProfile = async (token: string): Promise<AuthUser | null> => {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return null;

    return {
        id: user.id,
        username: user.email?.split('@')[0] || 'usuario',
        firstName: 'Usuario',
        lastName: 'Supabase',
        email: user.email || '',
        image: 'https://via.placeholder.com/150',
        token: token,
    };
};
