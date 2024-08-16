import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getApiInstance = async () => {
  try {
    // Obtenha a URL base do AsyncStorage
    const baseURL = await AsyncStorage.getItem('@MyApp:connection');

    // Crie e retorne a instância do Axios com a URL base dinâmica
    return axios.create({
      baseURL,
    });
  } catch (error) {
    console.error('Erro ao obter a URL base:', error);
    throw error; // Propaga o erro para o componente que chama
  }
};

export default getApiInstance;