import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutModal from '../components/CheckoutModal';
import { getProductsByCategory, Product } from '../services/ProductService';
import { formatCurrency } from '../constants/util';
export default function DetailsScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { theme } = useAppTheme();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { isInCart, getCartQuantity } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [checkoutVisible, setCheckoutVisible] = useState(false);
    
    const { category, title } = route.params || { title: 'Productos' };

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const data = await getProductsByCategory(category);
                setProducts(data);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [category]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Header showBack={true} />
            <ScrollView style={styles.container}>
                <View style={styles.mainContent}>
                    <View style={styles.titleRow}>
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()} 
                            style={[styles.miniBack, { backgroundColor: theme.colors.surface }]}
                        >
                            <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
                    </View>
                    
                    {!loading && (
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary, marginBottom: 15 }]}>
                            {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
                        </Text>
                    )}

                    {loading ? (
                        <View style={styles.emptyContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>Cargando productos...</Text>
                        </View>
                    ) : products.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={60} color={theme.colors.textMuted} />
                            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>No hay productos en esta categoría</Text>
                        </View>
                    ) : (
                        <View style={styles.listContainer}>
                            {products.map((item) => (
                                <View key={item.id} style={[styles.productCard, { backgroundColor: theme.colors.surface }]}>
                                    <Image
                                        source={{ uri: item.thumbnail }}
                                        style={styles.productImage}
                                        resizeMode="contain"
                                    />
                                    <View style={{ flex: 1, marginLeft: 15 }}>
                                        <View style={styles.nameRow}>
                                            <Text style={[styles.productName, { color: theme.colors.secondary }]}>{item.name}</Text>
                                            {isInCart(item.id) && (
                                                <View style={[styles.cartBadge, { backgroundColor: theme.colors.success }]}>
                                                    <Ionicons name="cart" size={12} color="#FFF" />
                                                    <Text style={styles.cartBadgeText}>{getCartQuantity(item.id)}</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.productBrand, { color: theme.colors.textMuted }]}>Marca: {item.brand}</Text>
                                        <Text style={[styles.productPrice, { color: theme.colors.primary }]}>{formatCurrency(item.price)}</Text>
                                        <Text style={[styles.productStock, { color: theme.colors.success }]}>Stock: {item.stock}</Text>
                                    </View>
                                    <View style={styles.cardActions}>
                                        <TouchableOpacity
                                            style={styles.favButton}
                                            onPress={() => toggleFavorite(item)}
                                        >
                                            <Ionicons
                                                name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
                                                size={22}
                                                color={isFavorite(item.id) ? theme.colors.warning : theme.colors.textMuted}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.viewButton, { backgroundColor: theme.colors.primary }]}
                                            onPress={() => {
                                                setSelectedProduct(item);
                                                setCheckoutVisible(true);
                                            }}
                                        >
                                            <Text style={styles.viewButtonText}>Añadir</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                    <TouchableOpacity 
                        style={[styles.backButton, { backgroundColor: theme.colors.secondary }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="apps-outline" size={20} color={theme.dark ? theme.colors.background : "#FFF"} style={{ marginRight: 10 }} />
                        <Text style={[styles.buttonText, { color: theme.dark ? theme.colors.background : "#FFF" }]}>Volver al Catálogo</Text>
                    </TouchableOpacity>
                </View>
                <Footer />
            </ScrollView>
            <CheckoutModal
                visible={checkoutVisible}
                product={selectedProduct}
                onClose={() => setCheckoutVisible(false)}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    mainContent: { padding: 24 },
    titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    subtitle: { fontSize: 14 },
    miniBack: { padding: 8, borderRadius: 10, marginRight: 15 },
    title: { fontSize: 28, fontWeight: '900' },
    listContainer: { gap: 12, marginBottom: 40 },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyText: { marginTop: 10, fontSize: 16 },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    productImage: { width: 60, height: 60, borderRadius: 12, marginRight: 15 },
    productName: { fontSize: 16, fontWeight: 'bold' },
    nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
    cartBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, gap: 2 },
    cartBadgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
    productBrand: { fontSize: 12, marginTop: 2 },
    productPrice: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
    productStock: { fontSize: 12, fontWeight: '600', marginTop: 2 },
    cardActions: { alignItems: 'center', gap: 8 },
    favButton: { padding: 6 },
    viewButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
    viewButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        marginBottom: 40,
    },
    buttonText: { fontWeight: 'bold', fontSize: 16 },
});
