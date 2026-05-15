import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf, Award, Calendar } from 'lucide-react-native';
import { getRetos, unirseReto, Reto } from '../services/retoService';
import { GlassCard } from '../components/ui/GlassCard';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

export const RetosScreen = () => {
  const [retos, setRetos] = useState<Reto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState<string | null>(null);

  useEffect(() => {
    cargarRetos();
  }, []);

  const cargarRetos = async () => {
    try {
      const data = await getRetos();
      setRetos(data);
    } catch (error) {
      console.error('Error al cargar retos:', error);
      Alert.alert('Error', 'No se pudieron cargar los retos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnirse = async (id: string) => {
    setIsJoining(id);
    try {
      const mensaje = await unirseReto(id);
      Alert.alert('¡Éxito!', mensaje);
      // Aquí se podría actualizar el estado local para marcar el reto como "Unido"
    } catch (error) {
      Alert.alert('Error', 'No se pudo unir al reto.');
    } finally {
      setIsJoining(null);
    }
  };

  const renderReto = ({ item }: { item: Reto }) => {
    const isThisJoining = isJoining === item.id;
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
        <Text style={styles.headerTitle}>Retos Disponibles</Text>
        <Text style={styles.headerSubtitle}>Únete y gana EcoPoints</Text>
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
    backgroundColor: 'rgba(163, 230, 53, 0.2)', // Accent transparent
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
