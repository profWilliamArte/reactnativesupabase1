import React from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
interface HeaderProps {
    showBack?: boolean;
}
export default function Header({ showBack = false }: HeaderProps) {
    const { theme, isDark, toggleTheme } = useAppTheme();
    const navigation = useNavigation<any>();
    return (
        <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
            <View style={styles.leftContainer}>
                <TouchableOpacity 
                    style={[styles.menuIcon, { backgroundColor: theme.colors.background }]} 
                    onPress={() => showBack ? navigation.goBack() : navigation.openDrawer()}
                >
                    <Ionicons 
                        name={showBack ? "arrow-back-outline" : "menu-outline"} 
                        size={24} 
                        color={theme.colors.text} 
                    />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <View style={[styles.iconBox, { backgroundColor: theme.colors.primary }]}>
                        <Ionicons name="flash" size={18} color="#FFF" />
                    </View>
                    <Text style={[styles.brandName, { color: theme.colors.secondary }]}>
                        TECH<Text style={{ color: theme.colors.primary }}>STORE</Text>
                    </Text>
                </View>
            </View>
            
            <View style={styles.actions}>
                <TouchableOpacity 
                    style={[styles.actionIcon, { backgroundColor: theme.colors.background }]} 
                    onPress={toggleTheme}
                >
                    <Ionicons 
                        name={isDark ? "sunny-outline" : "moon-outline"} 
                        size={22} 
                        color={isDark ? theme.colors.warning : theme.colors.primary} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        padding: 8,
        borderRadius: 10,
        marginRight: 12,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        padding: 5,
        borderRadius: 8,
        marginRight: 8,
    },
    brandName: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionIcon: {
        padding: 8,
        borderRadius: 10,
    }
});