import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Header from '../components/Header';
import Footer from '../components/Footer';
type RootDrawerParamList = {
    Tienda: undefined;
    Ajustes: undefined;
    Soporte: undefined;
};
type NavigationProp = DrawerNavigationProp<RootDrawerParamList>;
export default function ProfileScreen() {
    const { theme } = useAppTheme();
    const { user, logout } = useAuth();
    const navigation = useNavigation<NavigationProp>();
    const drawerNav = navigation.getParent<NavigationProp>();
    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: () => logout(),
                },
            ]
        );
    };
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Header />
            <ScrollView style={styles.container}>
                <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    {user?.image ? (
                        <Image
                            source={{ uri: user.image }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                            <Ionicons name="person" size={40} color="#FFF" />
                        </View>
                    )}
                    <Text style={[styles.name, { color: theme.colors.text }]}>
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <Text style={[styles.email, { color: theme.colors.textSecondary }]}>{user?.email}</Text>
                    <Text style={[styles.role, { color: theme.colors.primary }]}>@{user?.username}</Text>
                </View>
                <View style={styles.menuSection}>
                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                        onPress={() => drawerNav?.navigate('Ajustes')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                            <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.menuLabel, { color: theme.colors.text }]}>Ajustes</Text>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                        onPress={() => drawerNav?.navigate('Soporte')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                            <Ionicons name="help-circle-outline" size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.menuLabel, { color: theme.colors.text }]}>Soporte</Text>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                            <Ionicons name="heart-outline" size={20} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.menuLabel, { color: theme.colors.text }]}>Favoritos</Text>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>
                <View style={styles.menuSection}>
                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                        onPress={handleLogout}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                        </View>
                        <Text style={[styles.menuLabel, { color: '#EF4444' }]}>Cerrar Sesión</Text>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Footer />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
    profileCard: { alignItems: 'center', padding: 30, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    avatarImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 15 },
    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 2 },
    email: { fontSize: 14 },
    role: { fontSize: 13, marginTop: 4 },
    menuSection: { marginBottom: 16 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
    iconBox: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    menuLabel: { flex: 1, fontSize: 16, fontWeight: '500' },
});
