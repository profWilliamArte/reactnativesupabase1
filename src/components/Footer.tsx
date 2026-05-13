import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
export default function Footer() {
    const { theme } = useAppTheme();
    return (
        <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.content}>
                <View>
                    <Text style={[styles.copyright, { color: theme.colors.textSecondary }]}>© 2026 TechStore S.A.</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Calidad en cada producto</Text>
                </View>
                <View style={styles.socials}>
                    <Ionicons name="logo-instagram" size={18} color={theme.colors.textMuted} />
                    <Ionicons name="logo-twitter" size={18} color={theme.colors.textMuted} style={{ marginLeft: 15 }} />
                </View>
            </View>
            <Text style={[styles.version, { color: theme.colors.textMuted }]}>Versión 1.2.0-beta</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    footer: {
        padding: 24,
    },
    divider: {
        height: 1,
        marginBottom: 20,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    copyright: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    socials: {
        flexDirection: 'row',
    },
    version: {
        fontSize: 10,
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});