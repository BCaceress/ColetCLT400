import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const DadosContext = createContext();

export function DadosProvider({ children }) {
  const [dados, setDados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processosLista, setProcessosLista] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiInstance = await api();
        const response = await apiInstance.get(
          `/ordens?evento=20&numeroOF=118659.00`
        );
        setDados(response.data);
        setProcessosLista(response.data.ordem.processos);
        setIsLoading(true);
      } catch (error) {
        setIsLoading(true);
        console.error('Erro ao obter dados da API:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <DadosContext.Provider value={{ dados, isLoading, processosLista }}>
      {children}
    </DadosContext.Provider>
  );
}

export function useDados() {
  const context = useContext(DadosContext);
  if (!context) {
    throw new Error('useDados deve ser usado dentro de DadosProvider');
  }
  return context;
}
