import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <ThemeProvider>
                    <CartProvider>
                        <FavoritesProvider>
                            <NavigationContainer>
                                <RootStack />
                                <StatusBar style="auto" />
                            </NavigationContainer>
                        </FavoritesProvider>
                    </CartProvider>
                </ThemeProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}