import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Calendar, Bell } from 'lucide-react-native';
import { getRetos, unirseReto, getMisRetos, Reto, UsuarioReto } from '../services/retoService';
import { getNotificaciones } from '../services/notificacionService';
import { GlassCard } from '../components/ui/GlassCard';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export const RetosScreen = () => {
  const navigation = useNavigation<any>();
  const [retos, setRetos] = useState<Reto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [misRetos, setMisRetos] = useState<UsuarioReto[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);

  useFocusEffect(
    useCallback(() => {
      cargarRetos();
      getNotificaciones()
        .then((n) => setNoLeidas(n.filter((x) => !x.leida).length))
        .catch(() => {});
    }, [])
  );

  const cargarRetos = async () => {
    try {
      const dataRetos = await getRetos();
      setRetos(dataRetos);
    } catch (error) {
      console.error('Error al cargar retos:', error);
      Alert.alert('Error', 'No se pudieron cargar los retos disponibles.');
    }

    try {
      const dataMisRetos = await getMisRetos();
      setMisRetos(dataMisRetos);
    } catch (error) {
      console.error('Error al cargar mis retos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnirse = async (id: string) => {
    setIsJoining(id);
    try {
      const mensaje = await unirseReto(id);
      Alert.alert('¡Éxito!', mensaje);
      await cargarRetos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo unir al reto.');
    } finally {
      setIsJoining(null);
    }
  };

  const retoYaIniciado = (idReto: string) => {
    return misRetos.some((item) => item.id_reto === idReto);
  };

  const renderReto = ({ item }: { item: Reto }) => {
    const isThisJoining = isJoining === item.id;
    const miReto = misRetos.find((r) => r.id_reto === item.id);
    const iniciado = !!miReto;
    const completado = miReto?.estado === 'COMPLETADO';

    return (
      <GlassCard style={styles.retoCard}>
        <View style={styles.retoHeader}>
          <Text style={styles.retoTitle}>{item.titulo}</Text>
          <View style={styles.puntosBadge}>
            <Award size={16} color={colors.accent} />
            <Text style={styles.puntosText}>{item.puntosRecompensa} pts</Text>
          </View>
        </View>
        
        <Text style={styles.retoDescription}>{item.descripcion}</Text>
        
        <View style={styles.retoFooter}>
          <View style={styles.fechaContainer}>
            <Calendar size={14} color={colors.textMuted} />
            <Text style={styles.fechaText}>
              Vence: {new Date(item.fechaFin).toLocaleDateString()}
            </Text>
          </View>
          
          {completado ? (
            <View style={[styles.joinButton, { backgroundColor: colors.accent }]}>
              <Text style={styles.joinButtonText}>¡Completado!</Text>
            </View>
          ) : iniciado ? (
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate('DetalleReto', { reto: item })}
            >
              <Text style={styles.joinButtonText}>Ver reto</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleUnirse(item.id)}
              disabled={isThisJoining}
            >
              {isThisJoining ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text style={styles.joinButtonText}>Unirse</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </GlassCard>
    );
  };

  return (
    <LinearGradient
      colors={[colors.background, '#0f2b20']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Retos Disponibles</Text>
            <Text style={styles.headerSubtitle}>Únete y gana EcoPoints</Text>
          </View>
          <TouchableOpacity style={styles.bellButton} onPress={() => navigation.navigate('Notificaciones')}>
            <Bell size={24} color={colors.text} />
            {noLeidas > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{noLeidas > 9 ? '9+' : noLeidas}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={retos}
          keyExtractor={(item) => item.id}
          renderItem={renderReto}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay retos disponibles en este momento.</Text>
          }
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextWrap: {
    flex: 1,
  },
  bellButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerTitle: {
    ...typography.h1,
    color: colors.primary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 24,
    paddingTop: 0,
  },
  retoCard: {
    marginBottom: 16,
  },
  retoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  retoTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  puntosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(163, 230, 53, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  puntosText: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  retoDescription: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: 20,
    lineHeight: 24,
  },
  retoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fechaText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: 6,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  joinButtonText: {
    ...typography.button,
    color: colors.background,
    fontSize: 14,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});
