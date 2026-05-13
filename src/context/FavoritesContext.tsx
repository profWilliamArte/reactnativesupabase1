import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../services/ProductService';
interface FavoritesContextType {
    favorites: Product[];
    addToFavorites: (product: Product) => void;
    removeFromFavorites: (productId: number) => void;
    isFavorite: (productId: number) => boolean;
    toggleFavorite: (product: Product) => void;
    favoritesCount: number;
}
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const saved = await AsyncStorage.getItem('favorites');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Error loading favorites:', e);
        } finally {
            setLoaded(true);
        }
    };

    const saveFavorites = async (updated: Product[]) => {
        try {
            await AsyncStorage.setItem('favorites', JSON.stringify(updated));
        } catch (e) {
            console.error('Error saving favorites:', e);
        }
    };

    const addToFavorites = (product: Product) => {
        setFavorites((prev) => {
            if (prev.find((p) => p.id === product.id)) return prev;
            const updated = [...prev, product];
            saveFavorites(updated);
            return updated;
        });
    };

    const removeFromFavorites = (productId: number) => {
        setFavorites((prev) => {
            const updated = prev.filter((p) => p.id !== productId);
            saveFavorites(updated);
            return updated;
        });
    };

    const isFavorite = (productId: number) => {
        return favorites.some((p) => p.id === productId);
    };

    const toggleFavorite = (product: Product) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    const favoritesCount = favorites.length;

    if (!loaded) return null;

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite, favoritesCount }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
    return context;
};
