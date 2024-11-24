import axios from 'axios';

const api = axios.create({
  baseURL: 'https://<seuProjeto>.mockapi.io', // Substitua com sua URL do MockAPI
});

export default api;
