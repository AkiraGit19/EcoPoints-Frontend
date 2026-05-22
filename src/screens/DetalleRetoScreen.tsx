import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const DetalleRetoScreen = ({ route }: any) => {
  const { reto } = route.params;

  const enviarEvidencia = () => {
    Alert.alert('Evidencia', 'Aquí luego se enviará la evidencia del reto.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{reto.titulo}</Text>

      <Text style={styles.label}>Descripción</Text>
      <Text style={styles.texto}>{reto.descripcion}</Text>

      <Text style={styles.label}>Puntos</Text>
      <Text style={styles.texto}>{reto.puntosRecompensa} puntos</Text>

      <Text style={styles.label}>Fecha de finalización</Text>
      <Text style={styles.texto}>{reto.fechaFin}</Text>

      <Text style={styles.estado}>Estado: En progreso</Text>

      <TouchableOpacity style={styles.boton} onPress={enviarEvidencia}>
        <Text style={styles.textoBoton}>Enviar evidencia</Text>
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
  textoBoton: {
    color: '#0a1612',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
