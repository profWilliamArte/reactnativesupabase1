import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { getUserOrders, getOrderItems } from '../services/OrderService';
import { formatCurrency, formatDate } from '../constants/util';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function OrderScreen() {
  const { user } = useAuth();
  const { theme } = useAppTheme();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal de detalles
  const [detailModal, setDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = async (order: any) => {
    setSelectedOrder(order);
    setDetailModal(true);
    setLoadingDetails(true);
    try {
      const items = await getOrderItems(order.id);
      setOrderItems(items);
    } catch (error) {
      console.error('Error cargando items:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const renderOrder = ({ item }: { item: any }) => (
    <View style={[styles.orderCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.orderHeader}>
        <View style={[styles.statusBadge, { backgroundColor: theme.colors.primary + '20' }]}>
          <Text style={[styles.statusText, { color: theme.colors.primary }]}>PEDIDO #{item.id}</Text>
        </View>
        <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>{formatDate(new Date(item.fecha))}</Text>
      </View>
      
      <View style={styles.orderBody}>
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Total Pagado:</Text>
          <Text style={[styles.totalValue, { color: theme.colors.primary }]}>{formatCurrency(item.total)}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.detailBtn, { borderTopColor: theme.colors.border }]}
        onPress={() => handleShowDetails(item)}
      >
        <Text style={[styles.detailBtnText, { color: theme.colors.primary }]}>Ver detalles de la compra</Text>
        <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header showBack={true} />
      
      <View style={styles.container}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Mis Pedidos</Text>
          <TouchableOpacity onPress={loadOrders} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="receipt-outline" size={80} color={theme.colors.textMuted} />
            <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>Aún no tienes pedidos</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderOrder}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* MODAL DE DETALLES */}
      <Modal visible={detailModal} transparent animationType="slide" onRequestClose={() => setDetailModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Detalle del Pedido #{selectedOrder?.id}</Text>
              <TouchableOpacity onPress={() => setDetailModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {loadingDetails ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={{ margin: 40 }} />
            ) : (
              <ScrollView style={styles.modalBody}>
                {orderItems.map((item, index) => (
                  <View key={index} style={[styles.detailItem, { borderBottomColor: theme.colors.border }]}>
                    <Image source={{ uri: item.productos.imagen }} style={styles.detailImg} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailName, { color: theme.colors.text }]}>{item.productos.nombre}</Text>
                      <Text style={[styles.detailQty, { color: theme.colors.textSecondary }]}>
                        {item.cantidad} unidades x {formatCurrency(item.precio_unitario)}
                      </Text>
                    </View>
                    <Text style={[styles.detailTotal, { color: theme.colors.primary }]}>
                      {formatCurrency(item.cantidad * item.precio_unitario)}
                    </Text>
                  </View>
                ))}
                
                <View style={styles.totalSection}>
                  <Text style={[styles.finalLabel, { color: theme.colors.text }]}>Total del Pedido:</Text>
                  <Text style={[styles.finalValue, { color: theme.colors.primary }]}>{formatCurrency(selectedOrder?.total)}</Text>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.colors.primary }]} onPress={() => setDetailModal(false)}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900' },
  refreshBtn: { padding: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, marginTop: 15, fontWeight: '600' },
  list: { paddingBottom: 20 },
  orderCard: { padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 15 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  orderDate: { fontSize: 12 },
  orderBody: { gap: 8, marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  totalLabel: { fontSize: 14, flex: 1 },
  totalValue: { fontSize: 18, fontWeight: 'bold' },
  detailBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, marginTop: 10, gap: 5 },
  detailBtnText: { fontSize: 14, fontWeight: 'bold' },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, gap: 12 },
  detailImg: { width: 50, height: 50, borderRadius: 8 },
  detailName: { fontSize: 15, fontWeight: 'bold' },
  detailQty: { fontSize: 13, marginTop: 2 },
  detailTotal: { fontSize: 15, fontWeight: 'bold' },
  totalSection: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingTop: 20, borderTopWidth: 2, borderTopColor: '#eee' },
  finalLabel: { fontSize: 18, fontWeight: 'bold' },
  finalValue: { fontSize: 22, fontWeight: '900' },
  closeBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
  closeBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
