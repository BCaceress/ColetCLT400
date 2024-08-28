import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const DadosContext = createContext();

export function DadosProvider({ children, valueOF }) {
  const [dados, setDados] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiInstance = await api();
        const response = await apiInstance.get(`/detalhe_ordem?numeroOF=${valueOF}`);
        setDados(response.data);
      } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        setDados({ error: 'Não foi possível obter os dados. Por favor, tente novamente mais tarde.' });
      } finally {
        setIsLoading(false);
      }
    };

    if (!dados) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [valueOF]);

  return (
    <DadosContext.Provider value={{ dados, isLoading }}>
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