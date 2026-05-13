import { supabase } from '../lib/supabase';

export interface Product {
    id: number;
    name: string;
    price: number;
    category: number; // En Supabase es el ID de la categoría
    brand: string;
    stock: number;
    thumbnail: string;
    rating: number;
    description: string;
}

export interface Category {
    id: number;
    name: string;
}

// Mapeo de Supabase a nuestra interfaz de la Clase 7C
const mapSupabaseProduct = (p: any): Product => ({
    id: p.id,
    name: p.nombre,
    price: p.precio,
    category: p.idcategoria,
    brand: 'Genérico', // Supabase no tiene marca por ahora
    stock: 10,
    thumbnail: p.imagen || 'https://via.placeholder.com/150',
    rating: 4.5,
    description: p.descripcion || '',
});

export const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('categoria', { ascending: true });

    if (error) throw error;
    
    return data.map(c => ({
        id: c.id,
        name: c.categoria
    }));
};

export const getProductsByCategory = async (categoryId: number): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('idcategoria', categoryId)
        .order('nombre', { ascending: true });

    if (error) throw error;
    return data.map(mapSupabaseProduct);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
    if (!query.trim()) return [];
    
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .ilike('nombre', `%${query}%`)
        .order('nombre', { ascending: true });

    if (error) throw error;
    return data.map(mapSupabaseProduct);
};

export const getAllProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('nombre', { ascending: true });

    if (error) throw error;
    return data.map(mapSupabaseProduct);
};

export const clearCache = () => {
    // Supabase no necesita cache manual por ahora, 
    // pero dejamos la función para no romper la UI
};
