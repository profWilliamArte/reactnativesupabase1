import { supabase } from '../lib/supabase';

export interface CartProduct {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    thumbnail: string;
}

export interface CreateOrderResponse {
    id: number;
    total: number;
    userId: string;
}

export interface OrderItem {
    id: number;
    quantity: number;
    price: number;
}

export const createOrder = async (userId: string, total: number, items: any[]): Promise<CreateOrderResponse> => {
    // 1. Insertar el pedido principal
    const { data: order, error: orderError } = await supabase
        .from('pedidos')
        .insert([{ 
            user_id: userId, 
            total: total,
            idestatus: 1
        }])
        .select('id, total, user_id')
        .single();

    if (orderError) {
        console.error('Error insertando pedido:', orderError);
        throw orderError;
    }

    // 2. Preparar los items
    const orderItems = items.map(item => ({
        pedido_id: order.id,
        producto_id: item.id,
        cantidad: item.quantity || item.cantidad,
        precio_unitario: item.price
    }));

    // 3. Insertar items
    const { error: itemsError } = await supabase
        .from('pedidos_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('Error insertando items:', itemsError);
        throw itemsError;
    }

    return {
        id: order.id,
        total: order.total,
        userId: order.user_id
    };
};

export const getUserOrders = async (userId: string) => {
    const { data, error } = await supabase
        .from('pedidos')
        .select('id, user_id, total, fecha, idestatus')
        .eq('user_id', userId)
        .order('fecha', { ascending: false });

    if (error) throw error;
    return data;
};

export const getOrderItems = async (orderId: number) => {
    const { data, error } = await supabase
        .from('pedidos_items')
        .select(`
            id,
            cantidad,
            precio_unitario,
            productos (
                nombre,
                imagen
            )
        `)
        .eq('pedido_id', orderId);

    if (error) throw error;
    return data;
};
