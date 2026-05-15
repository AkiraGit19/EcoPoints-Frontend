import api from './api';

export interface Reto {
  id: string;
  titulo: string;
  descripcion: string;
  puntosRecompensa: number;
  fechaFin: string;
}

export const getRetos = async (): Promise<Reto[]> => {
  const response = await api.get('/retos');
  return response.data;
};

export const unirseReto = async (id: string): Promise<string> => {
  const response = await api.post(`/retos/${id}/unirse`);
  return response.data.mensaje;
};
