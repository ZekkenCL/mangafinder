import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const useSearchManga = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${API_URL}/search`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
};

export const useMangaDetails = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`${API_URL}/details`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  });
};
