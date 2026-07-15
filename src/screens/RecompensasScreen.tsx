import React, {
  useCallback,
  useContext,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  Award,
  CheckCircle,
  Gift,
  Package,
  X,
} from 'lucide-react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  canjearRecompensa,
  getRecompensas,
  Recompensa,
} from '../services/recompensaService';

import { GlassCard } from '../components/ui/GlassCard';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const RecompensasScreen = () => {
  const { user, addPoints } =
    useContext(AuthContext);

  const [recompensas, setRecompensas] =
    useState<Recompensa[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [canjeando, setCanjeando] =
    useState<string | null>(null);

  const [
    recompensaSeleccionada,
    setRecompensaSeleccionada,
  ] = useState<Recompensa | null>(null);

  const [
    mostrarConfirmacion,
    setMostrarConfirmacion,
  ] = useState(false);

  const [
    mostrarResultado,
    setMostrarResultado,
  ] = useState(false);

  const [
    mensajeResultado,
    setMensajeResultado,
  ] = useState('');

  const [saldoResultado, setSaldoResultado] =
    useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      cargarRecompensas();
    }, [])
  );

  const cargarRecompensas = async () => {
    try {
      setIsLoading(true);

      const datos =
        await getRecompensas();

      setRecompensas(datos);
    } catch (error) {
      setMensajeResultado(
        'No se pudieron cargar las recompensas.'
      );

      setSaldoResultado(null);
      setMostrarResultado(true);
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerMensajeCanje = (
    recompensa: Recompensa
  ): string => {
    const nombre =
      recompensa.nombre.toLowerCase();

    if (nombre.includes('insignia')) {
      return (
        `¡Felicidades! Acabas de obtener ` +
        `"${recompensa.nombre}". ` +
        `La insignia digital fue añadida a tu perfil.`
      );
    }

    if (
      nombre.includes('bolsa') &&
      nombre.includes('tela')
    ) {
      return (
        `¡Felicidades! Canjeaste ` +
        `"${recompensa.nombre}". ` +
        `Presenta tu canje para recibir tu bolsa reutilizable.`
      );
    }

    if (
      nombre.includes('cupón') ||
      nombre.includes('cupon')
    ) {
      return (
        `¡Felicidades! Acabas de obtener ` +
        `"${recompensa.nombre}". ` +
        `${recompensa.descripcion}`
      );
    }

    return (
      `¡Felicidades! Canjeaste ` +
      `"${recompensa.nombre}". ` +
      `${recompensa.descripcion}`
    );
  };

  const solicitarCanje = (
    recompensa: Recompensa
  ) => {
    const puntosActuales =
      user?.puntosTotales ?? 0;

    if (
      puntosActuales <
      recompensa.costo_puntos
    ) {
      setMensajeResultado(
        `No tienes puntos suficientes. ` +
          `Necesitas ${recompensa.costo_puntos} puntos ` +
          `y actualmente tienes ${puntosActuales}.`
      );

      setSaldoResultado(puntosActuales);
      setMostrarResultado(true);
      return;
    }

    if (recompensa.stock <= 0) {
      setMensajeResultado(
        'Esta recompensa se encuentra agotada.'
      );

      setSaldoResultado(puntosActuales);
      setMostrarResultado(true);
      return;
    }

    setRecompensaSeleccionada(recompensa);
    setMostrarConfirmacion(true);
  };

  const cancelarCanje = () => {
    if (canjeando) {
      return;
    }

    setMostrarConfirmacion(false);
    setRecompensaSeleccionada(null);
  };

  const confirmarCanje = async () => {
    if (
      !recompensaSeleccionada ||
      canjeando
    ) {
      return;
    }

    const recompensa =
      recompensaSeleccionada;

    const puntosAntes =
      user?.puntosTotales ?? 0;

    try {
      setCanjeando(recompensa.id);

      const resultado =
        await canjearRecompensa(
          recompensa.id
        );

      /*
       * El backend devuelve el saldo real
       * almacenado en Supabase.
       *
       * addPoints recibe una diferencia,
       * por eso calculamos cuánto debe cambiar
       * el estado local para coincidir con
       * saldoRestante.
       */
      const diferencia =
        resultado.saldoRestante -
        puntosAntes;

      await addPoints(diferencia);

      setMostrarConfirmacion(false);
      setRecompensaSeleccionada(null);

      setMensajeResultado(
        obtenerMensajeCanje(recompensa)
      );

      setSaldoResultado(
        resultado.saldoRestante
      );

      setMostrarResultado(true);

      /*
       * Vuelve a consultar las recompensas
       * para mostrar el stock actualizado.
       */
      await cargarRecompensas();
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.error ||
        error?.message ||
        'No se pudo completar el canje.';

      setMostrarConfirmacion(false);
      setRecompensaSeleccionada(null);

      setMensajeResultado(mensaje);
      setSaldoResultado(
        user?.puntosTotales ?? 0
      );

      setMostrarResultado(true);
    } finally {
      setCanjeando(null);
    }
  };

  const cerrarResultado = () => {
    setMostrarResultado(false);
    setMensajeResultado('');
    setSaldoResultado(null);
  };

  const renderItem = ({
    item,
  }: {
    item: Recompensa;
  }) => {
    const puntosActuales =
      user?.puntosTotales ?? 0;

    const alcanza =
      puntosActuales >=
      item.costo_puntos;

    const agotado =
      item.stock <= 0;

    const procesando =
      canjeando === item.id;

    return (
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.nombre}>
            {item.nombre}
          </Text>

          <View style={styles.costoBadge}>
            <Award
              size={16}
              color={colors.accent}
            />

            <Text style={styles.costoText}>
              {item.costo_puntos} pts
            </Text>
          </View>
        </View>

        <Text style={styles.descripcion}>
          {item.descripcion}
        </Text>

        <View style={styles.footer}>
          <View style={styles.stockContainer}>
            <Package
              size={14}
              color={colors.textMuted}
            />

            <Text style={styles.stockText}>
              {agotado
                ? 'Agotado'
                : `${item.stock} disponibles`}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.canjearButton,
              (!alcanza || agotado) &&
                styles.canjearDisabled,
            ]}
            onPress={() =>
              solicitarCanje(item)
            }
            disabled={
              !alcanza ||
              agotado ||
              procesando
            }
          >
            {procesando ? (
              <ActivityIndicator
                size="small"
                color={colors.background}
              />
            ) : (
              <Text
                style={[
                  styles.canjearText,
                  (!alcanza || agotado) &&
                    styles.canjearTextDisabled,
                ]}
              >
                {agotado
                  ? 'Agotado'
                  : 'Canjear'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  };

  return (
    <LinearGradient
      colors={[
        colors.background,
        '#0f2b20',
      ]}
      style={styles.container}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>
            Recompensas
          </Text>

          <Text style={styles.subtitle}>
            Canjea tus EcoPoints
          </Text>
        </View>

        <View style={styles.puntosPill}>
          <Award
            size={18}
            color={colors.accent}
          />

          <Text
            style={styles.puntosPillText}
          >
            {user?.puntosTotales ?? 0}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        </View>
      ) : (
        <FlatList
          data={recompensas}
          keyExtractor={(item) =>
            String(item.id)
          }
          renderItem={renderItem}
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator={
            false
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              No hay recompensas
              disponibles.
            </Text>
          }
        />
      )}

      {/* Ventana para confirmar el canje */}
      <Modal
        visible={mostrarConfirmacion}
        transparent
        animationType="fade"
        onRequestClose={cancelarCanje}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={cancelarCanje}
              disabled={Boolean(canjeando)}
            >
              <X
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>

            <View style={styles.modalIcon}>
              <Gift
                size={34}
                color={colors.primary}
              />
            </View>

            <Text style={styles.modalTitle}>
              Confirmar canje
            </Text>

            {recompensaSeleccionada && (
              <>
                <Text
                  style={
                    styles.modalDescription
                  }
                >
                  ¿Deseas canjear
                  {' "'}
                  {
                    recompensaSeleccionada.nombre
                  }
                  {'" '}
                  por{' '}
                  {
                    recompensaSeleccionada.costo_puntos
                  }{' '}
                  puntos?
                </Text>

                <View
                  style={styles.balanceBox}
                >
                  <Text
                    style={
                      styles.balanceLabel
                    }
                  >
                    Saldo actual
                  </Text>

                  <Text
                    style={
                      styles.balanceValue
                    }
                  >
                    {user?.puntosTotales ??
                      0}{' '}
                    pts
                  </Text>
                </View>

                <View
                  style={styles.balanceBox}
                >
                  <Text
                    style={
                      styles.balanceLabel
                    }
                  >
                    Saldo después del canje
                  </Text>

                  <Text
                    style={
                      styles.balanceValue
                    }
                  >
                    {Math.max(
                      0,
                      (user?.puntosTotales ??
                        0) -
                        recompensaSeleccionada.costo_puntos
                    )}{' '}
                    pts
                  </Text>
                </View>
              </>
            )}

            <View
              style={styles.modalActions}
            >
              <TouchableOpacity
                style={
                  styles.cancelButton
                }
                onPress={cancelarCanje}
                disabled={Boolean(canjeando)}
              >
                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.confirmButton
                }
                onPress={confirmarCanje}
                disabled={Boolean(canjeando)}
              >
                {canjeando ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.background}
                  />
                ) : (
                  <Text
                    style={
                      styles.confirmButtonText
                    }
                  >
                    Canjear
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Resultado final del canje */}
      <Modal
        visible={mostrarResultado}
        transparent
        animationType="fade"
        onRequestClose={cerrarResultado}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={cerrarResultado}
            >
              <X
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>

            <View
              style={
                styles.successIcon
              }
            >
              <CheckCircle
                size={42}
                color={colors.primary}
              />
            </View>

            <Text style={styles.modalTitle}>
              Resultado del canje
            </Text>

            <Text
              style={
                styles.modalDescription
              }
            >
              {mensajeResultado}
            </Text>

            {saldoResultado !== null && (
              <View
                style={
                  styles.finalBalanceBox
                }
              >
                <Text
                  style={
                    styles.balanceLabel
                  }
                >
                  Puntos restantes
                </Text>

                <Text
                  style={
                    styles.finalBalanceValue
                  }
                >
                  {saldoResultado} pts
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={cerrarResultado}
            >
              <Text
                style={
                  styles.confirmButtonText
                }
              >
                Aceptar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topBar: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  title: {
    ...typography.h1,
    color: colors.primary,
  },

  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4,
  },

  puntosPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor:
      'rgba(163, 230, 53, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  puntosPillText: {
    ...typography.button,
    color: colors.accent,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  list: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 100,
  },

  card: {
    marginBottom: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  nombre: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },

  costoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(163, 230, 53, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  costoText: {
    ...typography.bodySmall,
    color: colors.accent,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  descripcion: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: 20,
    lineHeight: 24,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stockText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginLeft: 6,
  },

  canjearButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
  },

  canjearDisabled: {
    backgroundColor: '#334155',
    opacity: 0.7,
  },

  canjearText: {
    ...typography.button,
    color: colors.background,
    fontSize: 14,
  },

  canjearTextDisabled: {
    color: '#0f2b20',
  },

  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      'rgba(0, 0, 0, 0.72)',
    padding: 24,
  },

  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#0f2b20',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor:
      'rgba(16, 185, 129, 0.35)',
  },

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
    padding: 4,
  },

  modalIcon: {
    alignSelf: 'center',
    backgroundColor:
      'rgba(16, 185, 129, 0.15)',
    padding: 16,
    borderRadius: 40,
    marginBottom: 16,
  },

  successIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },

  modalDescription: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 18,
  },

  balanceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:
      'rgba(255, 255, 255, 0.04)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  balanceLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  balanceValue: {
    ...typography.button,
    color: colors.accent,
  },

  finalBalanceBox: {
    alignItems: 'center',
    backgroundColor:
      'rgba(163, 230, 53, 0.12)',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
  },

  finalBalanceValue: {
    ...typography.h2,
    color: colors.accent,
    marginTop: 4,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },

  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },

  cancelButtonText: {
    ...typography.button,
    color: colors.textMuted,
  },

  confirmButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },

  confirmButtonText: {
    ...typography.button,
    color: colors.background,
  },

  acceptButton: {
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
});