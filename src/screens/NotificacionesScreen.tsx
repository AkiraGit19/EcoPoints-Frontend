import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, BellRing } from 'lucide-react-native';
import { getNotificaciones, marcarLeida, Notificacion } from '../services/notificacionService';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { useFocusEffect } from '@react-navigation/native';

export const NotificacionesScreen = () => {
  const [items, setItems] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const cargar = async () => {
    try {
      setItems(await getNotificaciones());
    } catch (error) {
      // sin datos
    } finally {
      setIsLoading(false);
    }
  };

  const abrir = async (n: Notificacion) => {
    if (n.leida) return;
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, leida: true } : x)));
    try {
      await marcarLeida(n.id);
    } catch (error) {
      // si falla, se recargará luego
    }
  };

  const renderItem = ({ item }: { item: Notificacion }) => (
    <TouchableOpacity onPress={() => abrir(item)} style={[styles.card, !item.leida && styles.cardUnread]}>
      <View style={styles.iconWrap}>
        {item.leida ? <Bell size={20} color={colors.textMuted} /> : <BellRing size={20} color={colors.primary} />}
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.mensaje, !item.leida && styles.mensajeUnread]}>{item.mensaje}</Text>
        <Text style={styles.fecha}>{new Date(item.fecha_creacion).toLocaleDateString()}</Text>
      </View>
      {!item.leida && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[colors.background, '#0f2b20']} style={styles.container}>
      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Bell size={40} color={colors.textMuted} />
              <Text style={styles.emptyText}>Aún no tienes notificaciones.</Text>
            </View>
          }
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(25, 42, 35, 0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    marginBottom: 12,
  },
  cardUnread: { borderColor: 'rgba(16, 185, 129, 0.4)' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: { flex: 1 },
  mensaje: { ...typography.body, color: colors.textMuted },
  mensajeUnread: { color: colors.text },
  fecha: { ...typography.bodySmall, color: colors.textMuted, marginTop: 4, opacity: 0.7 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  empty: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { ...typography.body, color: colors.textMuted },
});
