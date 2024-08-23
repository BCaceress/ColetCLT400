import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api'; // Ajuste o caminho conforme necessário

const DadosContext = createContext();

export function DadosProvider({ children, valueOF }) {
  const [dados, setDados] = useState({});
  const [isLoading, setIsLoading] = useState(true);  // Iniciar como true para mostrar carregamento inicialmente
  const [processosLista, setProcessosLista] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiInstance = await api();
        const response = await apiInstance.get(`/detalhe_ordem?numeroOF=${valueOF}`);
        setDados(response.data);
        setProcessosLista(response.data.ordem.processos);
      } catch (error) {
        console.error('Erro ao obter dados da API:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, [valueOF]);  

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
