import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';

import {
  ArrowLeft,
  Clock,
  Info,
  MapPin,
} from 'lucide-react-native';

import L from 'leaflet';

import { Centro } from '../services/centroService';
import { GlassCard } from './ui/GlassCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

import 'leaflet/dist/leaflet.css';

const POSICION_INICIAL: [number, number] = [
  -12.11,
  -77.02,
];

const iconoMarcador = L.icon({
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapaVistaProps {
  centros: Centro[];
}

interface CentrarMapaProps {
  centro: Centro;
}

interface MarcadorCentroProps {
  centro: Centro;
}

const CentrarMapa = ({
  centro,
}: CentrarMapaProps) => {
  const mapa = useMap();

  useEffect(() => {
    const latitud = Number(centro.latitud);
    const longitud = Number(centro.longitud);

    if (
      !Number.isFinite(latitud) ||
      !Number.isFinite(longitud)
    ) {
      return;
    }

    mapa.flyTo(
      [latitud, longitud],
      16,
      {
        duration: 0.8,
      }
    );
  }, [centro, mapa]);

  return null;
};

const MarcadorCentro = ({
  centro,
}: MarcadorCentroProps) => {
  const marcadorRef =
    useRef<L.Marker | null>(null);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      marcadorRef.current?.openPopup();
    }, 400);

    return () => {
      clearTimeout(temporizador);
    };
  }, [centro]);

  return (
    <Marker
      ref={marcadorRef}
      position={[
        Number(centro.latitud),
        Number(centro.longitud),
      ]}
      icon={iconoMarcador}
    >
      <Popup>
        <View style={styles.popup}>
          <Text style={styles.popupNombre}>
            {centro.nombre}
          </Text>

          <Text style={styles.popupTexto}>
            {centro.direccion}
          </Text>

          <Text style={styles.popupTexto}>
            {centro.horario_atencion}
          </Text>
        </View>
      </Popup>
    </Marker>
  );
};

export const MapaVista = ({
  centros,
}: MapaVistaProps) => {
  const [mostrarMapa, setMostrarMapa] =
    useState(false);

  const [
    centroSeleccionado,
    setCentroSeleccionado,
  ] = useState<Centro | null>(null);

  const centrosValidos = useMemo(
    () =>
      centros.filter((centro) => {
        const latitud = Number(
          centro.latitud
        );

        const longitud = Number(
          centro.longitud
        );

        return (
          Number.isFinite(latitud) &&
          Number.isFinite(longitud)
        );
      }),
    [centros]
  );

  const abrirCentroEnMapa = (
    centro: Centro
  ) => {
    setCentroSeleccionado(centro);
    setMostrarMapa(true);
  };

  const cerrarMapa = () => {
    setMostrarMapa(false);
    setCentroSeleccionado(null);
  };

  if (!mostrarMapa) {
    return (
      <LinearGradient
        colors={[
          colors.background,
          '#0f2b20',
        ]}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Centros de Reciclaje
          </Text>

          <View style={styles.note}>
            <Info
              size={16}
              color={colors.textMuted}
            />

            <Text style={styles.noteText}>
              Selecciona un centro para
              visualizar su ubicación.
            </Text>
          </View>
        </View>

        <FlatList
          data={centrosValidos}
          keyExtractor={(centro) =>
            String(centro.id)
          }
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cardButton}
              onPress={() =>
                abrirCentroEnMapa(item)
              }
            >
              <GlassCard style={styles.card}>
                <Text style={styles.nombre}>
                  {item.nombre}
                </Text>

                <View style={styles.row}>
                  <MapPin
                    size={18}
                    color={colors.primary}
                  />

                  <Text style={styles.rowText}>
                    {item.direccion}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Clock
                    size={18}
                    color={colors.primary}
                  />

                  <Text style={styles.rowText}>
                    {item.horario_atencion}
                  </Text>
                </View>

                <View style={styles.chips}>
                  {(
                    item.materiales_aceptados ||
                    []
                  ).map((material) => (
                    <View
                      key={material}
                      style={styles.chip}
                    >
                      <Text
                        style={
                          styles.chipText
                        }
                      >
                        {material}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.mapLink}>
                  <MapPin
                    size={16}
                    color={colors.primary}
                  />

                  <Text
                    style={
                      styles.mapLinkText
                    }
                  >
                    Ver ubicación en el mapa
                  </Text>
                </View>
              </GlassCard>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No hay centros de reciclaje
              disponibles.
            </Text>
          }
        />
      </LinearGradient>
    );
  }

  const posicionSeleccionada:
    [number, number] =
    centroSeleccionado
      ? [
          Number(
            centroSeleccionado.latitud
          ),
          Number(
            centroSeleccionado.longitud
          ),
        ]
      : POSICION_INICIAL;

  return (
    <View style={styles.mapContainer}>
      <MapContainer
        key={
          centroSeleccionado
            ? String(
                centroSeleccionado.id
              )
            : 'mapa'
        }
        center={posicionSeleccionada}
        zoom={16}
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {centroSeleccionado && (
          <>
            <CentrarMapa
              centro={centroSeleccionado}
            />

            <MarcadorCentro
              centro={centroSeleccionado}
            />
          </>
        )}
      </MapContainer>

      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.85}
        onPress={cerrarMapa}
      >
        <ArrowLeft
          size={20}
          color="#ffffff"
        />

        <Text style={styles.backButtonText}>
          Volver a centros
        </Text>
      </TouchableOpacity>

      {centroSeleccionado && (
        <View style={styles.detailCard}>
          <Text style={styles.nombre}>
            {centroSeleccionado.nombre}
          </Text>

          <View style={styles.row}>
            <MapPin
              size={18}
              color={colors.primary}
            />

            <Text style={styles.rowText}>
              {
                centroSeleccionado.direccion
              }
            </Text>
          </View>

          <View style={styles.row}>
            <Clock
              size={18}
              color={colors.primary}
            />

            <Text style={styles.rowText}>
              {
                centroSeleccionado.horario_atencion
              }
            </Text>
          </View>

          <View style={styles.chips}>
            {(
              centroSeleccionado.materiales_aceptados ||
              []
            ).map((material) => (
              <View
                key={material}
                style={styles.chip}
              >
                <Text
                  style={styles.chipText}
                >
                  {material}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  title: {
    ...typography.h1,
    color: colors.primary,
  },

  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },

  noteText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    flex: 1,
  },

  list: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },

  cardButton: {
    marginBottom: 16,
  },

  card: {
    width: '100%',
  },

  nombre: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  rowText: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },

  chip: {
    backgroundColor:
      'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  chipText: {
    ...typography.bodySmall,
    color: colors.primary,
  },

  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },

  mapLinkText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: 'bold',
  },

  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },

  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.background,
  },

  backButton: {
    position: 'absolute',
    top: 18,
    right: 16,
    zIndex: 2000,
    elevation: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f2b20',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  backButtonText: {
    ...typography.bodySmall,
    color: '#ffffff',
    fontWeight: 'bold',
  },

  detailCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    zIndex: 1500,
    elevation: 15,
    backgroundColor: '#0f2b20',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },

  popup: {
    minWidth: 150,
    padding: 4,
  },

  popupNombre: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },

  popupTexto: {
    fontSize: 12,
    marginTop: 2,
  },
});