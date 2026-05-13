import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Alert, TextInput } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerScreenProps } from '@react-navigation/drawer';
type RootDrawerParamList = {
    Tienda: undefined;
    Ajustes: undefined;
    Soporte: undefined;
};
type Props = DrawerScreenProps<RootDrawerParamList, 'Soporte'>;
const faqData = [
    { q: '¿Cómo realizo un pedido?', a: 'Navega por las categorías, selecciona un producto y presiona "Comprar" para iniciar el proceso de compra.' },
    { q: '¿Cuáles son los métodos de pago?', a: 'Aceptamos tarjetas de crédito/débito, PayPal y transferencias bancarias.' },
    { q: '¿Cuánto tarda el envío?', a: 'El envío estándar tarda de 3 a 5 días hábiles. El envío express de 1 a 2 días hábiles.' },
    { q: '¿Puedo devolver un producto?', a: 'Sí, tienes 30 días desde la recepción para realizar devoluciones. El producto debe estar en su empaque original.' },
];
export default function SupportScreen({ navigation }: Props) {
    const { theme } = useAppTheme();
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [message, setMessage] = useState('');
    const handleEmail = () => Linking.openURL('mailto:soporte@techstore.com');
    const handlePhone = () => Linking.openURL('tel:+580001234567');
    const handleWhatsApp = () => Linking.openURL('https://wa.me/580001234567?text=Hola,%20necesito%20soporte');
    const handleSendMessage = () => {
        if (message.trim()) {
            Alert.alert('Enviado', 'Tu mensaje ha sido enviado. Te responderemos pronto.');
            setMessage('');
        } else {
            Alert.alert('Error', 'Por favor escribe un mensaje');
        }
    };
    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar style="auto" />
            <Header title="Soporte" showBack onBack={() => navigation.openDrawer()} />
            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>CONTÁCTANOS</Text>
                    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <TouchableOpacity style={[styles.contactRow, { borderBottomColor: theme.colors.border }]} onPress={handleEmail}>
                            <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                                <Ionicons name="mail-outline" size={22} color={theme.colors.primary} />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={[styles.contactLabel, { color: theme.colors.text }]}>Email</Text>
                                <Text style={[styles.contactValue, { color: theme.colors.textSecondary }]}>soporte@techstore.com</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={18} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.contactRow, { borderBottomColor: theme.colors.border }]} onPress={handlePhone}>
                            <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
                                <Ionicons name="call-outline" size={22} color={theme.colors.primary} />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={[styles.contactLabel, { color: theme.colors.text }]}>Teléfono</Text>
                                <Text style={[styles.contactValue, { color: theme.colors.textSecondary }]}>+58 000-123-4567</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={18} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactRow} onPress={handleWhatsApp}>
                            <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                                <Ionicons name="logo-whatsapp" size={22} color="#22C55E" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={[styles.contactLabel, { color: theme.colors.text }]}>WhatsApp</Text>
                                <Text style={[styles.contactValue, { color: theme.colors.textSecondary }]}>+58 000-123-4567</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={18} color={theme.colors.textMuted} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>PREGUNTAS FRECUENTES</Text>
                    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        {faqData.map((item, index) => (
                            <View key={index} style={[styles.faqItem, index > 0 && { borderTopColor: theme.colors.border }, index > 0 && { borderTopWidth: 1 }]}>
                                <TouchableOpacity
                                    style={styles.faqQuestion}
                                    onPress={() => toggleFaq(index)}
                                >
                                    <Text style={[styles.faqQuestionText, { color: theme.colors.text }]}>{item.q}</Text>
                                    <Ionicons
                                        name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={theme.colors.textMuted}
                                    />
                                </TouchableOpacity>
                                {expandedFaq === index && (
                                    <Text style={[styles.faqAnswer, { color: theme.colors.textSecondary }]}>{item.a}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>ENVIAR CONSULTA</Text>
                    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <View style={styles.textareaContainer}>
                            <TextInput
                                style={[styles.textarea, { color: theme.colors.text, borderColor: theme.colors.border }]}
                                placeholder="Describe tu consulta..."
                                placeholderTextColor={theme.colors.textMuted}
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
                            onPress={handleSendMessage}
                        >
                            <Ionicons name="paper-plane" size={18} color="#FFF" />
                            <Text style={styles.sendButtonText}>Enviar Consulta</Text>
                        </TouchableOpacity>
                    </View>
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
    contactRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
    iconBox: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    contactInfo: { flex: 1 },
    contactLabel: { fontSize: 16, fontWeight: '600' },
    contactValue: { fontSize: 13, marginTop: 2 },
    faqItem: { padding: 16, borderBottomWidth: 1 },
    faqQuestion: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    faqQuestionText: { fontSize: 15, fontWeight: '600', flex: 1, paddingRight: 10 },
    faqAnswer: { fontSize: 14, marginTop: 10, lineHeight: 20 },
    textareaContainer: { padding: 16, paddingBottom: 8 },
    textarea: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 100, fontSize: 15 },
    sendButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, margin: 12, borderRadius: 10, gap: 8 },
    sendButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
