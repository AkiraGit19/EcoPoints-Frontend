import api from './api';

export const subirEvidencia = async (idReto: string, imagenBase64: string): Promise<any> => {
  const response = await api.post('/evidencias', {
    idReto,
    imagenBase64
  });
  return response.data;
};
