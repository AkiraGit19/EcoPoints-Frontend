import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { subirEvidencia } from '../services/evidenciaService';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const DetalleRetoScreen = ({ route }: any) => {
  const { reto } = route.params;
  const navigation = useNavigation<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultado, setResultado] = useState<{tipo: 'APROBADA'|'RECHAZADA'|'ERROR', mensaje: string} | null>(null);
  const { addPoints } = React.useContext(AuthContext);

  const enviarEvidencia = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para tomar la foto de evidencia.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64Img = result.assets[0].base64;
        if (base64Img) {
          setIsSubmitting(true);
          const response = await subirEvidencia(reto.id, base64Img);
          
          const estadoFinal = response.evidencia?.estadoValidacion || response.estadoValidacion;
          
          if (estadoFinal === 'APROBADA') {
            await addPoints(reto.puntosRecompensa || reto.puntos_recompensa || 0);
            setResultado({
              tipo: 'APROBADA',
              mensaje: '¡Excelente! La IA ha analizado tu foto y ha APROBADO el reto. Se han sumado los puntos a tu cuenta.'
            });
          } else {
            setResultado({
              tipo: 'RECHAZADA',
              mensaje: 'Reto Rechazado: La IA no pudo validar que la foto corresponda al reto. Inténtalo de nuevo con una foto más clara.'
            });
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      const errorDelServidor = error.response?.data?.error || 'No se pudo enviar la evidencia. Por favor intenta de nuevo.';
      setResultado({
        tipo: 'ERROR',
        mensaje: `Error: ${errorDelServidor}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resultado) {
    return (
      <View style={styles.container}>
        <View style={styles.resultadoContainer}>
          <Text style={[styles.tituloResultado, resultado.tipo === 'APROBADA' ? styles.aprobado : styles.rechazado]}>
            {resultado.tipo === 'APROBADA' ? '¡Reto Completado!' : '¡Ups! Algo salió mal'}
          </Text>
          <Text style={styles.textoResultado}>{resultado.mensaje}</Text>
          <TouchableOpacity 
            style={styles.botonVolver} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.textoBoton}>Volver a Retos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{reto.titulo}</Text>

      <Text style={styles.label}>Descripción</Text>
      <Text style={styles.texto}>{reto.descripcion}</Text>

      <Text style={styles.label}>Puntos</Text>
      <Text style={styles.texto}>{reto.puntosRecompensa} puntos</Text>

      <Text style={styles.label}>Fecha de finalización</Text>
      <Text style={styles.texto}>{new Date(reto.fechaFin).toLocaleDateString()}</Text>

      <Text style={styles.estado}>Estado: En progreso</Text>

      <TouchableOpacity 
        style={[styles.boton, isSubmitting && styles.botonDisabled]} 
        onPress={enviarEvidencia}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#0a1612" />
        ) : (
          <Text style={styles.textoBoton}>Enviar evidencia</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DetalleRetoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1612',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a7f3d0',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
  },
  texto: {
    fontSize: 15,
    color: '#d1d5db',
    marginTop: 4,
  },
  estado: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#facc15',
  },
  boton: {
    marginTop: 30,
    backgroundColor: '#22c55e',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonDisabled: {
    backgroundColor: '#166534',
  },
  textoBoton: {
    color: '#0a1612',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultadoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0f2b20',
    borderRadius: 12,
  },
  tituloResultado: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  aprobado: {
    color: '#4ade80', // Verde brillante
  },
  rechazado: {
    color: '#f87171', // Rojo suave
  },
  textoResultado: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 26,
  },
  botonVolver: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
});
