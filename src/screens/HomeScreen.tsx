import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCategories, Category } from '../services/ProductService';
const CATEGORY_ICONS: Record<string, string> = {
    smartphones: 'smartphone-outline',
    laptops: 'laptop-outline',
    fragrances: 'flower-outline',
    skincare: 'water-outline',
    groceries: 'basket-outline',
    'home-decoration': 'home-outline',
    furniture: 'bed-outline',
    tops: 'shirt-outline',
    dresses: 'woman-outline',
    bottoms: 'walk-outline',
    watches: 'time-outline',
    footwear: 'footsteps-outline',
    sunglasses: 'eye-outline',
    automotive: 'car-outline',
    motorcycle: 'bicycle-outline',
    lighting: 'bulb-outline',
    tablets: 'tablet-landscape-outline',
    'smart-accessories': 'bluetooth-outline',
    beauty: 'sparkles-outline',
    'mens-shirts': 'man-outline',
    'mens-shoes': 'footsteps-outline',
    'mens-watches': 'time-outline',
    'womens-bags': 'bag-outline',
    'womens-dresses': 'woman-outline',
    'womens-jewellery': 'diamond-outline',
    'womens-shoes': 'footsteps-outline',
    'womens-watches': 'time-outline',
    'sports-accessories': 'basketball-outline',
    'internal-hard-drives': 'server-outline',
    'mobile-accessories': 'phone-portrait-outline',
    'skin-care': 'water-outline',
    'eye-care': 'eye-outline',
    'hair-care': 'cut-outline',
    'body-care': 'body-outline',
    'face-care': 'happy-outline',
    'lip-care': 'happy-outline',
    'hand-care': 'hand-left-outline',
    'foot-care': 'footsteps-outline',
    'health-care': 'medkit-outline',
    'food-drinks': 'restaurant-outline',
    'books': 'book-outline',
    'games': 'game-controller-outline',
    'toys': 'gift-outline',
    'baby-care': 'baby-outline',
    'pet-care': 'paw-outline',
    'garden': 'leaf-outline',
    'tools': 'construct-outline',
    'home-improvement': 'hammer-outline',
    'office-supplies': 'briefcase-outline',
    'stationery': 'create-outline',
    'art-supplies': 'brush-outline',
    'musical-instruments': 'musical-notes-outline',
    'electronics': 'hardware-chip-outline',
    'cameras': 'camera-outline',
    'audio': 'volume-high-outline',
    'tv': 'tv-outline',
    'video-games': 'game-controller-outline',
    'computer-accessories': 'desktop-outline',
    'networking': 'wifi-outline',
    'storage': 'save-outline',
    'printers': 'print-outline',
    'monitors': 'desktop-outline',
    'keyboards': 'keypad-outline',
    'mice': 'pointer-outline',
    'headphones': 'headset-outline',
    'speakers': 'speaker-outline',
    'microphones': 'mic-outline',
    'webcams': 'camera-reverse-outline',
    'chargers': 'flash-outline',
    'cables': 'link-outline',
    'cases': 'shield-outline',
    'screen-protectors': 'shield-checkmark-outline',
    'batteries': 'battery-charging-outline',
    'power-banks': 'battery-full-outline',
    'car-chargers': 'car-sport-outline',
    'wall-chargers': 'flash-outline',
    'wireless-chargers': 'bluetooth-outline',
    'usb-hubs': 'layers-outline',
    'docking-stations': 'desktop-outline',
    'adapters': 'swap-horizontal-outline',
    'converters': 'swap-vertical-outline',
    'hubs': 'git-network-outline',
    'routers': 'wifi-outline',
    'modems': 'radio-outline',
    'switches': 'toggle-outline',
    'firewalls': 'shield-outline',
    'access-points': 'wifi-outline',
    'range-extenders': 'signal-outline',
    'mesh-networks': 'grid-outline',
    'ethernet-cables': 'link-outline',
    'fiber-optics': 'flash-outline',
    'coaxial-cables': 'link-outline',
    'patch-cables': 'link-outline',
    'cross-connects': 'git-merge-outline',
    'face-plates': 'square-outline',
    'wall-plates': 'square-outline',
    'keystone-jacks': 'grid-outline',
    'couplers': 'git-network-outline',
    'splitters': 'git-branch-outline',
    'combiners': 'git-merge-outline',
    'amplifiers': 'volume-high-outline',
    'repeaters': 'repeat-outline',
    'transceivers': 'swap-horizontal-outline',
    'media-converters': 'swap-vertical-outline',
    'sfp-modules': 'hardware-chip-outline',
    'qsfp-modules': 'hardware-chip-outline',
    'xfp-modules': 'hardware-chip-outline',
    'sfp+-modules': 'hardware-chip-outline',
    'qsfp+-modules': 'hardware-chip-outline',
    'qsfp28-modules': 'hardware-chip-outline',
    'qsfp56-modules': 'hardware-chip-outline',
    'qsfpdd-modules': 'hardware-chip-outline',
    'osfp-modules': 'hardware-chip-outline',
    'cfp-modules': 'hardware-chip-outline',
    'cfp2-modules': 'hardware-chip-outline',
    'cfp4-modules': 'hardware-chip-outline',
    'cfp8-modules': 'hardware-chip-outline',
    'cfp16-modules': 'hardware-chip-outline',
    'cfp32-modules': 'hardware-chip-outline',
    'cfp64-modules': 'hardware-chip-outline',
    'cfp128-modules': 'hardware-chip-outline',
    'cfp256-modules': 'hardware-chip-outline',
    'cfp512-modules': 'hardware-chip-outline',
    'cfp1024-modules': 'hardware-chip-outline',
};
const CATEGORY_COLORS: Record<string, string> = {
    smartphones: '#007AFF',
    laptops: '#5856D6',
    fragrances: '#FF2D55',
    skincare: '#34C759',
    groceries: '#FF9500',
    'home-decoration': '#AF52DE',
    furniture: '#5AC8FA',
    tops: '#FF3B30',
    dresses: '#FF2D55',
    bottoms: '#007AFF',
    watches: '#5856D6',
    footwear: '#FF9500',
    sunglasses: '#FFCC00',
    automotive: '#8E8E93',
    motorcycle: '#FF3B30',
    lighting: '#FFCC00',
    tablets: '#5856D6',
    'smart-accessories': '#007AFF',
    beauty: '#FF2D55',
    'mens-shirts': '#5AC8FA',
    'mens-shoes': '#FF9500',
    'mens-watches': '#5856D6',
    'womens-bags': '#AF52DE',
    'womens-dresses': '#FF2D55',
    'womens-jewellery': '#FFCC00',
    'womens-shoes': '#FF3B30',
    'womens-watches': '#5856D6',
    'sports-accessories': '#34C759',
};
const FALLBACK_ICON = 'grid-outline';
const FALLBACK_COLOR = '#007AFF';
export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { theme } = useAppTheme();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true);
            try {
                const data = await getCategories();
                setCategories(data.slice(0, 20));
            } catch (error) {
                console.error('Error loading categories:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Header />
            
            <ScrollView style={styles.container}>
                <View style={styles.mainContent}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Catálogo 2026</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Selecciona una categoría para explorar</Text>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>Cargando categorías...</Text>
                        </View>
                    ) : (
                        <View style={styles.menuGrid}>
                            {categories.map((cat) => {
                                // Mapeo simple de iconos por nombre
                                const nameLower = cat.name.toLowerCase();
                                let icon = FALLBACK_ICON;
                                if (nameLower.includes('elec')) icon = 'hardware-chip-outline';
                                else if (nameLower.includes('depor')) icon = 'basketball-outline';
                                else if (nameLower.includes('hogar')) icon = 'home-outline';
                                else if (nameLower.includes('ropa')) icon = 'shirt-outline';
                                
                                const color = FALLBACK_COLOR;
                                return (
                                    <TouchableOpacity 
                                        key={cat.id}
                                        style={[styles.menuItem, { 
                                            borderLeftColor: color,
                                            backgroundColor: theme.colors.surface 
                                        }]}
                                        onPress={() => navigation.navigate('Details', { 
                                            category: cat.id, 
                                            title: cat.name 
                                        })}
                                    >
                                        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                                            <Ionicons name={icon as any} size={28} color={color} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{cat.name}</Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
                <Footer />
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    mainContent: { padding: 24, paddingTop: 20 },
    headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    headerSubtitle: { fontSize: 16, marginBottom: 30 },
    menuGrid: { gap: 15, marginBottom: 40 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 16,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: { flex: 1 },
    optionTitle: { fontSize: 18, fontWeight: 'bold' },
    optionDescription: { fontSize: 13, marginTop: 2 },
    loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    loadingText: { marginTop: 10, fontSize: 16 },
});
