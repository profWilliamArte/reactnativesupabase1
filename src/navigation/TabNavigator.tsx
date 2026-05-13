import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useCart } from '../context/CartContext';
import HomeStack from './HomeStack';
import ExploreScreen from '../screens/ExploreScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrderScreen from '../screens/OrderScreen';

const Tab = createBottomTabNavigator();
type DrawerParamList = {
    Tienda: undefined;
    Ajustes: undefined;
    Soporte: undefined;
};
type TabParamList = {
    Tienda: undefined;
    Explorar: undefined;
    Pedidos: undefined;
    Carrito: undefined;
    Favoritos: undefined;
    Perfil: undefined;
};
export default function TabNavigator() {
    const { theme } = useAppTheme();
    const { totalItems } = useCart();
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList> & BottomTabNavigationProp<TabParamList>>();
    
    // Eliminamos el useFocusEffect que forzaba ir a Tienda para permitir navegar libremente
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    if (route.name === 'Tienda') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Explorar') iconName = focused ? 'search' : 'search-outline';
                    else if (route.name === 'Pedidos') iconName = focused ? 'receipt' : 'receipt-outline';
                    else if (route.name === 'Carrito') iconName = focused ? 'cart' : 'cart-outline';
                    else if (route.name === 'Favoritos') iconName = focused ? 'heart' : 'heart-outline';
                    else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                },
                tabBarBadge: route.name === 'Carrito' && totalItems > 0 ? totalItems : undefined,
                tabBarBadgeStyle: {
                    backgroundColor: theme.colors.warning,
                    color: '#FFF',
                    fontSize: 11,
                    fontWeight: '700',
                },
            })}
        >
            <Tab.Screen name="Tienda" component={HomeStack} />
            <Tab.Screen name="Explorar" component={ExploreScreen} />
            <Tab.Screen name="Pedidos" component={OrderScreen} />
            <Tab.Screen name="Carrito" component={CartScreen} />
            <Tab.Screen name="Favoritos" component={FavoritesScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
