import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Product } from '../services/ProductService';
import { formatCurrency } from '../constants/util';
interface CheckoutModalProps {
    visible: boolean;
    product?: Product | null;
    onClose: () => void;
}
export default function CheckoutModal({ visible, product, onClose }: CheckoutModalProps) {
    const { theme } = useAppTheme();
    const { addToCart, clearCart } = useCart();
    if (!product) return null;
    const handleAddToCart = () => {
        addToCart(product);
        Alert.alert('Éxito', `${product.name} añadido al carrito`);
        onClose();
    };
    const handleBuyNow = () => {
        addToCart(product);
        Alert.alert('Compra realizada', `Has comprado: ${product.name}`);
        clearCart();
        onClose();
    };
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Checkout</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.content}>
                    <View style={[styles.productCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Image
                            source={{ uri: product.thumbnail }}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                        <View style={styles.productInfo}>
                            <Text style={[styles.productName, { color: theme.colors.text }]}>{product.name}</Text>
                            <Text style={[styles.productBrand, { color: theme.colors.textSecondary }]}>Marca: {product.brand}</Text>
                            <Text style={[styles.productPrice, { color: theme.colors.primary }]}>{formatCurrency(product.price)}</Text>
                            <Text style={[styles.productStock, { color: theme.colors.success }]}>Stock: {product.stock}</Text>
                        </View>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>Resumen</Text>
                        <View style={[styles.summaryRow, { borderBottomColor: theme.colors.border }]}>
                            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Producto</Text>
                            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>{product.name}</Text>
                        </View>
                        <View style={[styles.summaryRow, { borderBottomColor: theme.colors.border }]}>
                            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Precio</Text>
                            <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>{formatCurrency(product.price)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Cantidad</Text>
                            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>1</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={[styles.footer, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                        onPress={handleAddToCart}
                    >
                        <Ionicons name="cart-outline" size={20} color={theme.colors.primary} />
                        <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>Añadir al Carrito</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleBuyNow}
                    >
                        <Ionicons name="card-outline" size={20} color="#FFF" />
                        <Text style={styles.primaryButtonText}>Comprar Ahora</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    title: { fontSize: 24, fontWeight: '900' },
    closeButton: { padding: 5 },
    content: { flex: 1, padding: 20 },
    productCard: { flexDirection: 'row', padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
    productImage: { width: 70, height: 70, borderRadius: 14, marginRight: 16 },
    productInfo: { flex: 1, justifyContent: 'center' },
    productName: { fontSize: 20, fontWeight: 'bold' },
    productBrand: { fontSize: 14, marginTop: 4 },
    productPrice: { fontSize: 20, fontWeight: 'bold', marginTop: 6 },
    productStock: { fontSize: 13, fontWeight: '600', marginTop: 2 },
    summaryCard: { padding: 20, borderRadius: 16, borderWidth: 1 },
    summaryTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
    summaryLabel: { fontSize: 15, fontWeight: '500' },
    summaryValue: { fontSize: 15, fontWeight: '600' },
    footer: { flexDirection: 'row', padding: 20, paddingTop: 15, gap: 12, borderTopWidth: 1, paddingBottom: 40 },
    secondaryButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, gap: 8 },
    secondaryButtonText: { fontSize: 15, fontWeight: '700' },
    primaryButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 14, gap: 8 },
    primaryButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
