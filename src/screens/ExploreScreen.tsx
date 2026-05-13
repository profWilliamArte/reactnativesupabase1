import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { searchProducts, Product } from '../services/ProductService';
import { formatCurrency, truncateText } from '../constants/util';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutModal from '../components/CheckoutModal';
export default function ExploreScreen() {
    const navigation = useNavigation<any>();
    const { theme } = useAppTheme();
    const { addToCart, isInCart, getCartQuantity } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [checkoutVisible, setCheckoutVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                setSearched(true);
                try {
                    const data = await searchProducts(query);
                    setResults(data);
                } catch (error) {
                    console.error('Error searching:', error);
                } finally {
                    setLoading(false);
                }
            } else if (query.trim() === '') {
                setResults([]);
                setSearched(false);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const handleQuickAdd = (product: Product) => {
        addToCart(product);
    };

    const handleProductPress = (product: Product) => {
        setSelectedProduct(product);
        setCheckoutVisible(true);
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={[styles.productCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => handleProductPress(item)}
        >
            <Image
                source={{ uri: item.thumbnail }}
                style={styles.productImage}
                resizeMode="contain"
            />
            <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: theme.colors.text }]} numberOfLines={2}>
                    {truncateText(item.name, 30)}
                </Text>
                <View style={styles.nameRow}>
                    <Text style={[styles.productBrand, { color: theme.colors.textSecondary }]}>
                        {item.brand} · {item.category}
                    </Text>
                    {isInCart(item.id) && (
                        <View style={[styles.cartBadge, { backgroundColor: theme.colors.success }]}>
                            <Ionicons name="cart" size={11} color="#FFF" />
                            <Text style={styles.cartBadgeText}>{getCartQuantity(item.id)}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.productRow}>
                    <Text style={[styles.productPrice, { color: theme.colors.primary }]}>
                        {formatCurrency(item.price)}
                    </Text>
                    <View style={styles.productActions}>
                        <TouchableOpacity
                            style={[styles.addBtn, { backgroundColor: theme.colors.primary + '15' }]}
                            onPress={() => handleQuickAdd(item)}
                        >
                            <Ionicons name="add" size={18} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.favBtn, { backgroundColor: theme.colors.warning + '15' }]}
                            onPress={() => toggleFavorite(item)}
                        >
                            <Ionicons
                                name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
                                size={18}
                                color={isFavorite(item.id) ? theme.colors.warning : theme.colors.textMuted}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Header />
            
            <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="search" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: theme.colors.text }]}
                    placeholder="Buscar productos, marcas, categorías..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="none"
                    returnKeyType="search"
                    onSubmitEditing={() => Keyboard.dismiss()}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery('')}>
                        <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>Buscando...</Text>
                </View>
            ) : searched && results.length > 0 ? (
                <>
                    <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>
                        {results.length} resultado{results.length !== 1 ? 's' : ''} para "{query}"
                    </Text>
                    <FlatList
                        data={results}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderProduct}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            ) : searched && results.length === 0 ? (
                <View style={styles.centerContent}>
                    <Ionicons name="search" size={60} color={theme.colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Sin resultados</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                        No encontramos productos para "{query}"
                    </Text>
                </View>
            ) : (
                <View style={styles.centerContent}>
                    <Ionicons name="compass-outline" size={60} color={theme.colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Explorar Productos</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                        Busca por nombre, marca o categoría
                    </Text>
                </View>
            )}
            <Footer />

            <CheckoutModal
                visible={checkoutVisible}
                product={selectedProduct}
                onClose={() => setCheckoutVisible(false)}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        marginBottom: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 15, paddingVertical: 2 },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    loadingText: { marginTop: 12, fontSize: 15 },
    emptyTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 16 },
    emptySubtitle: { fontSize: 14, marginTop: 6, textAlign: 'center' },
    resultsCount: { fontSize: 13, marginHorizontal: 16, marginBottom: 8 },
    listContent: { paddingHorizontal: 16, paddingBottom: 20 },
    productCard: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 10,
    },
    productImage: { width: 70, height: 70, borderRadius: 10, marginRight: 14 },
    productInfo: { flex: 1, justifyContent: 'center' },
    productName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    productBrand: { fontSize: 12, marginBottom: 4 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    cartBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 6, gap: 2 },
    cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    productRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productPrice: { fontSize: 15, fontWeight: '700' },
    productActions: { flexDirection: 'row', gap: 6 },
    addBtn: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    favBtn: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
});
