import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
type RootDrawerParamList = {
    Tienda: undefined;
    Ajustes: undefined;
    Soporte: undefined;
};
type Props = DrawerScreenProps<RootDrawerParamList, 'Ajustes'>;
export default function SettingsScreen({ navigation }: Props) {
    const { theme, isDark, toggleTheme } = useAppTheme();
    const { logout } = useAuth();
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar style="auto" />
            <Header title="Ajustes" showBack onBack={() => navigation.openDrawer()} />
            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>APARIENCIA</Text>
                    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <View style={styles.settingRow}>
                            <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                                <Ionicons name={isDark ? 'moon' : 'sunny'} size={22} color={theme.colors.primary} />
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Modo Oscuro</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.textSecondary }]}>
                                    {isDark ? 'Tema oscuro activado' : 'Tema claro activado'}
                                </Text>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>INFORMACIÓN</Text>
                    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
                            <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                                <Ionicons name="appstore-outline" size={22} color={theme.colors.primary} />
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Aplicación</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.textSecondary }]}>TechStore v1.0.0</Text>
                            </View>
                        </View>
                        <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
                            <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                                <Ionicons name="code-slash-outline" size={22} color={theme.colors.primary} />
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Tecnología</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.textSecondary }]}>React Native + Expo</Text>
                            </View>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                                <Ionicons name="school-outline" size={22} color={theme.colors.primary} />
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Proyecto</Text>
                                <Text style={[styles.settingDesc, { color: theme.colors.textSecondary }]}>Clase 7 - Proyecto Académico</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>AYUDA</Text>
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center', padding: 16 }]}
                        onPress={() => navigation.navigate('Support')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                            <Ionicons name="help-circle-outline" size={22} color={theme.colors.primary} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Soporte Técnico</Text>
                            <Text style={[styles.settingDesc, { color: theme.colors.textSecondary }]}>FAQ, contacto y consultas</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center', padding: 16 }]}
                        onPress={handleLogout}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Cerrar Sesión</Text>
                            <Text style={[styles.settingDesc, { color: theme.colors.textSecondary }]}>Salir de tu cuenta</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Footer />
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
    section: { paddingHorizontal: 16, marginBottom: 24 },
    sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 },
    card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 8 },
    settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
    iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    settingInfo: { flex: 1 },
    settingLabel: { fontSize: 16, fontWeight: '600' },
    settingDesc: { fontSize: 13, marginTop: 2 },
});
