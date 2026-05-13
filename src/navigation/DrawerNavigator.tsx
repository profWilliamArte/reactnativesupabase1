import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import SupportScreen from '../screens/SupportScreen';
const Drawer = createDrawerNavigator();
export default function DrawerNavigator() {
    const { theme } = useAppTheme();
    return (
        <Drawer.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                drawerIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    if (route.name === 'Tienda') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Ajustes') iconName = focused ? 'settings' : 'settings-outline';
                    else if (route.name === 'Soporte') iconName = focused ? 'help-circle' : 'help-circle-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                drawerActiveTintColor: theme.colors.primary,
                drawerInactiveTintColor: theme.colors.textSecondary,
                drawerStyle: {
                    backgroundColor: theme.colors.surface,
                    width: 260,
                },
                drawerLabelStyle: {
                    fontSize: 15,
                    fontWeight: '600',
                    marginLeft: -12,
                },
            })}
        >
            <Drawer.Screen
                name="Tienda"
                component={TabNavigator}
                options={{ title: 'Tienda' }}
            />
            <Drawer.Screen
                name="Ajustes"
                component={SettingsScreen}
                options={{ title: 'Ajustes' }}
            />
            <Drawer.Screen
                name="Soporte"
                component={SupportScreen}
                options={{ title: 'Soporte' }}
            />
        </Drawer.Navigator>
    );
}
