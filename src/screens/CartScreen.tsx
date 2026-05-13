import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Modal, Platform, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, CreateOrderResponse } from '../services/OrderService';
import { formatCurrency, formatDate } from '../constants/util';
import Header from '../components/Header';
import Footer from '../components/Footer';
export default function CartScreen() {
    const { theme } = useAppTheme();
    const { items, removeFromCart, clearCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const [confirmModal, setConfirmModal] = useState<{ visible: boolean; title: string; message: string; onConfirm: () => void }>({
        visible: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });
    const [orderModal, setOrderModal] = useState<{ visible: boolean; loading: boolean; order: CreateOrderResponse | null; rawResponse: string | null }>({
        visible: false,
        loading: false,
        order: null,
        rawResponse: null,
    });
    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        if (Platform.OS === 'web') {
            setConfirmModal({ visible: true, title, message, onConfirm });
        } else {
            Alert.alert(title, message, [
                { text: 'Cancelar', style: 'cancel' },
                { text: title === 'Eliminar producto' ? 'Eliminar' : title === 'Confirmar Pedido' ? 'Confirmar' : 'Vaciar', style: 'destructive', onPress: onConfirm },
            ]);
        }
    };
    const handleClearCart = () => {
        showConfirm('Vaciar carrito', '¿Estás seguro de que deseas vaciar el carrito?', () => clearCart());
    };
    const handleRemoveItem = (id: number, name: string) => {
        showConfirm('Eliminar producto', `¿Eliminar ${name} del carrito?`, () => removeFromCart(id));
    };
    const handleCheckoutRequest = () => {
        const total = formatCurrency(items.map((i) => i.quantity * i.price).reduce((a, b) => a + b, 0));
        const message = `${items.length} producto(s) por un total de ${total}. ¿Confirmar pedido?`;
        showConfirm('Confirmar Pedido', message, executeCheckout);
    };
    const executeCheckout = async () => {
        if (!user || !user.id) {
            Alert.alert('Error', 'Debes iniciar sesión para realizar un pedido.');
            return;
        }

        setOrderModal({ visible: true, loading: true, order: null, rawResponse: null });
        try {
            // Calculamos el total de los items actuales en el carrito
            const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            
            // Llamamos a nuestro nuevo servicio de Supabase con el ID real
            const response = await createOrder(user.id, totalAmount, items);
            
            setOrderModal({
                visible: true,
                loading: false,
                order: {
                    ...response,
                    products: items,
                    discountedTotal: totalAmount,
                    totalProducts: items.length,
                    totalQuantity: items.reduce((acc, item) => acc + item.quantity, 0)
                } as any,
                rawResponse: JSON.stringify(response, null, 2),
            });
        } catch (error: any) {
            setOrderModal({ visible: true, loading: false, order: null, rawResponse: null });
            console.error('Error al procesar pedido:', error);
            // Mostramos el mensaje de error que viene de Supabase para saber qué pasa
            Alert.alert('Error al Procesar', error.message || 'No se pudo completar el pedido.');
        }
    };
    const handleCloseConfirm = () => setConfirmModal({ visible: false, title: '', message: '', onConfirm: () => {} });
    const handleConfirmAction = () => {
        confirmModal.onConfirm();
        handleCloseConfirm();
    };
    const handleCloseOrderModal = () => {
        setOrderModal({ visible: false, loading: false, order: null, rawResponse: null });
        clearCart();
    };
    if (items.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <Header />
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={theme.colors.textMuted} />
                    <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>Tu carrito está vacío</Text>
                    <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Agrega productos para comenzar</Text>
                </View>
                <Footer />
            </View>
        );
    }
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Header />
            <ScrollView style={styles.content}>
                <View style={styles.cartHeader}>
                    <Text style={[styles.cartTitle, { color: theme.colors.text }]}>
                        Mi Carrito ({items.length} item{items.length !== 1 ? 's' : ''})
                    </Text>
                    <TouchableOpacity onPress={handleClearCart}>
                        <Text style={[styles.clearText, { color: theme.colors.warning }]}>Vaciar</Text>
                    </TouchableOpacity>
                </View>
                {items.map((item) => (
                    <View key={item.id} style={[styles.cartItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Image
                            source={{ uri: item.thumbnail }}
                            style={styles.itemImage}
                            resizeMode="contain"
                        />
                        <View style={styles.itemInfo}>
                            <Text style={[styles.itemName, { color: theme.colors.text }]}>{item.name}</Text>
                            <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>{formatCurrency(item.price)}</Text>
                        </View>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={[styles.qtyButton, { borderColor: theme.colors.border }]}
                                onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                                <Ionicons name="remove" size={16} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                            <Text style={[styles.qtyText, { color: theme.colors.text }]}>{item.quantity}</Text>
                            <TouchableOpacity
                                style={[styles.qtyButton, { borderColor: theme.colors.border }]}
                                onPress={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                                <Ionicons name="add" size={16} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => handleRemoveItem(item.id, item.name)}
                        >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={[styles.cartFooter, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                <View style={styles.totalRow}>
                    <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Total:</Text>
                    <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                        {formatCurrency(items.map((i) => i.quantity * i.price).reduce((a, b) => a + b, 0))}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.checkoutButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleCheckoutRequest}
                >
                    <Ionicons name="bag-check-outline" size={20} color="#FFF" />
                    <Text style={styles.checkoutButtonText}>Realizar Pedido</Text>
                </TouchableOpacity>
            </View>
            <Footer />

            <Modal visible={confirmModal.visible} transparent animationType="fade" onRequestClose={handleCloseConfirm}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{confirmModal.title}</Text>
                        <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>{confirmModal.message}</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, { borderColor: theme.colors.border }]} onPress={handleCloseConfirm}>
                                <Text style={[styles.modalButtonText, { color: theme.colors.textSecondary }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.colors.primary }]} onPress={handleConfirmAction}>
                                <Text style={styles.modalButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={orderModal.visible} transparent animationType="slide" onRequestClose={handleCloseOrderModal}>
                <View style={styles.orderModalOverlay}>
                    <View style={[styles.orderModalContent, { backgroundColor: theme.colors.surface }]}>
                        {orderModal.loading ? (
                            <>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <Text style={[styles.orderModalTitle, { color: theme.colors.text }]}>Procesando pedido...</Text>
                            </>
                        ) : orderModal.order ? (
                            <ScrollView style={styles.orderScroll} showsVerticalScrollIndicator={false}>
                                <View style={[styles.orderIconContainer, { backgroundColor: theme.colors.success + '15' }]}>
                                    <Ionicons name="checkmark-circle" size={60} color={theme.colors.success} />
                                </View>
                                <Text style={[styles.orderModalTitle, { color: theme.colors.text }]}>¡Pedido Confirmado!</Text>
                                <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>
                                    {formatDate(new Date())} · Pedido #{orderModal.order.id}
                                </Text>
                                <View style={[styles.orderSummary, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                                    {orderModal.order.products.map((p, index) => (
                                        <View key={index} style={styles.orderItem}>
                                            <View style={styles.orderItemInfo}>
                                                <Text style={[styles.orderItemName, { color: theme.colors.text }]}>{p.name}</Text>
                                                <Text style={[styles.orderItemQty, { color: theme.colors.textSecondary }]}>
                                                    Cant: {p.quantity} · {formatCurrency(p.price)} c/u
                                                </Text>
                                            </View>
                                            <Text style={[styles.orderItemTotal, { color: theme.colors.primary }]}>
                                                {formatCurrency(p.price * p.quantity)}
                                            </Text>
                                        </View>
                                    ))}
                                    <View style={[styles.orderTotalRow, { borderTopColor: theme.colors.border }]}>
                                        <Text style={[styles.orderTotalLabel, { color: theme.colors.text }]}>Total:</Text>
                                        <Text style={[styles.orderTotalValue, { color: theme.colors.primary }]}>
                                            {formatCurrency(orderModal.order.discountedTotal)}
                                        </Text>
                                    </View>
                                    <Text style={[styles.orderItemsCount, { color: theme.colors.textSecondary }]}>
                                        {orderModal.order.totalProducts} producto(s) · {orderModal.order.totalQuantity} unidad(es)
                                    </Text>
                                </View>

                                <Text style={[styles.rawSectionTitle, { color: theme.colors.primary }]}>Respuesta del Servidor</Text>
                                <ScrollView style={[styles.rawResponseContainer, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]} showsVerticalScrollIndicator={false}>
                                    <Text style={[styles.rawResponseText, { color: theme.colors.text }]}>{orderModal.rawResponse}</Text>
                                </ScrollView>

                                <TouchableOpacity
                                    style={[styles.orderCloseButton, { backgroundColor: theme.colors.primary }]}
                                    onPress={handleCloseOrderModal}
                                >
                                    <Ionicons name="checkmark" size={20} color="#FFF" />
                                    <Text style={styles.orderCloseButtonText}>Entendido</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        ) : (
                            <>
                                <Ionicons name="alert-circle-outline" size={60} color={theme.colors.warning} />
                                <Text style={[styles.orderModalTitle, { color: theme.colors.text }]}>Error al Procesar</Text>
                                <Text style={[styles.orderErrorText, { color: theme.colors.textSecondary }]}>
                                    No se pudo completar el pedido. Inténtalo de nuevo.
                                </Text>
                                <TouchableOpacity
                                    style={[styles.orderCloseButton, { backgroundColor: theme.colors.primary }]}
                                    onPress={handleCloseOrderModal}
                                >
                                    <Text style={styles.orderCloseButtonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    content: { flex: 1, padding: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
    emptySubtext: { fontSize: 15, marginTop: 8 },
    cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cartTitle: { fontSize: 20, fontWeight: '900' },
    clearText: { fontSize: 14, fontWeight: '600' },
    cartItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 10 },
    itemImage: { width: 48, height: 48, borderRadius: 12, marginRight: 12 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '600' },
    itemPrice: { fontSize: 14, fontWeight: '700', marginTop: 4 },
    quantityControls: { flexDirection: 'row', alignItems: 'center', marginRight: 10, gap: 8 },
    qtyButton: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    qtyText: { fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center' },
    removeButton: { padding: 5 },
    cartFooter: { padding: 16, borderTopWidth: 1, gap: 10 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 18, fontWeight: '600' },
    totalValue: { fontSize: 22, fontWeight: '900' },
    checkoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 14, gap: 8 },
    checkoutButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { width: '100%', maxWidth: 400, padding: 24, borderRadius: 16 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    modalMessage: { fontSize: 15, marginBottom: 24, lineHeight: 22 },
    modalButtons: { flexDirection: 'row', gap: 12 },
    modalButton: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
    modalButtonText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
    orderModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
    orderModalContent: { width: '100%', maxWidth: 420, maxHeight: '85%', padding: 28, borderRadius: 20, alignItems: 'center' },
    orderScroll: { width: '100%', flexGrow: 0 },
    orderIconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    orderModalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
    orderDate: { fontSize: 13, marginBottom: 20 },
    orderSummary: { width: '100%', borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
    orderItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    orderItemInfo: { flex: 1 },
    orderItemName: { fontSize: 14, fontWeight: '600' },
    orderItemQty: { fontSize: 12, marginTop: 2 },
    orderItemTotal: { fontSize: 14, fontWeight: '700', marginLeft: 10 },
    orderTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14, marginTop: 4, borderTopWidth: 1 },
    orderTotalLabel: { fontSize: 18, fontWeight: '700' },
    orderTotalValue: { fontSize: 20, fontWeight: '900' },
    orderItemsCount: { fontSize: 12, marginTop: 8, textAlign: 'center' },
    rawSectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    rawResponseContainer: { width: '100%', maxHeight: 200, borderRadius: 10, borderWidth: 1, padding: 12, marginBottom: 16 },
    rawResponseText: { fontSize: 11, fontFamily: 'monospace', lineHeight: 16 },
    orderErrorText: { fontSize: 15, marginBottom: 24, textAlign: 'center' },
    orderCloseButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 12, width: '100%', gap: 8 },
    orderCloseButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
