import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../constants/util';
import CheckoutModal from './CheckoutModal';
import { Product } from '../services/ProductService';
interface CartBottomSheetProps {
    onClose?: () => void;
}
export default function CartBottomSheet({ onClose }: CartBottomSheetProps) {
    const { theme } = useAppTheme();
    const { items, updateQuantity, removeFromCart, totalItems } = useCart();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [checkoutVisible, setCheckoutVisible] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1 && onClose) {
            onClose();
        }
    }, [onClose]);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );
    const handleCheckout = (product: Product) => {
        setSelectedProduct(product);
        setCheckoutVisible(true);
    };
    if (items.length === 0) {
        return (
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={['15%']}
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                backgroundStyle={{ backgroundColor: theme.colors.surface }}
                handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
            >
                <BottomSheetView style={[styles.sheetView, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.emptyCart}>
                        <Ionicons name="cart-outline" size={40} color={theme.colors.textMuted} />
                        <Text style={[styles.emptyCartText, { color: theme.colors.textSecondary }]}>Tu carrito está vacío</Text>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        );
    }
    return (
        <>
            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                backgroundStyle={{ backgroundColor: theme.colors.surface }}
                handleIndicatorStyle={{ backgroundColor: theme.colors.textMuted }}
                onChange={handleSheetChanges}
            >
                <BottomSheetView style={[styles.sheetView, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            Carrito ({totalItems} item{totalItems !== 1 ? 's' : ''})
                        </Text>
                        <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
                            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemsContainer}>
                        {items.map((item) => (
                            <View key={item.id} style={[styles.cartItem, { borderBottomColor: theme.colors.border }]}>
                                <Image
                                    source={{ uri: item.thumbnail }}
                                    style={styles.itemImage}
                                    resizeMode="contain"
                                />
                                <View style={styles.itemInfo}>
                                    <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</Text>
                                    <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>{formatCurrency(item.price)}</Text>
                                </View>
                                <View style={styles.quantityControls}>
                                    <TouchableOpacity
                                        style={[styles.qtyButton, { borderColor: theme.colors.border }]}
                                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Ionicons name="remove" size={14} color={theme.colors.textSecondary} />
                                    </TouchableOpacity>
                                    <Text style={[styles.qtyText, { color: theme.colors.text }]}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={[styles.qtyButton, { borderColor: theme.colors.border }]}
                                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Ionicons name="add" size={14} color={theme.colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
                                    <Ionicons name="close" size={18} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity
                        style={[styles.checkoutButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => handleCheckout(items[0])}
                    >
                        <Ionicons name="card-outline" size={20} color="#FFF" />
                        <Text style={styles.checkoutButtonText}>Ir al Checkout</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheet>
            <CheckoutModal
                visible={checkoutVisible}
                product={selectedProduct}
                onClose={() => setCheckoutVisible(false)}
            />
        </>
    );
}
const styles = StyleSheet.create({
    sheetView: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: 10 },
    title: { fontSize: 18, fontWeight: '900' },
    emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyCartText: { fontSize: 14, marginTop: 8 },
    itemsContainer: { gap: 12, marginBottom: 16 },
    cartItem: { flexDirection: 'row', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1 },
    itemImage: { width: 40, height: 40, borderRadius: 10, marginRight: 12 },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 14, fontWeight: '600' },
    itemPrice: { fontSize: 13, fontWeight: '700', marginTop: 2 },
    quantityControls: { flexDirection: 'row', alignItems: 'center', marginRight: 8, gap: 6 },
    qtyButton: { width: 24, height: 24, borderRadius: 5, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    qtyText: { fontSize: 14, fontWeight: '700', minWidth: 18, textAlign: 'center' },
    removeButton: { padding: 4 },
    checkoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 12, gap: 8, marginTop: 10 },
    checkoutButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
