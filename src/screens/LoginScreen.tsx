import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
const { width } = Dimensions.get('window');
const DEMO_USERS = [
    { username: 'emilys', password: 'emilyspass', label: 'emilys / emilyspass' },
    { username: 'johnw', password: 'johnwpass', label: 'johnw / johnwpass' },
    { username: 'jamesd', password: 'jamesdpass', label: 'jamesd / jamesdpass' },
];
export default function LoginScreen() {
    const { theme } = useAppTheme();
    const { login, loginError, loginLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        if (email.trim() && password.trim()) {
            await login(email.trim(), password);
        }
    };
    const useDemoUser = () => {
        setEmail('admin@gmail.com');
        setPassword('123456');
    };
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <StatusBar style="auto" />
            <View style={styles.topShape}>
                <View style={[styles.circle, { backgroundColor: theme.colors.primary, opacity: 0.1, top: -50, right: -50 }]} />
                <View style={[styles.circle, { backgroundColor: theme.colors.primary, opacity: 0.05, top: 100, left: -100, width: 300, height: 300 }]} />
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                        <Ionicons name="flash" size={40} color="#FFF" />
                    </View>
                    <Text style={[styles.title, { color: theme.colors.text }]}>TechStore</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Premium Electronics & Gear</Text>
                </View>
                <View style={styles.form}>
                    <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="mail-outline" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
                        <TextInput 
                            style={[styles.input, { color: theme.colors.text }]}
                            placeholder="Correo electrónico"
                            placeholderTextColor={theme.colors.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            editable={!loginLoading}
                        />
                    </View>
                    <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
                        <TextInput 
                            style={[styles.input, { color: theme.colors.text }]}
                            placeholder="Contraseña"
                            placeholderTextColor={theme.colors.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!loginLoading}
                            onSubmitEditing={handleLogin}
                        />
                    </View>
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={[styles.forgotText, { color: theme.colors.primary }]}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>

                    {loginError && (
                        <View style={[styles.errorContainer, { backgroundColor: theme.colors.warning + '20', borderColor: theme.colors.warning }]}>
                            <Ionicons name="alert-circle-outline" size={20} color={theme.colors.warning} />
                            <Text style={[styles.errorText, { color: theme.colors.warning }]}>{loginError}</Text>
                        </View>
                    )}

                    <View style={[styles.hintContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="information-circle-outline" size={16} color={theme.colors.textMuted} />
                        <Text style={[styles.hintText, { color: theme.colors.textMuted }]}>admin@gmail.com / 123456</Text>
                    </View>

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: theme.colors.primary, opacity: loginLoading ? 0.7 : 1 }]}
                        onPress={handleLogin}
                        disabled={loginLoading}
                    >
                        {loginLoading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>Iniciar Sesión</Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 10 }} />
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.demoButton, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
                        onPress={useDemoUser}
                        disabled={loginLoading}
                    >
                        <Ionicons name="enter-outline" size={18} color={theme.colors.primary} />
                        <Text style={[styles.demoText, { color: theme.colors.primary }]}>Usar cuenta demo</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>¿No tienes cuenta? </Text>
                        <TouchableOpacity>
                            <Text style={[styles.signupText, { color: theme.colors.primary }]}>Regístrate</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    topShape: { position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' },
    circle: { position: 'absolute', width: 250, height: 250, borderRadius: 125 },
    content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 50 },
    iconContainer: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: 1 },
    subtitle: { fontSize: 16, marginTop: 5 },
    form: { width: '100%' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', height: 60, borderRadius: 15, borderWidth: 1, marginBottom: 20, paddingHorizontal: 15 },
    inputIcon: { marginRight: 15 },
    input: { flex: 1, fontSize: 16 },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: 30 },
    forgotText: { fontSize: 14, fontWeight: '600' },
    errorContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 15 },
    errorText: { fontSize: 14, fontWeight: '600', marginLeft: 8 },
    hintContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1, marginBottom: 20, justifyContent: 'center' },
    hintText: { fontSize: 12, marginLeft: 5 },
    button: { height: 60, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    demoButton: { height: 48, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, marginTop: 12, gap: 8 },
    demoText: { fontSize: 15, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    footerText: { fontSize: 14 },
    signupText: { fontSize: 14, fontWeight: 'bold' }
});
