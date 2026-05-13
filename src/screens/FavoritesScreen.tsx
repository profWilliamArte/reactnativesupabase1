import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { formatCurrency, truncateText } from '../constants/util';
import Header from '../components/Header';
import Footer from '../components/Footer';
export default function FavoritesScreen() {
    const navigation = useNavigation<any>();
    const { theme } = useAppTheme();
    const { favorites, removeFromFavorites } = useFavorites();
    const { addToCart } = useCart();

    const handleAddToCart = (product: any) => {
        addToCart(product);
    };

    const handleRemove = (id: number, name: string) => {
        removeFromFavorites(id);
    };

    const renderFavorite = ({ item }: { item: any }) => (
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Image
                source={{ uri: item.thumbnail }}
                style={styles.productImage}
                resizeMode="contain"
            />
            <View style={styles.info}>
                <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
                    {truncateText(item.name, 30)}
                </Text>
                <Text style={[styles.brand, { color: theme.colors.textSecondary }]}>
                    {item.brand}
                </Text>
                <Text style={[styles.price, { color: theme.colors.primary }]}>
                    {formatCurrency(item.price)}
                </Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.colors.primary + '15' }]}
                    onPress={() => handleAddToCart(item)}
                >
                    <Ionicons name="cart-outline" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: theme.colors.warning + '15' }]}
                    onPress={() => handleRemove(item.id, item.name)}
                >
                    <Ionicons name="heart-dislike-outline" size={18} color={theme.colors.warning} />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (favorites.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <Header />
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={80} color={theme.colors.textMuted} />
                    <Text style={[styles.emptyTitle, { color: theme.colors.textMuted }]}>Sin favoritos</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                        Toca el corazón en un producto para guardarlo
                    </Text>
                </View>
                <Footer />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Header />
            <View style={styles.headerRow}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                    Favoritos ({favorites.length})
                </Text>
            </View>
            <FlatList
                data={favorites}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderFavorite}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
            <Footer />
        </View>
    );
}
const styles = StyleSheet.create({
    headerRow: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
    title: { fontSize: 20, fontWeight: '900' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    emptyTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 16 },
    emptySubtitle: { fontSize: 14, marginTop: 6, textAlign: 'center' },
    listContent: { paddingHorizontal: 16, paddingBottom: 20 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 10,
    },
    productImage: { width: 60, height: 60, borderRadius: 10, marginRight: 12 },
    info: { flex: 1 },
    name: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    brand: { fontSize: 12 },
    price: { fontSize: 14, fontWeight: '700', marginTop: 4 },
    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});
