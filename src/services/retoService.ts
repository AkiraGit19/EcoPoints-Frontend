import api from './api';

export interface Reto {
  id: string;
  titulo: string;
  descripcion: string;
  puntosRecompensa: number;
  fechaFin: string;
}

export interface UsuarioReto {
  id_reto: string;
  estado: string;
  puntos_obtenidos: number;
}

export const getRetos = async (): Promise<Reto[]> => {
  const response = await api.get('/retos');
  return response.data;
};

export const unirseReto = async (id: string): Promise<string> => {
  const response = await api.post(`/retos/${id}/unirse`);
  return response.data.mensaje;
};

export const getMisRetos = async (): Promise<UsuarioReto[]> => {
  const response = await api.get('/retos/mis-retos');
  return response.data;
};
