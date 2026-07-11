import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gift, Award, Package } from 'lucide-react-native';
import { getRecompensas, canjearRecompensa, Recompensa } from '../services/recompensaService';
import { GlassCard } from '../components/ui/GlassCard';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export const RecompensasScreen = () => {
  const { user, addPoints } = useContext(AuthContext);
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canjeando, setCanjeando] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const cargar = async () => {
    try {
      setRecompensas(await getRecompensas());
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las recompensas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCanjear = (item: Recompensa) => {
    const puntos = user?.puntosTotales || 0;
    if (puntos < item.costo_puntos) {
      Alert.alert('Puntos insuficientes', `Necesitas ${item.costo_puntos} pts y tienes ${puntos}.`);
      return;
    }
    const confirmar = async () => {
      setCanjeando(item.id);
      try {
        const res = await canjearRecompensa(item.id);
        await addPoints(-item.costo_puntos);
        Alert.alert('¡Listo!', res.mensaje);
        await cargar();
      } catch (error: any) {
        Alert.alert('Error', error?.response?.data?.error || 'No se pudo canjear.');
      } finally {
        setCanjeando(null);
      }
    };
    Alert.alert('Confirmar canje', `¿Canjear "${item.nombre}" por ${item.costo_puntos} puntos?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Canjear', onPress: confirmar },
    ]);
  };

  const renderItem = ({ item }: { item: Recompensa }) => {
    const alcanza = (user?.puntosTotales || 0) >= item.costo_puntos;
    const agotado = item.stock <= 0;
    return (
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <View style={styles.costoBadge}>
            <Award size={16} color={colors.accent} />
            <Text style={styles.costoText}>{item.costo_puntos} pts</Text>
          </View>
        </View>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <View style={styles.footer}>
          <View style={styles.stockContainer}>
            <Package size={14} color={colors.textMuted} />
            <Text style={styles.stockText}>{agotado ? 'Agotado' : `${item.stock} disponibles`}</Text>
          </View>
          <TouchableOpacity
            style={[styles.canjearButton, (!alcanza || agotado) && styles.canjearDisabled]}
            onPress={() => handleCanjear(item)}
            disabled={!alcanza || agotado || canjeando === item.id}
          >
            {canjeando === item.id ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Text style={styles.canjearText}>{agotado ? 'Agotado' : 'Canjear'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  };

  return (
    <LinearGradient colors={[colors.background, '#0f2b20']} style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Recompensas</Text>
          <Text style={styles.subtitle}>Canjea tus EcoPoints</Text>
        </View>
        <View style={styles.puntosPill}>
          <Award size={18} color={colors.accent} />
          <Text style={styles.puntosPillText}>{user?.puntosTotales || 0}</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <FlatList
          data={recompensas}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.empty}>No hay recompensas disponibles.</Text>}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: { ...typography.h1, color: colors.primary },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: 4 },
  puntosPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  puntosPillText: { ...typography.button, color: colors.accent },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 24, paddingTop: 0 },
  card: { marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  nombre: { ...typography.h3, color: colors.text, flex: 1, marginRight: 12 },
  costoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  costoText: { ...typography.bodySmall, color: colors.accent, fontWeight: 'bold', marginLeft: 4 },
  descripcion: { ...typography.body, color: colors.textMuted, marginBottom: 20, lineHeight: 24 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stockContainer: { flexDirection: 'row', alignItems: 'center' },
  stockText: { ...typography.bodySmall, color: colors.textMuted, marginLeft: 6 },
  canjearButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
  },
  canjearDisabled: { backgroundColor: '#334155', opacity: 0.7 },
  canjearText: { ...typography.button, color: colors.background, fontSize: 14 },
  empty: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: 40 },
});
