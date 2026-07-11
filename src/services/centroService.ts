import api from './api';

export interface Centro {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  horario_atencion: string;
  materiales_aceptados: string[];
}

export const getCentros = async (): Promise<Centro[]> => {
  const response = await api.get('/centros');
  return response.data;
};
